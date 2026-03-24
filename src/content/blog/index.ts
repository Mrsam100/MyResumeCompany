export type { BlogPost } from './posts-resume-writing'
import { resumeWritingPosts } from './posts-resume-writing'
import { jobSearchPosts } from './posts-job-search'
import { industryPosts } from './posts-industry'
import { coverLettersAIPosts } from './posts-cover-letters-ai'
import { existingPosts } from './posts-existing'

/** All blog posts sorted by date (newest first) */
export const ALL_POSTS = [
  ...existingPosts,
  ...resumeWritingPosts,
  ...jobSearchPosts,
  ...industryPosts,
  ...coverLettersAIPosts,
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

/** Lookup map: slug → BlogPost */
export const POSTS_BY_SLUG: Record<string, (typeof ALL_POSTS)[number]> = Object.fromEntries(
  ALL_POSTS.map((post) => [post.slug, post]),
)

/** All unique categories */
export const CATEGORIES = [...new Set(ALL_POSTS.map((p) => p.category))].sort()
