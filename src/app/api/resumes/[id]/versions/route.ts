import { NextResponse } from 'next/server'
import { z } from 'zod'
import { eq, and, desc } from 'drizzle-orm'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { resumes, resumeVersions } from '@/lib/db/schema'
import type { ResumeContent } from '@/types/resume'

const MAX_VERSIONS_PER_RESUME = 20

const saveSchema = z.object({
  label: z.string().min(1).max(100),
})

const restoreSchema = z.object({
  versionId: z.string().min(1).max(30),
})

// GET — list versions for a resume
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  // Verify ownership
  const resume = await db.query.resumes.findFirst({
    where: and(eq(resumes.id, id), eq(resumes.userId, session.user.id)),
    columns: { id: true },
  })
  if (!resume) {
    return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
  }

  const versions = await db.query.resumeVersions.findMany({
    where: eq(resumeVersions.resumeId, id),
    orderBy: desc(resumeVersions.createdAt),
    columns: { id: true, label: true, templateId: true, createdAt: true },
  })

  return NextResponse.json({ versions })
}

// POST — save current state as a version OR restore a version
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  // Check if this is a restore or save action
  const isRestore = 'versionId' in body

  // Verify ownership
  const resume = await db.query.resumes.findFirst({
    where: and(eq(resumes.id, id), eq(resumes.userId, session.user.id)),
  })
  if (!resume) {
    return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
  }

  if (isRestore) {
    // ── Restore a version ──
    const parsed = restoreSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid version ID' }, { status: 400 })
    }

    const version = await db.query.resumeVersions.findFirst({
      where: and(
        eq(resumeVersions.id, parsed.data.versionId),
        eq(resumeVersions.resumeId, id),
      ),
    })
    if (!version) {
      return NextResponse.json({ error: 'Version not found' }, { status: 404 })
    }

    // Atomic: save current state + restore version in one transaction
    await db.transaction(async (tx) => {
      await tx.insert(resumeVersions).values({
        resumeId: id,
        userId: session.user.id,
        label: 'Auto-save before restore',
        templateId: resume.templateId,
        content: resume.content,
      })
      await tx.update(resumes).set({
        content: version.content as ResumeContent,
        templateId: version.templateId,
        lastEditedAt: new Date(),
      }).where(eq(resumes.id, id))
    })

    return NextResponse.json({ restored: true, label: version.label })
  } else {
    // ── Save a new version ──
    const parsed = saveSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Label is required' }, { status: 400 })
    }

    // Check version count limit
    const existingCount = await db.query.resumeVersions.findMany({
      where: eq(resumeVersions.resumeId, id),
      columns: { id: true },
    })
    if (existingCount.length >= MAX_VERSIONS_PER_RESUME) {
      return NextResponse.json(
        { error: `Maximum ${MAX_VERSIONS_PER_RESUME} versions per resume` },
        { status: 400 },
      )
    }

    const [version] = await db.insert(resumeVersions).values({
      resumeId: id,
      userId: session.user.id,
      label: parsed.data.label,
      templateId: resume.templateId,
      content: resume.content,
    }).returning({ id: resumeVersions.id, label: resumeVersions.label, createdAt: resumeVersions.createdAt })

    return NextResponse.json({ version }, { status: 201 })
  }
}
