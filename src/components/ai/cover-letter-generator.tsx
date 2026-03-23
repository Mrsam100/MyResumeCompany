'use client'

import { useState } from 'react'
import { FileText, Loader2, Copy, RotateCcw, Download, Save, BookOpen } from 'lucide-react'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useResumeStore } from '@/stores/resume-store'
import { COVER_LETTER_TEMPLATES, COVER_LETTER_CATEGORIES } from '@/constants/cover-letter-templates'
import type { CoverLetterTemplate } from '@/constants/cover-letter-templates'

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
  const [saving, setSaving] = useState(false)
  const [result, setResult] = useState<CoverLetterResult | null>(null)
  const [companyName, setCompanyName] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [tone, setTone] = useState<Tone>('professional')
  const [length, setLength] = useState<Length>('standard')
  const [editedContent, setEditedContent] = useState('')
  const [activeTab, setActiveTab] = useState<string>('generate')
  const [selectedCategory, setSelectedCategory] = useState<string>('general')

  const content = useResumeStore((s) => s.content)
  const resumeId = useResumeStore((s) => s.resumeId)

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

  async function handleSave() {
    if (!editedContent.trim()) return
    setSaving(true)

    try {
      const res = await fetch('/api/cover-letters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeId: resumeId || undefined,
          companyName: companyName || 'Unknown Company',
          jobTitle: jobTitle || 'Unknown Position',
          tone,
          subject: result?.subject || '',
          content: editedContent,
        }),
      })

      if (!res.ok) {
        toast.error('Failed to save cover letter')
        return
      }

      toast.success('Cover letter saved!')
    } catch {
      toast.error('Failed to save cover letter')
    } finally {
      setSaving(false)
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

  function handleTemplateSelect(template: CoverLetterTemplate) {
    setEditedContent(template.content)
    setResult({ coverLetter: template.content, subject: `Application for [Job Title] at [Company Name]` })
    setActiveTab('generate')
    toast.success(`Loaded "${template.name}" template`)
  }

  const filteredTemplates = COVER_LETTER_TEMPLATES.filter(
    (t) => selectedCategory === 'all' || t.category === selectedCategory,
  )

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="h-8 gap-1.5 text-xs"
        onClick={() => { resetForm(); setOpen(true) }}
      >
        <FileText className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Cover Letter</span>
      </Button>

      <Dialog open={open} onOpenChange={(val) => { if (!generating && !saving) setOpen(val) }}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Cover Letter</DialogTitle>
            <DialogDescription>
              Generate with AI or start from a template
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="generate" className="flex-1 gap-1.5">
                <FileText className="h-3.5 w-3.5" />
                Generate
              </TabsTrigger>
              <TabsTrigger value="templates" className="flex-1 gap-1.5">
                <BookOpen className="h-3.5 w-3.5" />
                Templates
              </TabsTrigger>
            </TabsList>

            <TabsContent value="generate" className="mt-3">
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
                    {generating ? 'Generating...' : 'Generate Cover Letter (20 credits)'}
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {result.subject && (
                    <div className="rounded-lg border bg-muted/30 p-2.5">
                      <p className="text-[10px] font-semibold text-muted-foreground mb-0.5">SUGGESTED SUBJECT</p>
                      <p className="text-xs">{result.subject}</p>
                    </div>
                  )}

                  <Textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    rows={14}
                    className="text-xs leading-relaxed resize-none"
                    aria-label="Cover letter content"
                  />

                  <div className="flex flex-wrap gap-2">
                    <Button onClick={handleSave} variant="default" size="sm" className="flex-1 gap-1.5" disabled={saving}>
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      {saving ? 'Saving...' : 'Save'}
                    </Button>
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
            </TabsContent>

            <TabsContent value="templates" className="mt-3">
              <div className="space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                      selectedCategory === 'all'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    All
                  </button>
                  {COVER_LETTER_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                        selectedCategory === cat.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <div className="grid gap-2 max-h-[50vh] overflow-y-auto pr-1">
                  {filteredTemplates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleTemplateSelect(template)}
                      className="rounded-lg border bg-card p-3 text-left transition-colors hover:bg-muted/50"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium">{template.name}</p>
                          <p className="text-xs text-muted-foreground">{template.description}</p>
                        </div>
                        <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                          {COVER_LETTER_CATEGORIES.find((c) => c.id === template.category)?.label}
                        </span>
                      </div>
                      <p className="mt-2 line-clamp-2 text-[11px] text-muted-foreground/70">
                        {template.content.slice(0, 150)}...
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  )
}
