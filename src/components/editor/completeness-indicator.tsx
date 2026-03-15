'use client'

import { useState } from 'react'
import { Check, Circle, ChevronDown, ChevronUp } from 'lucide-react'
import { useResumeStore } from '@/stores/resume-store'
import { cn } from '@/lib/utils'

interface CheckItem {
  label: string
  done: boolean
  weight: number
}

function useCompletenessScore() {
  const content = useResumeStore((s) => s.content)
  const { personalInfo, sections } = content

  const items: CheckItem[] = [
    { label: 'Full name', done: !!personalInfo.fullName.trim(), weight: 8 },
    { label: 'Professional title', done: !!personalInfo.title.trim(), weight: 5 },
    { label: 'Email address', done: !!personalInfo.email.trim(), weight: 5 },
    { label: 'Phone number', done: !!personalInfo.phone.trim(), weight: 4 },
    { label: 'Location', done: !!personalInfo.location.trim(), weight: 3 },
    {
      label: 'Professional summary',
      done: (personalInfo.summary?.trim().length ?? 0) >= 50,
      weight: 15,
    },
    {
      label: 'Work experience',
      done: sections.some(
        (s) => s.type === 'experience' && s.entries.some((e) => !!e.fields.jobTitle?.trim()),
      ),
      weight: 20,
    },
    {
      label: 'Education',
      done: sections.some(
        (s) => s.type === 'education' && s.entries.some((e) => !!e.fields.school?.trim()),
      ),
      weight: 15,
    },
    {
      label: 'Skills',
      done: sections.some(
        (s) => s.type === 'skills' && s.entries.some((e) => !!e.fields.skills?.trim()),
      ),
      weight: 10,
    },
    {
      label: 'Additional section',
      done: sections.some(
        (s) =>
          !['experience', 'education', 'skills'].includes(s.type) && s.entries.length > 0,
      ),
      weight: 10,
    },
    {
      label: 'Achievement bullet points',
      done: sections.some(
        (s) =>
          s.type === 'experience' &&
          s.visible &&
          s.entries.some((e) => e.bulletPoints.filter((b) => b.trim()).length >= 2),
      ),
      weight: 5,
    },
  ]

  const earned = items.filter((i) => i.done).reduce((sum, i) => sum + i.weight, 0)
  const total = items.reduce((sum, i) => sum + i.weight, 0)
  const percentage = Math.round((earned / total) * 100)

  return { items, percentage }
}

export function CompletenessIndicator() {
  const [expanded, setExpanded] = useState(false)
  const { items, percentage } = useCompletenessScore()

  const completedCount = items.filter((i) => i.done).length

  return (
    <div className="rounded-xl border bg-card">
      {/* Header bar */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-3 px-4 py-3"
      >
        {/* Circular progress */}
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
          <svg className="h-10 w-10 -rotate-90" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              r="15"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-muted/50"
            />
            <circle
              cx="18"
              cy="18"
              r="15"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray={`${percentage * 0.94} 100`}
              strokeLinecap="round"
              className={cn(
                percentage < 40 && 'text-red-500',
                percentage >= 40 && percentage < 70 && 'text-amber-500',
                percentage >= 70 && 'text-green-500',
              )}
            />
          </svg>
          <span className="absolute text-[10px] font-bold">{percentage}%</span>
        </div>

        <div className="flex-1 text-left">
          <p className="text-sm font-medium">
            {percentage < 40
              ? 'Getting started'
              : percentage < 70
                ? 'Making progress'
                : percentage < 100
                  ? 'Almost there'
                  : 'Complete'}
          </p>
          <p className="text-xs text-muted-foreground">
            {completedCount} of {items.length} items completed
          </p>
        </div>

        {expanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {/* Expanded checklist */}
      {expanded && (
        <div className="border-t px-4 py-3">
          <div className="grid gap-1.5 sm:grid-cols-2">
            {items.map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-sm">
                {item.done ? (
                  <Check className="h-3.5 w-3.5 shrink-0 text-green-500" />
                ) : (
                  <Circle className="h-3.5 w-3.5 shrink-0 text-muted-foreground/30" />
                )}
                <span
                  className={cn(
                    'text-xs',
                    item.done ? 'text-muted-foreground line-through' : 'text-foreground',
                  )}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
