import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://theresumecompany.com'

  return [
    // Core marketing pages (updated frequently)
    { url: baseUrl, lastModified: new Date('2026-03-16') },
    { url: `${baseUrl}/pricing`, lastModified: new Date('2026-03-14') },
    { url: `${baseUrl}/about`, lastModified: new Date('2026-03-12') },
    { url: `${baseUrl}/contact`, lastModified: new Date('2026-03-10') },

    // Templates gallery (public)
    { url: `${baseUrl}/resume-templates`, lastModified: new Date('2026-03-15') },

    // Blog (each article has its own publish date)
    { url: `${baseUrl}/blog`, lastModified: new Date('2026-03-16') },
    { url: `${baseUrl}/blog/how-to-write-resume-bullet-points`, lastModified: new Date('2026-03-10') },
    { url: `${baseUrl}/blog/what-is-ats-and-how-to-beat-it`, lastModified: new Date('2026-03-11') },
    { url: `${baseUrl}/blog/best-resume-format-2026`, lastModified: new Date('2026-03-12') },
    { url: `${baseUrl}/blog/ai-resume-builder-guide`, lastModified: new Date('2026-03-13') },
    { url: `${baseUrl}/blog/resume-summary-vs-objective`, lastModified: new Date('2026-03-14') },

    // Comparison pages
    { url: `${baseUrl}/compare`, lastModified: new Date('2026-03-16') },
    { url: `${baseUrl}/compare/best-resume-builders-2026`, lastModified: new Date('2026-03-16') },
    { url: `${baseUrl}/compare/vs-zety`, lastModified: new Date('2026-03-08') },
    { url: `${baseUrl}/compare/vs-resume-io`, lastModified: new Date('2026-03-08') },
    { url: `${baseUrl}/compare/vs-canva`, lastModified: new Date('2026-03-08') },

    // Legal pages (rarely updated)
    { url: `${baseUrl}/privacy`, lastModified: new Date('2026-03-01') },
    { url: `${baseUrl}/terms`, lastModified: new Date('2026-03-01') },

    // Auth pages (signup is a conversion page worth indexing)
    { url: `${baseUrl}/signup`, lastModified: new Date('2026-03-05') },
  ]
}
