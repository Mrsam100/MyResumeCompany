import { NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { z } from 'zod'
import { auth } from '@/auth'
import { getResumeById } from '@/lib/db/resumes'
import { deductCredits } from '@/lib/db/credits'
import { getTemplateConfig } from '@/templates/registry'
import { CREDIT_COSTS } from '@/constants/credit-costs'
import { checkRateLimit } from '@/lib/ai/rate-limiter'
import { renderPdf } from '@/lib/services/pdf-client'
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
  const rateLimitError = await checkRateLimit(session.user.id, tier, 'pdf')
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

    // 3. Render PDF inline (nodejs_compat enables @react-pdf/renderer on Workers)
    const config = getTemplateConfig(resume.templateId)
    const content = resume.content as ResumeContent

    let pdfResult: { buffer: Buffer; size: number }
    try {
      pdfResult = await renderPdf(content, config, resumeId)
    } catch (renderErr) {
      Sentry.captureException(renderErr, { tags: { component: 'pdf', feature: 'render' } })
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

    // Buffer is a valid BodyInit in Node.js / Workers with nodejs_compat
    return new Response(pdfResult.buffer as never, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (err) {
    Sentry.captureException(err, { tags: { component: 'pdf', feature: 'export' } })
    console.error('PDF generation error:', err)
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 })
  }
}
