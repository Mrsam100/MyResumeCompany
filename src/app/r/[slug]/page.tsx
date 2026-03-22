import { cache } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

import { getResumeBySlug } from '@/lib/db/resumes'
import { TemplateRenderer } from '@/templates/template-renderer'
import type { ResumeContent } from '@/types/resume'

interface Props {
  params: Promise<{ slug: string }>
}

// Validate slug format: alphanumeric, hyphens, underscores, max 50 chars
const SLUG_REGEX = /^[a-zA-Z0-9_-]{1,50}$/

// Cache the DB query so generateMetadata and page share one fetch
const getResume = cache(async (slug: string) => {
  if (!SLUG_REGEX.test(slug)) return null
  return getResumeBySlug(slug)
})

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const resume = await getResume(slug)

  if (!resume || !resume.isPublic) {
    return { title: 'Resume Not Found' }
  }

  const content = resume.content as ResumeContent
  const name = content.personalInfo.fullName || 'Resume'
  const title = content.personalInfo.title || ''

  return {
    title: `${name}${title ? ` — ${title}` : ''} | MyResumeCompany`,
    description: content.personalInfo.summary?.slice(0, 160) ?? `Resume of ${name}`,
    openGraph: {
      title: `${name}'s Resume`,
      description: title || 'Professional resume built with MyResumeCompany',
      type: 'profile',
    },
  }
}

export default async function PublicResumePage({ params }: Props) {
  const { slug } = await params
  const resume = await getResume(slug)

  if (!resume || !resume.isPublic) {
    notFound()
  }

  const content = resume.content as ResumeContent

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="mx-auto max-w-[820px] px-4">
        <div className="overflow-hidden rounded-lg border bg-white shadow-lg">
          <TemplateRenderer templateSlug={resume.templateId} content={content} />
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Built with{' '}
          <Link href="/" className="font-medium text-primary hover:underline">
            MyResumeCompany
          </Link>
        </p>
      </div>
    </div>
  )
}
