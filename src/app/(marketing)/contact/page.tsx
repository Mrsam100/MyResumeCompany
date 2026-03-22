import type { Metadata } from 'next'
import Link from 'next/link'
import { Mail, MapPin, MessageSquare } from 'lucide-react'
import { JsonLd } from '@/components/schema/json-ld'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with MyResumeCompany. Contact us for support, feedback, or business inquiries.',
  alternates: { canonical: '/contact' },
}

export default function ContactPage() {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://myresumecompany.com'
  return (
    <>
    <JsonLd data={{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl }, { '@type': 'ListItem', position: 2, name: 'Contact', item: `${siteUrl}/contact` }] }} />
    <div className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
      <h1 className="text-4xl font-bold tracking-tight">Contact Us</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Have a question, feature request, or need help with your resume? We&apos;d love to hear
        from you.
      </p>

      <div className="mt-12 grid gap-8 sm:grid-cols-3">
        <div className="rounded-xl border p-6 text-center">
          <Mail className="mx-auto h-8 w-8 text-primary" />
          <h2 className="mt-4 font-semibold">Email</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            For general inquiries and support
          </p>
          <a
            href="mailto:support@myresumecompany.com"
            className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          >
            support@myresumecompany.com
          </a>
        </div>

        <div className="rounded-xl border p-6 text-center">
          <MessageSquare className="mx-auto h-8 w-8 text-primary" />
          <h2 className="mt-4 font-semibold">Privacy</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Data requests and privacy concerns
          </p>
          <a
            href="mailto:privacy@myresumecompany.com"
            className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          >
            privacy@myresumecompany.com
          </a>
        </div>

        <div className="rounded-xl border p-6 text-center">
          <MapPin className="mx-auto h-8 w-8 text-primary" />
          <h2 className="mt-4 font-semibold">Address</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            MyResumeCompany
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            United States
          </p>
        </div>
      </div>

      {/* Common questions */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold">Before you reach out</h2>
        <div className="mt-6 space-y-6">
          <div>
            <h3 className="font-semibold">How do I delete my account?</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Go to{' '}
              <Link href="/settings" className="text-primary underline underline-offset-4">
                Settings
              </Link>{' '}
              and scroll to the Danger Zone section. All your data will be permanently removed
              within 30 days.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">How do I get a refund?</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Email support@myresumecompany.com with your account email and we&apos;ll review
              your request. We typically respond within 24 hours.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">I found a bug. Where do I report it?</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Email support@myresumecompany.com with a description of what happened and
              screenshots if possible. We appreciate every report.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Can I use MyResumeCompany for my team or company?</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Enterprise and team features are on our roadmap. Email support@myresumecompany.com
              to discuss your needs and get early access.
            </p>
          </div>
        </div>
      </div>

      {/* Response time */}
      <div className="mt-16 rounded-xl border bg-muted/40 p-8 text-center">
        <p className="text-lg font-semibold">We typically respond within 24 hours</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Monday through Friday. For urgent issues, include &ldquo;URGENT&rdquo; in the subject
          line.
        </p>
      </div>
    </div>
    </>
  )
}
