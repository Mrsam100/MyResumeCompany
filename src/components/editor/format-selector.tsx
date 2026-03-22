'use client'

import { ListOrdered, Layers, LayoutList } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useResumeStore } from '@/stores/resume-store'
import type { ResumeFormat } from '@/types/resume'

const FORMAT_OPTIONS: { value: ResumeFormat; label: string; description: string; icon: typeof ListOrdered }[] = [
  {
    value: 'chronological',
    label: 'Chronological',
    description: 'Work history first, most recent on top',
    icon: ListOrdered,
  },
  {
    value: 'functional',
    label: 'Functional',
    description: 'Skills-first, ideal for career changers',
    icon: Layers,
  },
  {
    value: 'hybrid',
    label: 'Hybrid',
    description: 'Skills summary + work history combined',
    icon: LayoutList,
  },
]

export function FormatSelector() {
  const format = useResumeStore((s) => s.content.format) || 'chronological'
  const setFormat = useResumeStore((s) => s.setFormat)

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground">Resume Format</p>
      <div className="grid grid-cols-3 gap-1.5">
        {FORMAT_OPTIONS.map((opt) => {
          const Icon = opt.icon
          const isSelected = format === opt.value
          return (
            <button
              key={opt.value}
              onClick={() => setFormat(opt.value)}
              className={cn(
                'flex flex-col items-center gap-1 rounded-lg border-2 px-2 py-2 text-center transition-all',
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-transparent hover:border-muted-foreground/20 hover:bg-muted/30',
              )}
            >
              <Icon className={cn('h-4 w-4', isSelected ? 'text-primary' : 'text-muted-foreground')} />
              <span className={cn('text-[10px] font-medium', isSelected ? 'text-primary' : 'text-muted-foreground')}>
                {opt.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
