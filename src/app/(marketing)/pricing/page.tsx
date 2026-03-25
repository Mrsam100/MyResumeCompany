import type { Metadata } from 'next'
import Link from 'next/link'
import { Check, Zap, ArrowRight } from 'lucide-react'

import { auth } from '@/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CREDIT_COSTS, CREDIT_PACKS, CURRENCY } from '@/constants/credit-costs'
import { JsonLd } from '@/components/schema/json-ld'

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Pay only for what you use. Buy credits when you need them — no subscriptions. Start free with 100 credits on signup. Credits never expire.',
  alternates: { canonical: '/pricing' },
}

const ALL_FEATURES = [
  '100 free credits on signup',
  'All 15 resume templates',
  'Drag-and-drop editor',
  'AI bullet point writer',
  'AI professional summary writer',
  'AI full resume generator',
  'ATS scanner & optimizer',
  'Cover letter generator',
  'PDF export',
  'Shareable public resume link',
]

const FAQ = [
  {
    q: 'What are credits?',
    a: 'Credits are used for AI features and PDF exports. Each action costs a set number of credits. You start with 100 free credits on signup — no card required.',
  },
  {
    q: 'Can I use the builder without paying?',
    a: 'Yes. You get 100 free credits on signup, which is enough to create and export a complete resume with AI assistance. Most users finish their first resume without spending anything.',
  },
  {
    q: 'Do credits expire?',
    a: 'No. Credits never expire. Buy them whenever you need them and use them at your own pace.',
  },
  {
    q: 'What happens when I run out of credits?',
    a: `You can purchase a credit pack starting at ${CURRENCY.symbol}199 for 200 credits. You can still use the drag-and-drop editor and view templates without any credits.`,
  },
  {
    q: 'How does the AI resume writer work?',
    a: 'Our AI is powered by Google Gemini. It generates achievement-focused bullet points, professional summaries, and full resumes based on your experience. You review and edit everything before saving — the AI suggests, you decide.',
  },
  {
    q: 'Will my resume pass ATS (Applicant Tracking Systems)?',
    a: "All 15 templates are tested against real ATS parsers. The ATS Scanner scores your resume 0-100 against a specific job description and shows exactly which keywords you're missing. The optimizer can rewrite your bullets to match.",
  },
  {
    q: 'Is my data safe?',
    a: "Yes. Your resume data is encrypted in transit, stored securely on Supabase, and never sold to third parties. We don't use your data to train AI models. You can delete your account and all data anytime from Settings.",
  },
  {
    q: 'Can I share my resume online?',
    a: 'Yes. Every resume gets a public shareable link that you can include in email signatures, LinkedIn, or job applications.',
  },
]

export default async function PricingPage() {
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
            Pay only for what you use
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Buy credits when you need them. No subscriptions. Credits never expire.
          </p>
        </div>

        {/* Hero card — free signup offer */}
        <div className="mt-12">
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-8">
              <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
                <div className="flex-1">
                  <p className="text-2xl font-bold">100 free credits on signup</p>
                  <p className="mt-1 text-muted-foreground">
                    Then buy more as you need — no subscription required, no card needed to start.
                  </p>
                  <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                    {ALL_FEATURES.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 shrink-0 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="shrink-0">
                  <Link href={ctaHref}>
                    <Button size="lg" className="gap-2 px-8">
                      {ctaLabel}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Credit Packs */}
        <div className="mt-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Credit packs</h2>
            <p className="mt-2 text-muted-foreground">
              One-time purchase. No subscription. Buy what you need, when you need it.
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {CREDIT_PACKS.map((pack) => (
              <Card key={pack.id} className={pack.popular ? 'border-primary/50 shadow-md' : ''}>
                {pack.popular && (
                  <div className="flex justify-center pt-3">
                    <Badge variant="default">Best Value</Badge>
                  </div>
                )}
                <CardContent className={`space-y-3 p-6 text-center ${pack.popular ? 'pt-3' : ''}`}>
                  <p className="text-lg font-semibold">{pack.label}</p>
                  <p className="text-4xl font-bold">
                    {CURRENCY.symbol}{(pack.price / 100).toFixed(0)}
                  </p>
                  <p className="text-xl font-medium text-muted-foreground">{pack.credits} credits</p>
                  <p className="text-xs text-muted-foreground">
                    {CURRENCY.symbol}{(pack.price / pack.credits).toFixed(2)} per credit
                  </p>
                  <Link href={ctaHref} className="block pt-1">
                    <Button
                      variant={pack.popular ? 'default' : 'outline'}
                      className="w-full gap-2"
                    >
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
              Transparent per-action pricing. No hidden fees.
            </p>
          </div>
          <div className="mt-8 overflow-x-auto rounded-xl border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-3 py-3 text-left font-medium sm:px-5">Feature</th>
                  <th className="px-3 py-3 text-center font-medium sm:px-5">Credits</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {Object.entries(CREDIT_COSTS).map(([key, cost]) => (
                  <tr key={key}>
                    <td className="whitespace-nowrap px-3 py-3 sm:px-5">{formatFeatureName(key)}</td>
                    <td className="px-3 py-3 text-center sm:px-5">{cost} credits</td>
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
              ? 'Head to your credits page to top up and keep going.'
              : 'Sign up free and get 100 credits — no card required.'}
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
