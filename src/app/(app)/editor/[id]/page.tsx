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
  ZoomIn,
  ZoomOut,
  LayoutGrid,
} from 'lucide-react'

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
import { CompletenessIndicator } from '@/components/editor/completeness-indicator'
import { ATSScanner } from '@/components/ai/ats-scanner'
import { CoverLetterGenerator } from '@/components/ai/cover-letter-generator'
import { TemplateRenderer } from '@/templates/template-renderer'
import { useResumeStore } from '@/stores/resume-store'
import { useEditorStore } from '@/stores/editor-store'
import { useAutosave } from '@/hooks/use-autosave'
import { usePdfExport } from '@/hooks/use-pdf-export'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'
import { TEMPLATE_NAMES } from '@/constants/template-names'
import type { ResumeContent } from '@/types/resume'

export default function EditorPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { loadResume, resetStore, content, title, templateId, setTemplate, canUndo, canRedo, undo, redo } =
    useResumeStore()
  const { showPreview, togglePreview, zoom, setZoom } = useEditorStore()
  const { save } = useAutosave()
  const { exportPdf, exporting } = usePdfExport()

  useKeyboardShortcuts(save)

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
        }
        loadResume({
          id: data.resume.id,
          title: data.resume.title ?? 'Untitled Resume',
          templateId: data.resume.templateId ?? 'classic-professional',
          content: safeContent,
        })
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
    <div className="-m-4 flex h-[calc(100vh-3.5rem)] flex-col md:-m-6">
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

          <Separator orientation="vertical" className="mx-1 h-5" />

          <Button variant="ghost" size="sm" className="gap-1.5 lg:hidden" onClick={togglePreview}>
            {showPreview ? <><PenLine className="h-4 w-4" /> Edit</> : <><Eye className="h-4 w-4" /> Preview</>}
          </Button>

          <Separator orientation="vertical" className="mx-1 hidden h-5 lg:block" />

          <div className="flex items-center gap-1">
            <ATSScanner />
            <CoverLetterGenerator />
          </div>

          <Separator orientation="vertical" className="mx-1 h-5" />

          <Tooltip>
            <TooltipTrigger>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={exportPdf} disabled={exporting}>
                {exporting ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">{exporting ? 'Exporting...' : 'Export PDF'}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Download as PDF (30 credits)</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* ── Two-panel layout ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor panel */}
        <div className={`flex-1 overflow-y-auto ${showPreview ? 'hidden lg:block' : 'block'}`}>
          <div className="mx-auto max-w-2xl space-y-6 p-6">
            <CompletenessIndicator />
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
              className="w-full max-w-[420px] overflow-hidden rounded-md border bg-white shadow-sm"
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center', minHeight: '594px' }}
            >
              <TemplateRenderer templateSlug={templateId} content={content} />
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
