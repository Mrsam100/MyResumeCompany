import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { createResume, getUserResumes } from '@/lib/db/resumes'
import { createResumeSchema } from '@/lib/validations/resume'
import { createDefaultResumeContent } from '@/lib/resume-factory'

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '20', 10) || 20))

    const result = await getUserResumes(session.user.id, { page, limit })
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch resumes' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const parsed = createResumeSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      )
    }

    const resume = await createResume(session.user.id, {
      title: parsed.data.title,
      templateId: parsed.data.templateId,
      content: parsed.data.content ?? createDefaultResumeContent(),
    })

    return NextResponse.json({ resume }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create resume' }, { status: 500 })
  }
}
