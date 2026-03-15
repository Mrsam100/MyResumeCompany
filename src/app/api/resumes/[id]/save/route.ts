import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { updateResume } from '@/lib/db/resumes'
import { updateResumeSchema } from '@/lib/validations/resume'

// POST handler for sendBeacon (which only supports POST method)
// Used for saving on page unload — fire-and-forget
export async function POST(
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
    const parsed = updateResumeSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    }

    await updateResume(id, session.user.id, parsed.data)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
}
