import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, ArrowLeft, Clock, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { JsonLd } from '@/components/schema/json-ld'
import { NewsletterSignup } from '@/components/marketing/newsletter-signup'
import { ALL_POSTS, POSTS_BY_SLUG } from '@/content/blog'
import { cn } from '@/lib/utils'
import { ReadingProgress } from './reading-progress'
import { ShareButtons } from './share-buttons'

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://myresumecompany.canmero.com'

const CATEGORY_COLORS: Record<string, string> = {
  'Resume Writing': 'bg-blue-50 text-blue-700 border-blue-200',
  'Job Search': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Career Advice': 'bg-violet-50 text-violet-700 border-violet-200',
  'AI & Technology': 'bg-amber-50 text-amber-700 border-amber-200',
  'Cover Letters': 'bg-pink-50 text-pink-700 border-pink-200',
  'Industry Guides': 'bg-indigo-50 text-indigo-700 border-indigo-200',
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

  // Prev/next navigation
  const currentIndex = ALL_POSTS.findIndex((p) => p.slug === slug)
  const prevPost = currentIndex < ALL_POSTS.length - 1 ? ALL_POSTS[currentIndex + 1] : null
  const nextPost = currentIndex > 0 ? ALL_POSTS[currentIndex - 1] : null

  // Related posts (same category, excluding current, max 3)
  const related = ALL_POSTS
    .filter((p) => p.category === article.category && p.slug !== slug)
    .slice(0, 3)

  const articleUrl = `${siteUrl}/blog/${slug}`

  return (
    <>
      <ReadingProgress />

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: article.title,
          description: article.description,
          image: `${siteUrl}/opengraph-image`,
          datePublished: article.date,
          dateModified: article.date,
          wordCount: 1000,
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
            logo: { '@type': 'ImageObject', url: `${siteUrl}/opengraph-image` },
          },
          mainEntityOfPage: { '@type': 'WebPage', '@id': articleUrl },
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteUrl}/blog` },
            { '@type': 'ListItem', position: 3, name: article.title, item: articleUrl },
          ],
        }}
      />

      <article className="mx-auto max-w-3xl px-4 py-12 sm:py-20">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link href="/blog" className="flex items-center gap-1 hover:text-foreground transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            Blog
          </Link>
          <span className="text-muted-foreground/40">/</span>
          <span className="truncate text-foreground/70">{article.category}</span>
        </nav>

        {/* Header */}
        <header>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="secondary" className={cn('border text-xs', CATEGORY_COLORS[article.category])}>
              {article.category}
            </Badge>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              {article.readingTime} min read
            </span>
            <time className="text-sm text-muted-foreground" dateTime={article.date}>
              {new Date(article.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
          <h1 className="mt-5 text-3xl font-bold tracking-tight leading-tight sm:text-4xl lg:text-[2.5rem]">
            {article.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{article.description}</p>
        </header>

        {/* Divider */}
        <div className="my-8 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Content */}
        <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-headings:font-semibold prose-h2:mt-10 prose-h2:text-2xl prose-h3:mt-6 prose-h3:text-xl prose-p:leading-7 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-li:leading-7 prose-blockquote:border-l-primary prose-blockquote:italic prose-strong:text-foreground prose-img:rounded-xl">
          {article.content}
        </div>

        {/* Share */}
        <div className="mt-10 flex flex-col items-center gap-3 border-t border-b py-6 sm:flex-row sm:justify-between">
          <p className="text-sm font-medium text-muted-foreground">Found this helpful? Share it:</p>
          <ShareButtons url={articleUrl} title={article.title} />
        </div>

        {/* CTA */}
        <div className="mt-10 overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5 p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Build Your Resume in Minutes</h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            50+ professional templates, AI-powered writing tools, and a built-in ATS scanner. Start free with 100 credits.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/signup">
              <Button size="lg" className="gap-2">
                Get Started Free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/resume-templates">
              <Button variant="outline" size="lg">Browse Templates</Button>
            </Link>
            <Link href="/pricing">
              <Button variant="ghost" size="lg" className="text-muted-foreground">View Pricing</Button>
            </Link>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-8 rounded-xl border bg-muted/30 p-6">
          <NewsletterSignup source="blog" />
        </div>

        {/* Related Posts */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-lg font-semibold">Related Articles</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {related.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col rounded-xl border p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                >
                  <Badge variant="secondary" className={cn('w-fit border text-[10px]', CATEGORY_COLORS[post.category])}>
                    {post.category}
                  </Badge>
                  <p className="mt-2 flex-1 text-sm font-medium leading-snug group-hover:text-primary line-clamp-2">
                    {post.title}
                  </p>
                  <span className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-2.5 w-2.5" />
                    {post.readingTime} min read
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Prev / Next Navigation */}
        <nav className="mt-10 grid gap-4 border-t pt-8 sm:grid-cols-2">
          {prevPost ? (
            <Link
              href={`/blog/${prevPost.slug}`}
              className="group flex items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/40"
            >
              <ChevronLeft className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Previous</p>
                <p className="mt-0.5 text-sm font-medium line-clamp-2 group-hover:text-primary">{prevPost.title}</p>
              </div>
            </Link>
          ) : (
            <div />
          )}
          {nextPost ? (
            <Link
              href={`/blog/${nextPost.slug}`}
              className="group flex items-start gap-3 rounded-lg border p-4 text-right transition-colors hover:bg-muted/40 sm:flex-row-reverse"
            >
              <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Next</p>
                <p className="mt-0.5 text-sm font-medium line-clamp-2 group-hover:text-primary">{nextPost.title}</p>
              </div>
            </Link>
          ) : (
            <div />
          )}
        </nav>

        {/* Back to blog */}
        <div className="mt-6 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> All articles
          </Link>
        </div>
      </article>
    </>
  )
}
