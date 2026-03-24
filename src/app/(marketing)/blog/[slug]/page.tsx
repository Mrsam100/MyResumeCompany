import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { JsonLd } from '@/components/schema/json-ld'
import { NewsletterSignup } from '@/components/marketing/newsletter-signup'
import { ALL_POSTS, POSTS_BY_SLUG } from '@/content/blog'

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://myresumecompany.canmero.com'

function ArticleCTA() {
  return (
    <div className="mt-12 rounded-xl border bg-muted/40 p-8 text-center">
      <h2 className="text-2xl font-bold">Build Your Resume in Minutes</h2>
      <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
        MyResumeCompany gives you 50+ professional templates, AI-powered writing tools, and a
        built-in ATS scanner. Start free with 100 credits.
      </p>
      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link href="/signup">
          <Button size="lg" className="gap-2">
            Get Started Free <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <Link href="/pricing">
          <Button variant="outline" size="lg">View Pricing</Button>
        </Link>
      </div>
    </div>
  )
}

export function generateStaticParams() {
  return ALL_POSTS.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = POSTS_BY_SLUG[slug]
  if (!article) return {}

  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.date,
      url: `${siteUrl}/blog/${slug}`,
      siteName: 'MyResumeCompany',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
    },
    alternates: {
      canonical: `${siteUrl}/blog/${slug}`,
    },
  }
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = POSTS_BY_SLUG[slug]

  if (!article) {
    notFound()
  }

  // Get related posts (same category, excluding current)
  const related = ALL_POSTS
    .filter((p) => p.category === article.category && p.slug !== slug)
    .slice(0, 3)

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: article.title,
          description: article.description,
          image: `${siteUrl}/opengraph-image`,
          datePublished: article.date,
          dateModified: article.date,
          author: {
            '@type': 'Organization',
            '@id': `${siteUrl}/#organization`,
            name: 'MyResumeCompany',
            url: siteUrl,
          },
          publisher: {
            '@type': 'Organization',
            '@id': `${siteUrl}/#organization`,
            name: 'MyResumeCompany',
            url: siteUrl,
            logo: {
              '@type': 'ImageObject',
              url: `${siteUrl}/opengraph-image`,
            },
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${siteUrl}/blog/${slug}`,
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
            { '@type': 'ListItem', position: 3, name: article.title, item: `${siteUrl}/blog/${slug}` },
          ],
        }}
      />

      <article className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
        <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/blog" className="hover:text-foreground">
            Blog
          </Link>
          <span>/</span>
          <span className="truncate text-foreground">{article.title}</span>
        </nav>

        <header>
          <div className="flex items-center gap-3">
            <Badge variant="secondary">{article.category}</Badge>
            <time className="text-sm text-muted-foreground" dateTime={article.date}>
              {new Date(article.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{article.title}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{article.description}</p>
        </header>

        <div className="prose prose-neutral dark:prose-invert mt-10 max-w-none prose-headings:scroll-mt-20 prose-headings:font-semibold prose-h2:mt-10 prose-h2:text-2xl prose-h3:mt-6 prose-h3:text-xl prose-p:leading-7 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-li:leading-7 prose-blockquote:border-l-primary prose-blockquote:italic">
          {article.content}
        </div>

        <ArticleCTA />

        <div className="mt-10 rounded-xl border bg-muted/30 p-6">
          <NewsletterSignup source="blog" />
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <div className="mt-12 border-t pt-8">
            <h2 className="text-lg font-semibold">Related Articles</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {related.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group rounded-lg border p-4 transition-colors hover:bg-muted/40"
                >
                  <Badge variant="secondary" className="text-[10px]">{post.category}</Badge>
                  <p className="mt-2 text-sm font-medium group-hover:text-primary line-clamp-2">{post.title}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        <nav className="mt-8 border-t pt-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            &larr; Back to all articles
          </Link>
        </nav>
      </article>
    </>
  )
}
