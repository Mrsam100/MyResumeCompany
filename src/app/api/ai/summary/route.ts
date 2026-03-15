import { NextResponse } from 'next/server'
import { z } from 'zod'
import { generateAIResponse } from '@/lib/ai/client'
import { RESUME_SYSTEM_PROMPT, buildSummaryPrompt } from '@/lib/ai/prompts'
import { checkAuth, deductCreditsForAI, refundCredits } from '@/lib/ai/credit-check'
import { extractJSON } from '@/lib/ai/parse-json'
import { CREDIT_COSTS } from '@/constants/credit-costs'

const AI_TIMEOUT_MS = 30_000

const inputSchema = z.object({
  targetRole: z.string().min(1).max(200),
  yearsExperience: z.string().max(20).optional(),
  keySkills: z.string().max(500).optional(),
  industry: z.string().max(100).optional(),
})

const responseSchema = z.object({
  confident: z.string().min(1).max(1000),
  balanced: z.string().min(1).max(1000),
  technical: z.string().min(1).max(1000),
})

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

  const creditError = await deductCreditsForAI(userId, CREDIT_COSTS.AI_SUMMARY, 'AI_SUMMARY', 'AI summary generation')
  if (creditError) return creditError

  try {
    const prompt = buildSummaryPrompt(parsed)

    const text = await generateAIResponse({
      system: RESUME_SYSTEM_PROMPT,
      prompt,
      maxTokens: 1024,
      timeoutMs: AI_TIMEOUT_MS,
    })

    const extracted = extractJSON<Record<string, string>>(text, 'object')
    if (!extracted) {
      console.error('AI summary parse failed. Raw:', text.slice(0, 2000))
      await refundCredits(userId, CREDIT_COSTS.AI_SUMMARY, 'AI_SUMMARY', 'Failed to parse AI response')
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 })
    }

    let summaries: z.infer<typeof responseSchema>
    try {
      summaries = responseSchema.parse(extracted.data)
    } catch (zodErr) {
      console.error('AI summary Zod validation failed. Parsed JSON:', JSON.stringify(extracted.data).slice(0, 1000), zodErr)
      await refundCredits(userId, CREDIT_COSTS.AI_SUMMARY, 'AI_SUMMARY', 'Invalid AI response format')
      return NextResponse.json({ error: 'Invalid AI response format' }, { status: 500 })
    }

    return NextResponse.json({ summaries })
  } catch (err) {
    const isTimeout = err instanceof Error && err.name === 'AbortError'
    console.error('AI summary error:', isTimeout ? 'Request timed out' : err)
    await refundCredits(userId, CREDIT_COSTS.AI_SUMMARY, 'AI_SUMMARY', isTimeout ? 'AI request timed out' : 'AI generation failed')
    return NextResponse.json({ error: isTimeout ? 'AI request timed out. Please try again.' : 'AI generation failed' }, { status: isTimeout ? 504 : 500 })
  }
}
