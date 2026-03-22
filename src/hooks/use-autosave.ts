'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useResumeStore } from '@/stores/resume-store'

const DEBOUNCE_MS = 2000
const MAX_RETRIES = 3

export function useAutosave() {
  const {
    resumeId,
    content,
    title,
    templateId,
    targetJobDescription,
    isDirty,
  } = useResumeStore()

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const retryCountRef = useRef(0)
  const abortRef = useRef<AbortController | null>(null)

  const save = useCallback(async () => {
    // Read fresh state from the store to avoid stale closures on retries
    const state = useResumeStore.getState()
    if (!state.resumeId || !state.isDirty || state.isSaving) return

    abortRef.current?.abort()
    abortRef.current = new AbortController()

    state.markSaving()

    try {
      const res = await fetch(`/api/resumes/${state.resumeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: state.title,
          templateId: state.templateId,
          content: state.content,
          targetJobDescription: state.targetJobDescription,
        }),
        signal: abortRef.current.signal,
      })

      if (res.ok) {
        state.markSaved()
        retryCountRef.current = 0
      } else {
        throw new Error(`Save failed: ${res.status}`)
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return

      retryCountRef.current++
      if (retryCountRef.current < MAX_RETRIES) {
        const delay = Math.min(1000 * 2 ** retryCountRef.current, 10000)
        retryTimerRef.current = setTimeout(save, delay)
        useResumeStore.getState().markSaveError(`Retrying... (${retryCountRef.current}/${MAX_RETRIES})`)
      } else {
        useResumeStore.getState().markSaveError('Failed to save. Check your connection.')
        retryCountRef.current = 0
      }
    }
  }, [])

  // Debounced auto-save on changes
  useEffect(() => {
    if (!isDirty || !resumeId) return

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
    debounceTimerRef.current = setTimeout(save, DEBOUNCE_MS)

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps — save reads fresh state via getState()
  }, [isDirty, resumeId, content, title, templateId, targetJobDescription])

  // Save on page unload
  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      const state = useResumeStore.getState()
      if (state.isDirty && state.resumeId) {
        e.preventDefault()
        const data = JSON.stringify({
          title: state.title,
          templateId: state.templateId,
          content: state.content,
          targetJobDescription: state.targetJobDescription,
        })
        navigator.sendBeacon(
          `/api/resumes/${state.resumeId}/save`,
          new Blob([data], { type: 'application/json' }),
        )
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

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
