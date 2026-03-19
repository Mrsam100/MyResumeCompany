import { NextResponse } from 'next/server'
import { getTemplates } from '@/lib/db/templates'

export async function GET() {
  try {
    const templates = await getTemplates()

    return NextResponse.json({
      templates: templates.map((t) => ({
        id: t.id,
        name: t.name,
        slug: t.slug,
        description: t.description,
        category: t.category,
        isPremium: t.isPremium,
      })),
    }, {
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 })
  }
}
