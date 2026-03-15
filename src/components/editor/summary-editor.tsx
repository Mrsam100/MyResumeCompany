'use client'

import { AlignLeft } from 'lucide-react'

import { Textarea } from '@/components/ui/textarea'
import { SummaryGenerator } from '@/components/ai/summary-generator'
import { useResumeStore } from '@/stores/resume-store'
import { cn } from '@/lib/utils'

const RECOMMENDED_MIN = 200
const RECOMMENDED_MAX = 400

export function SummaryEditor() {
  const summary = useResumeStore((s) => s.content.personalInfo.summary ?? '')
  const setPersonalInfo = useResumeStore((s) => s.setPersonalInfo)

  const charCount = summary.length
  const progress = Math.min(100, (charCount / RECOMMENDED_MAX) * 100)
  const isShort = charCount > 0 && charCount < RECOMMENDED_MIN
  const isGood = charCount >= RECOMMENDED_MIN && charCount <= RECOMMENDED_MAX
  const isLong = charCount > RECOMMENDED_MAX

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10">
            <AlignLeft className="h-4 w-4 text-violet-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Professional Summary</h3>
            <p className="text-xs text-muted-foreground">A brief overview of your career</p>
          </div>
        </div>
        <SummaryGenerator />
      </div>

      <Textarea
        placeholder="Experienced software engineer with 5+ years of expertise in full-stack development. Passionate about building scalable applications and mentoring junior developers..."
        value={summary}
        onChange={(e) => setPersonalInfo('summary', e.target.value)}
        rows={5}
        className="resize-none text-sm leading-relaxed"
      />

      {/* Progress bar + counter */}
      <div className="space-y-1.5">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-300',
              charCount === 0 && 'w-0',
              isShort && 'bg-amber-400',
              isGood && 'bg-green-500',
              isLong && 'bg-destructive',
            )}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            {charCount === 0
              ? 'Aim for 200-400 characters'
              : isShort
                ? 'A bit short — add more detail'
                : isGood
                  ? 'Great length'
                  : 'Consider shortening'}
          </span>
          <span
            className={cn(
              'tabular-nums',
              isShort && 'text-amber-500',
              isGood && 'text-green-600',
              isLong && 'text-destructive',
              charCount === 0 && 'text-muted-foreground',
            )}
          >
            {charCount} / {RECOMMENDED_MAX}
          </span>
        </div>
      </div>
    </div>
  )
}
