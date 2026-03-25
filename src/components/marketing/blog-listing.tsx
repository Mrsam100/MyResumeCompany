'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Clock, Search, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ALL_POSTS, CATEGORIES } from '@/content/blog'
import { cn } from '@/lib/utils'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const CATEGORY_COLORS: Record<string, string> = {
  'Resume Writing': 'bg-blue-50 text-blue-700 border-blue-200',
  'Job Search': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Career Advice': 'bg-violet-50 text-violet-700 border-violet-200',
  'AI & Technology': 'bg-amber-50 text-amber-700 border-amber-200',
  'Cover Letters': 'bg-pink-50 text-pink-700 border-pink-200',
  'Industry Guides': 'bg-indigo-50 text-indigo-700 border-indigo-200',
}

export function BlogListing() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const filtered = ALL_POSTS.filter((post) => {
    if (activeCategory && post.category !== activeCategory) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      return (
        post.title.toLowerCase().includes(q) ||
        post.description.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q)
      )
    }
    return true
  })

  const featured = ALL_POSTS[0]
  const rest = filtered.filter((p) => p.slug !== featured.slug || activeCategory || search)

  return (
    <>
      {/* Search + Filters */}
      <div className="mt-10 space-y-4">
        <div className="relative mx-auto max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={cn(
              'rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors',
              !activeCategory
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted text-muted-foreground hover:bg-muted/80',
            )}
          >
            All ({ALL_POSTS.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = ALL_POSTS.filter((p) => p.category === cat).length
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                className={cn(
                  'rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors',
                  activeCategory === cat
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80',
                )}
              >
                {cat} ({count})
              </button>
            )
          })}
        </div>
      </div>

      {/* Featured Post — only show when no filter/search */}
      {!activeCategory && !search && (
        <Link href={`/blog/${featured.slug}`} className="group mt-12 block">
          <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5 p-8 transition-all duration-300 hover:shadow-lg hover:border-primary/20 sm:p-10">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className={cn('border text-xs', CATEGORY_COLORS[featured.category])}>
                  {featured.category}
                </Badge>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {featured.readingTime} min read
                </span>
                <time className="text-xs text-muted-foreground">{formatDate(featured.date)}</time>
              </div>
              <h2 className="mt-4 text-2xl font-bold tracking-tight transition-colors group-hover:text-primary sm:text-3xl">
                {featured.title}
              </h2>
              <p className="mt-3 max-w-2xl text-muted-foreground sm:text-lg">{featured.description}</p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                Read article <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        </Link>
      )}

      {/* Post Grid */}
      {rest.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post, i) => (
            <article
              key={post.slug}
              className="group flex flex-col rounded-xl border bg-card transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <Link href={`/blog/${post.slug}`} className="flex flex-1 flex-col p-5">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className={cn('border text-[10px]', CATEGORY_COLORS[post.category])}>
                    {post.category}
                  </Badge>
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock className="h-2.5 w-2.5" />
                    {post.readingTime} min
                  </span>
                </div>
                <h2 className="mt-3 flex-1 text-base font-semibold leading-snug transition-colors group-hover:text-primary line-clamp-2">
                  {post.title}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{post.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <time className="text-xs text-muted-foreground">{formatDate(post.date)}</time>
                  <span className="text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    Read <ArrowRight className="inline h-3 w-3" />
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center">
          <p className="text-muted-foreground">No articles match your search.</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => { setSearch(''); setActiveCategory(null) }}>
            Clear filters
          </Button>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="mt-20 rounded-2xl border bg-gradient-to-br from-primary/5 to-blue-500/5 p-8 text-center sm:p-12">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Ready to build your resume?</h2>
        <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
          Put these tips into practice. 50+ templates, AI writing tools, and a built-in ATS scanner. Free to start.
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
    </>
  )
}
