import Link from 'next/link'
import {
  ArrowRight,
  Check,
  X,
  Clock,
  MousePointerClick,
  ScanSearch,
  Pen,
  FileDown,
  MessageSquareText,
  ChevronRight,
} from 'lucide-react'

import { auth } from '@/auth'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { JsonLd } from '@/components/schema/json-ld'
import { LandingAnimations } from '@/components/marketing/landing-animations'

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://myresumecompany.com'

export default async function HomePage() {
  const session = await auth()
  const isLoggedIn = !!session?.user
  const ctaHref = isLoggedIn ? '/dashboard' : '/signup'
  const ctaLabel = isLoggedIn ? 'Go to Dashboard' : "Start building — it's free"

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
          browserRequirements: 'Requires a modern web browser',
          description:
            'AI-powered resume builder with 15+ professional templates, ATS scanner, AI bullet writer, and cover letter generator. Free to start.',
          offers: {
            '@type': 'AggregateOffer',
            lowPrice: '0',
            highPrice: '19.99',
            priceCurrency: 'USD',
            offerCount: 3,
            offers: [
              {
                '@type': 'Offer',
                name: 'Free Plan',
                price: '0',
                priceCurrency: 'USD',
                description: '100 free credits, all 50+ templates, AI features',
              },
              {
                '@type': 'Offer',
                name: 'Pro Monthly',
                price: '12',
                priceCurrency: 'USD',
                description: 'Unlimited AI usage, 500 credits/month, priority support',
                priceSpecification: {
                  '@type': 'UnitPriceSpecification',
                  price: '12',
                  priceCurrency: 'USD',
                  billingDuration: 'P1M',
                },
              },
              {
                '@type': 'Offer',
                name: 'Pro Yearly',
                price: '99',
                priceCurrency: 'USD',
                description: 'Unlimited AI usage, 500 credits/month, priority support — save 31%',
                priceSpecification: {
                  '@type': 'UnitPriceSpecification',
                  price: '99',
                  priceCurrency: 'USD',
                  billingDuration: 'P1Y',
                },
              },
            ],
          },
          featureList: [
            '15+ professional resume templates',
            'AI bullet point writer',
            'AI professional summary generator',
            'AI full resume generator',
            'ATS scanner and optimizer',
            'AI cover letter generator',
            'Drag-and-drop resume editor',
            'PDF export',
            'Public shareable resume links',
          ],
        }}
      />

      {/* Client-side animations wrapper */}
      <LandingAnimations>
        {/* ─── Hero ─── */}
        <section data-section="hero" className="relative overflow-hidden px-4 pb-24 pt-16 sm:pt-24">
          <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2">
            <div className="h-[500px] w-[800px] rounded-full bg-gradient-to-r from-primary/10 via-violet-500/10 to-primary/5 blur-3xl parallax-bg" />
          </div>
          <div className="relative mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
              Stop tweaking. Start landing.
            </p>
            <h1 className="mt-4 text-3xl font-bold leading-[1.1] tracking-tight sm:text-[2.5rem] md:text-6xl">
              Your resume is costing you interviews.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              According to hiring industry research, up to 75% of resumes are filtered out by
              applicant tracking systems before a recruiter sees them.
              We fix that. Pick a template, let AI write it, score it against the job — done.
            </p>
            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href={ctaHref}>
                <Button size="lg" className="h-12 gap-2 px-8 text-base font-semibold">
                  {ctaLabel}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <p className="text-xs text-muted-foreground">100 free credits. No card required.</p>
            </div>
          </div>
        </section>

        {/* ─── Social Proof ─── */}
        <section className="border-b px-4 py-10">
          <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-8 text-center sm:gap-14">
            <div>
              <p className="text-2xl font-bold sm:text-3xl">15</p>
              <p className="mt-1 text-xs text-muted-foreground">Professional templates</p>
            </div>
            <div>
              <p className="text-2xl font-bold sm:text-3xl">6</p>
              <p className="mt-1 text-xs text-muted-foreground">AI-powered tools</p>
            </div>
            <div>
              <p className="text-2xl font-bold sm:text-3xl">0-100</p>
              <p className="mt-1 text-xs text-muted-foreground">ATS compatibility score</p>
            </div>
            <div>
              <p className="text-2xl font-bold sm:text-3xl">Free</p>
              <p className="mt-1 text-xs text-muted-foreground">To start building</p>
            </div>
          </div>
        </section>

        {/* ─── The problem ─── */}
        <section data-section="problem" className="relative border-y bg-muted/40 px-4 py-28 overflow-hidden">
          <div className="mx-auto max-w-5xl">
            <h2 className="section-heading text-center text-3xl font-bold sm:text-4xl">
              Why do most resumes get rejected?
            </h2>
            <div className="mt-12 grid gap-6 sm:mt-16 sm:gap-10 sm:grid-cols-3">
              <div className="problem-card space-y-4 text-center">
                <div className="problem-icon mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                  <Clock className="h-8 w-8 text-destructive" />
                </div>
                <p className="text-lg font-semibold">Hours wasted formatting</p>
                <p className="text-base text-muted-foreground">
                  Fiddling with margins in Word. Googling &ldquo;how to write a bullet point.&rdquo;
                  Copy-pasting from templates that look like 2009.
                </p>
              </div>
              <div className="problem-card space-y-4 text-center">
                <div className="problem-icon mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                  <X className="h-8 w-8 text-destructive" />
                </div>
                <p className="text-lg font-semibold">Rejected by robots</p>
                <p className="text-base text-muted-foreground">
                  ATS software filters you out before anyone reads your name.
                  Wrong format, missing keywords, game over.
                </p>
              </div>
              <div className="problem-card space-y-4 text-center">
                <div className="problem-icon mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                  <MessageSquareText className="h-8 w-8 text-destructive" />
                </div>
                <p className="text-lg font-semibold">Generic &ldquo;responsible for&rdquo;</p>
                <p className="text-base text-muted-foreground">
                  Your bullet points sound like everyone else&apos;s.
                  No impact. No numbers. No reason to call you back.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── How it works ─── */}
        <section data-section="steps" className="px-4 py-24">
          <div className="mx-auto max-w-4xl">
            <p className="text-sm font-medium uppercase tracking-wide text-primary">How it works</p>
            <h2 className="section-heading mt-2 text-2xl font-bold sm:text-3xl">
              How do you build a resume that actually works?
            </h2>

            <div className="mt-16 space-y-20">
              <div className="step-item flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-10">
                <div className="step-number flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground">
                  1
                </div>
                <div className="step-content">
                  <h3 className="text-xl font-semibold">Pick a design that fits your industry</h3>
                  <p className="mt-2 text-muted-foreground">
                    50+ templates across categories — clean ATS-safe layouts for finance,
                    bold modern designs for startups, academic CVs for research. Every one
                    is tested with real ATS systems.
                  </p>
                  <Link
                    href="/resume-templates"
                    className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    Browse templates <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              <div className="step-item flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-10">
                <div className="step-number flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground">
                  2
                </div>
                <div className="step-content">
                  <h3 className="text-xl font-semibold">Let AI do the writing you dread</h3>
                  <p className="mt-2 text-muted-foreground">
                    Tell it your job title and company. It writes achievement-focused bullets
                    with real metrics. Need a full resume from scratch? The wizard asks 5 questions
                    and builds the whole thing.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {['Bullet points', 'Summaries', 'Full resumes', 'Cover letters'].map((t) => (
                      <Badge key={t} variant="secondary" className="badge-item text-xs">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="step-item flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-10">
                <div className="step-number flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground">
                  3
                </div>
                <div className="step-content">
                  <h3 className="text-xl font-semibold">Score it, fix it, send it</h3>
                  <p className="mt-2 text-muted-foreground">
                    Paste a job description. The ATS scanner scores your resume 0-100 and shows
                    exactly which keywords you&apos;re missing. One click and the optimizer
                    rewrites your bullets to match. Export a pixel-perfect PDF and apply.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── What you get ─── */}
        <section data-section="tools" className="border-y bg-muted/40 px-4 py-24">
          <div className="mx-auto max-w-4xl">
            <h2 className="section-heading text-center text-2xl font-bold sm:text-3xl">
              What AI tools does MyResumeCompany include?
            </h2>
            <p className="mt-3 text-center text-muted-foreground">
              Not features. Tools that actually change your callback rate.
            </p>

            <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-2" style={{ perspective: '1000px' }}>
              {TOOLS.map((tool) => (
                <div key={tool.label} className="tool-card flex gap-3 bg-card p-4 cursor-default sm:gap-4 sm:p-6">
                  <div className="tool-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <tool.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{tool.label}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{tool.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Before / After ─── */}
        <section data-section="before-after" className="px-4 py-24 overflow-hidden">
          <div className="mx-auto max-w-3xl">
            <h2 className="section-heading text-center text-2xl font-bold sm:text-3xl">
              What does AI resume rewriting look like?
            </h2>
            <p className="mt-3 text-center text-muted-foreground">
              Here&apos;s what AI rewriting actually looks like.
            </p>

            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              <div className="before-card rounded-xl border border-destructive/30 bg-destructive/5 p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-destructive">Before</p>
                <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                  <li>&bull; Responsible for managing social media accounts</li>
                  <li>&bull; Worked with the marketing team on campaigns</li>
                  <li>&bull; Helped increase website traffic</li>
                </ul>
              </div>
              <div className="after-card rounded-xl border border-green-500/30 bg-green-500/5 p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-green-600">After</p>
                <ul className="mt-4 space-y-3 text-sm">
                  <li>&bull; Grew Instagram following from 2K to 18K in 6 months through data-driven content strategy</li>
                  <li>&bull; Led 3-person team on a $50K product launch campaign that exceeded revenue targets by 140%</li>
                  <li>&bull; Increased organic website traffic 65% YoY by implementing SEO-optimized blog program</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* ─── Pricing ─── */}
        <section data-section="pricing" className="px-4 py-24">
          <div className="mx-auto max-w-3xl">
            <h2 className="section-heading text-center text-2xl font-bold sm:text-3xl">
              How much does an AI resume builder cost?
            </h2>
            <p className="mt-3 text-center text-muted-foreground">
              100 free credits gets you a full resume with AI. Most people never need to pay.
            </p>

            <div className="mx-auto mt-12 max-w-lg overflow-hidden rounded-2xl border">
              <div className="pricing-row flex items-center justify-between bg-muted/50 px-6 py-4">
                <span className="font-semibold">Action</span>
                <span className="font-semibold">Credits</span>
              </div>
              <div className="divide-y">
                {PRICING_ROWS.map(([action, cost]) => (
                  <div key={action} className="pricing-row flex items-center justify-between px-6 py-3 text-sm">
                    <span>{action}</span>
                    <span className="font-mono text-muted-foreground">{cost}</span>
                  </div>
                ))}
              </div>
              <div className="pricing-row bg-muted/50 px-6 py-3 text-center text-xs text-muted-foreground">
                Pro subscribers ($12/mo) use all AI features for free + get 500 credits/month.
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link href="/pricing">
                <Button variant="outline" className="gap-2">
                  Full pricing details <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <Separator />

        {/* ─── Objections ─── */}
        <section data-section="objections" className="px-4 py-24">
          <div className="mx-auto max-w-3xl">
            <h2 className="section-heading text-center text-2xl font-bold sm:text-3xl">
              &ldquo;But...&rdquo;
            </h2>

            <div className="mt-12 space-y-8">
              {OBJECTIONS.map((o) => (
                <div key={o.q} className="objection-item">
                  <p className="objection-q font-semibold">{o.q}</p>
                  <p className="objection-a mt-1.5 text-sm text-muted-foreground">{o.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Final CTA ─── */}
        <section data-section="final-cta" className="relative border-t bg-muted/40 px-4 py-24 overflow-hidden">
          <div className="pointer-events-none absolute -bottom-40 left-1/2 -translate-x-1/2">
            <div className="h-[400px] w-[600px] rounded-full bg-gradient-to-t from-primary/10 via-violet-500/5 to-transparent blur-3xl parallax-bg" />
          </div>
          <div className="relative mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">
              You&apos;ve read this far.
            </h2>
            <p className="mt-4 text-muted-foreground">
              That&apos;s more effort than most people put into their resume.
              Give it 10 minutes. See what comes out.
            </p>
            <div className="final-cta-btn mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href={ctaHref}>
                <Button size="lg" className="h-12 gap-2 px-10 text-base font-semibold">
                  {ctaLabel}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Free. 100 credits. No credit card. Takes 30 seconds to sign up.
            </p>
          </div>
        </section>
      </LandingAnimations>
    </>
  )
}

// ─── Data ───

const TOOLS = [
  {
    icon: Pen,
    label: 'AI Bullet Writer',
    detail: 'Give it your job title. Get back 5 achievement-focused bullets with real metrics you can edit.',
  },
  {
    icon: ScanSearch,
    label: 'ATS Scanner',
    detail: "Paste a job description. Get a 0-100 score with exactly which keywords you're missing.",
  },
  {
    icon: MousePointerClick,
    label: 'One-Click Optimize',
    detail: 'The optimizer rewrites your bullets to match the job. You pick which rewrites to keep.',
  },
  {
    icon: FileDown,
    label: 'PDF Export',
    detail: 'Pixel-perfect PDFs that look great on screen and survive any ATS parser.',
  },
  {
    icon: MessageSquareText,
    label: 'Cover Letters',
    detail: 'Personalized to the company and role. Choose professional, enthusiastic, or conversational tone.',
  },
  {
    icon: Check,
    label: '50+ Templates',
    detail: 'Classic, modern, creative, ATS-safe, academic. Every one tested with real tracking systems.',
  },
]

const PRICING_ROWS: [string, string][] = [
  ['AI bullet points', '10'],
  ['AI summary', '10'],
  ['ATS scan', '15'],
  ['ATS optimize', '15'],
  ['Cover letter', '20'],
  ['Full resume wizard', '40'],
  ['PDF export', '30'],
]

const OBJECTIONS = [
  {
    q: '"Won\'t AI-written resumes sound fake?"',
    a: 'The AI suggests. You edit. Every bullet is based on your actual experience — it just makes it sound better. Think writing partner, not ghostwriter. You stay in control of every word.',
  },
  {
    q: '"I don\'t want to pay for another subscription."',
    a: "Then don't. You get 100 free credits on signup — that's enough for a full AI-generated resume, ATS scan, and PDF export. Most people finish their resume without ever paying. Credit packs start at $4.99 if you need more.",
  },
  {
    q: '"What about my data?"',
    a: "Your resume data is yours. We don't sell it. We don't use it to train AI. You can delete your account and every byte of data from Settings, anytime.",
  },
  {
    q: '"Do ATS scanners actually matter?"',
    a: "Fortune 500 companies, staffing agencies, and most mid-size companies use ATS. If your resume doesn't have the right keywords in the right format, it never reaches a human. Our scanner shows you exactly what's missing.",
  },
]
