import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { JsonLd } from '@/components/schema/json-ld'
import { RESUME_EXAMPLES, EXAMPLE_CATEGORIES } from '@/constants/resume-examples'

export const metadata: Metadata = {
  title: 'Resume Examples by Job Title — Real Samples for Every Industry',
  description:
    'Browse real resume examples for software engineers, nurses, accountants, marketing managers, and more. See what works, then build yours with AI.',
  alternates: { canonical: '/examples' },
}

export default function ExamplesPage() {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://myresumecompany.com'

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Resume Examples by Job Title',
          description: metadata.description,
          url: `${siteUrl}/examples`,
          mainEntity: {
            '@type': 'ItemList',
            numberOfItems: RESUME_EXAMPLES.length,
            itemListElement: RESUME_EXAMPLES.map((ex, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: `${ex.jobTitle} Resume Example`,
              url: `${siteUrl}/examples/${ex.slug}`,
            })),
          },
        }}
      />

      <div className="mx-auto max-w-5xl px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Resume Examples for Every Job Title
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            See what a great resume looks like for your role. Browse real examples with proven
            bullet points, then build yours with AI in minutes.
          </p>
          <div className="mt-8">
            <Link href="/signup">
              <Button size="lg" className="gap-2 px-8">
                Build your resume <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Category sections */}
        {EXAMPLE_CATEGORIES.map((cat) => {
          const catExamples = RESUME_EXAMPLES.filter((ex) => ex.category === cat.id)
          if (catExamples.length === 0) return null
          return (
            <section key={cat.id} className="mt-16" id={cat.id}>
              <h2 className="text-2xl font-bold">{cat.label} Resume Examples</h2>
              <p className="mt-2 text-muted-foreground">{cat.description}</p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {catExamples.map((example) => (
                  <Link
                    key={example.slug}
                    href={`/examples/${example.slug}`}
                    className="group rounded-xl border bg-card p-5 transition-all hover:shadow-md hover:-translate-y-0.5"
                  >
                    <Badge variant="secondary" className="text-[10px]">
                      {cat.label}
                    </Badge>
                    <h3 className="mt-2 text-lg font-semibold group-hover:text-primary">
                      {example.jobTitle} Resume
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {example.description}
                    </p>
                    <p className="mt-3 flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      View example <ArrowRight className="h-3 w-3" />
                    </p>
                  </Link>
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
            Sign up free, pick a template, and let AI write your bullet points. 100 free credits,
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
      </div>
    </>
  )
}
