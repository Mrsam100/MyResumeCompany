'use client'

import { formatDistanceToNow } from 'date-fns'
import { Check, Loader2, AlertCircle, Cloud } from 'lucide-react'
import { useResumeStore } from '@/stores/resume-store'

export function SaveStatus() {
  const { isDirty, isSaving, lastSavedAt, saveError } = useResumeStore()

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
        <Check className="h-3.5 w-3.5 text-green-500" />
        <span>Saved {formatDistanceToNow(lastSavedAt, { addSuffix: true })}</span>
      </div>
    )
  }

  return null
}
