'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, Loader2, Sparkles, ChevronDown, ChevronUp } from 'lucide-react'
import { toast } from 'sonner'
import { trackEvent } from '@/components/posthog-provider'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useResumeStore } from '@/stores/resume-store'
import { cn } from '@/lib/utils'

interface ATSResult {
  overallScore: number
  keywordMatch: { score: number; matched: string[]; missing: string[] }
  skillsAlignment: { score: number; matched: string[]; missing: string[]; suggested: string[] }
  experienceRelevance: { score: number; feedback: string }
  formatScore: { score: number; issues: string[] }
  suggestions: string[]
}

interface OptimizeResult {
  optimizedSections: Array<{
    sectionIndex: number
    entryIndex: number
    originalBullets: string[]
    optimizedBullets: string[]
  }>
  summary: string
}

function ScoreCircle({ score, size = 80 }: { score: number; size?: number }) {
  const strokeWidth = 6
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = (score / 100) * circumference
  const color = score >= 75 ? 'text-green-500' : score >= 50 ? 'text-amber-500' : 'text-red-500'
  const label = score >= 75 ? 'Great match' : score >= 50 ? 'Needs improvement' : 'Low match'

  return (
    <div
      className="relative inline-flex items-center justify-center"
      role="img"
      aria-label={`ATS compatibility score: ${score} out of 100. ${label}`}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" className="stroke-muted" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className={cn('transition-all duration-700', color.replace('text-', 'stroke-'))}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
        />
      </svg>
      <span className={cn('absolute text-lg font-bold', color)}>{score}</span>
    </div>
  )
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  const color = score >= 75 ? 'bg-green-500' : score >= 50 ? 'bg-amber-500' : 'bg-red-500'
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold">{score}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className={cn('h-full rounded-full transition-all duration-500', color)} style={{ width: `${score}%` }} />
      </div>
    </div>
  )
}

/** Get a human-readable label for a section/entry by index */
function getEntryLabel(sectionIndex: number, entryIndex: number): string {
  const sections = useResumeStore.getState().content.sections
  const section = sections[sectionIndex]
  if (!section) return `Section ${sectionIndex + 1}, Entry ${entryIndex + 1}`

  const entry = section.entries[entryIndex]
  if (!entry) return `${section.title}, Entry ${entryIndex + 1}`

  const title = entry.fields.jobTitle || entry.fields.name || entry.fields.title || ''
  const subtitle = entry.fields.company || entry.fields.school || ''

  if (title && subtitle) return `${title} at ${subtitle}`
  if (title) return title
  return `${section.title} — Entry ${entryIndex + 1}`
}

interface ATSScannerProps {
  externalOpen?: boolean
  onExternalOpenChange?: (open: boolean) => void
  prefillJobDescription?: string
}

export function ATSScanner({ externalOpen, onExternalOpenChange, prefillJobDescription }: ATSScannerProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = externalOpen ?? internalOpen
  const setOpen = onExternalOpenChange ?? setInternalOpen
  const [scanning, setScanning] = useState(false)
  const [optimizing, setOptimizing] = useState(false)
  const [jobDescription, setJobDescription] = useState('')
  const [result, setResult] = useState<ATSResult | null>(null)
  const [optimizeResult, setOptimizeResult] = useState<OptimizeResult | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [appliedEntries, setAppliedEntries] = useState<Set<string>>(new Set())

  // Pre-fill JD once when dialog opens externally (not on every render)
  const prefillAppliedRef = useRef(false)
  useEffect(() => {
    if (open && prefillJobDescription && !prefillAppliedRef.current) {
      setJobDescription(prefillJobDescription)
      prefillAppliedRef.current = true
    }
    if (!open) {
      prefillAppliedRef.current = false
    }
  }, [open, prefillJobDescription])

  const content = useResumeStore((s) => s.content)
  const setBulletPoints = useResumeStore((s) => s.setBulletPoints)

  async function handleScan() {
    if (!jobDescription.trim() || jobDescription.length < 50) {
      toast.error('Please paste a job description (at least 50 characters)')
      return
    }

    setScanning(true)
    setResult(null)
    setOptimizeResult(null)
    setAppliedEntries(new Set())

    try {
      const res = await fetch('/api/ai/ats-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeContent: content, jobDescription }),
      })

      if (res.status === 402) {
        toast.error('Not enough credits for ATS scan (15 required)', {
          action: { label: 'Buy credits', onClick: () => window.location.href = '/credits' },
        })
        return
      }
      if (res.status === 429) { toast.error('Rate limit exceeded. Please try again later.'); return }
      if (res.status === 504) { toast.error('AI took too long. Try again with a shorter job description.'); return }
      if (!res.ok) { toast.error('Scan failed. Please try again.'); return }

      const data = await res.json()
      if (data.result) {
        trackEvent('ai_ats_scan', { score: data.result.overallScore })
        setResult(data.result)
      } else toast.error('Invalid scan response')
    } catch {
      toast.error('Network error. Check your connection and try again.')
    } finally {
      setScanning(false)
    }
  }

  async function handleOptimize() {
    if (!result) return
    setOptimizing(true)

    // De-duplicate missing keywords before sending
    const allMissing = [
      ...result.keywordMatch.missing.slice(0, 10),
      ...result.skillsAlignment.missing.slice(0, 10),
    ]
    const uniqueKeywords = [...new Set(allMissing.map((k) => k.toLowerCase()))].slice(0, 15)

    try {
      // Use fresh store state for the optimize call
      const freshContent = useResumeStore.getState().content

      const res = await fetch('/api/ai/ats-optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeContent: freshContent,
          jobDescription,
          missingKeywords: uniqueKeywords,
        }),
      })

      if (res.status === 402) {
        toast.error('Not enough credits for optimization (15 required)', {
          action: { label: 'Buy credits', onClick: () => window.location.href = '/credits' },
        })
        return
      }
      if (res.status === 429) { toast.error('Rate limit exceeded'); return }
      if (res.status === 504) { toast.error('AI took too long. Try again.'); return }
      if (!res.ok) { toast.error('Optimization failed. Please try again.'); return }

      const data = await res.json()
      if (data.result) setOptimizeResult(data.result)
      else toast.error('Invalid optimize response')
    } catch {
      toast.error('Network error. Check your connection and try again.')
    } finally {
      setOptimizing(false)
    }
  }

  function applyOptimization(sectionIndex: number, entryIndex: number, bullets: string[]) {
    // Read fresh from store to get current section/entry IDs
    const currentSections = useResumeStore.getState().content.sections
    const section = currentSections[sectionIndex]
    if (!section) {
      toast.error('Section not found — your resume structure may have changed. Re-scan to update.')
      return
    }
    const entry = section.entries[entryIndex]
    if (!entry) {
      toast.error('Entry not found — your resume structure may have changed. Re-scan to update.')
      return
    }

    // Block apply if user edited bullets since scan (prevents silent data loss)
    if (entry.bulletPoints.length > 0 && bullets.length !== entry.bulletPoints.length) {
      toast.error(`Bullet count changed (${entry.bulletPoints.length} now, ${bullets.length} optimized). Re-scan to update.`)
      return
    }

    setBulletPoints(section.id, entry.id, bullets)
    setAppliedEntries((prev) => new Set(prev).add(`${sectionIndex}-${entryIndex}`))
    trackEvent('ai_ats_optimize_applied')
    toast.success('Optimized bullets applied! (Ctrl+Z to undo)')
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="h-8 gap-1.5 text-xs"
        onClick={() => { setResult(null); setOptimizeResult(null); setJobDescription(''); setAppliedEntries(new Set()); setOpen(true) }}
      >
        <Search className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">ATS Score</span>
      </Button>

      <Dialog open={open} onOpenChange={(val) => { if (!scanning && !optimizing) setOpen(val) }}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>ATS Resume Scanner</DialogTitle>
            <DialogDescription>
              Paste a job description to see how well your resume matches (15 credits)
            </DialogDescription>
          </DialogHeader>

          {!result ? (
            <div className="space-y-3">
              <Textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here..."
                rows={8}
                className="resize-none text-sm"
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{jobDescription.length} / 5,000 characters</p>
                {jobDescription.length > 5000 && (
                  <p className="text-xs text-destructive">Too long — max 5,000 characters</p>
                )}
              </div>
              <Button onClick={handleScan} disabled={scanning || jobDescription.length < 50 || jobDescription.length > 5000} className="w-full gap-2">
                {scanning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                {scanning ? 'Scanning...' : 'Scan Resume'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Overall Score */}
              <div className="flex flex-col items-center gap-2 py-2">
                <ScoreCircle score={result.overallScore} />
                <span className="text-sm font-semibold">
                  {result.overallScore >= 75 ? 'Great Match!' : result.overallScore >= 50 ? 'Needs Improvement' : 'Low Match'}
                </span>
              </div>

              {/* Score Breakdown */}
              <div className="space-y-3 rounded-lg border p-3">
                <ScoreBar label="Keyword Match" score={result.keywordMatch.score} />
                <ScoreBar label="Skills Alignment" score={result.skillsAlignment.score} />
                <ScoreBar label="Experience Relevance" score={result.experienceRelevance.score} />
                <ScoreBar label="Format & Structure" score={result.formatScore.score} />
              </div>

              {/* Expandable Details */}
              <button
                onClick={() => setShowDetails(!showDetails)}
                aria-expanded={showDetails}
                aria-controls="ats-details"
                className="flex w-full items-center justify-between rounded-lg border p-2.5 text-xs font-medium hover:bg-muted/50"
              >
                Detailed Analysis
                {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>

              {showDetails && (
                <div id="ats-details" className="space-y-3">
                  {/* Matched Keywords */}
                  {result.keywordMatch.matched.length > 0 && (
                    <div className="rounded-lg border p-3">
                      <p className="text-xs font-semibold mb-2">Matched Keywords ({result.keywordMatch.matched.length})</p>
                      <div className="flex flex-wrap gap-1">
                        {result.keywordMatch.matched.slice(0, 15).map((kw) => (
                          <Badge key={`m-${kw}`} variant="secondary" className="text-[10px] text-green-600 border-green-400/30">{kw}</Badge>
                        ))}
                        {result.keywordMatch.matched.length > 15 && (
                          <Badge variant="secondary" className="text-[10px]">+{result.keywordMatch.matched.length - 15} more</Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Missing Keywords */}
                  {result.keywordMatch.missing.length > 0 && (
                    <div className="rounded-lg border p-3">
                      <p className="text-xs font-semibold mb-2">Missing Keywords ({result.keywordMatch.missing.length})</p>
                      <div className="flex flex-wrap gap-1">
                        {result.keywordMatch.missing.slice(0, 15).map((kw) => (
                          <Badge key={`mk-${kw}`} variant="outline" className="text-[10px] text-destructive border-destructive/30">{kw}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Missing Skills */}
                  {result.skillsAlignment.missing.length > 0 && (
                    <div className="rounded-lg border p-3">
                      <p className="text-xs font-semibold mb-2">Missing Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {result.skillsAlignment.missing.slice(0, 10).map((s) => (
                          <Badge key={`ms-${s}`} variant="outline" className="text-[10px] text-amber-600 border-amber-400/30">{s}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Experience Feedback */}
                  <div className="rounded-lg border p-3">
                    <p className="text-xs font-semibold mb-1">Experience Relevance</p>
                    <p className="text-xs text-muted-foreground line-clamp-4">{result.experienceRelevance.feedback}</p>
                  </div>

                  {/* Format Issues */}
                  {result.formatScore.issues.length > 0 && (
                    <div className="rounded-lg border p-3">
                      <p className="text-xs font-semibold mb-1">Format Issues</p>
                      <ul className="space-y-1">
                        {result.formatScore.issues.map((issue, i) => (
                          <li key={i} className="text-xs text-muted-foreground">• {issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Suggestions */}
                  {result.suggestions.length > 0 && (
                    <div className="rounded-lg border p-3">
                      <p className="text-xs font-semibold mb-1">Suggestions</p>
                      <ol className="space-y-1">
                        {result.suggestions.map((s, i) => (
                          <li key={i} className="text-xs text-muted-foreground">{i + 1}. {s}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              )}

              {/* Optimize Button */}
              {!optimizeResult && (
                <Button onClick={handleOptimize} disabled={optimizing} variant="outline" className="w-full gap-2">
                  {optimizing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  {optimizing ? 'Optimizing...' : 'Optimize Bullets with AI (+15 credits)'}
                </Button>
              )}

              {/* Optimize Results */}
              {optimizeResult && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold">Optimized Bullets</p>
                    <p className="text-xs text-muted-foreground">{optimizeResult.summary}</p>
                  </div>
                  {optimizeResult.optimizedSections.map((opt) => {
                    const key = `${opt.sectionIndex}-${opt.entryIndex}`
                    const isApplied = appliedEntries.has(key)

                    return (
                      <div key={key} className={cn('rounded-lg border p-3 space-y-2', isApplied && 'border-green-500/30 bg-green-500/5')}>
                        <p className="text-xs font-semibold">{getEntryLabel(opt.sectionIndex, opt.entryIndex)}</p>
                        <div className="space-y-1">
                          {opt.optimizedBullets.map((b, j) => (
                            <p key={j} className="text-xs text-muted-foreground">• {b}</p>
                          ))}
                        </div>
                        <Button
                          size="sm"
                          variant={isApplied ? 'secondary' : 'outline'}
                          className="h-7 text-xs w-full"
                          disabled={isApplied}
                          onClick={() => applyOptimization(opt.sectionIndex, opt.entryIndex, opt.optimizedBullets)}
                        >
                          {isApplied ? 'Applied' : 'Apply These Bullets'}
                        </Button>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Rescan */}
              <Button variant="outline" size="sm" className="w-full" onClick={() => { setResult(null); setOptimizeResult(null); setAppliedEntries(new Set()) }}>
                Scan Again (15 credits)
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
