import { eq, and, desc, count } from 'drizzle-orm'
import { db } from '@/lib/db'
import { resumes } from './schema'
import type { ResumeContent } from '@/types/resume'

const DEFAULT_CONTENT: ResumeContent = {
  personalInfo: {
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
  },
  sections: [
    {
      id: 'experience-default',
      type: 'experience',
      title: 'Work Experience',
      visible: true,
      entries: [],
    },
    {
      id: 'education-default',
      type: 'education',
      title: 'Education',
      visible: true,
      entries: [],
    },
    {
      id: 'skills-default',
      type: 'skills',
      title: 'Skills',
      visible: true,
      entries: [],
    },
    {
      id: 'projects-default',
      type: 'projects',
      title: 'Projects',
      visible: true,
      entries: [],
    },
  ],
}

function clampPagination(options?: { page?: number; limit?: number }) {
  const page = Math.max(1, options?.page ?? 1)
  const limit = Math.min(100, Math.max(1, options?.limit ?? 20))
  return { page, limit, offset: (page - 1) * limit }
}

export async function createResume(
  userId: string,
  data?: {
    title?: string
    templateId?: string
    content?: ResumeContent
  },
) {
  const [resume] = await db
    .insert(resumes)
    .values({
      userId,
      title: data?.title ?? 'Untitled Resume',
      templateId: data?.templateId ?? 'classic-professional',
      content: data?.content ?? DEFAULT_CONTENT,
    })
    .returning()
  return resume
}

export async function getResumeById(id: string, userId?: string) {
  const conditions = userId ? and(eq(resumes.id, id), eq(resumes.userId, userId)) : eq(resumes.id, id)

  const result = await db.query.resumes.findFirst({
    where: conditions,
  })
  return result ?? null
}

export async function getResumeBySlug(slug: string) {
  const result = await db.query.resumes.findFirst({
    where: eq(resumes.slug, slug),
  })
  return result ?? null
}

export async function getUserResumes(
  userId: string,
  options?: { page?: number; limit?: number },
) {
  const { page, limit, offset } = clampPagination(options)

  const [resumeList, [{ total }]] = await Promise.all([
    db.query.resumes.findMany({
      where: eq(resumes.userId, userId),
      orderBy: desc(resumes.lastEditedAt),
      limit,
      offset,
    }),
    db.select({ total: count() }).from(resumes).where(eq(resumes.userId, userId)),
  ])

  return {
    resumes: resumeList,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
}

export async function updateResume(
  id: string,
  userId: string,
  data: {
    title?: string
    templateId?: string
    content?: ResumeContent
    isPublic?: boolean
  },
) {
  const [updated] = await db
    .update(resumes)
    .set({
      ...data,
      lastEditedAt: new Date(),
    })
    .where(and(eq(resumes.id, id), eq(resumes.userId, userId)))
    .returning()
  return updated ?? null
}

export async function deleteResume(id: string, userId: string) {
  const [deleted] = await db
    .delete(resumes)
    .where(and(eq(resumes.id, id), eq(resumes.userId, userId)))
    .returning()
  return deleted ?? null
}

export async function duplicateResume(id: string, userId: string) {
  const original = await getResumeById(id, userId)
  if (!original) throw new Error('Resume not found')

  const [duplicate] = await db
    .insert(resumes)
    .values({
      userId,
      title: `${original.title} (Copy)`,
      templateId: original.templateId,
      content: original.content ?? DEFAULT_CONTENT,
    })
    .returning()
  return duplicate
}
