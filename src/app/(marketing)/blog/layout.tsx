import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog — Resume Tips, Career Advice & Job Search Strategies',
  description:
    'Resume writing tips, career advice, and job search strategies from MyResumeCompany. Learn how to build a better resume and land more interviews.',
  alternates: { canonical: '/blog' },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children
}
