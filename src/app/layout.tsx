import type { Metadata } from 'next'
import { Nunito, Poppins } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { JsonLd } from '@/components/schema/json-ld'
import './globals.css'

const nunito = Nunito({
  variable: '--font-body',
  subsets: ['latin'],
})

const poppins = Poppins({
  variable: '--font-heading',
  subsets: ['latin'],
  weight: ['600', '700'],
})

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://theresumecompany.com'

export const metadata: Metadata = {
  title: {
    default: 'TheResumeCompany — AI Resume Builder',
    template: '%s | TheResumeCompany',
  },
  description:
    'Build your perfect resume in minutes with AI. 15+ professional templates, ATS scanner, AI bullet writer, and cover letter generator. Free to start.',
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'TheResumeCompany',
    title: 'TheResumeCompany — AI Resume Builder',
    description:
      'Build your perfect resume in minutes with AI. 15+ professional templates, ATS scanner, and cover letter generator.',
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TheResumeCompany — AI Resume Builder',
    description:
      'Build your perfect resume in minutes with AI. Free to start with 100 credits.',
  },
  icons: {
    icon: '/favicon.svg',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} ${poppins.variable} font-sans antialiased`}>
        <noscript>
          <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <h1>TheResumeCompany — AI Resume Builder</h1>
            <p>
              Build your perfect resume in minutes with AI. 15+ professional templates, ATS scanner,
              AI bullet writer, and cover letter generator.
            </p>
            <p>
              JavaScript is required to use the resume editor. Please enable JavaScript in your
              browser settings to get started.
            </p>
            <p>
              <a href="/about">About</a> · <a href="/pricing">Pricing</a> ·{' '}
              <a href="/privacy">Privacy</a> · <a href="/terms">Terms</a> ·{' '}
              <a href="/contact">Contact</a>
            </p>
          </div>
        </noscript>
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'Organization',
            '@id': `${siteUrl}/#organization`,
            name: 'TheResumeCompany',
            url: siteUrl,
            logo: {
              '@type': 'ImageObject',
              url: `${siteUrl}/opengraph-image`,
              width: 1200,
              height: 630,
            },
            description:
              'AI-powered resume builder with 15+ professional templates, ATS scanner, and cover letter generator.',
          }}
        />
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'TheResumeCompany',
            url: siteUrl,
            description:
              'Build your perfect resume in minutes with AI. 15+ professional templates, ATS scanner, AI bullet writer, and cover letter generator.',
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: `${siteUrl}/resume-templates?q={search_term_string}`,
              },
              'query-input': 'required name=search_term_string',
            },
          }}
        />
        <TooltipProvider>
          {children}
          <Toaster richColors position="bottom-right" />
        </TooltipProvider>
      </body>
    </html>
  )
}
