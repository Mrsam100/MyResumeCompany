import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { duplicateResume } from '@/lib/db/resumes'

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const duplicate = await duplicateResume(id, session.user.id)
    return NextResponse.json({ resume: duplicate }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to duplicate resume' }, { status: 500 })
  }
}
