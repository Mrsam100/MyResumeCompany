import { NextResponse } from 'next/server'
import { z } from 'zod'
import pdfParse from 'pdf-parse'
import { generateAIResponse } from '@/lib/ai/client'
import { RESUME_SYSTEM_PROMPT, buildLinkedInImportPrompt } from '@/lib/ai/prompts'
import { checkAuth, deductCreditsForAI, refundCredits } from '@/lib/ai/credit-check'
import { extractJSON } from '@/lib/ai/parse-json'
import { CREDIT_COSTS } from '@/constants/credit-costs'

const AI_TIMEOUT_MS = 45_000
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

const textSchema = z.string().min(100, 'Profile text too short (min 100 characters)').max(15000)

const VALID_SECTION_TYPES = [
  'experience', 'education', 'skills', 'projects', 'certifications',
  'awards', 'languages', 'volunteer', 'publications', 'interests',
  'references', 'custom',
] as const

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

async function extractTextFromRequest(req: Request): Promise<{ text?: string; error?: NextResponse }> {
  const contentType = req.headers.get('content-type') || ''

  if (contentType.includes('multipart/form-data')) {
    const formData = await req.formData()
    const file = formData.get('file')

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

    // Validate PDF magic bytes
    if (buffer.length < 4 || buffer.subarray(0, 4).toString('ascii') !== '%PDF') {
      return { error: NextResponse.json({ error: 'Invalid PDF file' }, { status: 400 }) }
    }

    const parsed = await pdfParse(buffer)

    // Cap extracted text length before further processing
    if (!parsed.text || parsed.text.length < 100) {
      return { error: NextResponse.json({ error: 'PDF contains too little text. Try pasting your profile text instead.' }, { status: 400 }) }
    }

    return { text: parsed.text.slice(0, 15000) }
  }

  // JSON body with profileText
  const body = await req.json()
  return { text: body.profileText }
}

export async function POST(req: Request) {
  const { userId, error: authError } = await checkAuth()
  if (authError) return authError

  let profileText: string
  try {
    const { text, error } = await extractTextFromRequest(req)
    if (error) return error
    if (!text) return NextResponse.json({ error: 'No profile text provided' }, { status: 400 })

    const result = textSchema.safeParse(text)
    if (!result.success) {
      return NextResponse.json({
        error: 'Invalid profile text',
        details: result.error.flatten().formErrors,
      }, { status: 400 })
    }
    profileText = result.data
  } catch {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 400 })
  }

  const creditError = await deductCreditsForAI(
    userId,
    CREDIT_COSTS.AI_LINKEDIN_IMPORT,
    'AI_LINKEDIN_IMPORT',
    'LinkedIn profile import',
  )
  if (creditError) return creditError

  try {
    const prompt = buildLinkedInImportPrompt({ profileText })

    const text = await generateAIResponse({
      system: RESUME_SYSTEM_PROMPT,
      prompt,
      maxTokens: 6144,
      timeoutMs: AI_TIMEOUT_MS,
    })

    const extracted = extractJSON<Record<string, unknown>>(text, 'object')
    if (!extracted) {
      console.error('LinkedIn import parse failed. Raw:', text.slice(0, 2000))
      await refundCredits(userId, CREDIT_COSTS.AI_LINKEDIN_IMPORT, 'AI_LINKEDIN_IMPORT', 'Failed to parse AI response')
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 })
    }

    let resume: z.infer<typeof responseSchema>
    try {
      resume = responseSchema.parse(extracted.data)
    } catch (zodErr) {
      console.error('LinkedIn import Zod validation failed:', JSON.stringify(extracted.data).slice(0, 2000), zodErr)
      await refundCredits(userId, CREDIT_COSTS.AI_LINKEDIN_IMPORT, 'AI_LINKEDIN_IMPORT', 'Invalid AI response format')
      return NextResponse.json({ error: 'Invalid AI response format' }, { status: 500 })
    }

    return NextResponse.json({ resume })
  } catch (err) {
    const isTimeout = err instanceof Error && err.name === 'AbortError'
    const isQuota = err instanceof Error && err.name === 'QuotaError'
    const isAuth = err instanceof Error && err.name === 'AuthError'
    const isConfig = err instanceof Error && err.name === 'ConfigError'
    console.error('LinkedIn import error:', err instanceof Error ? `[${err.name}] ${err.message}` : err)
    await refundCredits(userId, CREDIT_COSTS.AI_LINKEDIN_IMPORT, 'AI_LINKEDIN_IMPORT', isTimeout ? 'AI request timed out' : 'AI generation failed')

    if (isTimeout) return NextResponse.json({ error: 'AI request timed out. Please try again.' }, { status: 504 })
    if (isQuota) return NextResponse.json({ error: 'AI service temporarily unavailable. Please try again later.' }, { status: 503 })
    if (isConfig) return NextResponse.json({ error: 'AI service is not configured.' }, { status: 503 })
    if (isAuth) return NextResponse.json({ error: 'AI service configuration error.' }, { status: 503 })
    return NextResponse.json({ error: 'Import failed. Please try again.' }, { status: 500 })
  }
}
