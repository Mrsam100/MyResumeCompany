import type { Metadata } from 'next'
import Link from 'next/link'
import { FileText, Target, Sparkles, Shield, Users, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { JsonLd } from '@/components/schema/json-ld'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Learn about MyResumeCompany — our mission to democratize professional resume writing with AI-powered tools, 15+ templates, and ATS optimization.',
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://myresumecompany.com'
  return (
    <>
    <JsonLd data={{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl }, { '@type': 'ListItem', position: 2, name: 'About', item: `${siteUrl}/about` }] }} />
    <div className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
      <h1 className="text-4xl font-bold tracking-tight">About MyResumeCompany</h1>

      {/* Origin story */}
      <div className="mt-8 space-y-5 text-muted-foreground">
        <p className="text-lg leading-relaxed">
          MyResumeCompany started with a frustration that millions of job seekers share: the resume
          process is broken. Talented people spend hours fighting with formatting in Word, copying
          generic templates from the internet, and guessing which keywords will get them past
          applicant tracking systems. Most never hear back — not because they aren&apos;t qualified,
          but because their resume didn&apos;t make it past the first automated filter.
        </p>
        <p>
          We built MyResumeCompany to fix that. Our platform combines professionally designed
          templates with AI writing tools that help you articulate your experience in the language
          hiring managers and ATS systems actually look for. The result is a resume that represents
          your true potential — built in minutes, not hours.
        </p>
      </div>

      {/* The problem we solve */}
      <h2 className="mt-14 text-2xl font-bold">The problem we solve</h2>
      <div className="mt-4 space-y-4 text-muted-foreground">
        <p>
          Studies suggest that up to 75% of resumes are filtered out by applicant tracking systems
          before a human recruiter ever sees them. The reasons are often mechanical: wrong file
          format, missing keywords, inconsistent formatting, or bullet points that describe
          responsibilities instead of achievements. These are solvable problems — but most job
          seekers don&apos;t know where to start.
        </p>
        <p>
          Professional resume writers charge $200-$500 per resume. AI tools that promise to &ldquo;write
          your resume&rdquo; often produce generic, robotic output that experienced recruiters can
          spot immediately. Neither option works well for the average job seeker who needs something
          fast, affordable, and genuinely effective.
        </p>
        <p>
          MyResumeCompany sits in the middle. We give you the structure and design of a professional
          template, the intelligence of AI writing assistance, and the confidence of an{' '}
          <Link href="/pricing" className="text-primary underline underline-offset-4 hover:text-primary/80">
            ATS compatibility score
          </Link>{' '}
          — all at a price that starts at free.
        </p>
      </div>

      {/* What makes us different */}
      <h2 className="mt-14 text-2xl font-bold">What makes us different</h2>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {VALUES.map((v) => (
          <div key={v.title} className="rounded-xl border p-6">
            <v.icon className="h-6 w-6 text-primary" />
            <h3 className="mt-3 font-semibold">{v.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{v.description}</p>
          </div>
        ))}
      </div>

      {/* How it works */}
      <h2 className="mt-14 text-2xl font-bold">How it works</h2>
      <div className="mt-6 space-y-5 text-muted-foreground">
        <p>
          Getting started takes less than a minute. Sign up for free and you receive 100 credits —
          enough to create a complete AI-assisted resume and export it as a PDF. Here&apos;s the
          typical workflow:
        </p>
        <ol className="list-decimal space-y-3 pl-6">
          <li>
            <strong className="text-foreground">Choose a template.</strong> Pick from{' '}
            <Link href="/resume-templates" className="text-primary underline underline-offset-4 hover:text-primary/80">
              15 professionally designed templates
            </Link>{' '}
            spanning classic, modern, creative, tech, ATS-optimized, and academic styles. Every
            template has been tested against real ATS parsers to ensure your content gets through.
          </li>
          <li>
            <strong className="text-foreground">Fill in your details or use the AI wizard.</strong>{' '}
            Type your information into the drag-and-drop editor, or let the AI Resume Wizard ask
            you 5 questions and generate a complete resume from scratch. Either way, you stay in
            full control of every word.
          </li>
          <li>
            <strong className="text-foreground">Polish with AI tools.</strong> Use the AI bullet
            writer to turn &ldquo;responsible for managing social media&rdquo; into &ldquo;grew
            Instagram following from 2K to 18K in 6 months through data-driven content
            strategy.&rdquo; Generate professional summaries in three tones: confident, balanced, or
            technical.
          </li>
          <li>
            <strong className="text-foreground">Scan and optimize for ATS.</strong> Paste a job
            description and get a 0-100 ATS compatibility score. The scanner identifies missing
            keywords and formatting issues. One click lets the optimizer rewrite your bullets to
            match — you pick which changes to keep.
          </li>
          <li>
            <strong className="text-foreground">Export and apply.</strong> Download a pixel-perfect
            PDF or share a public link. Your resume is ready to submit.
          </li>
        </ol>
      </div>

      {/* Who we serve */}
      <h2 className="mt-14 text-2xl font-bold">Who we built this for</h2>
      <div className="mt-4 space-y-4 text-muted-foreground">
        <p>
          MyResumeCompany is designed for anyone who needs a professional resume without the
          professional price tag. That includes:
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong className="text-foreground">Students and recent graduates</strong> entering
            the workforce for the first time and unsure how to present limited experience
            effectively.
          </li>
          <li>
            <strong className="text-foreground">Career changers</strong> pivoting into new
            industries who need to reframe their existing experience for a different audience.
          </li>
          <li>
            <strong className="text-foreground">Experienced professionals</strong> who haven&apos;t
            updated their resume in years and need a modern, ATS-compatible format.
          </li>
          <li>
            <strong className="text-foreground">Academics and researchers</strong> who need
            multi-page CVs with publications, grants, and teaching sections.
          </li>
          <li>
            <strong className="text-foreground">Job seekers applying at scale</strong> who need to
            tailor their resume to multiple job descriptions quickly.
          </li>
        </ul>
      </div>

      {/* Our mission */}
      <h2 className="mt-14 text-2xl font-bold">Our mission</h2>
      <div className="mt-4 space-y-4 text-muted-foreground">
        <p>
          Our mission is to democratize access to professional resume writing. The difference
          between landing an interview and getting filtered out should not come down to whether you
          can afford a $400 resume writer or happen to know the right keywords. Everyone deserves
          tools that make the process fast, painless, and effective.
        </p>
        <p>
          We obsess over quality at every level. Every template is hand-crafted and tested against
          real ATS systems. Every AI prompt is carefully tuned to produce achievement-focused,
          recruiter-ready language. Every feature — from the drag-and-drop editor to the one-click
          ATS optimizer — is designed to save you time while producing better results than you could
          get on your own.
        </p>
      </div>

      {/* Pricing transparency */}
      <h2 className="mt-14 text-2xl font-bold">Transparent pricing</h2>
      <div className="mt-4 space-y-4 text-muted-foreground">
        <p>
          We use a credit-based system so you only pay for what you use. Every new account starts
          with 100 free credits — enough for a full AI-generated resume, ATS scan, and PDF export.
          Need more? Credit packs start at $4.99, or upgrade to{' '}
          <Link href="/pricing" className="text-primary underline underline-offset-4 hover:text-primary/80">
            Pro for $12/month
          </Link>{' '}
          for unlimited AI usage and 500 bonus credits every month. No hidden fees, no surprise
          charges.
        </p>
      </div>

      {/* CTA */}
      <div className="mt-16 rounded-xl border bg-muted/40 p-8 text-center">
        <h2 className="text-2xl font-bold">Ready to build your resume?</h2>
        <p className="mt-2 text-muted-foreground">
          Sign up free and get 100 credits. No credit card required.
        </p>
        <div className="mt-6">
          <Link href="/signup">
            <Button size="lg" className="gap-2 px-8">
              Get started free
            </Button>
          </Link>
        </div>
      </div>
    </div>
    </>
  )
}

const VALUES = [
  {
    icon: FileText,
    title: '15 professional templates',
    description:
      'Classic, modern, creative, tech, ATS-optimized, and academic styles. Each tested against real applicant tracking systems.',
  },
  {
    icon: Sparkles,
    title: 'AI that helps, not replaces',
    description:
      'AI writes achievement-focused bullets and summaries. You review, edit, and keep full control of every word.',
  },
  {
    icon: Target,
    title: 'ATS-first approach',
    description:
      'Paste a job description and get a 0-100 score with missing keywords. One-click optimizer rewrites bullets to match.',
  },
  {
    icon: Shield,
    title: 'Privacy by design',
    description:
      'Your data is yours. We never sell personal information, never use it for AI training, and you can delete everything anytime.',
  },
  {
    icon: Users,
    title: 'Built for every career stage',
    description:
      'Students, career changers, senior professionals, and academics. Templates and AI tuned for every level.',
  },
  {
    icon: Zap,
    title: 'Minutes, not hours',
    description:
      'The AI Resume Wizard builds a complete resume from 5 questions. Manual editing with drag-and-drop is just as fast.',
  },
]
