'use client'

import { useEffect, useRef, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Check, Loader2, AlertCircle, Cloud } from 'lucide-react'
import { useResumeStore } from '@/stores/resume-store'
import { cn } from '@/lib/utils'

export function SaveStatus() {
  const { isDirty, isSaving, lastSavedAt, saveError } = useResumeStore()
  const [showPulse, setShowPulse] = useState(false)
  const prevSavingRef = useRef(false)

  // Trigger pulse when transitioning from saving → saved
  useEffect(() => {
    if (prevSavingRef.current && !isSaving && lastSavedAt && !saveError) {
      setShowPulse(true)
      const timer = setTimeout(() => setShowPulse(false), 1500)
      return () => clearTimeout(timer)
    }
    prevSavingRef.current = isSaving
  }, [isSaving, lastSavedAt, saveError])

  if (saveError) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-destructive">
        <AlertCircle className="h-3.5 w-3.5" />
        <span>{saveError}</span>
      </div>
    )
  }

  if (isSaving) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        <span>Saving...</span>
      </div>
    )
  }

  if (isDirty) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Cloud className="h-3.5 w-3.5" />
        <span>Unsaved changes</span>
      </div>
    )
  }

  if (lastSavedAt) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Check className={cn('h-3.5 w-3.5 text-green-500 transition-all', showPulse && 'scale-125')} />
        <span className={cn('transition-colors', showPulse && 'text-green-600 font-medium')}>
          {showPulse ? 'Saved' : `Saved ${formatDistanceToNow(lastSavedAt, { addSuffix: true })}`}
        </span>
      </div>
    )
  }

  return null
}
