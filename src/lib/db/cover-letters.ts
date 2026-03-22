import { eq, and, desc, count } from 'drizzle-orm'
import { db } from '@/lib/db'
import { coverLetters } from './schema'

function clampPagination(options?: { page?: number; limit?: number }) {
  const page = Math.max(1, options?.page ?? 1)
  const limit = Math.min(100, Math.max(1, options?.limit ?? 20))
  return { page, limit, offset: (page - 1) * limit }
}

export async function createCoverLetter(
  userId: string,
  data: {
    resumeId?: string | null
    title?: string
    companyName: string
    jobTitle: string
    tone?: 'professional' | 'enthusiastic' | 'conversational'
    subject?: string
    content: string
    templateId?: string | null
  },
) {
  const [cl] = await db
    .insert(coverLetters)
    .values({
      userId,
      resumeId: data.resumeId ?? null,
      title: data.title ?? `${data.companyName} - ${data.jobTitle}`,
      companyName: data.companyName,
      jobTitle: data.jobTitle,
      tone: data.tone ?? 'professional',
      subject: data.subject,
      content: data.content,
      templateId: data.templateId ?? null,
    })
    .returning()
  return cl
}

export async function getCoverLetterById(id: string, userId: string) {
  const result = await db.query.coverLetters.findFirst({
    where: and(eq(coverLetters.id, id), eq(coverLetters.userId, userId)),
  })
  return result ?? null
}

export async function getUserCoverLetters(
  userId: string,
  options?: { page?: number; limit?: number },
) {
  const { page, limit, offset } = clampPagination(options)

  const [list, [{ total }]] = await Promise.all([
    db.query.coverLetters.findMany({
      where: eq(coverLetters.userId, userId),
      orderBy: desc(coverLetters.updatedAt),
      limit,
      offset,
    }),
    db.select({ total: count() }).from(coverLetters).where(eq(coverLetters.userId, userId)),
  ])

  return { coverLetters: list, total, page, limit, totalPages: Math.ceil(total / limit) }
}

export async function updateCoverLetter(
  id: string,
  userId: string,
  data: {
    title?: string
    companyName?: string
    jobTitle?: string
    tone?: 'professional' | 'enthusiastic' | 'conversational'
    subject?: string
    content?: string
    templateId?: string | null
  },
) {
  const [updated] = await db
    .update(coverLetters)
    .set(data)
    .where(and(eq(coverLetters.id, id), eq(coverLetters.userId, userId)))
    .returning()
  return updated ?? null
}

export async function deleteCoverLetter(id: string, userId: string) {
  const [deleted] = await db
    .delete(coverLetters)
    .where(and(eq(coverLetters.id, id), eq(coverLetters.userId, userId)))
    .returning()
  return deleted ?? null
}
