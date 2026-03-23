'use client'

import { useState } from 'react'
import { Pen, ScanSearch, MousePointerClick, FileText, Sparkles, FileDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const FEATURES = [
  {
    id: 'bullet-writer',
    icon: Pen,
    label: 'AI Bullet Writer',
    headline: 'Achievement-focused bullets with real metrics',
    description: 'Enter your job title and company. AI generates 5 STAR-format bullet points with quantified results. Pick the ones you like, edit the rest. Every bullet starts with a strong action verb.',
    example: '"Led a cross-functional team of 8 engineers to deliver a customer-facing dashboard 2 weeks ahead of schedule, reducing support tickets by 34%."',
  },
  {
    id: 'ats-scanner',
    icon: ScanSearch,
    label: 'ATS Scanner',
    headline: 'Score your resume 0-100 against any job',
    description: 'Paste a job description. The scanner analyzes keyword coverage, skills alignment, experience relevance, and format compatibility. See exactly which keywords you\'re missing and which ones you\'ve nailed.',
    example: 'Score: 87/100 — Missing: "Kubernetes", "CI/CD", "Agile" — Matched: 14/17 keywords',
  },
  {
    id: 'optimizer',
    icon: MousePointerClick,
    label: 'One-Click Optimize',
    headline: 'Rewrite bullets to match the job description',
    description: 'After scanning, the optimizer rewrites your bullet points to naturally include missing keywords. You review each change and pick which rewrites to keep. One click to apply, Ctrl+Z to undo.',
    example: 'Before: "Managed team projects" → After: "Led Agile sprint planning for 3 cross-functional teams, delivering 12 features per quarter using CI/CD pipelines"',
  },
  {
    id: 'cover-letter',
    icon: FileText,
    label: 'Cover Letters',
    headline: 'Personalized cover letters in 30 seconds',
    description: 'AI generates a tailored cover letter from your resume + the job description. Choose Professional, Enthusiastic, or Conversational tone. Edit inline, then copy or download. Or start from one of 11 proven templates.',
    example: 'Choose tone → Choose length → Generate → Edit → Download as .txt',
  },
  {
    id: 'resume-wizard',
    icon: Sparkles,
    label: 'Full Resume Wizard',
    headline: 'Build a complete resume from 5 questions',
    description: 'Answer 5 questions: target role, experience, education, skills, and preferred style. AI generates a full resume with summary, work experience, education, and skills sections. Pick a template and export.',
    example: '5 questions → Full resume → Choose template → Export PDF',
  },
  {
    id: 'export',
    icon: FileDown,
    label: 'PDF & DOCX Export',
    headline: 'Pixel-perfect exports that survive any ATS',
    description: 'Export as PDF for visual perfection or DOCX for job boards that require Word format. Every export is ATS-tested — clean text layers, parseable headers, no image-based text.',
    example: 'PDF (30 credits) or DOCX (25 credits) — Pro users export unlimited',
  },
]

export function FeatureTabs() {
  const [active, setActive] = useState(0)
  const feature = FEATURES[active]

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
      {/* Tab buttons — horizontal scroll on mobile, vertical on desktop */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 lg:w-52 lg:shrink-0 lg:flex-col lg:overflow-visible lg:pb-0">
        {FEATURES.map((f, i) => {
          const Icon = f.icon
          return (
            <button
              key={f.id}
              onClick={() => setActive(i)}
              className={cn(
                'flex shrink-0 items-center gap-2.5 rounded-xl px-4 py-3 text-left text-sm font-medium transition-all duration-200',
                i === active
                  ? 'bg-white text-slate-900 shadow-md shadow-blue-500/10 ring-1 ring-slate-200'
                  : 'text-slate-500 hover:bg-white/60 hover:text-slate-700',
              )}
            >
              <Icon className={cn('h-4 w-4 shrink-0', i === active ? 'text-blue-600' : 'text-slate-400')} />
              <span className="whitespace-nowrap">{f.label}</span>
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 text-white">
            <feature.icon className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">{feature.headline}</h3>
        </div>

        <p className="text-slate-600 leading-relaxed">{feature.description}</p>

        {/* Example output */}
        <div className="mt-5 rounded-lg border border-slate-100 bg-slate-50 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">Example</p>
          <p className="text-sm text-slate-700 italic leading-relaxed">{feature.example}</p>
        </div>
      </div>
    </div>
  )
}
