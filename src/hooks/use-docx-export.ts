'use client'

import { useState, useRef, useEffect } from 'react'
import { toast } from 'sonner'
import { useResumeStore } from '@/stores/resume-store'
import { trackEvent } from '@/components/posthog-provider'

const DOCX_TIMEOUT_MS = 30_000

export function useDocxExport() {
  const [exporting, setExporting] = useState(false)
  const abortRef = useRef<AbortController | null>(null)
  const resumeId = useResumeStore((s) => s.resumeId)
  const isDirty = useResumeStore((s) => s.isDirty)
  const title = useResumeStore((s) => s.title)
  const templateId = useResumeStore((s) => s.templateId)
  const content = useResumeStore((s) => s.content)
  const markSaved = useResumeStore((s) => s.markSaved)

  useEffect(() => {
    return () => { abortRef.current?.abort() }
  }, [])

  async function exportDocx() {
    if (!resumeId || exporting) return
    setExporting(true)
    abortRef.current = new AbortController()
    const signal = abortRef.current.signal

    try {
      // Auto-save if dirty
      if (isDirty) {
        const saveRes = await fetch(`/api/resumes/${resumeId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, templateId, content }),
          signal,
        })
        if (!saveRes.ok) {
          toast.error('Failed to save resume before export. Please try again.')
          return
        }
        markSaved()
      }

      const timeoutId = setTimeout(() => abortRef.current?.abort(), DOCX_TIMEOUT_MS)

      let res: Response
      try {
        res = await fetch('/api/export/docx', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resumeId }),
          signal,
        })
      } catch (fetchErr) {
        clearTimeout(timeoutId)
        throw fetchErr
      }
      clearTimeout(timeoutId)

      if (res.status === 402) {
        toast.error('Not enough credits to export DOCX')
        return
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        toast.error((data as { error?: string }).error ?? 'Failed to export DOCX')
        return
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const safeName = (content.personalInfo.fullName || title || 'resume')
        .replace(/[^a-zA-Z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
      a.download = `${safeName || 'resume'}.docx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      trackEvent('docx_exported', { resumeId, templateId })
      toast.success('DOCX downloaded!')
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        toast.error('DOCX export timed out. Please try again.')
      } else {
        toast.error('Something went wrong')
      }
    } finally {
      setExporting(false)
      abortRef.current = null
    }
  }

  return { exportDocx, exporting }
}
