import { NextResponse } from 'next/server'
import { z } from 'zod'
import { generateAIResponse } from '@/lib/ai/client'
import { RESUME_SYSTEM_PROMPT, buildFullResumePrompt } from '@/lib/ai/prompts'
import { checkAuth, deductCreditsForAI, refundCredits } from '@/lib/ai/credit-check'
import { extractJSON } from '@/lib/ai/parse-json'
import { CREDIT_COSTS } from '@/constants/credit-costs'

const AI_TIMEOUT_MS = 45_000 // Longer timeout for full resume generation

const positionSchema = z.object({
  title: z.string().min(1).max(200),
  company: z.string().min(1).max(200),
  duration: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
})

const inputSchema = z.object({
  targetRole: z.string().min(1).max(200),
  industry: z.string().max(100).optional(),
  experienceLevel: z.string().min(1).max(50),
  positions: z.array(positionSchema).min(1).max(5),
  education: z.object({
    degree: z.string().min(1).max(200),
    school: z.string().min(1).max(200),
    field: z.string().max(200).optional().default(''),
    graduationYear: z.string().min(1).max(10),
  }),
  skills: z.array(z.string().max(100)).min(1).max(30),
  goals: z.string().max(1000).optional(),
  tone: z.enum(['professional', 'conversational', 'technical', 'creative']).optional(),
  contentDensity: z.enum(['concise', 'balanced', 'detailed']).optional(),
  templateCategory: z.string().max(50).optional(),
  jobDescription: z.string().max(2000).optional(),
})

const resumeSectionSchema = z.object({
  type: z.string(),
  title: z.string(),
  entries: z.array(z.object({
    fields: z.record(z.string(), z.string()),
    bulletPoints: z.array(z.string()),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    current: z.boolean().optional(),
  })),
})

const responseSchema = z.object({
  personalInfo: z.object({
    fullName: z.string(),
    title: z.string(),
    summary: z.string(),
  }),
  sections: z.array(resumeSectionSchema).min(1),
})

export async function POST(req: Request) {
  const { userId, error: authError } = await checkAuth()
  if (authError) return authError

  let parsed: z.infer<typeof inputSchema>
  try {
    const body = await req.json()
    const result = inputSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: 'Validation failed', details: result.error.flatten().fieldErrors }, { status: 400 })
    }
    parsed = result.data
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const creditError = await deductCreditsForAI(userId, CREDIT_COSTS.AI_FULL_RESUME, 'AI_FULL_RESUME', 'AI full resume generation')
  if (creditError) return creditError

  try {
    const prompt = buildFullResumePrompt({
      ...parsed,
      education: { ...parsed.education, field: parsed.education.field ?? '' },
      tone: parsed.tone,
      contentDensity: parsed.contentDensity,
      templateCategory: parsed.templateCategory,
      jobDescription: parsed.jobDescription,
    })

    const text = await generateAIResponse({
      system: RESUME_SYSTEM_PROMPT,
      prompt,
      maxTokens: parsed.jobDescription ? 6144 : 4096,
      timeoutMs: AI_TIMEOUT_MS,
    })

    const extracted = extractJSON<Record<string, unknown>>(text, 'object')
    if (!extracted) {
      console.error('AI full resume parse failed. Raw:', text.slice(0, 2000))
      await refundCredits(userId, CREDIT_COSTS.AI_FULL_RESUME, 'AI_FULL_RESUME', 'Failed to parse AI response')
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 })
    }

    let resume: z.infer<typeof responseSchema>
    try {
      resume = responseSchema.parse(extracted.data)
    } catch (zodErr) {
      console.error('AI full resume Zod validation failed. Parsed JSON:', JSON.stringify(extracted.data).slice(0, 2000), zodErr)
      await refundCredits(userId, CREDIT_COSTS.AI_FULL_RESUME, 'AI_FULL_RESUME', 'Invalid AI response format')
      return NextResponse.json({ error: 'Invalid AI response format' }, { status: 500 })
    }

    return NextResponse.json({ resume })
  } catch (err) {
    const isTimeout = err instanceof Error && err.name === 'AbortError'
    const isQuota = err instanceof Error && err.name === 'QuotaError'
    const isAuth = err instanceof Error && err.name === 'AuthError'
    const isConfig = err instanceof Error && err.name === 'ConfigError'
    console.error('AI full resume error:', err instanceof Error ? `[${err.name}] ${err.message}` : err)
    await refundCredits(userId, CREDIT_COSTS.AI_FULL_RESUME, 'AI_FULL_RESUME', isTimeout ? 'AI request timed out' : 'AI generation failed')

    if (isTimeout) return NextResponse.json({ error: 'AI request timed out. Please try again.' }, { status: 504 })
    if (isQuota) return NextResponse.json({ error: 'AI service is temporarily unavailable due to quota limits. Please try again later.' }, { status: 503 })
    if (isConfig) return NextResponse.json({ error: 'AI service is not configured. Please set GEMINI_API_KEY.' }, { status: 503 })
    if (isAuth) return NextResponse.json({ error: 'AI service configuration error. Please contact support.' }, { status: 503 })
    return NextResponse.json({ error: 'AI generation failed. Please try again.' }, { status: 500 })
  }
}
