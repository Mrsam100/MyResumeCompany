import { eq, and, asc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { templates } from './schema'
import type { TemplateCategory } from './schema'

export async function getTemplates(onlyActive = true) {
  if (onlyActive) {
    return db.query.templates.findMany({
      where: eq(templates.isActive, true),
      orderBy: asc(templates.sortOrder),
    })
  }
  return db.query.templates.findMany({
    orderBy: asc(templates.sortOrder),
  })
}

export async function getTemplateBySlug(slug: string) {
  const result = await db.query.templates.findFirst({
    where: eq(templates.slug, slug),
  })
  return result ?? null
}

export async function getTemplatesByCategory(category: TemplateCategory) {
  return db.query.templates.findMany({
    where: and(eq(templates.category, category), eq(templates.isActive, true)),
    orderBy: asc(templates.sortOrder),
  })
}

export async function getTemplateById(id: string) {
  const result = await db.query.templates.findFirst({
    where: eq(templates.id, id),
  })
  return result ?? null
}
