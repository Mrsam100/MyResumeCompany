import type { Metadata } from 'next'
import { FileText, Target, Sparkles, Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about TheResumeCompany — our mission, story, and what makes us different.',
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
      <h1 className="text-4xl font-bold tracking-tight">About TheResumeCompany</h1>

      <div className="mt-8 space-y-6 text-muted-foreground">
        <p className="text-lg">
          We believe everyone deserves a resume that truly represents their potential. Too many
          talented people miss opportunities because their resume doesn&apos;t do them justice.
        </p>

        <p>
          TheResumeCompany was built to solve that. We combine beautiful, professional templates
          with cutting-edge AI to help job seekers create resumes that get past applicant tracking
          systems and into the hands of hiring managers.
        </p>
      </div>

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

      <h2 className="mt-14 text-2xl font-bold">Our mission</h2>

      <div className="mt-4 space-y-4 text-muted-foreground">
        <p>
          Our mission is to democratize access to professional resume writing. Whether you&apos;re a
          recent graduate entering the workforce, a career changer pivoting industries, or a senior
          professional refreshing your materials — you deserve tools that make the process fast,
          painless, and effective.
        </p>
        <p>
          We&apos;re a small, focused team obsessed with quality. Every template is hand-crafted,
          every AI prompt is carefully tuned, and every feature is designed to save you time
          while producing better results.
        </p>
      </div>
    </div>
  )
}

const VALUES = [
  {
    icon: FileText,
    title: 'Quality templates',
    description: '15+ templates designed by professionals, each tested with real ATS systems to ensure compatibility.',
  },
  {
    icon: Sparkles,
    title: 'AI that helps, not replaces',
    description: 'Our AI suggests and improves — you stay in control. Every bullet point and summary is editable.',
  },
  {
    icon: Target,
    title: 'ATS-first approach',
    description: 'Every template and export is optimized for applicant tracking systems, so your resume gets read.',
  },
  {
    icon: Shield,
    title: 'Privacy by design',
    description: 'Your data is yours. We never sell personal information and you can delete your account anytime.',
  },
]
