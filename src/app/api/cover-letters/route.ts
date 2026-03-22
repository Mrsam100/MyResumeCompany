import { NextResponse } from 'next/server'
import { z } from 'zod'
import { eq, and } from 'drizzle-orm'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { resumes } from '@/lib/db/schema'
import { createCoverLetter, getUserCoverLetters } from '@/lib/db/cover-letters'

const createSchema = z.object({
  resumeId: z.string().min(1).optional().nullable(),
  title: z.string().min(1).max(200).optional(),
  companyName: z.string().min(1).max(200),
  jobTitle: z.string().min(1).max(200),
  tone: z.enum(['professional', 'enthusiastic', 'conversational']).optional(),
  subject: z.string().max(500).optional(),
  content: z.string().min(1).max(50000),
  templateId: z.string().max(50).optional().nullable(),
})

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') ?? '1', 10)
  const limit = parseInt(searchParams.get('limit') ?? '20', 10)

  const result = await getUserCoverLetters(session.user.id, { page, limit })
  return NextResponse.json(result)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      )
    }

    // Verify resumeId ownership if provided
    if (parsed.data.resumeId) {
      const resume = await db.query.resumes.findFirst({
        where: and(eq(resumes.id, parsed.data.resumeId), eq(resumes.userId, session.user.id)),
        columns: { id: true },
      })
      if (!resume) {
        return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
      }
    }

    const cl = await createCoverLetter(session.user.id, parsed.data)
    return NextResponse.json({ coverLetter: cl }, { status: 201 })
  } catch (err) {
    console.error('Failed to create cover letter:', err)
    return NextResponse.json({ error: 'Failed to create cover letter' }, { status: 500 })
  }
}
