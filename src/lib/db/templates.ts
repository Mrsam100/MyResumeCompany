import { eq, and, asc } from 'drizzle-orm'
import { unstable_cache } from 'next/cache'
import { db } from '@/lib/db'
import { templates } from './schema'
import type { TemplateCategory } from './schema'

async function fetchTemplates(onlyActive: boolean) {
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

// Cache template queries for 1 hour — templates rarely change
const getCachedTemplates = unstable_cache(
  () => fetchTemplates(true),
  ['templates-active'],
  { revalidate: 3600 },
)

const getCachedAllTemplates = unstable_cache(
  () => fetchTemplates(false),
  ['templates-all'],
  { revalidate: 3600 },
)

export async function getTemplates(onlyActive = true) {
  return onlyActive ? getCachedTemplates() : getCachedAllTemplates()
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
