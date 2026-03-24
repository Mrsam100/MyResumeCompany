import type { MetadataRoute } from 'next'
import { ALL_POSTS } from '@/content/blog'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://myresumecompany.canmero.com'

  const blogEntries: MetadataRoute.Sitemap = ALL_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [
    // Core marketing pages (updated frequently)
    { url: baseUrl, lastModified: new Date('2026-03-16'), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/pricing`, lastModified: new Date('2026-03-14'), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: new Date('2026-03-12'), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date('2026-03-10'), changeFrequency: 'monthly', priority: 0.5 },

    // Templates gallery (public)
    { url: `${baseUrl}/resume-templates`, lastModified: new Date('2026-03-15'), changeFrequency: 'weekly', priority: 0.9 },

    // Resume examples
    { url: `${baseUrl}/examples`, lastModified: new Date('2026-03-22'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/examples/software-engineer`, lastModified: new Date('2026-03-22'), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/examples/data-scientist`, lastModified: new Date('2026-03-22'), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/examples/product-manager`, lastModified: new Date('2026-03-22'), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/examples/registered-nurse`, lastModified: new Date('2026-03-22'), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/examples/graphic-designer`, lastModified: new Date('2026-03-22'), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/examples/marketing-manager`, lastModified: new Date('2026-03-22'), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/examples/recent-graduate`, lastModified: new Date('2026-03-22'), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/examples/accountant`, lastModified: new Date('2026-03-22'), changeFrequency: 'monthly', priority: 0.7 },

    // Blog listing
    { url: `${baseUrl}/blog`, lastModified: new Date('2026-03-25'), changeFrequency: 'weekly', priority: 0.8 },

    // Blog articles (auto-generated from content)
    ...blogEntries,

    // Comparison pages
    { url: `${baseUrl}/compare`, lastModified: new Date('2026-03-16'), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/compare/best-resume-builders-2026`, lastModified: new Date('2026-03-16'), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/compare/vs-zety`, lastModified: new Date('2026-03-08'), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/compare/vs-resume-io`, lastModified: new Date('2026-03-08'), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/compare/vs-canva`, lastModified: new Date('2026-03-08'), changeFrequency: 'monthly', priority: 0.6 },

    // Legal pages (rarely updated)
    { url: `${baseUrl}/privacy`, lastModified: new Date('2026-03-01'), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date('2026-03-01'), changeFrequency: 'yearly', priority: 0.3 },

    // Auth pages (signup is a conversion page worth indexing)
    { url: `${baseUrl}/signup`, lastModified: new Date('2026-03-05'), changeFrequency: 'monthly', priority: 0.8 },
  ]
}
