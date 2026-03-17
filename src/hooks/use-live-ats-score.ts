'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { useResumeStore } from '@/stores/resume-store'
import { extractKeywords, matchKeywords, resumeContentToText } from '@/lib/ats/keyword-matcher'
import type { KeywordMatchResult } from '@/lib/ats/keyword-matcher'

const DEBOUNCE_MS = 3000

export function useLiveATSScore(): KeywordMatchResult & { hasJobDescription: boolean } {
  const content = useResumeStore((s) => s.content)
  const targetJobDescription = useResumeStore((s) => s.targetJobDescription)

  const [result, setResult] = useState<KeywordMatchResult>({
    score: 0,
    matched: [],
    missing: [],
    total: 0,
  })

  const hasJobDescription = !!targetJobDescription?.trim()

  // Memoize keyword extraction (only recomputes when JD changes)
  const keywords = useMemo(() => {
    if (!targetJobDescription?.trim()) return []
    return extractKeywords(targetJobDescription)
  }, [targetJobDescription])

  // Debounce the matching computation
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (keywords.length === 0) {
      setResult({ score: 0, matched: [], missing: [], total: 0 })
      return
    }

    if (timerRef.current) clearTimeout(timerRef.current)

    timerRef.current = setTimeout(() => {
      const resumeText = resumeContentToText(content)
      const matchResult = matchKeywords(resumeText, keywords)
      setResult(matchResult)
    }, DEBOUNCE_MS)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [content, keywords])

  return { ...result, hasJobDescription }
}
