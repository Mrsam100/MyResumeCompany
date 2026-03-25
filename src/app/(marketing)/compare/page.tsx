import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { JsonLd } from '@/components/schema/json-ld'

export const metadata: Metadata = {
  title: 'Compare Resume Builders — MyResumeCompany vs Competitors',
  description:
    'See how MyResumeCompany compares to Zety, Resume.io, and Canva for AI resume building, ATS optimization, templates, and pricing.',
  alternates: { canonical: '/compare' },
}

const COMPARISONS = [
  {
    slug: 'vs-zety',
    name: 'Zety',
    tagline: 'Half the price, more AI features',
    highlight: '₹799/mo vs $24.95/mo',
    description:
      'Zety is a popular resume builder with 20+ templates and step-by-step writing tips. MyResumeCompany offers the same core features at roughly half the price, plus an ATS scanner, ATS optimizer, and AI full resume generator that Zety lacks.',
  },
  {
    slug: 'vs-resume-io',
    name: 'Resume.io',
    tagline: 'More AI, better ATS tools',
    highlight: 'ATS scanner + optimizer included',
    description:
      'Resume.io is a clean, straightforward builder with 30+ templates. MyResumeCompany matches its ease of use while adding a full ATS scanner (0-100 score), ATS optimizer that rewrites bullets to match job descriptions, and an AI wizard that generates complete resumes from scratch.',
  },
  {
    slug: 'vs-canva',
    name: 'Canva',
    tagline: 'Built for resumes, not just design',
    highlight: 'ATS-compatible output guaranteed',
    description:
      'Canva is a powerful design tool, but its resume templates often fail ATS parsing because they use images and non-standard layouts. MyResumeCompany is purpose-built for job seekers with AI writing tools, ATS-tested templates, and structured PDF export that every ATS can read.',
  },
]

export default function ComparePage() {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://myresumecompany.canmero.com'

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Compare', item: `${siteUrl}/compare` },
          ],
        }}
      />
      <div className="mx-auto max-w-4xl px-4 py-16 sm:py-24">
        <h1 className="text-4xl font-bold tracking-tight">
          How Does MyResumeCompany Compare?
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Honest, side-by-side comparisons with the most popular resume builders. We show where we
          win, where they win, and who each tool is best for.
        </p>

        <div className="mt-12 space-y-6">
          {COMPARISONS.map((comp) => (
            <Link
              key={comp.slug}
              href={`/compare/${comp.slug}`}
              className="group block rounded-xl border p-6 transition-all hover:bg-muted/40 hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold group-hover:text-primary">
                      MyResumeCompany vs {comp.name}
                    </h2>
                    <Badge variant="secondary" className="text-xs">
                      {comp.highlight}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm font-medium text-primary">{comp.tagline}</p>
                  <p className="mt-3 text-sm text-muted-foreground">{comp.description}</p>
                </div>
                <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </div>
            </Link>
          ))}
        </div>

        {/* Roundup link */}
        <div className="mt-12 rounded-xl border bg-muted/40 p-8 text-center">
          <h2 className="text-2xl font-bold">Looking for a broader comparison?</h2>
          <p className="mt-2 text-muted-foreground">
            See how 6 resume builders stack up in our comprehensive roundup.
          </p>
          <div className="mt-6">
            <Link href="/compare/best-resume-builders-2026">
              <Button variant="outline" className="gap-2">
                Best Resume Builders in 2026 <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold">Ready to try MyResumeCompany?</h2>
          <p className="mt-2 text-muted-foreground">
            Free to start. 100 credits. No credit card required.
          </p>
          <div className="mt-6">
            <Link href="/signup">
              <Button size="lg" className="gap-2 px-8">
                Get started free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
