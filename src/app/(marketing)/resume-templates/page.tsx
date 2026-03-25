import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { JsonLd } from '@/components/schema/json-ld'
import { getAllTemplateConfigs } from '@/templates/registry'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Resume Templates — 50+ Professional, ATS-Optimized Designs',
  description:
    'Browse 50+ free resume templates — professional, modern, creative, ATS-optimized, tech, and academic. Pick a design and start building your resume with AI.',
  alternates: {
    canonical: '/resume-templates',
  },
}

const CATEGORY_LABELS: Record<string, string> = {
  PROFESSIONAL: 'Professional',
  MODERN: 'Modern',
  CREATIVE: 'Creative',
  TECH: 'Tech',
  ATS_OPTIMIZED: 'ATS-Optimized',
  ACADEMIC: 'Academic',
  MINIMAL: 'Minimal',
}

const CATEGORY_COLORS: Record<string, string> = {
  PROFESSIONAL: 'bg-blue-50 text-blue-700 border-blue-200',
  MODERN: 'bg-violet-50 text-violet-700 border-violet-200',
  CREATIVE: 'bg-pink-50 text-pink-700 border-pink-200',
  TECH: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  ATS_OPTIMIZED: 'bg-amber-50 text-amber-700 border-amber-200',
  ACADEMIC: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  MINIMAL: 'bg-gray-50 text-gray-700 border-gray-200',
}

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  PROFESSIONAL:
    'Clean, traditional layouts trusted by recruiters at law firms, banks, and Fortune 500 companies. Safe for any industry.',
  MODERN:
    'Contemporary designs with bold typography and smart whitespace. Ideal for startups, marketing, and product roles.',
  CREATIVE:
    'Eye-catching layouts with unique elements. Perfect for designers, agencies, media, and entry-level applicants.',
  TECH:
    'Developer-focused templates with monospace accents, skill tags, and GitHub-style aesthetics for engineers and data professionals.',
  ATS_OPTIMIZED:
    'Zero-graphics, pure-text layouts engineered to achieve maximum ATS parse rates. When compatibility is everything.',
  ACADEMIC:
    'Multi-page CVs with sections for publications, research, grants, and teaching. Built for professors and PhDs.',
  MINIMAL:
    'Understated single-column layouts that let your content speak for itself. Clean dividers, generous whitespace.',
}

export default function TemplatesPage() {
  const templates = getAllTemplateConfigs()
  const categories = [...new Set(templates.map((t) => t.category))]

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://myresumecompany.canmero.com'

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: '50+ Professional Resume Templates',
          description: metadata.description,
          url: `${siteUrl}/resume-templates`,
          mainEntity: {
            '@type': 'ItemList',
            numberOfItems: templates.length,
            itemListElement: templates.map((t, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: t.name,
              url: `${siteUrl}/signup`,
            })),
          },
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Templates',
              item: `${siteUrl}/resume-templates`,
            },
          ],
        }}
      />

      <div className="mx-auto max-w-5xl px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Resume Templates for Every Industry
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Choose from 50+ professionally designed resume templates — all ATS-tested, all free to
            use. Pick a design, add your info, and let AI write the hard parts.
          </p>
          <div className="mt-8">
            <Link href="/signup">
              <Button size="lg" className="gap-2 px-8">
                Start building your resume <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Category sections */}
        {categories.map((cat) => {
          const catTemplates = templates.filter((t) => t.category === cat)
          return (
            <section key={cat} className="mt-20" id={cat.toLowerCase().replace('_', '-')}>
              <div className="flex items-center gap-3">
                <Badge
                  variant="outline"
                  className={cn('text-xs border', CATEGORY_COLORS[cat] ?? '')}
                >
                  {CATEGORY_LABELS[cat] ?? cat}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {catTemplates.length} template{catTemplates.length !== 1 ? 's' : ''}
                </span>
              </div>
              <h2 className="mt-3 text-2xl font-bold">
                {CATEGORY_LABELS[cat] ?? cat} Resume Templates
              </h2>
              <p className="mt-2 max-w-2xl text-muted-foreground">
                {CATEGORY_DESCRIPTIONS[cat] ?? ''}
              </p>

              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {catTemplates.map((template) => (
                  <div
                    key={template.slug}
                    className="group overflow-hidden rounded-xl border bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  >
                    {/* Color preview bar */}
                    <div
                      className="h-2"
                      style={{
                        background: `linear-gradient(90deg, ${template.defaultColors.primary}, ${template.defaultColors.secondary || template.defaultColors.primary})`,
                      }}
                    />

                    {/* Template info */}
                    <div className="p-5">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{template.name}</h3>
                        {template.isPremium && (
                          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px]">
                            Pro
                          </Badge>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {template.layout === 'sidebar-left'
                          ? 'Two-column sidebar layout'
                          : 'Single column layout'}
                        {' · '}
                        {template.defaultFonts.heading.split(',')[0]}
                      </p>

                      {/* Color swatches */}
                      <div className="mt-3 flex items-center gap-1.5">
                        <div
                          className="h-4 w-4 rounded-full border"
                          style={{ backgroundColor: template.defaultColors.primary }}
                          title="Primary color"
                        />
                        {template.defaultColors.secondary && (
                          <div
                            className="h-4 w-4 rounded-full border"
                            style={{ backgroundColor: template.defaultColors.secondary }}
                            title="Secondary color"
                          />
                        )}
                        <span className="ml-2 text-xs text-muted-foreground">
                          + custom colors
                        </span>
                      </div>

                      <Link
                        href="/signup"
                        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                      >
                        Use this template <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )
        })}

        {/* Bottom CTA */}
        <section className="mt-24 rounded-2xl border bg-muted/40 p-8 text-center sm:p-12">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Ready to build your resume?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Sign up free, choose a template, and let AI write your bullet points. 100 free credits,
            no credit card required.
          </p>
          <div className="mt-8">
            <Link href="/signup">
              <Button size="lg" className="gap-2 px-10">
                Get started free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* FAQ for SEO */}
        <section className="mt-24">
          <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
          <div className="mt-8 space-y-6">
            <div>
              <h3 className="font-semibold">Are these resume templates free?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Yes. All templates are free to use. You get 100 credits when you sign up, which
                covers AI writing, ATS scanning, and PDF export. Some templates are marked Pro —
                these are available to Pro subscribers (₹799/mo) and offer more advanced layouts.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Are these templates ATS-compatible?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Every template is tested with real applicant tracking systems. Our ATS-Optimized
                category uses zero graphics and pure text for maximum parse rates, but all templates
                generate clean, parseable PDFs.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Can I customize the colors and fonts?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Yes. Every template supports custom color schemes. Choose from predefined palettes or
                enter your own hex colors. The editor updates in real-time so you can see changes
                instantly.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Which template should I use?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                It depends on your industry. For corporate, finance, or legal roles, use Professional
                or ATS-Optimized templates. For startups or marketing, try Modern. For design or
                creative roles, use Creative. For engineering, use Tech. When in doubt, Classic
                Professional works everywhere.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
