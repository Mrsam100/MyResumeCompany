import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { JsonLd } from '@/components/schema/json-ld'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Resume writing tips, career advice, and job search strategies from MyResumeCompany. Learn how to build a better resume and land more interviews.',
  alternates: { canonical: '/blog' },
}

const POSTS = [
  {
    slug: 'how-to-write-resume-bullet-points',
    title: 'How to Write Resume Bullet Points That Get Interviews',
    description:
      'Learn the STAR method for writing achievement-focused bullet points with metrics. Stop writing "responsible for" and start writing results.',
    category: 'Resume Writing',
    date: '2026-03-16',
  },
  {
    slug: 'what-is-ats-and-how-to-beat-it',
    title: 'What Is an ATS? How Applicant Tracking Systems Filter Your Resume',
    description:
      'Understand how ATS software works, why most resumes get rejected, and what you can do to get past the automated filters.',
    category: 'Job Search',
    date: '2026-03-16',
  },
  {
    slug: 'best-resume-format-2026',
    title: 'The Best Resume Format in 2026: Chronological vs Functional vs Hybrid',
    description:
      'Which resume format should you use? Compare chronological, functional, and hybrid formats with pros, cons, and examples for each.',
    category: 'Resume Writing',
    date: '2026-03-16',
  },
  {
    slug: 'ai-resume-builder-guide',
    title: 'How to Use an AI Resume Builder Without Sounding Like a Robot',
    description:
      'AI can write your resume, but should it? Learn how to use AI as a writing partner while keeping your resume authentic and personal.',
    category: 'AI & Technology',
    date: '2026-03-16',
  },
  {
    slug: 'resume-summary-vs-objective',
    title: 'Resume Summary vs Objective: Which One Should You Use?',
    description:
      'Objective statements are dead. Learn how to write a professional summary that hooks recruiters in the first 6 seconds.',
    category: 'Resume Writing',
    date: '2026-03-16',
  },
]

export default function BlogPage() {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://myresumecompany.canmero.com'
  return (
    <>
    <JsonLd data={{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl }, { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteUrl}/blog` }] }} />
    <div className="mx-auto max-w-4xl px-4 py-16 sm:py-24">
      <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Resume writing tips, career advice, and job search strategies to help you land your next
        role.
      </p>

      <div className="mt-12 space-y-8">
        {POSTS.map((post) => (
          <article key={post.slug} className="group rounded-xl border p-6 transition-colors hover:bg-muted/40">
            <Link href={`/blog/${post.slug}`} className="block">
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="text-xs">
                  {post.category}
                </Badge>
                <time className="text-xs text-muted-foreground">{post.date}</time>
              </div>
              <h2 className="mt-3 text-xl font-semibold group-hover:text-primary">
                {post.title}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">{post.description}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Read more <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          </article>
        ))}
      </div>

      <div className="mt-16 rounded-xl border bg-muted/40 p-8 text-center">
        <p className="text-lg font-semibold">More articles coming soon</p>
        <p className="mt-2 text-sm text-muted-foreground">
          We&apos;re publishing new resume tips and career advice regularly. Check back soon.
        </p>
      </div>
    </div>
    </>
  )
}
