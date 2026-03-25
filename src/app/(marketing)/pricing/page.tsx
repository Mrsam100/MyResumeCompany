import type { Metadata } from 'next'
import Link from 'next/link'
import { Check, X, Crown, Zap, ArrowRight } from 'lucide-react'

import { auth } from '@/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CREDIT_COSTS, CREDIT_PACKS, SUBSCRIPTION_PLANS, CURRENCY } from '@/constants/credit-costs'
import { JsonLd } from '@/components/schema/json-ld'

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Simple, transparent pricing for MyResumeCompany. Start free with 100 credits or upgrade to Pro for unlimited AI resume writing, ATS scanning, and PDF exports.',
  alternates: { canonical: '/pricing' },
}

const FREE_FEATURES = [
  { text: '100 free credits on signup', included: true },
  { text: 'All 15 resume templates', included: true },
  { text: 'Drag-and-drop editor', included: true },
  { text: 'AI bullet point writer', included: true },
  { text: 'AI summary writer', included: true },
  { text: 'ATS scanner & optimizer', included: true },
  { text: 'Cover letter generator', included: true },
  { text: 'PDF export', included: true },
  { text: 'Credits consumed per action', included: true },
  { text: 'Unlimited AI usage', included: false },
  { text: 'Monthly credit refill', included: false },
  { text: 'Priority support', included: false },
]

const PRO_FEATURES = [
  { text: '500 credits on signup', included: true },
  { text: 'All 15 resume templates', included: true },
  { text: 'Drag-and-drop editor', included: true },
  { text: 'AI bullet point writer', included: true },
  { text: 'AI summary writer', included: true },
  { text: 'ATS scanner & optimizer', included: true },
  { text: 'Cover letter generator', included: true },
  { text: 'PDF export', included: true },
  { text: 'Unlimited AI usage (0 credits)', included: true },
  { text: '500 credits/month refill', included: true },
  { text: 'Priority support', included: true },
]

const FAQ = [
  {
    q: 'What are credits?',
    a: 'Credits are used for AI features and PDF exports. Each action costs a specific number of credits. Pro subscribers get unlimited AI usage (0 credits charged) plus 500 bonus credits per month.',
  },
  {
    q: 'Can I use the builder without paying?',
    a: 'Yes! You get 100 free credits on signup, which is enough to create and export a complete resume with AI assistance. Most users finish their first resume without spending anything.',
  },
  {
    q: 'What happens when I run out of credits?',
    a: `You can purchase credit packs starting at ${CURRENCY.symbol}299 for 100 credits, or upgrade to Pro for unlimited AI usage. You can still use the drag-and-drop editor and view templates without credits.`,
  },
  {
    q: 'Can I cancel my Pro subscription?',
    a: 'Yes, you can cancel anytime from your Settings page. You\'ll keep Pro benefits until the end of your billing period. No cancellation fees or penalties.',
  },
  {
    q: 'Do credits expire?',
    a: 'No, purchased credits never expire. Buy them whenever you need them and use them at your own pace.',
  },
  {
    q: 'How does the AI resume writer work?',
    a: 'Our AI is powered by Google Gemini. It generates achievement-focused bullet points, professional summaries, and full resumes based on your experience. You review and edit everything before saving — the AI suggests, you decide.',
  },
  {
    q: 'Will my resume pass ATS (Applicant Tracking Systems)?',
    a: 'All 50+ templates are tested against real ATS parsers. The ATS Scanner scores your resume 0-100 against a specific job description and shows exactly which keywords you\'re missing. The optimizer can rewrite your bullets to match.',
  },
  {
    q: 'Is my data safe?',
    a: 'Yes. Your resume data is encrypted in transit, stored securely on Supabase, and never sold to third parties. We don\'t use your data to train AI models. You can delete your account and all data anytime from Settings.',
  },
  {
    q: 'What\'s the difference between Free and Pro?',
    a: `Free users pay credits per AI action and PDF export. Pro users (${CURRENCY.symbol}${(SUBSCRIPTION_PLANS.PRO_MONTHLY.price / 100).toFixed(0)}/month) get unlimited AI usage at zero credit cost, 500 bonus credits per month for PDF exports, and priority support. Both plans have access to all 50+ templates and the full editor.`,
  },
  {
    q: 'Can I share my resume online?',
    a: 'Yes. Every resume gets a public shareable link (myresumecompany.canmero.com/r/your-slug) that you can include in email signatures, LinkedIn, or job applications.',
  },
]

export default async function PricingPage() {
  // (#20) Redirect authenticated users to /credits instead of /signup
  const session = await auth()
  const ctaHref = session?.user ? '/credits' : '/signup'
  const ctaLabel = session?.user ? 'Go to Credits' : 'Get Started Free'

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://myresumecompany.canmero.com'

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: siteUrl,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Pricing',
              item: `${siteUrl}/pricing`,
            },
          ],
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: FAQ.map((item) => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.a,
            },
          })),
        }}
      />
    <div className="mx-auto max-w-5xl px-4 py-16 sm:py-24">
      {/* Hero */}
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Simple, transparent pricing
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Start for free with 100 credits. Upgrade to Pro for unlimited AI or buy credit packs as
          you go.
        </p>
      </div>

      {/* Who is this for */}
      <div className="mt-16 grid gap-6 sm:grid-cols-3">
        <div className="rounded-xl border p-5 text-center">
          <p className="text-lg font-semibold">Students</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Entering the workforce? 100 free credits is all you need for your first AI-powered resume and PDF export.
          </p>
        </div>
        <div className="rounded-xl border p-5 text-center">
          <p className="text-lg font-semibold">Job seekers</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Applying to multiple roles? Pro gives you unlimited AI rewrites to tailor every resume to each job description.
          </p>
        </div>
        <div className="rounded-xl border p-5 text-center">
          <p className="text-lg font-semibold">Career changers</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Pivoting industries? The AI reframes your experience for a new audience. Credit packs let you pay as you go.
          </p>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="mt-16 grid gap-8 sm:grid-cols-2">
        {/* Free */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-2xl">Free</CardTitle>
            <CardDescription>Everything you need to get started</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col space-y-6">
            <div>
              <span className="text-4xl font-bold">{CURRENCY.symbol}0</span>
              <span className="text-muted-foreground">/forever</span>
            </div>
            <ul className="flex-1 space-y-3">
              {FREE_FEATURES.map((f) => (
                <li key={f.text} className="flex items-start gap-2.5 text-sm">
                  {f.included ? (
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  ) : (
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/40" />
                  )}
                  <span className={!f.included ? 'text-muted-foreground' : ''}>{f.text}</span>
                </li>
              ))}
            </ul>
            <Link href={ctaHref}>
              <Button variant="outline" className="w-full gap-2" size="lg">
                {ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Pro */}
        <Card className="relative flex flex-col border-amber-500/50 shadow-lg">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-1 text-white">
              <Crown className="mr-1 h-3 w-3" />
              Most Popular
            </Badge>
          </div>
          <CardHeader className="pt-8">
            <CardTitle className="text-2xl">Pro</CardTitle>
            <CardDescription>For serious job seekers</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col space-y-6">
            <div>
              <span className="text-4xl font-bold">
                {CURRENCY.symbol}{(SUBSCRIPTION_PLANS.PRO_MONTHLY.price / 100).toFixed(0)}
              </span>
              <span className="text-muted-foreground">/month</span>
              <p className="mt-1 text-sm text-muted-foreground">
                or {CURRENCY.symbol}{(SUBSCRIPTION_PLANS.PRO_YEARLY.price / 100).toFixed(0)}/year (save 32%)
              </p>
            </div>
            <ul className="flex-1 space-y-3">
              {PRO_FEATURES.map((f) => (
                <li key={f.text} className="flex items-start gap-2.5 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  <span>{f.text}</span>
                </li>
              ))}
            </ul>
            <Link href={ctaHref}>
              <Button
                className="w-full gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                size="lg"
              >
                <Crown className="h-4 w-4" />
                {session?.user ? 'Upgrade Now' : 'Start Pro Trial'}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Credit Packs */}
      <div className="mt-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Or buy credits as you go</h2>
          <p className="mt-2 text-muted-foreground">
            No subscription required. Buy what you need.
          </p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {CREDIT_PACKS.map((pack) => (
            <Card key={pack.id} className={pack.popular ? 'border-primary/50' : ''}>
              {pack.popular && (
                <div className="flex justify-center pt-3">
                  <Badge variant="default">Best Value</Badge>
                </div>
              )}
              <CardContent className="space-y-3 p-5 text-center">
                <p className="text-xl font-bold">{pack.credits} Credits</p>
                <p className="text-3xl font-bold">{CURRENCY.symbol}{(pack.price / 100).toFixed(0)}</p>
                <p className="text-xs text-muted-foreground">
                  {CURRENCY.symbol}{(pack.price / pack.credits).toFixed(1)} per credit
                </p>
                <Link href={ctaHref}>
                  <Button variant={pack.popular ? 'default' : 'outline'} className="w-full gap-2">
                    <Zap className="h-4 w-4" />
                    {session?.user ? 'Buy Now' : 'Sign Up & Buy'}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Credit Cost Table */}
      <div className="mt-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold">What do credits cost?</h2>
          <p className="mt-2 text-muted-foreground">
            Transparent per-action pricing. Pro users pay nothing.
          </p>
        </div>
        <div className="mt-8 overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-3 sm:px-5 py-3 text-left font-medium">Feature</th>
                <th className="px-3 sm:px-5 py-3 text-center font-medium">Free</th>
                <th className="px-3 sm:px-5 py-3 text-center font-medium">Pro</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {Object.entries(CREDIT_COSTS).map(([key, cost]) => (
                <tr key={key}>
                  <td className="px-3 sm:px-5 py-3 whitespace-nowrap">{formatFeatureName(key)}</td>
                  <td className="px-3 sm:px-5 py-3 text-center">{cost} credits</td>
                  <td className="px-3 sm:px-5 py-3 text-center font-medium text-green-600">Free</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
        </div>
        <div className="mx-auto mt-8 max-w-3xl space-y-6">
          {FAQ.map((item) => (
            <div key={item.q}>
              <h3 className="font-semibold">{item.q}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div className="mt-20 text-center">
        <h2 className="text-2xl font-bold">Ready to build your resume?</h2>
        <p className="mt-2 text-muted-foreground">
          {session?.user
            ? 'Head to your credits page to purchase credits or upgrade.'
            : 'Sign up free and get 100 credits to start.'}
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link href={ctaHref}>
            <Button size="lg" className="gap-2">
              {ctaLabel} <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
    </>
  )
}

function formatFeatureName(key: string): string {
  return key
    .replace(/^AI_/, 'AI ')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}
