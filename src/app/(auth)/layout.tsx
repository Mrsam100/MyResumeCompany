import Link from 'next/link'
import { FileText, Sparkles, Shield, Zap } from 'lucide-react'

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Writing',
    description: 'Generate professional bullet points and summaries tailored to your industry',
  },
  {
    icon: FileText,
    title: '15+ Templates',
    description: 'Professional, modern, creative, and ATS-optimized designs',
  },
  {
    icon: Shield,
    title: 'ATS-Optimized',
    description: 'Score 90+ on any Applicant Tracking System',
  },
  {
    icon: Zap,
    title: '100 Free Credits',
    description: 'Start building immediately — no credit card required',
  },
]

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left — Branding panel (hidden on mobile) */}
      <div className="hidden flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold">
          <FileText className="h-6 w-6" />
          TheResumeCompany
        </Link>

        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold leading-tight">
              Build your perfect resume
              <br />
              in minutes with AI
            </h1>
            <p className="mt-3 text-primary-foreground/70">
              Join thousands of job seekers who landed their dream jobs.
            </p>
          </div>

          <div className="grid gap-4">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/10">
                  <feature.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">{feature.title}</p>
                  <p className="text-sm text-primary-foreground/60">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-primary-foreground/50">
          &copy; {new Date().getFullYear()} TheResumeCompany. All rights reserved.
        </p>
      </div>

      {/* Right — Auth form */}
      <div className="flex items-center justify-center bg-background px-4 py-10">
        <div className="w-full max-w-md">
          {/* Mobile logo (visible only on small screens) */}
          <Link
            href="/"
            className="mb-8 flex items-center justify-center gap-2 text-lg font-bold lg:hidden"
          >
            <FileText className="h-6 w-6 text-primary" />
            TheResumeCompany
          </Link>
          {children}
        </div>
      </div>
    </div>
  )
}
