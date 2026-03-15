import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { SessionProvider } from '@/components/providers/session-provider'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
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
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <SessionProvider>
          <TooltipProvider>
            {children}
            <Toaster richColors position="bottom-right" />
          </TooltipProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
