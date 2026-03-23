import Link from 'next/link'
import {
  ArrowRight,
  Check,
  ChevronRight,
  Sparkles,
} from 'lucide-react'

import { auth } from '@/auth'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { JsonLd } from '@/components/schema/json-ld'
import { HeroMockup } from '@/components/marketing/hero-mockup'
import { TemplateCarousel } from '@/components/marketing/template-carousel'
import { FeatureTabs } from '@/components/marketing/feature-tabs'
import { Testimonials } from '@/components/marketing/testimonials'
import { FAQAccordion } from '@/components/marketing/faq-accordion'
import { getFAQSchema } from '@/constants/faq-data'
import { LandingAnimations } from '@/components/marketing/landing-animations'

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://myresumecompany.canmero.com'

export default async function HomePage() {
  const session = await auth()
  const isLoggedIn = !!session?.user
  const ctaHref = isLoggedIn ? '/dashboard' : '/signup'
  const ctaLabel = isLoggedIn ? 'Go to Dashboard' : 'Create my resume — free'

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'MyResumeCompany',
          url: siteUrl,
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Any',
          description:
            'AI-powered resume builder with 50+ professional templates, ATS scanner, AI bullet writer, and cover letter generator.',
          offers: {
            '@type': 'AggregateOffer',
            lowPrice: '0',
            highPrice: '19.99',
            priceCurrency: 'USD',
            offerCount: 3,
            offers: [
              { '@type': 'Offer', name: 'Free Plan', price: '0', priceCurrency: 'USD', description: '100 free credits, all 50+ templates, AI features' },
              { '@type': 'Offer', name: 'Pro Monthly', price: '12', priceCurrency: 'USD', description: 'Unlimited AI, 500 credits/month' },
              { '@type': 'Offer', name: 'Pro Yearly', price: '99', priceCurrency: 'USD', description: 'Unlimited AI, 500 credits/month — save 31%' },
            ],
          },
          featureList: ['50+ resume templates', 'AI bullet writer', 'ATS scanner 0-100', 'Cover letter generator', 'PDF & DOCX export'],
        }}
      />
      <JsonLd data={getFAQSchema()} />

      <LandingAnimations>
      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden bg-white px-4 pb-20 pt-16 sm:pt-20 lg:pb-28 lg:pt-24">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-blue-100 via-violet-100 to-blue-50 opacity-70 blur-3xl" />

        <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-12 lg:flex-row lg:gap-16">
          <div className="flex-1 text-center lg:text-left">
            <Badge variant="secondary" className="mb-6 gap-1.5 border-blue-200 bg-blue-50 text-blue-700">
              <Sparkles className="h-3 w-3" /> AI-Powered Resume Builder
            </Badge>

            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Build a resume that
              <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent"> gets you hired</span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-600 lg:mx-0">
              Only 2% of resumes make it past ATS filters. MyResumeCompany gives you AI-powered writing, 50+ tested templates, and a real-time ATS scanner — so yours is one of them.
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
              <Link href={ctaHref}>
                <Button size="lg" className="h-12 gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-8 text-base font-semibold shadow-lg shadow-blue-500/25 transition-shadow hover:shadow-xl hover:shadow-blue-500/30">
                  {ctaLabel}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/resume-templates" className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-700">
                Browse templates <ChevronRight className="inline h-3.5 w-3.5" />
              </Link>
            </div>

            <p className="mt-4 text-xs text-slate-400">100 free credits. No credit card required.</p>
          </div>

          <div className="shrink-0 lg:w-[360px]">
            <HeroMockup />
          </div>
        </div>
      </section>

      {/* ═══ TRUST STATS ═══ */}
      <section className="border-y border-slate-100 bg-slate-50 px-4 py-8">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-8 sm:gap-14">
          {TRUST_STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-bold text-slate-900 sm:text-3xl">{stat.value}</p>
              <p className="mt-0.5 text-xs text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="bg-white px-4 py-20 lg:py-28">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">How it works</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">Three steps to a job-winning resume</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-500">No design skills needed. No hours wasted formatting. Just answer a few questions and let AI do the heavy lifting.</p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <div key={step.title} className="relative text-center">
                {i < 2 && (
                  <div className="absolute left-[calc(50%+40px)] top-8 hidden h-px w-[calc(100%-80px)] border-t-2 border-dashed border-slate-200 md:block" />
                )}
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 text-2xl font-bold text-white shadow-lg shadow-blue-500/20">
                  {i + 1}
                </div>
                <h3 className="text-lg font-bold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{step.description}</p>
                {step.link && (
                  <Link href={step.link.href} className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
                    {step.link.label} <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ AI TOOLS ═══ */}
      <section className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-violet-50/30 px-4 py-20 lg:py-28">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">AI Tools</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">Six tools that change your callback rate</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-500">Real AI tools that make measurable differences in how many interviews you land.</p>
          </div>
          <div className="mt-14">
            <FeatureTabs />
          </div>
        </div>
      </section>

      {/* ═══ BEFORE / AFTER ═══ */}
      <section className="bg-white px-4 py-20 lg:py-28">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">See the difference AI makes</h2>
            <p className="mt-3 text-slate-500">Same experience. Completely different impression.</p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-red-200 bg-red-50/50 p-6">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-400" />
                <p className="text-xs font-bold uppercase tracking-wider text-red-600">Before</p>
              </div>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex gap-2"><span className="shrink-0 text-red-400">&bull;</span>Responsible for managing social media accounts</li>
                <li className="flex gap-2"><span className="shrink-0 text-red-400">&bull;</span>Worked with the marketing team on campaigns</li>
                <li className="flex gap-2"><span className="shrink-0 text-red-400">&bull;</span>Helped increase website traffic</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-green-200 bg-green-50/50 p-6">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <p className="text-xs font-bold uppercase tracking-wider text-green-600">After — with AI</p>
              </div>
              <ul className="space-y-3 text-sm text-slate-800">
                <li className="flex gap-2"><span className="shrink-0 text-green-500">&bull;</span>Grew Instagram following from 2K to 18K in 6 months through data-driven content strategy</li>
                <li className="flex gap-2"><span className="shrink-0 text-green-500">&bull;</span>Led 3-person team on a $50K product launch campaign that exceeded revenue targets by 140%</li>
                <li className="flex gap-2"><span className="shrink-0 text-green-500">&bull;</span>Increased organic website traffic 65% YoY by implementing SEO-optimized blog program</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TEMPLATE GALLERY ═══ */}
      <section className="border-y border-slate-100 bg-slate-50 px-4 py-20 lg:py-28">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Templates</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">50+ professional templates</h2>
              <p className="mt-2 text-slate-500">Every category. Every industry. All ATS-tested.</p>
            </div>
            <Link href="/resume-templates" className="hidden items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 sm:flex">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <TemplateCarousel />
          <div className="mt-6 text-center sm:hidden">
            <Link href="/resume-templates" className="text-sm font-medium text-blue-600">View all templates <ArrowRight className="inline h-3.5 w-3.5" /></Link>
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="bg-white px-4 py-20 lg:py-28">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Testimonials</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">Trusted by job seekers worldwide</h2>
          </div>
          <div className="mt-12">
            <Testimonials />
          </div>
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section className="border-y border-slate-100 bg-slate-50 px-4 py-20 lg:py-28">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Simple, transparent pricing</h2>
            <p className="mt-3 text-slate-500">Start free. Upgrade when you need unlimited AI.</p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-8">
              <p className="text-sm font-semibold text-slate-500">Free</p>
              <p className="mt-2 text-4xl font-bold text-slate-900">$0</p>
              <p className="mt-1 text-sm text-slate-500">100 credits on signup</p>
              <ul className="mt-6 space-y-3">
                {FREE_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="mt-8 block">
                <Button variant="outline" className="w-full rounded-xl">Start free</Button>
              </Link>
            </div>

            <div className="relative rounded-2xl border-2 border-blue-500 bg-white p-8 shadow-lg shadow-blue-500/10">
              <div className="absolute -top-3 left-6">
                <Badge className="bg-gradient-to-r from-blue-600 to-violet-600 text-white">Most Popular</Badge>
              </div>
              <p className="text-sm font-semibold text-blue-600">Pro</p>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-slate-900">$12</span>
                <span className="text-slate-500">/month</span>
              </div>
              <p className="mt-1 text-sm text-slate-500">or $99/year (save 31%)</p>
              <ul className="mt-6 space-y-3">
                {PRO_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" /> {f}
                  </li>
                ))}
              </ul>
              <Link href={isLoggedIn ? '/credits' : '/signup'} className="mt-8 block">
                <Button className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 shadow-md">
                  Go Pro <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
          <p className="mt-6 text-center text-xs text-slate-400">Credit packs also available: 100 for $4.99 &middot; 300 for $9.99 &middot; 800 for $19.99</p>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="bg-white px-4 py-20 lg:py-28">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Frequently asked questions</h2>
            <p className="mt-3 text-slate-500">Everything you need to know before getting started.</p>
          </div>
          <div className="mt-12">
            <FAQAccordion />
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-violet-700 px-4 py-20 lg:py-24">
        <div className="pointer-events-none absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="relative mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Ready to land more interviews?</h2>
          <p className="mx-auto mt-4 max-w-lg text-blue-100">
            Join thousands of job seekers who built their resume with AI. Free to start, no credit card required.
          </p>
          <div className="mt-8">
            <Link href={ctaHref}>
              <Button size="lg" className="h-12 gap-2 rounded-xl bg-white px-10 text-base font-semibold text-blue-700 shadow-xl transition-colors hover:bg-blue-50">
                {ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-xs text-blue-200">Free &middot; 100 credits &middot; 50+ templates &middot; No credit card</p>
        </div>
      </section>
      </LandingAnimations>
    </>
  )
}

// ─── Data ───

const TRUST_STATS = [
  { value: '50+', label: 'Professional templates' },
  { value: '8', label: 'AI-powered tools' },
  { value: '0-100', label: 'ATS compatibility score' },
  { value: 'Free', label: 'To start building' },
]

const STEPS = [
  {
    title: 'Pick a template',
    description: '50+ designs across 7 categories — all tested with real ATS systems.',
    link: { href: '/resume-templates', label: 'Browse templates' },
  },
  {
    title: 'Let AI write it',
    description: 'AI generates achievement-focused bullets with real metrics. Or build a full resume from 5 questions.',
    link: null,
  },
  {
    title: 'Score, fix & export',
    description: 'Get an ATS score 0-100. One click to optimize missing keywords. Export as PDF or DOCX.',
    link: null,
  },
]

const FREE_FEATURES = [
  'All 50+ templates',
  '100 credits on signup',
  'AI bullet writer & summary generator',
  'ATS scanner & optimizer',
  'PDF & DOCX export',
  'Cover letter generator',
]

const PRO_FEATURES = [
  'Everything in Free',
  'Unlimited AI usage (0 credits)',
  '500 bonus credits every month',
  'Unlimited PDF & DOCX exports',
  'Priority support',
  'Save 31% with annual plan',
]
