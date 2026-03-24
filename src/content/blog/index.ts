export type { BlogPost } from './posts-resume-writing'
import type { BlogPost } from './posts-resume-writing'
import { resumeWritingPosts } from './posts-resume-writing'
import { jobSearchPosts } from './posts-job-search'
import { industryPosts } from './posts-industry'
import { coverLettersAIPosts } from './posts-cover-letters-ai'
import { existingPosts } from './posts-existing'

export interface BlogPostWithMeta extends BlogPost {
  readingTime: number
}

/** Estimate reading time from description length as proxy (avg 1000 words per post = 5 min) */
function estimateReadingTime(post: BlogPost): number {
  // Use description length as rough proxy since content is JSX
  // Longer descriptions correlate with longer posts
  const baseMin = 5
  const descWords = post.description.split(/\s+/).length
  return descWords > 25 ? baseMin + 2 : baseMin
}

function withMeta(posts: BlogPost[]): BlogPostWithMeta[] {
  return posts.map((p) => ({ ...p, readingTime: estimateReadingTime(p) }))
}

/** All blog posts sorted by date (newest first) */
export const ALL_POSTS: BlogPostWithMeta[] = [
  ...withMeta(existingPosts),
  ...withMeta(resumeWritingPosts),
  ...withMeta(jobSearchPosts),
  ...withMeta(industryPosts),
  ...withMeta(coverLettersAIPosts),
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

/** Lookup map: slug -> BlogPostWithMeta */
export const POSTS_BY_SLUG: Record<string, BlogPostWithMeta> = Object.fromEntries(
  ALL_POSTS.map((post) => [post.slug, post]),
)

/** All unique categories */
export const CATEGORIES = [...new Set(ALL_POSTS.map((p) => p.category))].sort()
