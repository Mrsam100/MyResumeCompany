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
    console.error('AI bullet points error:', isTimeout ? 'Request timed out' : err)
    await refundCredits(userId, CREDIT_COSTS.AI_BULLET_POINTS, 'AI_BULLET_POINTS', isTimeout ? 'AI request timed out' : 'AI generation failed')
    return NextResponse.json({ error: isTimeout ? 'AI request timed out. Please try again.' : 'AI generation failed' }, { status: isTimeout ? 504 : 500 })
  }
}
