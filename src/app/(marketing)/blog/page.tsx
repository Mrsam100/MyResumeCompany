import type { Metadata } from 'next'
import { BookOpen } from 'lucide-react'
import { JsonLd } from '@/components/schema/json-ld'
import { ALL_POSTS } from '@/content/blog'
import { BlogListing } from '@/components/marketing/blog-listing'

const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://myresumecompany.canmero.com').trim()

export const metadata: Metadata = {
  title: 'Blog — Resume Tips, Career Advice & Job Search Strategies | MyResumeCompany',
  description:
    'Expert resume writing tips, career advice, and job search strategies. Learn how to write ATS-optimized resumes, craft cover letters, and land more interviews. 25+ free guides.',
  alternates: { canonical: `${siteUrl}/blog` },
  openGraph: {
    title: 'Blog — Resume Tips & Career Advice',
    description: 'Expert guides on resume writing, job search strategy, and career growth. 25+ free articles.',
    type: 'website',
    url: `${siteUrl}/blog`,
    siteName: 'MyResumeCompany',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog — Resume Tips & Career Advice',
    description: 'Expert guides on resume writing, job search strategy, and career growth.',
  },
}

export default function BlogPage() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'MyResumeCompany Blog',
          description: 'Resume writing tips, career advice, and job search strategies.',
          url: `${siteUrl}/blog`,
          mainEntity: {
            '@type': 'ItemList',
            numberOfItems: ALL_POSTS.length,
            itemListElement: ALL_POSTS.map((post, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              url: `${siteUrl}/blog/${post.slug}`,
            })),
          },
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteUrl}/blog` },
          ],
        }}
      />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-20">
        {/* Hero */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Resume Tips & Career Advice</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Expert guides on resume writing, job search strategy, and career growth. {ALL_POSTS.length} articles to help you land your next role.
          </p>
        </div>

        <BlogListing />
      </div>
    </>
  )
}
