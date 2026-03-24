import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { JsonLd } from '@/components/schema/json-ld'
import { ALL_POSTS } from '@/content/blog'

export const metadata: Metadata = {
  title: 'Blog — Resume Tips, Career Advice & Job Search Strategies',
  description:
    'Resume writing tips, career advice, and job search strategies from MyResumeCompany. Learn how to build a better resume and land more interviews.',
  alternates: { canonical: '/blog' },
}

export default function BlogPage() {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://myresumecompany.canmero.com'
  return (
    <>
    <JsonLd data={{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl }, { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteUrl}/blog` }] }} />
    <JsonLd data={{ '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'MyResumeCompany Blog', description: 'Resume writing tips, career advice, and job search strategies.', url: `${siteUrl}/blog`, mainEntity: { '@type': 'ItemList', numberOfItems: ALL_POSTS.length, itemListElement: ALL_POSTS.map((post, i) => ({ '@type': 'ListItem', position: i + 1, url: `${siteUrl}/blog/${post.slug}` })) } }} />
    <div className="mx-auto max-w-4xl px-4 py-16 sm:py-24">
      <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Resume writing tips, career advice, and job search strategies to help you land your next
        role. {ALL_POSTS.length} articles and growing.
      </p>

      <div className="mt-12 space-y-8">
        {ALL_POSTS.map((post) => (
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
    </div>
    </>
  )
}
