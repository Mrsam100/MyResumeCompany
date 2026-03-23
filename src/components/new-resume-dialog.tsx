'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, LayoutGrid, Linkedin, FileUp, Loader2, Plus } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface NewResumeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onWizardOpen: () => void
  onLinkedInOpen: () => void
  onResumeImportOpen: () => void
}

const OPTIONS = [
  {
    id: 'ai',
    icon: Sparkles,
    label: 'Create with AI',
    description: 'Let AI generate a full resume from your work history',
    color: 'bg-slate-800',
    iconColor: 'text-white',
    borderColor: 'border-t-slate-800',
  },
  {
    id: 'template',
    icon: LayoutGrid,
    label: 'Choose a Template',
    description: 'Pick from 50+ professional, modern, and creative designs',
    color: 'bg-violet-600',
    iconColor: 'text-white',
    borderColor: 'border-t-violet-500',
  },
  {
    id: 'linkedin',
    icon: Linkedin,
    label: 'Import from LinkedIn',
    description: 'Upload a LinkedIn PDF or paste your profile text',
    color: 'bg-emerald-500',
    iconColor: 'text-white',
    borderColor: 'border-t-emerald-500',
  },
  {
    id: 'enhance',
    icon: FileUp,
    label: 'Enhance Old Resume',
    description: 'Upload your old resume and AI will make it 10x better',
    color: 'bg-orange-500',
    iconColor: 'text-white',
    borderColor: 'border-t-orange-500',
  },
] as const

export function NewResumeDialog({
  open,
  onOpenChange,
  onWizardOpen,
  onLinkedInOpen,
  onResumeImportOpen,
}: NewResumeDialogProps) {
  const router = useRouter()
  const [creating, setCreating] = useState(false)

  async function handleBlankCreate() {
    setCreating(true)
    try {
      const res = await fetch('/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      router.push(`/editor/${data.resume.id}`)
    } catch {
      toast.error('Failed to create resume')
      setCreating(false)
    }
  }

  function handleOption(id: string) {
    onOpenChange(false)
    switch (id) {
      case 'ai':
        onWizardOpen()
        break
      case 'template':
        router.push('/templates')
        break
      case 'linkedin':
        onLinkedInOpen()
        break
      case 'enhance':
        onResumeImportOpen()
        break
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!creating) onOpenChange(val) }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create a new resume</DialogTitle>
          <DialogDescription>
            Choose how you want to get started
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 mt-2">
          {OPTIONS.map((opt) => {
            const Icon = opt.icon
            return (
              <button
                key={opt.id}
                onClick={() => handleOption(opt.id)}
                className={`group flex flex-col items-center gap-3 rounded-xl border border-border/60 border-t-4 ${opt.borderColor} bg-card p-5 text-center transition-all hover:shadow-md hover:-translate-y-0.5 duration-200`}
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${opt.color} shadow-sm transition-transform group-hover:scale-110`}>
                  <Icon className={`h-6 w-6 ${opt.iconColor}`} />
                </div>
                <div>
                  <p className="text-sm font-semibold">{opt.label}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground leading-snug">{opt.description}</p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Blank resume option */}
        <button
          onClick={handleBlankCreate}
          disabled={creating}
          className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border/60 py-2.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
        >
          {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          {creating ? 'Creating...' : 'Start from blank'}
        </button>
      </DialogContent>
    </Dialog>
  )
}
