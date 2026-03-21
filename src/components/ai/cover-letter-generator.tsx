'use client'

import { useState } from 'react'
import { FileText, Loader2, Copy, RotateCcw, Download } from 'lucide-react'
import { toast } from 'sonner'
import { trackEvent } from '@/components/posthog-provider'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useResumeStore } from '@/stores/resume-store'

type Tone = 'professional' | 'enthusiastic' | 'conversational'
type Length = 'short' | 'standard' | 'detailed'

interface CoverLetterResult {
  coverLetter: string
  subject: string
}

const TONE_OPTIONS: { value: Tone; label: string; description: string }[] = [
  { value: 'professional', label: 'Professional', description: 'Formal and polished' },
  { value: 'enthusiastic', label: 'Enthusiastic', description: 'Energetic and passionate' },
  { value: 'conversational', label: 'Conversational', description: 'Friendly and approachable' },
]

const LENGTH_OPTIONS: { value: Length; label: string; words: string }[] = [
  { value: 'short', label: 'Short', words: '150-200 words' },
  { value: 'standard', label: 'Standard', words: '250-350 words' },
  { value: 'detailed', label: 'Detailed', words: '400-500 words' },
]

export function CoverLetterGenerator() {
  const [open, setOpen] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState<CoverLetterResult | null>(null)
  const [companyName, setCompanyName] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [tone, setTone] = useState<Tone>('professional')
  const [length, setLength] = useState<Length>('standard')

  const [editedContent, setEditedContent] = useState('')

  const content = useResumeStore((s) => s.content)

  function resetForm() {
    setCompanyName('')
    setJobTitle('')
    setJobDescription('')
    setTone('professional')
    setLength('standard')
    setResult(null)
    setEditedContent('')
  }

  async function handleGenerate() {
    if (!companyName.trim() || !jobTitle.trim() || jobDescription.length < 50) {
      toast.error('Please fill in all required fields')
      return
    }

    setGenerating(true)
    setResult(null)

    try {
      const res = await fetch('/api/ai/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeContent: content,
          companyName,
          jobTitle,
          jobDescription,
          tone,
          length,
        }),
      })

      if (res.status === 402) { toast.error('Not enough credits (20 required)'); return }
      if (res.status === 429) { toast.error('Rate limit exceeded. Please try again later.'); return }
      if (!res.ok) {
        const errData = await res.json().catch(() => null)
        const errMsg = errData?.error || 'Generation failed. Please try again.'
        toast.error(errMsg)
        return
      }

      const data = await res.json()
      if (data.result?.coverLetter) {
        trackEvent('ai_cover_letter')
        setResult(data.result)
        setEditedContent(data.result.coverLetter)
      } else {
        toast.error('Invalid response from AI')
      }
    } catch {
      toast.error('Something went wrong')
    } finally {
      setGenerating(false)
    }
  }

  async function handleCopy() {
    if (!editedContent) return
    try {
      await navigator.clipboard.writeText(editedContent)
      toast.success('Copied to clipboard!')
    } catch {
      toast.error('Failed to copy')
    }
  }

  function handleDownload() {
    if (!editedContent) return
    const subject = result?.subject || 'Cover Letter'
    const fullText = `Subject: ${subject}\n\n${editedContent}`
    const blob = new Blob([fullText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Cover Letter - ${companyName || 'Company'} - ${jobTitle || 'Position'}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Downloaded!')
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="h-8 gap-1.5 text-xs"
        onClick={() => { resetForm(); setOpen(true) }}
      >
        <FileText className="h-3.5 w-3.5" />
        Cover Letter
      </Button>

      <Dialog open={open} onOpenChange={(val) => { if (!generating) setOpen(val) }}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Generate Cover Letter</DialogTitle>
            <DialogDescription>
              AI will write a personalized cover letter based on your resume (20 credits)
            </DialogDescription>
          </DialogHeader>

          {!result ? (
            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label className="mb-1.5 text-xs">Company Name *</Label>
                  <Input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Google"
                  />
                </div>
                <div>
                  <Label className="mb-1.5 text-xs">Job Title *</Label>
                  <Input
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="Senior Engineer"
                  />
                </div>
              </div>

              <div>
                <Label className="mb-1.5 text-xs">Job Description *</Label>
                <Textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here (at least 50 characters)..."
                  rows={5}
                  className="resize-none text-sm"
                />
                <p className="mt-1 text-xs text-muted-foreground">{jobDescription.length} characters</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label className="mb-1.5 text-xs">Tone</Label>
                  <Select value={tone} onValueChange={(val) => { if (val) setTone(val as Tone) }}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {TONE_OPTIONS.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          <span>{t.label}</span>
                          <span className="ml-2 text-muted-foreground text-xs">— {t.description}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-1.5 text-xs">Length</Label>
                  <Select value={length} onValueChange={(val) => { if (val) setLength(val as Length) }}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {LENGTH_OPTIONS.map((l) => (
                        <SelectItem key={l.value} value={l.value}>
                          <span>{l.label}</span>
                          <span className="ml-2 text-muted-foreground text-xs">— {l.words}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={generating || !companyName.trim() || !jobTitle.trim() || jobDescription.length < 50}
                className="w-full gap-2"
              >
                {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
                {generating ? 'Generating...' : 'Generate Cover Letter'}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Subject Line */}
              <div className="rounded-lg border bg-muted/30 p-2.5">
                <p className="text-[10px] font-semibold text-muted-foreground mb-0.5">SUGGESTED SUBJECT</p>
                <p className="text-xs">{result.subject}</p>
              </div>

              {/* Editable Cover Letter Content */}
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                rows={12}
                className="text-xs leading-relaxed resize-none"
                aria-label="Cover letter content"
              />

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <Button onClick={handleCopy} variant="outline" size="sm" className="flex-1 gap-1.5">
                  <Copy className="h-4 w-4" /> Copy
                </Button>
                <Button onClick={handleDownload} variant="outline" size="sm" className="flex-1 gap-1.5">
                  <Download className="h-4 w-4" /> Download
                </Button>
                <Button onClick={() => { setResult(null); setEditedContent('') }} variant="outline" size="sm" className="w-full gap-1.5">
                  <RotateCcw className="h-4 w-4" /> Regenerate (20 credits)
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
