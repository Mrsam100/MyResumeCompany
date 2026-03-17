'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, FileText, Loader2, X, ClipboardPaste, Wand2, Sparkles, PenLine } from 'lucide-react'
import { toast } from 'sonner'
import { nanoid } from 'nanoid'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { CREDIT_COSTS } from '@/constants/credit-costs'

interface ResumeImportProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type Tab = 'upload' | 'paste'
type EnhanceLevel = 'light' | 'full'

export function ResumeImport({ open, onOpenChange }: ResumeImportProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('upload')
  const [resumeText, setResumeText] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [enhanceLevel, setEnhanceLevel] = useState<EnhanceLevel>('full')
  const [importing, setImporting] = useState(false)
  const [dragging, setDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function reset() {
    setActiveTab('upload')
    setResumeText('')
    setSelectedFile(null)
    setEnhanceLevel('full')
    setDragging(false)
  }

  function validateFile(file: File): string | null {
    if (!file.name.toLowerCase().endsWith('.pdf')) return 'Only PDF files are accepted'
    if (file.size > 5 * 1024 * 1024) return 'File too large (max 5MB)'
    return null
  }

  function handleFileSelect(file: File) {
    const err = validateFile(file)
    if (err) {
      toast.error(err)
      return
    }
    setSelectedFile(file)
  }

  const canImport = activeTab === 'upload'
    ? !!selectedFile
    : resumeText.trim().length >= 100

  async function handleImport() {
    setImporting(true)
    try {
      let res: Response

      if (activeTab === 'upload' && selectedFile) {
        const formData = new FormData()
        formData.append('file', selectedFile)
        formData.append('enhanceLevel', enhanceLevel)
        res = await fetch('/api/ai/resume-import', {
          method: 'POST',
          body: formData,
        })
      } else {
        res = await fetch('/api/ai/resume-import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resumeText, enhanceLevel }),
        })
      }

      if (res.status === 402) {
        toast.error(`Not enough credits (${CREDIT_COSTS.AI_RESUME_IMPORT} required)`)
        return
      }

      if (res.status === 429) {
        toast.error('Rate limit exceeded. Please try again later.')
        return
      }

      if (!res.ok) {
        const errData = await res.json().catch(() => null)
        toast.error(errData?.error || 'Import failed. Please try again.')
        return
      }

      const { resume: aiResume } = await res.json()

      // Create a new resume
      const createRes = await fetch('/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${aiResume.personalInfo.title || 'Enhanced'} Resume`,
        }),
      })

      if (!createRes.ok) {
        toast.error('Failed to create resume')
        return
      }

      const { resume } = await createRes.json()

      const content = {
        personalInfo: {
          fullName: aiResume.personalInfo.fullName || 'Your Name',
          title: aiResume.personalInfo.title || '',
          email: '',
          phone: '',
          location: '',
          summary: aiResume.personalInfo.summary || '',
        },
        sections: (aiResume.sections || []).map((section: { type: string; title: string; entries: Array<{ fields: Record<string, string>; bulletPoints: string[]; startDate?: string; endDate?: string; current?: boolean }> }) => ({
          id: nanoid(10),
          type: section.type,
          title: section.title,
          visible: true,
          entries: (section.entries || []).map((entry: { fields: Record<string, string>; bulletPoints: string[]; startDate?: string; endDate?: string; current?: boolean }) => ({
            id: nanoid(10),
            fields: entry.fields || {},
            bulletPoints: entry.bulletPoints || [],
            startDate: entry.startDate,
            endDate: entry.endDate,
            current: entry.current,
          })),
        })),
      }

      const saveRes = await fetch(`/api/resumes/${resume.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })

      if (!saveRes.ok) {
        await fetch(`/api/resumes/${resume.id}`, { method: 'DELETE' }).catch(() => {})
        toast.error('Failed to save enhanced resume')
        return
      }

      toast.success(enhanceLevel === 'full'
        ? 'Resume enhanced! Review your upgraded resume.'
        : 'Resume imported! Review your cleaned-up resume.'
      )
      router.push(`/editor/${resume.id}`)
      onOpenChange(false)
    } catch {
      toast.error('Something went wrong')
    } finally {
      setImporting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!importing) {
          onOpenChange(val)
          if (!val) reset()
        }
      }}
    >
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-amber-500" />
            Import & Enhance Resume
          </DialogTitle>
          <DialogDescription>
            Upload your old resume and our AI expert will make it significantly better ({CREDIT_COSTS.AI_RESUME_IMPORT} credits).
          </DialogDescription>
        </DialogHeader>

        {/* Enhance Level Toggle */}
        <div>
          <Label className="mb-2 text-xs font-semibold">Enhancement Level</Label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setEnhanceLevel('full')}
              className={cn(
                'rounded-lg border-2 p-3 text-left transition-all',
                enhanceLevel === 'full'
                  ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                  : 'border-muted hover:border-muted-foreground/30',
              )}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-medium">Full Rewrite</span>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Transform weak bullets into powerful achievements with STAR format and metrics
              </p>
            </button>
            <button
              onClick={() => setEnhanceLevel('light')}
              className={cn(
                'rounded-lg border-2 p-3 text-left transition-all',
                enhanceLevel === 'light'
                  ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                  : 'border-muted hover:border-muted-foreground/30',
              )}
            >
              <div className="flex items-center gap-2">
                <PenLine className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Light Cleanup</span>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Fix grammar, strengthen verbs, and polish phrasing while keeping your voice
              </p>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          <button
            onClick={() => setActiveTab('upload')}
            className={cn(
              'flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              activeTab === 'upload'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Upload className="mr-1.5 inline h-3.5 w-3.5" />
            Upload PDF
          </button>
          <button
            onClick={() => setActiveTab('paste')}
            className={cn(
              'flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              activeTab === 'paste'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <ClipboardPaste className="mr-1.5 inline h-3.5 w-3.5" />
            Paste Text
          </button>
        </div>

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div className="space-y-3">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFileSelect(f) }}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors',
                dragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/20 hover:border-muted-foreground/40',
                selectedFile && 'border-green-500 bg-green-50 dark:bg-green-950/20',
              )}
            >
              {selectedFile ? (
                <>
                  <FileText className="h-8 w-8 text-green-600" />
                  <p className="mt-2 text-sm font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024).toFixed(0)} KB</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedFile(null) }}
                    className="mt-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-3 w-3" /> Remove
                  </button>
                </>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <p className="mt-2 text-sm font-medium">{dragging ? 'Drop your resume here' : 'Click or drag to upload'}</p>
                  <p className="text-xs text-muted-foreground">PDF resume file (max 5MB)</p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); e.target.value = '' }}
              />
            </div>
          </div>
        )}

        {/* Paste Tab */}
        {activeTab === 'paste' && (
          <div className="space-y-2">
            <Label className="text-xs">Paste your resume text</Label>
            <Textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Copy all text from your existing resume and paste here..."
              rows={10}
              maxLength={15000}
              className="resize-none text-sm"
            />
            <div className="flex items-center justify-between">
              <p className="text-[11px] text-muted-foreground">Min 100 characters required</p>
              <p className="text-[10px] text-muted-foreground">{resumeText.length.toLocaleString()}/15,000</p>
            </div>
          </div>
        )}

        {/* Import Button */}
        <Button
          onClick={handleImport}
          disabled={importing || !canImport}
          className="w-full gap-2"
        >
          {importing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {enhanceLevel === 'full' ? 'Enhancing your resume...' : 'Cleaning up your resume...'}
            </>
          ) : (
            <>
              <Wand2 className="h-4 w-4" />
              {enhanceLevel === 'full' ? `Enhance Resume (${CREDIT_COSTS.AI_RESUME_IMPORT} credits)` : `Clean Up Resume (${CREDIT_COSTS.AI_RESUME_IMPORT} credits)`}
            </>
          )}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
