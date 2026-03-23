'use client'

import { useState } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { trackEvent } from '@/components/posthog-provider'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useResumeStore } from '@/stores/resume-store'
import { cn } from '@/lib/utils'

interface Summaries {
  confident: string
  balanced: string
  technical: string
}

const variantLabels: Record<keyof Summaries, { label: string; description: string }> = {
  confident: { label: 'Confident', description: 'Bold, leadership-focused' },
  balanced: { label: 'Balanced', description: 'Professional, well-rounded' },
  technical: { label: 'Technical', description: 'Skills and expertise-focused' },
}

export function SummaryGenerator() {
  const [open, setOpen] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [results, setResults] = useState<Summaries | null>(null)
  const [targetRole, setTargetRole] = useState('')
  const [yearsExp, setYearsExp] = useState('')

  const setPersonalInfo = useResumeStore((s) => s.setPersonalInfoBulk)
  const currentTitle = useResumeStore((s) => s.content.personalInfo.title)

  async function handleGenerate() {
    if (!targetRole.trim()) return
    setGenerating(true)
    setResults(null)

    try {
      const res = await fetch('/api/ai/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetRole, yearsExperience: yearsExp }),
      })

      if (res.status === 402) {
        toast.error('Not enough credits — buy more at Credits page')
        return
      }

      if (res.status === 429) {
        toast.error('Rate limit exceeded. Please try again later.')
        return
      }

      if (!res.ok) {
        toast.error('Generation failed')
        return
      }

      const data = await res.json()
      if (!data.summaries?.confident || !data.summaries?.balanced || !data.summaries?.technical) {
        toast.error('Invalid response from AI. Please try again.')
        return
      }
      setResults(data.summaries)
    } catch {
      toast.error('Something went wrong')
    } finally {
      setGenerating(false)
    }
  }

  function handleSelect(variant: keyof Summaries) {
    if (!results) return
    setPersonalInfo({ summary: results[variant] })
    setOpen(false)
    setResults(null)
    trackEvent('ai_summary_applied')
    toast.success('Summary applied')
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="h-8 gap-1.5 text-xs"
        onClick={() => {
          setTargetRole(currentTitle ?? '')
          setYearsExp('')
          setResults(null)
          setOpen(true)
        }}
      >
        <Sparkles className="h-3.5 w-3.5" />
        AI Generate
      </Button>

      <Dialog open={open} onOpenChange={(val) => { if (!generating) setOpen(val) }}>
        <DialogContent className="max-w-lg max-h-[85dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Generate Professional Summary</DialogTitle>
            <DialogDescription>
              AI will write 3 summary variants for your resume (10 credits)
            </DialogDescription>
          </DialogHeader>

          {!results ? (
            <div className="space-y-3">
              <div>
                <Label className="mb-1.5 text-xs">Target Role</Label>
                <Input
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="Senior Software Engineer"
                />
              </div>
              <div>
                <Label className="mb-1.5 text-xs">Years of Experience (optional)</Label>
                <Input
                  value={yearsExp}
                  onChange={(e) => setYearsExp(e.target.value)}
                  placeholder="5"
                />
              </div>
              <Button onClick={handleGenerate} disabled={generating || !targetRole.trim()} className="w-full gap-2">
                {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {generating ? 'Generating...' : 'Generate Summaries'}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {(Object.keys(variantLabels) as (keyof Summaries)[]).map((key) => (
                <button
                  key={key}
                  onClick={() => handleSelect(key)}
                  className={cn(
                    'w-full rounded-lg border p-3 text-left transition-all hover:border-primary/30 hover:bg-primary/5',
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">{variantLabels[key].label}</span>
                    <span className="text-[10px] text-muted-foreground">{variantLabels[key].description}</span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {results[key]}
                  </p>
                </button>
              ))}
              <Button variant="outline" size="sm" className="w-full" onClick={() => setResults(null)}>
                Regenerate (10 credits)
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
