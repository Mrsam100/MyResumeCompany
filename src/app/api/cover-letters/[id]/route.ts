import { NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/auth'
import { getCoverLetterById, updateCoverLetter, deleteCoverLetter } from '@/lib/db/cover-letters'

const updateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  companyName: z.string().min(1).max(200).optional(),
  jobTitle: z.string().min(1).max(200).optional(),
  tone: z.enum(['professional', 'enthusiastic', 'conversational']).optional(),
  subject: z.string().max(500).optional(),
  content: z.string().min(1).max(50000).optional(),
  templateId: z.string().max(50).optional().nullable(),
})

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const cl = await getCoverLetterById(id, session.user.id)
  if (!cl) {
    return NextResponse.json({ error: 'Cover letter not found' }, { status: 404 })
  }

  return NextResponse.json({ coverLetter: cl })
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = await req.json()
    const parsed = updateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      )
    }

    const updated = await updateCoverLetter(id, session.user.id, parsed.data)
    if (!updated) {
      return NextResponse.json({ error: 'Cover letter not found' }, { status: 404 })
    }

    return NextResponse.json({ coverLetter: updated })
  } catch {
    return NextResponse.json({ error: 'Failed to update cover letter' }, { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const deleted = await deleteCoverLetter(id, session.user.id)
  if (!deleted) {
    return NextResponse.json({ error: 'Cover letter not found' }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
