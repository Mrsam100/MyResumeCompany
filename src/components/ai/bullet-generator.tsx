'use client'

import { useState } from 'react'
import { Sparkles, Loader2, Check } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useResumeStore } from '@/stores/resume-store'

interface BulletGeneratorProps {
  sectionId: string
  entryId: string
  jobTitle?: string
  company?: string
}

export function BulletGenerator({ sectionId, entryId, jobTitle, company }: BulletGeneratorProps) {
  const [open, setOpen] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [results, setResults] = useState<string[]>([])
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [inputTitle, setInputTitle] = useState(jobTitle ?? '')
  const [inputCompany, setInputCompany] = useState(company ?? '')

  const setBulletPoints = useResumeStore((s) => s.setBulletPoints)
  const entry = useResumeStore((s) => {
    const section = s.content.sections.find((sec) => sec.id === sectionId)
    return section?.entries.find((e) => e.id === entryId)
  })

  async function handleGenerate() {
    if (!inputTitle.trim()) return
    setGenerating(true)
    setResults([])

    try {
      const res = await fetch('/api/ai/bullet-points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobTitle: inputTitle, company: inputCompany }),
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
      const bullets = Array.isArray(data.bullets) ? data.bullets.filter((b: unknown) => typeof b === 'string') : []
      if (bullets.length === 0) {
        toast.error('No bullet points generated. Please try again.')
        return
      }
      setResults(bullets)
      setSelected(new Set())
    } catch {
      toast.error('Something went wrong')
    } finally {
      setGenerating(false)
    }
  }

  function toggleBullet(index: number) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  function handleInsert() {
    const existing = entry?.bulletPoints.filter((b) => b.trim()) ?? []
    const newBullets = results.filter((_, i) => selected.has(i))
    setBulletPoints(sectionId, entryId, [...existing, ...newBullets])
    setOpen(false)
    setResults([])
    toast.success(`${newBullets.length} bullet points added`)
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="h-7 gap-1.5 text-xs"
        onClick={() => {
          setInputTitle(jobTitle ?? '')
          setInputCompany(company ?? '')
          setResults([])
          setOpen(true)
        }}
      >
        <Sparkles className="h-3 w-3" />
        AI Generate
      </Button>

      <Dialog open={open} onOpenChange={(val) => { if (!generating) setOpen(val) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Bullet Points</DialogTitle>
            <DialogDescription>
              AI will write achievement-based bullet points for this position (10 credits)
            </DialogDescription>
          </DialogHeader>

          {results.length === 0 ? (
            <div className="space-y-3">
              <div>
                <Label className="mb-1.5 text-xs">Job Title</Label>
                <Input
                  value={inputTitle}
                  onChange={(e) => setInputTitle(e.target.value)}
                  placeholder="Software Engineer"
                />
              </div>
              <div>
                <Label className="mb-1.5 text-xs">Company (optional)</Label>
                <Input
                  value={inputCompany}
                  onChange={(e) => setInputCompany(e.target.value)}
                  placeholder="Acme Corp"
                />
              </div>
              <Button onClick={handleGenerate} disabled={generating || !inputTitle.trim()} className="w-full gap-2">
                {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {generating ? 'Generating...' : 'Generate Bullets'}
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {results.map((bullet, i) => (
                <label key={i} className="flex items-start gap-2 rounded-md border p-2.5 text-sm hover:bg-muted/50">
                  <Checkbox
                    checked={selected.has(i)}
                    onCheckedChange={() => toggleBullet(i)}
                    className="mt-0.5"
                  />
                  <span className="flex-1 text-xs leading-relaxed">{bullet}</span>
                </label>
              ))}
            </div>
          )}

          {results.length > 0 && (
            <DialogFooter>
              <Button variant="outline" onClick={() => setResults([])}>
                Regenerate (10 credits)
              </Button>
              <Button onClick={handleInsert} disabled={selected.size === 0} className="gap-1.5">
                <Check className="h-4 w-4" />
                Insert {selected.size} selected
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
