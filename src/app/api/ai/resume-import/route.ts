import { NextResponse } from 'next/server'
import { z } from 'zod'
import pdfParse from 'pdf-parse'
import { generateAIResponse } from '@/lib/ai/client'
import { RESUME_SYSTEM_PROMPT, buildResumeImportPrompt } from '@/lib/ai/prompts'
import { checkAuth, deductCreditsForAI, refundCredits } from '@/lib/ai/credit-check'
import { extractJSON } from '@/lib/ai/parse-json'
import { CREDIT_COSTS } from '@/constants/credit-costs'

const AI_TIMEOUT_MS = 45_000
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

const VALID_SECTION_TYPES = [
  'experience', 'education', 'skills', 'projects', 'certifications',
  'awards', 'languages', 'volunteer', 'publications', 'interests',
  'references', 'custom',
] as const

const textSchema = z.string().min(100, 'Resume text too short (min 100 characters)').max(15000)
const enhanceLevelSchema = z.enum(['light', 'full']).default('full')

const resumeSectionSchema = z.object({
  type: z.enum(VALID_SECTION_TYPES),
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

async function extractTextFromRequest(req: Request): Promise<{ text?: string; enhanceLevel?: string; error?: NextResponse }> {
  const contentType = req.headers.get('content-type') || ''

  if (contentType.includes('multipart/form-data')) {
    const formData = await req.formData()
    const file = formData.get('file')
    const level = formData.get('enhanceLevel')

    if (!file || !(file instanceof File)) {
      return { error: NextResponse.json({ error: 'No file uploaded' }, { status: 400 }) }
    }

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return { error: NextResponse.json({ error: 'Only PDF files are accepted' }, { status: 400 }) }
    }

    if (file.size > MAX_FILE_SIZE) {
      return { error: NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 }) }
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    if (buffer.length < 4 || buffer[0] !== 0x25 || buffer[1] !== 0x50 || buffer[2] !== 0x44 || buffer[3] !== 0x46) {
      return { error: NextResponse.json({ error: 'Invalid PDF file' }, { status: 400 }) }
    }

    const parsed = await pdfParse(buffer)

    if (!parsed.text || parsed.text.length < 100) {
      return { error: NextResponse.json({ error: 'PDF contains too little text. Try pasting your resume text instead.' }, { status: 400 }) }
    }

    return { text: parsed.text.slice(0, 15000), enhanceLevel: typeof level === 'string' ? level : 'full' }
  }

  const body = await req.json()
  return { text: body.resumeText, enhanceLevel: body.enhanceLevel }
}

export async function POST(req: Request) {
  const { userId, error: authError } = await checkAuth()
  if (authError) return authError

  let resumeText: string
  let enhanceLevel: 'light' | 'full'
  try {
    const { text, enhanceLevel: level, error } = await extractTextFromRequest(req)
    if (error) return error
    if (!text) return NextResponse.json({ error: 'No resume text provided' }, { status: 400 })

    const textResult = textSchema.safeParse(text)
    if (!textResult.success) {
      return NextResponse.json({ error: 'Invalid resume text', details: textResult.error.flatten().formErrors }, { status: 400 })
    }
    resumeText = textResult.data

    const levelResult = enhanceLevelSchema.safeParse(level)
    enhanceLevel = levelResult.success ? levelResult.data : 'full'
  } catch {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 400 })
  }

  const creditError = await deductCreditsForAI(
    userId,
    CREDIT_COSTS.AI_RESUME_IMPORT,
    'AI_RESUME_IMPORT',
    `Resume import (${enhanceLevel} enhance)`,
  )
  if (creditError) return creditError

  try {
    const prompt = buildResumeImportPrompt({ resumeText, enhanceLevel })

    const text = await generateAIResponse({
      system: RESUME_SYSTEM_PROMPT,
      prompt,
      maxTokens: 6144,
      timeoutMs: AI_TIMEOUT_MS,
    })

    const extracted = extractJSON<Record<string, unknown>>(text, 'object')
    if (!extracted) {
      console.error('Resume import parse failed. Raw:', text.slice(0, 2000))
      await refundCredits(userId, CREDIT_COSTS.AI_RESUME_IMPORT, 'AI_RESUME_IMPORT', 'Failed to parse AI response')
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 })
    }

    let resume: z.infer<typeof responseSchema>
    try {
      resume = responseSchema.parse(extracted.data)
    } catch (zodErr) {
      console.error('Resume import Zod validation failed:', JSON.stringify(extracted.data).slice(0, 2000), zodErr)
      await refundCredits(userId, CREDIT_COSTS.AI_RESUME_IMPORT, 'AI_RESUME_IMPORT', 'Invalid AI response format')
      return NextResponse.json({ error: 'Invalid AI response format' }, { status: 500 })
    }

    return NextResponse.json({ resume })
  } catch (err) {
    const isTimeout = err instanceof Error && err.name === 'AbortError'
    const isQuota = err instanceof Error && err.name === 'QuotaError'
    const isAuth = err instanceof Error && err.name === 'AuthError'
    const isConfig = err instanceof Error && err.name === 'ConfigError'
    console.error('Resume import error:', err instanceof Error ? `[${err.name}] ${err.message}` : err)
    await refundCredits(userId, CREDIT_COSTS.AI_RESUME_IMPORT, 'AI_RESUME_IMPORT', isTimeout ? 'AI request timed out' : 'AI generation failed')

    if (isTimeout) return NextResponse.json({ error: 'AI request timed out. Please try again.' }, { status: 504 })
    if (isQuota) return NextResponse.json({ error: 'AI service temporarily unavailable. Please try again later.' }, { status: 503 })
    if (isConfig) return NextResponse.json({ error: 'AI service is not configured.' }, { status: 503 })
    if (isAuth) return NextResponse.json({ error: 'AI service configuration error.' }, { status: 503 })
    return NextResponse.json({ error: 'Import failed. Please try again.' }, { status: 500 })
  }
}
