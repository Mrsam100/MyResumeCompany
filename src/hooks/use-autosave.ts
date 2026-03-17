'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useResumeStore } from '@/stores/resume-store'

const DEBOUNCE_MS = 2000
const MAX_RETRIES = 3

export function useAutosave() {
  const {
    resumeId,
    title,
    templateId,
    content,
    targetJobDescription,
    isDirty,
    isSaving,
    markSaving,
    markSaved,
    markSaveError,
  } = useResumeStore()

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const retryCountRef = useRef(0)
  const abortRef = useRef<AbortController | null>(null)

  const save = useCallback(async () => {
    if (!resumeId || !isDirty || isSaving) return

    abortRef.current?.abort()
    abortRef.current = new AbortController()

    markSaving()

    try {
      const res = await fetch(`/api/resumes/${resumeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, templateId, content, targetJobDescription }),
        signal: abortRef.current.signal,
      })

      if (res.ok) {
        markSaved()
        retryCountRef.current = 0
      } else {
        throw new Error(`Save failed: ${res.status}`)
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return

      retryCountRef.current++
      if (retryCountRef.current < MAX_RETRIES) {
        const delay = Math.min(1000 * 2 ** retryCountRef.current, 10000)
        // Use separate retry timer so debounce doesn't clear it
        retryTimerRef.current = setTimeout(save, delay)
        markSaveError(`Retrying... (${retryCountRef.current}/${MAX_RETRIES})`)
      } else {
        markSaveError('Failed to save. Check your connection.')
        retryCountRef.current = 0
      }
    }
  }, [resumeId, isDirty, isSaving, title, templateId, content, targetJobDescription, markSaving, markSaved, markSaveError])

  // Debounced auto-save on changes
  useEffect(() => {
    if (!isDirty || !resumeId) return

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
    debounceTimerRef.current = setTimeout(save, DEBOUNCE_MS)

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
    }
  }, [isDirty, resumeId, content, title, templateId, targetJobDescription, save])

  // Save on page unload
  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (isDirty && resumeId) {
        e.preventDefault()
        const data = JSON.stringify({ title, templateId, content, targetJobDescription })
        navigator.sendBeacon(
          `/api/resumes/${resumeId}/save`,
          new Blob([data], { type: 'application/json' }),
        )
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty, resumeId, title, templateId, content, targetJobDescription])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current)
      abortRef.current?.abort()
    }
  }, [])

  return { save }
}
