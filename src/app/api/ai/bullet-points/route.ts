import { NextResponse } from 'next/server'
import { z } from 'zod'
import { generateAIResponse } from '@/lib/ai/client'
import { RESUME_SYSTEM_PROMPT, buildBulletPointsPrompt } from '@/lib/ai/prompts'
import { checkAuth, deductCreditsForAI, refundCredits } from '@/lib/ai/credit-check'
import { extractJSON } from '@/lib/ai/parse-json'
import { CREDIT_COSTS } from '@/constants/credit-costs'

const AI_TIMEOUT_MS = 30_000

const inputSchema = z.object({
  jobTitle: z.string().min(1).max(200),
  company: z.string().max(200).optional(),
  responsibilities: z.string().max(1000).optional(),
  industry: z.string().max(100).optional(),
})

const responseSchema = z.array(z.string().min(1).max(500)).min(1).max(10)

export async function POST(req: Request) {
  const { userId, error: authError } = await checkAuth()
  if (authError) return authError

  let parsed
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

  const creditError = await deductCreditsForAI(userId, CREDIT_COSTS.AI_BULLET_POINTS, 'AI_BULLET_POINTS', 'AI bullet point generation')
  if (creditError) return creditError

  try {
    const prompt = buildBulletPointsPrompt(parsed)

    const text = await generateAIResponse({
      system: RESUME_SYSTEM_PROMPT,
      prompt,
      maxTokens: 1024,
      timeoutMs: AI_TIMEOUT_MS,
    })

    const extracted = extractJSON<string[]>(text, 'array')
    if (!extracted) {
      console.error('AI bullet parse failed. Raw:', text.slice(0, 2000))
      await refundCredits(userId, CREDIT_COSTS.AI_BULLET_POINTS, 'AI_BULLET_POINTS', 'Failed to parse AI response')
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 })
    }

    let bullets: string[]
    try {
      bullets = responseSchema.parse(extracted.data)
    } catch (zodErr) {
      console.error('AI bullet Zod validation failed. Parsed JSON:', JSON.stringify(extracted.data).slice(0, 1000), zodErr)
      await refundCredits(userId, CREDIT_COSTS.AI_BULLET_POINTS, 'AI_BULLET_POINTS', 'Invalid AI response format')
      return NextResponse.json({ error: 'Invalid AI response format' }, { status: 500 })
    }

    return NextResponse.json({ bullets })
  } catch (err) {
    const isTimeout = err instanceof Error && err.name === 'AbortError'
    const isQuota = err instanceof Error && err.name === 'QuotaError'
    const isAuth = err instanceof Error && err.name === 'AuthError'
    const isConfig = err instanceof Error && err.name === 'ConfigError'
    console.error('AI bullet points error:', err instanceof Error ? `[${err.name}] ${err.message}` : err)
    await refundCredits(userId, CREDIT_COSTS.AI_BULLET_POINTS, 'AI_BULLET_POINTS', isTimeout ? 'AI request timed out' : 'AI generation failed')

    if (isTimeout) return NextResponse.json({ error: 'AI request timed out. Please try again.' }, { status: 504 })
    if (isQuota) return NextResponse.json({ error: 'AI service is temporarily unavailable due to quota limits. Please try again later.' }, { status: 503 })
    if (isConfig) return NextResponse.json({ error: 'AI service is not configured. Please set GEMINI_API_KEY.' }, { status: 503 })
    if (isAuth) return NextResponse.json({ error: 'AI service configuration error. Please contact support.' }, { status: 503 })
    return NextResponse.json({ error: 'AI generation failed. Please try again.' }, { status: 500 })
  }
}
