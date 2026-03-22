import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { JsonLd } from '@/components/schema/json-ld'
import { RESUME_EXAMPLES, EXAMPLE_CATEGORIES } from '@/constants/resume-examples'

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://myresumecompany.com'

export async function generateStaticParams() {
  return RESUME_EXAMPLES.map((ex) => ({ slug: ex.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const example = RESUME_EXAMPLES.find((e) => e.slug === slug)
  if (!example) return {}
  return {
    title: `${example.jobTitle} Resume Example — Proven Template & Bullet Points`,
    description: `See a real ${example.jobTitle} resume example with proven bullet points and metrics. Use this as a starting point to build your own resume with AI.`,
    alternates: { canonical: `/examples/${slug}` },
  }
}

export default async function ExamplePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const example = RESUME_EXAMPLES.find((e) => e.slug === slug)
  if (!example) notFound()

  const category = EXAMPLE_CATEGORIES.find((c) => c.id === example.category)

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: `${example.jobTitle} Resume Example`,
          description: example.description,
          url: `${siteUrl}/examples/${slug}`,
          author: { '@type': 'Organization', name: 'MyResumeCompany' },
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Examples', item: `${siteUrl}/examples` },
            { '@type': 'ListItem', position: 3, name: `${example.jobTitle} Resume`, item: `${siteUrl}/examples/${slug}` },
          ],
        }}
      />

      <div className="mx-auto max-w-4xl px-4 py-16 sm:py-24">
        <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/examples" className="hover:text-foreground">Examples</Link>
          <span>/</span>
          <span className="text-foreground">{example.jobTitle}</span>
        </nav>

        <div className="flex items-center gap-3 mb-4">
          <Badge variant="secondary">{category?.label}</Badge>
          <Badge variant="outline" className="text-[10px]">Template: {example.template}</Badge>
        </div>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {example.jobTitle} Resume Example
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">{example.description}</p>

        <div className="mt-6">
          <Link href="/signup">
            <Button className="gap-2">
              Use this as a starting point <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Resume Preview */}
        <div className="mt-10 rounded-xl border bg-white p-8 shadow-sm space-y-6">
          {/* Header */}
          <div className="border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-900">[Your Name]</h2>
            <p className="text-gray-600">{example.jobTitle}</p>
            <p className="text-sm text-gray-500 mt-1">your@email.com · (555) 123-4567 · City, ST</p>
          </div>

          {/* Summary */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-2">Professional Summary</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{example.summary}</p>
          </div>

          {/* Experience */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-3">Work Experience</h3>
            {example.experience.map((exp, i) => (
              <div key={i} className={i > 0 ? 'mt-4' : ''}>
                <div className="flex justify-between items-baseline">
                  <p className="font-semibold text-gray-900">{exp.title}</p>
                  <p className="text-xs text-gray-500 shrink-0">{exp.dates}</p>
                </div>
                <p className="text-sm text-gray-600">{exp.company}</p>
                <ul className="mt-2 space-y-1.5">
                  {exp.bullets.map((bullet, j) => (
                    <li key={j} className="text-sm text-gray-700 leading-relaxed pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-gray-400">
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Education */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-2">Education</h3>
            {example.education.map((edu, i) => (
              <div key={i} className="flex justify-between">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{edu.degree}</p>
                  <p className="text-sm text-gray-600">{edu.school}</p>
                </div>
                <p className="text-xs text-gray-500">{edu.year}</p>
              </div>
            ))}
          </div>

          {/* Skills */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-2">Skills</h3>
            <div className="flex flex-wrap gap-1.5">
              {example.skills.map((skill) => (
                <span key={skill} className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-700">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Why this works */}
        <div className="mt-10 space-y-4">
          <h2 className="text-xl font-bold">Why This {example.jobTitle} Resume Works</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2"><span className="text-green-600 font-bold">+</span> Quantified achievements with specific metrics (percentages, dollar amounts, team sizes)</li>
            <li className="flex gap-2"><span className="text-green-600 font-bold">+</span> Action verbs that demonstrate leadership and impact (Led, Built, Implemented, Reduced)</li>
            <li className="flex gap-2"><span className="text-green-600 font-bold">+</span> Industry-specific keywords that pass ATS systems</li>
            <li className="flex gap-2"><span className="text-green-600 font-bold">+</span> Clear progression showing career growth</li>
            <li className="flex gap-2"><span className="text-green-600 font-bold">+</span> Concise summary that matches the target role</li>
          </ul>
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-2xl border bg-muted/40 p-8 text-center">
          <h2 className="text-2xl font-bold">Build a resume like this in minutes</h2>
          <p className="mt-3 text-muted-foreground">
            Our AI will generate bullet points with real metrics based on your experience. Pick the {example.template} template and start building.
          </p>
          <div className="mt-6">
            <Link href="/signup">
              <Button size="lg" className="gap-2 px-8">
                Create your {example.jobTitle} resume <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <nav className="mt-10 border-t pt-6">
          <Link href="/examples" className="text-sm font-medium text-primary hover:underline">
            &larr; Back to all examples
          </Link>
        </nav>
      </div>
    </>
  )
}
