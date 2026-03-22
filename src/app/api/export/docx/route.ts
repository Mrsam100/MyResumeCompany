import { NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { z } from 'zod'
import { auth } from '@/auth'
import { getResumeById } from '@/lib/db/resumes'
import { deductCredits, checkSufficientCredits } from '@/lib/db/credits'
import { getTemplateConfig } from '@/templates/registry'
import { CREDIT_COSTS } from '@/constants/credit-costs'
import { checkRateLimit } from '@/lib/ai/rate-limiter'
import { renderDocx } from '@/lib/services/docx-client'
import type { ResumeContent } from '@/types/resume'

const inputSchema = z.object({
  resumeId: z.string().min(1).max(30),
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const tier = (session.user as { subscriptionTier?: string }).subscriptionTier ?? 'FREE'
  const rateLimitError = await checkRateLimit(session.user.id, tier, 'docx')
  if (rateLimitError) return rateLimitError

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
    const resume = await getResumeById(resumeId, session.user.id)
    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
    }

    const hasCredits = await checkSufficientCredits(session.user.id, CREDIT_COSTS.DOCX_EXPORT)
    if (!hasCredits) {
      return NextResponse.json(
        { error: 'Insufficient credits', required: CREDIT_COSTS.DOCX_EXPORT },
        { status: 402 },
      )
    }

    const config = getTemplateConfig(resume.templateId)
    const content = resume.content as ResumeContent

    // Merge custom colors/fonts with template defaults
    const colors = { ...config.defaultColors, ...content.customColors }
    const fonts = { ...config.defaultFonts, ...content.customFonts }

    let buffer: Buffer
    try {
      buffer = await renderDocx(content, colors, fonts)
    } catch (renderErr) {
      Sentry.captureException(renderErr, { tags: { component: 'docx', feature: 'render' } })
      console.error('DOCX render error:', renderErr)
      return NextResponse.json({ error: 'Failed to render DOCX' }, { status: 500 })
    }

    try {
      await deductCredits(
        session.user.id,
        CREDIT_COSTS.DOCX_EXPORT,
        'DOCX_EXPORT',
        `DOCX export: ${resume.title}`,
        resumeId,
      )
    } catch (err) {
      if (err instanceof Error && err.message === 'Insufficient credits') {
        return NextResponse.json(
          { error: 'Insufficient credits', required: CREDIT_COSTS.DOCX_EXPORT },
          { status: 402 },
        )
      }
      throw err
    }

    const rawName = (content.personalInfo.fullName || resume.title || '')
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
    const filename = `${rawName || 'resume'}.docx`

    return new Response(buffer as never, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (err) {
    Sentry.captureException(err, { tags: { component: 'docx', feature: 'export' } })
    console.error('DOCX generation error:', err)
    return NextResponse.json({ error: 'Failed to generate DOCX' }, { status: 500 })
  }
}
