import { NextResponse } from 'next/server'
import { z } from 'zod'
import { renderToBuffer } from '@react-pdf/renderer'
import { auth } from '@/auth'
import { getResumeById } from '@/lib/db/resumes'
import { deductCredits } from '@/lib/db/credits'
import { getTemplateConfig } from '@/templates/registry'
import { PDFResume } from '@/lib/pdf/pdf-template'
import { CREDIT_COSTS } from '@/constants/credit-costs'
import { checkRateLimit } from '@/lib/ai/rate-limiter'
import type { ResumeContent } from '@/types/resume'

const inputSchema = z.object({
  resumeId: z.string().min(1).max(30),
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Rate limit check
  const tier = (session.user as { subscriptionTier?: string }).subscriptionTier ?? 'FREE'
  const rateLimitError = checkRateLimit(session.user.id, tier, 'pdf')
  if (rateLimitError) return rateLimitError

  // 1. Validate input
  let resumeId: string
  try {
    const body = await req.json()
    const parsed = inputSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }
    resumeId = parsed.data.resumeId
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  try {
    // 2. Fetch resume with ownership check
    const resume = await getResumeById(resumeId, session.user.id)
    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
    }

    // 3. Generate PDF FIRST (before charging credits)
    const config = getTemplateConfig(resume.templateId)
    const content = resume.content as ResumeContent

    let pdfBuffer: Buffer
    try {
      pdfBuffer = await renderToBuffer(PDFResume({ content, config }))
    } catch (renderErr) {
      console.error('PDF render error:', renderErr)
      return NextResponse.json({ error: 'Failed to render PDF' }, { status: 500 })
    }

    // 4. Deduct credits AFTER successful generation
    try {
      await deductCredits(
        session.user.id,
        CREDIT_COSTS.PDF_EXPORT,
        'PDF_EXPORT',
        `PDF export: ${resume.title}`,
        resumeId,
      )
    } catch (err) {
      if (err instanceof Error && err.message === 'Insufficient credits') {
        return NextResponse.json(
          { error: 'Insufficient credits', required: CREDIT_COSTS.PDF_EXPORT },
          { status: 402 },
        )
      }
      throw err
    }

    // 5. Build safe filename with fallback
    const rawName = (content.personalInfo.fullName || resume.title || '')
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
    const filename = `${rawName || 'resume'}.pdf`

    return new Response(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': String(pdfBuffer.length),
      },
    })
  } catch (err) {
    console.error('PDF generation error:', err)
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 })
  }
}
