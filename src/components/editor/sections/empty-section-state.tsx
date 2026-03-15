'use client'

import type { LucideIcon } from 'lucide-react'

interface EmptySectionStateProps {
  icon: LucideIcon
  title: string
  description: string
}

export function EmptySectionState({ icon: Icon, title, description }: EmptySectionStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-8">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Icon className="h-6 w-6 text-muted-foreground/50" />
      </div>
      <p className="mt-3 text-sm font-medium text-muted-foreground">{title}</p>
      <p className="mt-1 text-center text-xs text-muted-foreground/70">{description}</p>
    </div>
  )
}
