import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Check, X, Crown, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { JsonLd } from '@/components/schema/json-ld'

export const metadata: Metadata = {
  title: '6 Best AI Resume Builders in 2026 — Compared & Ranked',
  description:
    'We compared the 6 most popular AI resume builders in 2026 on templates, AI features, ATS optimization, pricing, and free tiers. See which one fits your needs.',
  alternates: { canonical: '/compare/best-resume-builders-2026' },
}

interface Builder {
  name: string
  rank: number
  verdict: string
  bestFor: string
  price: string
  freeOption: string
  templates: string
  aiFeatures: string[]
  atsScanner: boolean | string
  pdfExport: boolean
  pros: string[]
  cons: string[]
  compareSlug?: string
}

const BUILDERS: Builder[] = [
  {
    name: 'TheResumeCompany',
    rank: 1,
    verdict: 'Best overall for AI-powered resume building with ATS optimization',
    bestFor: 'Job seekers who want AI writing + ATS scoring in one tool',
    price: '$12/mo (Pro) or pay-per-use credits',
    freeOption: '100 free credits — enough for a full resume + ATS scan + PDF export',
    templates: '15 templates across 7 categories (Professional, Modern, Creative, Tech, ATS-Optimized, Academic, Minimal)',
    aiFeatures: ['AI bullet point writer', 'AI summary generator (3 tones)', 'AI full resume wizard', 'ATS scanner (0-100 score)', 'ATS optimizer (rewrites bullets)', 'Cover letter generator'],
    atsScanner: '0-100 score with keyword analysis',
    pdfExport: true,
    pros: [
      'Most complete AI feature set of any builder we tested',
      'ATS scanner + optimizer is unique — no other builder rewrites bullets to match a specific job',
      'Generous free tier (100 credits covers a full resume workflow)',
      'Pro plan is the most affordable at $12/mo',
    ],
    cons: [
      'Fewer templates than Resume.io or Canva',
      'Newer platform — smaller user community',
      'No LinkedIn import yet (coming soon)',
    ],
  },
  {
    name: 'Zety',
    rank: 2,
    verdict: 'Established builder with strong writing guidance',
    bestFor: 'Users who want step-by-step resume writing tips alongside their builder',
    price: '$24.95/mo',
    freeOption: 'Free to create, but PDF export requires subscription',
    templates: '20+ templates with multiple color schemes',
    aiFeatures: ['AI bullet suggestions', 'Writing tips per section', 'Cover letter builder'],
    atsScanner: 'Basic ATS check',
    pdfExport: false,
    pros: [
      'Well-known brand with years of experience',
      'Excellent step-by-step writing guidance',
      'Large, polished template library',
      'Built-in content suggestions for many job titles',
    ],
    cons: [
      'Most expensive option at $24.95/mo',
      'No free PDF export — must subscribe to download',
      'No ATS scanner with scoring or keyword analysis',
      'No AI full resume generator',
    ],
    compareSlug: 'vs-zety',
  },
  {
    name: 'Resume.io',
    rank: 3,
    verdict: 'Clean, simple builder with a wide template library',
    bestFor: 'Users who want simplicity and a large selection of visual templates',
    price: '$15/mo',
    freeOption: 'One free resume with limited features',
    templates: '30+ templates across multiple categories',
    aiFeatures: ['AI content suggestions', 'Pre-written phrases', 'Cover letter builder'],
    atsScanner: false,
    pdfExport: false,
    pros: [
      'Largest template library among dedicated resume builders',
      'Very clean, intuitive interface',
      'Reasonable pricing at $15/mo',
      'Quick setup — can have a resume in under 10 minutes',
    ],
    cons: [
      'No ATS scanner or optimizer',
      'No AI full resume generator',
      'Free tier is extremely limited (one resume, no export)',
      'AI features are less advanced than TheResumeCompany or Zety',
    ],
    compareSlug: 'vs-resume-io',
  },
  {
    name: 'Canva',
    rank: 4,
    verdict: 'Great for visual resumes, risky for ATS',
    bestFor: 'Designers and creatives who prioritize visual appeal over ATS compatibility',
    price: 'Free (with ads) or $12.99/mo (Pro)',
    freeOption: 'Free with watermark on some elements and ads',
    templates: '1,000+ resume templates (general design tool)',
    aiFeatures: ['Magic Write (general AI, not resume-specific)'],
    atsScanner: false,
    pdfExport: true,
    pros: [
      'Massive template library',
      'Complete design freedom — customize anything',
      'Free tier is genuinely usable',
      'Great for portfolios and creative fields',
    ],
    cons: [
      'Resumes often fail ATS parsing (image-based layouts)',
      'No resume-specific AI (bullet writer, summary generator)',
      'No ATS scanner or optimization tools',
      'Not built for job seekers — general design tool',
    ],
    compareSlug: 'vs-canva',
  },
  {
    name: 'Novoresume',
    rank: 5,
    verdict: 'Solid mid-range builder with good ATS awareness',
    bestFor: 'Users who want a balance of design and ATS compatibility',
    price: '$19.99/mo',
    freeOption: 'One basic resume with Novoresume branding',
    templates: '12+ templates with customization options',
    aiFeatures: ['Content suggestions', 'Pre-written examples'],
    atsScanner: 'Basic ATS tips',
    pdfExport: false,
    pros: [
      'Clean, modern interface',
      'ATS-friendly template designs',
      'Skill and language proficiency sections built-in',
      'European-friendly (popular in EU markets)',
    ],
    cons: [
      'Higher price than TheResumeCompany with fewer features',
      'Limited AI capabilities',
      'Free tier is very restrictive (branding, one template)',
      'No ATS scoring or optimization',
    ],
  },
  {
    name: 'Kickresume',
    rank: 6,
    verdict: 'Affordable with AI writing, but limited ATS tools',
    bestFor: 'Budget-conscious users who want basic AI assistance',
    price: '$9.99/mo',
    freeOption: 'Free tier with limited templates and features',
    templates: '35+ templates',
    aiFeatures: ['AI resume writer (GPT-based)', 'Cover letter generator'],
    atsScanner: false,
    pdfExport: false,
    pros: [
      'Lowest paid tier among dedicated builders',
      'Large template selection',
      'AI writing powered by GPT',
      'Website builder included',
    ],
    cons: [
      'No ATS scanner or optimizer',
      'AI quality varies — generic output without resume expertise',
      'Free PDF export not available',
      'Interface feels dated compared to competitors',
    ],
  },
]

const RANKING_CRITERIA = [
  { label: 'AI Features', weight: '30%', description: 'Quality and breadth of AI writing tools — bullet writer, summary generator, full resume wizard, cover letters' },
  { label: 'ATS Optimization', weight: '25%', description: 'ATS scanning, scoring, keyword analysis, and optimization capabilities' },
  { label: 'Templates & Design', weight: '15%', description: 'Number, quality, and variety of resume templates' },
  { label: 'Pricing & Free Tier', weight: '20%', description: 'Monthly cost, free tier generosity, and overall value' },
  { label: 'Ease of Use', weight: '10%', description: 'Interface quality, onboarding, and time to first resume' },
]

export default function BestResumeBuildersPage() {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://theresumecompany.com'

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Best AI Resume Builders in 2026',
          description: metadata.description,
          itemListOrder: 'https://schema.org/ItemListOrderDescending',
          numberOfItems: BUILDERS.length,
          itemListElement: BUILDERS.map((b, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: b.name,
            url: b.compareSlug ? `${siteUrl}/compare/${b.compareSlug}` : `${siteUrl}/compare/best-resume-builders-2026`,
          })),
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Compare', item: `${siteUrl}/compare` },
            { '@type': 'ListItem', position: 3, name: 'Best Resume Builders 2026', item: `${siteUrl}/compare/best-resume-builders-2026` },
          ],
        }}
      />

      <div className="mx-auto max-w-4xl px-4 py-16 sm:py-24">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          {' / '}
          <Link href="/compare" className="hover:text-foreground">Compare</Link>
          {' / '}
          <span className="text-foreground">Best Resume Builders 2026</span>
        </nav>

        <h1 className="text-4xl font-bold tracking-tight">
          6 Best AI Resume Builders in 2026
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          We tested the 6 most popular AI-powered resume builders and ranked them on AI quality,
          ATS optimization, templates, pricing, and ease of use. Here is how they stack up.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Last updated: March 2026. Pricing verified as of March 10, 2026. TheResumeCompany is our product — we disclose this throughout.
        </p>

        {/* Quick rankings table */}
        <div className="mt-12 overflow-hidden rounded-xl border">
          <div className="bg-muted/50 px-5 py-3">
            <h2 className="font-bold">Quick Rankings</h2>
          </div>
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/30">
              <tr>
                <th className="px-4 py-2 text-left font-medium">#</th>
                <th className="px-4 py-2 text-left font-medium">Builder</th>
                <th className="px-4 py-2 text-left font-medium">Best For</th>
                <th className="px-4 py-2 text-left font-medium">Price</th>
                <th className="px-4 py-2 text-center font-medium">ATS Scanner</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {BUILDERS.map((b) => (
                <tr key={b.name} className={b.rank === 1 ? 'bg-primary/5' : ''}>
                  <td className="px-4 py-3 font-bold">{b.rank}</td>
                  <td className="px-4 py-3">
                    <span className="font-semibold">{b.name}</span>
                    {b.rank === 1 && (
                      <Badge className="ml-2 bg-primary/10 text-primary text-[10px]">
                        <Crown className="mr-1 h-3 w-3" /> Our Pick
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{b.bestFor.split(' who ')[0]}</td>
                  <td className="px-4 py-3">{b.price.split(' (')[0].split(' or ')[0]}</td>
                  <td className="px-4 py-3 text-center">
                    {b.atsScanner === false ? (
                      <X className="mx-auto h-4 w-4 text-muted-foreground/40" />
                    ) : typeof b.atsScanner === 'string' ? (
                      <span className="text-xs text-green-600">{b.atsScanner.includes('0-100') ? '0-100' : 'Basic'}</span>
                    ) : (
                      <Check className="mx-auto h-4 w-4 text-green-500" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Ranking methodology */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold">How we ranked these builders</h2>
          <p className="mt-3 text-muted-foreground">
            We evaluated each builder by creating a resume from scratch, testing AI features,
            exporting PDFs, and checking ATS compatibility. Here are the criteria and weights:
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {RANKING_CRITERIA.map((c) => (
              <div key={c.label} className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{c.label}</span>
                  <Badge variant="secondary" className="text-xs">{c.weight}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{c.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Individual reviews */}
        {BUILDERS.map((builder) => (
          <section key={builder.name} id={builder.name.toLowerCase().replace(/[.\s]/g, '-')} className="mt-16 scroll-mt-24">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                {builder.rank}
              </span>
              <h2 className="text-2xl font-bold">{builder.name}</h2>
              {builder.rank === 1 && (
                <Badge className="bg-amber-500/10 text-amber-600 border-amber-200 text-xs">
                  <Star className="mr-1 h-3 w-3" /> Editor&apos;s Choice
                </Badge>
              )}
            </div>

            <p className="mt-3 text-muted-foreground">
              <strong>Verdict:</strong> {builder.verdict}
            </p>
            <p className="mt-1 text-muted-foreground">
              <strong>Best for:</strong> {builder.bestFor}
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-muted p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Pricing</p>
                <p className="mt-1 text-sm font-medium">{builder.price}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Free: {builder.freeOption}</p>
              </div>
              <div className="rounded-lg border border-muted p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Templates</p>
                <p className="mt-1 text-sm">{builder.templates}</p>
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-muted p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">AI Features</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {builder.aiFeatures.map((f) => (
                  <Badge key={f} variant="secondary" className="text-xs">{f}</Badge>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="font-semibold text-green-600">Pros</h3>
                <ul className="mt-2 space-y-1.5">
                  {builder.pros.map((pro) => (
                    <li key={pro} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-500" />
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-red-600">Cons</h3>
                <ul className="mt-2 space-y-1.5">
                  {builder.cons.map((con) => (
                    <li key={con} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-400" />
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {builder.compareSlug && (
              <div className="mt-4">
                <Link
                  href={`/compare/${builder.compareSlug}`}
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  Read full comparison: TheResumeCompany vs {builder.name}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </section>
        ))}

        {/* Feature comparison matrix */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold">Feature Comparison Matrix</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Side-by-side comparison of the key features that matter most to job seekers.
          </p>
          <div className="mt-6 overflow-x-auto rounded-xl border">
            <table className="w-full text-xs sm:text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Feature</th>
                  {BUILDERS.map((b) => (
                    <th key={b.name} className="px-3 py-2 text-center font-medium whitespace-nowrap">
                      {b.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {MATRIX_ROWS.map((row) => (
                  <tr key={row.feature}>
                    <td className="px-3 py-2 font-medium">{row.feature}</td>
                    {row.values.map((val, i) => (
                      <td key={i} className="px-3 py-2 text-center">
                        {typeof val === 'boolean' ? (
                          val ? <Check className="mx-auto h-3.5 w-3.5 text-green-500" /> : <X className="mx-auto h-3.5 w-3.5 text-muted-foreground/40" />
                        ) : (
                          <span className="text-xs">{val}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Pricing as of March 2026. Features based on each builder&apos;s publicly documented capabilities.
          </p>
        </section>

        {/* Bottom line */}
        <section className="mt-16 rounded-xl border bg-muted/40 p-8">
          <h2 className="text-2xl font-bold">The Bottom Line</h2>
          <p className="mt-3 text-muted-foreground">
            If you want the most complete AI resume building experience with ATS optimization built in,{' '}
            <strong>TheResumeCompany</strong> is the best choice in 2026. It is the only builder that combines
            an AI bullet writer, full resume generator, ATS scanner with a 0-100 score, and an ATS optimizer
            that rewrites your bullets to match specific job descriptions — all at the lowest Pro price ($12/mo)
            among dedicated resume builders.
          </p>
          <p className="mt-3 text-muted-foreground">
            If you prioritize template variety, <strong>Resume.io</strong> and <strong>Canva</strong> offer more
            options. If you want hands-on writing guidance, <strong>Zety</strong> excels. But for the AI + ATS
            combination that actually helps you land interviews, TheResumeCompany leads the field.
          </p>
          <p className="mt-2 text-xs text-muted-foreground italic">
            Disclosure: TheResumeCompany is our product. We have done our best to present all builders
            fairly and accurately. Competitor information is sourced from their public websites and documentation.
          </p>
        </section>

        {/* CTA */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold">Try TheResumeCompany Free</h2>
          <p className="mt-2 text-muted-foreground">
            100 free credits. No credit card. Build a full resume with AI in minutes.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/signup">
              <Button size="lg" className="gap-2 px-8">
                Get started free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg">View pricing</Button>
            </Link>
          </div>
        </div>

        {/* Related */}
        <div className="mt-12 border-t pt-8">
          <h3 className="font-semibold">Head-to-head comparisons</h3>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/compare/vs-zety" className="text-sm text-primary hover:underline">vs Zety</Link>
            <Link href="/compare/vs-resume-io" className="text-sm text-primary hover:underline">vs Resume.io</Link>
            <Link href="/compare/vs-canva" className="text-sm text-primary hover:underline">vs Canva</Link>
          </div>
        </div>
      </div>
    </>
  )
}

// Feature comparison matrix data
const MATRIX_ROWS = [
  { feature: 'AI Bullet Writer', values: [true, true, true, false, false, true] },
  { feature: 'AI Full Resume Generator', values: [true, false, false, false, false, true] },
  { feature: 'ATS Scanner (0-100)', values: [true, false, false, false, false, false] },
  { feature: 'ATS Optimizer', values: [true, false, false, false, false, false] },
  { feature: 'Cover Letter Generator', values: [true, true, true, false, false, true] },
  { feature: 'Free PDF Export', values: [true, false, false, true, false, false] },
  { feature: 'Templates', values: ['15', '20+', '30+', '1000+', '12+', '35+'] },
  { feature: 'Pro Price', values: ['$12/mo', '$24.95/mo', '$15/mo', '$12.99/mo', '$19.99/mo', '$9.99/mo'] },
  { feature: 'Free Tier', values: ['100 credits', 'Preview only', '1 resume', 'Free + ads', 'Branded', 'Limited'] },
]
