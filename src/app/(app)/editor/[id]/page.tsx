'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Undo2,
  Redo2,
  FileText,
  Eye,
  PenLine,
  Download,
  FileDown,
  ZoomIn,
  ZoomOut,
  LayoutGrid,
  Target,
  ChevronDown,
  ChevronUp,
  Link2,
  Loader2,
} from 'lucide-react'

import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SaveStatus } from '@/components/editor/save-status'
import { PersonalInfoForm } from '@/components/editor/personal-info-form'
import { SummaryEditor } from '@/components/editor/summary-editor'
import { SectionManager } from '@/components/editor/section-manager'
import { TemplateCustomizer } from '@/components/editor/template-customizer'
import { CompletenessIndicator } from '@/components/editor/completeness-indicator'
import { VersionManager } from '@/components/editor/version-manager'
import { ATSScanner } from '@/components/ai/ats-scanner'
import { CoverLetterGenerator } from '@/components/ai/cover-letter-generator'
import { TemplateRenderer } from '@/templates/template-renderer'
import { useResumeStore } from '@/stores/resume-store'
import { useEditorStore } from '@/stores/editor-store'
import { useAutosave } from '@/hooks/use-autosave'
import { usePdfExport } from '@/hooks/use-pdf-export'
import { useDocxExport } from '@/hooks/use-docx-export'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'
import { useLiveATSScore } from '@/hooks/use-live-ats-score'
import { TEMPLATE_NAMES } from '@/constants/template-names'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import type { ResumeContent } from '@/types/resume'

export default function EditorPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { loadResume, resetStore, content, title, templateId, setTemplate, canUndo, canRedo, undo, redo, targetJobDescription, setTargetJobDescription } =
    useResumeStore()
  const { showPreview, togglePreview, zoom, setZoom } = useEditorStore()
  const { save } = useAutosave()
  const { exportPdf, exporting: exportingPdf } = usePdfExport()
  const { exportDocx, exporting: exportingDocx } = useDocxExport()
  const exporting = exportingPdf || exportingDocx
  const { score: atsScore, matched: atsMatched, total: atsTotal, hasJobDescription } = useLiveATSScore()
  const [jdExpanded, setJdExpanded] = useState(false)
  const [jdInput, setJdInput] = useState('')
  const [atsScannerOpen, setAtsScannerOpen] = useState(false)
  const [jdUrlInput, setJdUrlInput] = useState('')
  const [jdUrlLoading, setJdUrlLoading] = useState(false)

  useKeyboardShortcuts(save)

  async function handleJdUrlImport() {
    if (!jdUrlInput.trim() || jdUrlLoading) return
    setJdUrlLoading(true)
    try {
      const res = await fetch('/api/jd-extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: jdUrlInput.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Failed to extract job description')
        return
      }
      setJdInput(data.text)
      setTargetJobDescription(data.text)
      setJdUrlInput('')
      toast.success(`Imported ${data.charCount} characters from job listing`)
    } catch {
      toast.error('Failed to fetch URL')
    } finally {
      setJdUrlLoading(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    setError(null)

    async function fetchResume() {
      try {
        const res = await fetch(`/api/resumes/${params.id}`)
        if (res.status === 404) { setError('Resume not found'); return }
        if (res.status === 401) { router.push('/login'); return }
        if (!res.ok) { setError('Failed to load resume'); return }

        const data = await res.json()
        const rawContent = data.resume.content
        // Validate content shape — fallback to safe defaults for missing fields
        const safeContent: ResumeContent = {
          personalInfo: {
            fullName: rawContent?.personalInfo?.fullName ?? '',
            title: rawContent?.personalInfo?.title ?? '',
            email: rawContent?.personalInfo?.email ?? '',
            phone: rawContent?.personalInfo?.phone ?? '',
            location: rawContent?.personalInfo?.location ?? '',
            linkedin: rawContent?.personalInfo?.linkedin,
            website: rawContent?.personalInfo?.website,
            portfolio: rawContent?.personalInfo?.portfolio,
            summary: rawContent?.personalInfo?.summary,
            photoUrl: rawContent?.personalInfo?.photoUrl,
          },
          sections: Array.isArray(rawContent?.sections) ? rawContent.sections : [],
          customColors: rawContent?.customColors,
          customFonts: rawContent?.customFonts,
          format: rawContent?.format,
        }
        loadResume({
          id: data.resume.id,
          title: data.resume.title ?? 'Untitled Resume',
          templateId: data.resume.templateId ?? 'classic-professional',
          content: safeContent,
          targetJobDescription: data.resume.targetJobDescription ?? null,
        })
        setJdInput(data.resume.targetJobDescription ?? '')
      } catch {
        setError('Failed to load resume')
      } finally {
        setLoading(false)
      }
    }

    fetchResume()
    return () => { resetStore() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id])

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <FileText className="h-16 w-16 text-muted-foreground/30" />
        <div className="text-center">
          <h2 className="text-lg font-semibold">{error}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            The resume you&apos;re looking for doesn&apos;t exist or you don&apos;t have access.
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex h-12 items-center gap-2 border-b px-4">
          <Skeleton className="h-5 w-40" />
          <div className="flex-1" />
          <Skeleton className="h-8 w-20" />
        </div>
        <div className="flex flex-1">
          <div className="flex-1 space-y-4 p-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-40 w-full" />
          </div>
          <div className="hidden w-1/2 border-l bg-muted/20 p-6 lg:block">
            <Skeleton className="mx-auto h-[600px] w-[420px]" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="-m-4 flex h-[calc(100dvh-3.5rem)] flex-col md:-m-6">
      {/* ── Toolbar ── */}
      <div className="flex h-12 shrink-0 items-center justify-between border-b bg-card px-3">
        <div className="flex items-center gap-2 min-w-0">
          <h2 className="max-w-[160px] truncate text-sm font-medium sm:max-w-xs">{title}</h2>

          {/* Template selector */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 rounded-md border bg-muted/50 px-2 py-1 text-[11px] font-medium text-muted-foreground hover:bg-muted">
              <LayoutGrid className="h-3 w-3" />
              <span className="hidden sm:inline">{TEMPLATE_NAMES[templateId] ?? templateId}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-64 overflow-y-auto">
              {Object.entries(TEMPLATE_NAMES).map(([slug, name]) => (
                <DropdownMenuItem
                  key={slug}
                  onClick={() => setTemplate(slug)}
                  className={slug === templateId ? 'bg-accent' : ''}
                >
                  {name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <SaveStatus />
        </div>

        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={undo} disabled={!canUndo()}>
                <Undo2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={redo} disabled={!canRedo()}>
                <Redo2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo (Ctrl+Shift+Z)</TooltipContent>
          </Tooltip>

          <VersionManager />

          <Separator orientation="vertical" className="mx-1 h-5" />

          <Button variant="ghost" size="sm" className="gap-1.5 lg:hidden" onClick={togglePreview}>
            {showPreview ? <><PenLine className="h-4 w-4" /> Edit</> : <><Eye className="h-4 w-4" /> Preview</>}
          </Button>

          <Separator orientation="vertical" className="mx-1 hidden h-5 lg:block" />

          <div className="flex items-center gap-1">
            {hasJobDescription && atsScore !== null && (
              <Tooltip>
                <TooltipTrigger>
                  <button
                    onClick={() => setAtsScannerOpen(true)}
                    className="mr-1"
                  >
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-[11px] font-bold tabular-nums',
                        atsScore >= 75 ? 'border-green-500 text-green-600' :
                        atsScore >= 50 ? 'border-amber-500 text-amber-600' :
                        'border-red-500 text-red-600',
                      )}
                    >
                      ATS {atsScore}
                    </Badge>
                  </button>
                </TooltipTrigger>
                <TooltipContent>{atsMatched.length}/{atsTotal} keywords matched. Click for full AI scan.</TooltipContent>
              </Tooltip>
            )}
            <ATSScanner
              externalOpen={atsScannerOpen}
              onExternalOpenChange={setAtsScannerOpen}
              prefillJobDescription={targetJobDescription || undefined}
            />
            <CoverLetterGenerator />
          </div>

          <Separator orientation="vertical" className="mx-1 h-5" />

          <DropdownMenu>
            <DropdownMenuTrigger
              className="inline-flex items-center justify-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium shadow-xs hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
              disabled={exporting}
            >
              {exporting ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">{exporting ? 'Exporting...' : 'Export'}</span>
              <ChevronDown className="h-3 w-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={exportPdf} disabled={exportingPdf}>
                <Download className="mr-2 h-4 w-4" />
                Export PDF
                <span className="ml-auto text-xs text-muted-foreground">30 credits</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportDocx} disabled={exportingDocx}>
                <FileDown className="mr-2 h-4 w-4" />
                Export DOCX
                <span className="ml-auto text-xs text-muted-foreground">25 credits</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* ── Job Description Panel (collapsible) ── */}
      <div className="shrink-0 border-b bg-muted/30">
        {jdExpanded ? (
          <div className="px-4 py-3 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5 text-primary" />
                Target Job Description
              </label>
              <button onClick={() => setJdExpanded(false)} className="text-muted-foreground hover:text-foreground">
                <ChevronUp className="h-4 w-4" />
              </button>
            </div>
            {/* URL import */}
            <div className="flex gap-1.5">
              <div className="relative flex-1">
                <Link2 className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/40" />
                <input
                  type="url"
                  value={jdUrlInput}
                  onChange={(e) => setJdUrlInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleJdUrlImport()}
                  placeholder="Paste Indeed/LinkedIn job URL..."
                  className="h-8 w-full rounded-md border bg-background pl-8 pr-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-8 shrink-0 gap-1 text-[11px]"
                onClick={handleJdUrlImport}
                disabled={jdUrlLoading || !jdUrlInput.trim()}
              >
                {jdUrlLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Link2 className="h-3 w-3" />}
                Import
              </Button>
            </div>

            <Textarea
              value={jdInput}
              onChange={(e) => setJdInput(e.target.value)}
              onBlur={() => setTargetJobDescription(jdInput.trim() || null)}
              placeholder="Paste the job description here for live ATS keyword matching..."
              rows={4}
              maxLength={5000}
              className="resize-none text-xs"
            />
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-muted-foreground">
                {hasJobDescription ? `Live scoring active — ${atsMatched.length}/${atsTotal} keywords matched` : 'Paste a job description to enable live ATS scoring'}
              </p>
              <p className="text-[10px] text-muted-foreground">{jdInput.length}/5,000</p>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setJdExpanded(true)}
            className="flex w-full items-center justify-between px-4 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Target className="h-3 w-3" />
              {hasJobDescription ? (
                <>Job description set — <span className={cn('font-medium', atsScore !== null && atsScore >= 75 ? 'text-green-600' : atsScore !== null && atsScore >= 50 ? 'text-amber-600' : 'text-red-600')}>{atsMatched.length}/{atsTotal} keywords matched</span></>
              ) : (
                'Add job description for live ATS scoring'
              )}
            </span>
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* ── Two-panel layout ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor panel */}
        <div className={`flex-1 overflow-y-auto ${showPreview ? 'hidden lg:block' : 'block'}`}>
          <div className="mx-auto max-w-2xl space-y-6 p-6">
            <CompletenessIndicator />
            <TemplateCustomizer />
            <PersonalInfoForm />
            <Separator />
            <SummaryEditor />
            <Separator />
            <SectionManager />
          </div>
        </div>

        {/* Preview panel */}
        <div className={`relative border-l bg-muted/20 lg:w-1/2 ${showPreview ? 'block' : 'hidden lg:block'}`}>
          <div className="flex h-full items-start justify-center overflow-y-auto p-6">
            <div
              className="w-full max-w-[min(100%,420px)] overflow-hidden rounded-md border bg-white shadow-sm"
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center', minHeight: '594px' }}
            >
              <TemplateRenderer templateSlug={templateId} content={content} customColors={content.customColors} customFonts={content.customFonts} />
            </div>
          </div>

          {/* Zoom controls */}
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-lg border bg-card/90 px-2 py-1 shadow-sm backdrop-blur-sm">
            <button onClick={() => setZoom(zoom - 10)} className="flex h-7 w-7 items-center justify-center rounded hover:bg-muted" disabled={zoom <= 25}>
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <span className="w-10 text-center text-xs font-medium tabular-nums">{zoom}%</span>
            <button onClick={() => setZoom(zoom + 10)} className="flex h-7 w-7 items-center justify-center rounded hover:bg-muted" disabled={zoom >= 200}>
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
