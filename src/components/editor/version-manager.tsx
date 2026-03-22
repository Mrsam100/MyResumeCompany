'use client'

import { useState, useEffect } from 'react'
import { History, Save, RotateCcw, Loader2, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useResumeStore } from '@/stores/resume-store'
import { formatDistanceToNow } from 'date-fns'

interface Version {
  id: string
  label: string
  templateId: string
  createdAt: string
}

export function VersionManager() {
  const [open, setOpen] = useState(false)
  const [versions, setVersions] = useState<Version[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [restoring, setRestoring] = useState<string | null>(null)
  const [newLabel, setNewLabel] = useState('')
  const [showSaveInput, setShowSaveInput] = useState(false)

  const resumeId = useResumeStore((s) => s.resumeId)

  async function fetchVersions() {
    if (!resumeId) return
    setLoading(true)
    try {
      const res = await fetch(`/api/resumes/${resumeId}/versions`)
      if (res.ok) {
        const data = await res.json()
        setVersions(data.versions)
      }
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open && resumeId) fetchVersions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, resumeId])

  async function handleSave() {
    if (!resumeId || !newLabel.trim() || saving) return
    setSaving(true)

    // Save current state first
    const state = useResumeStore.getState()
    if (state.isDirty) {
      await fetch(`/api/resumes/${resumeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: state.title,
          templateId: state.templateId,
          content: state.content,
        }),
      })
    }

    try {
      const res = await fetch(`/api/resumes/${resumeId}/versions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: newLabel.trim() }),
      })
      if (res.ok) {
        toast.success(`Version "${newLabel.trim()}" saved`)
        setNewLabel('')
        setShowSaveInput(false)
        fetchVersions()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to save version')
      }
    } catch {
      toast.error('Failed to save version')
    } finally {
      setSaving(false)
    }
  }

  async function handleRestore(versionId: string, label: string) {
    if (!resumeId || restoring) return
    setRestoring(versionId)
    try {
      const res = await fetch(`/api/resumes/${resumeId}/versions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ versionId }),
      })
      if (res.ok) {
        toast.success(`Restored "${label}"`)
        // Reload the page to pick up restored content
        window.location.reload()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to restore')
      }
    } catch {
      toast.error('Failed to restore version')
    } finally {
      setRestoring(null)
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => setOpen(true)}
        title="Version History"
      >
        <History className="h-4 w-4" />
      </Button>

      <Dialog open={open} onOpenChange={(val) => { if (!saving && !restoring) setOpen(val) }}>
        <DialogContent className="max-w-md max-h-[70vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Version History
            </DialogTitle>
            <DialogDescription>
              Save snapshots of your resume. Restore any version at any time.
            </DialogDescription>
          </DialogHeader>

          {/* Save new version */}
          <div className="border-b pb-3">
            {showSaveInput ? (
              <div className="flex gap-2">
                <Input
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                  placeholder="e.g. v1 for Google, Before ATS changes..."
                  className="h-8 text-xs"
                  autoFocus
                />
                <Button
                  size="sm"
                  className="h-8 shrink-0 gap-1"
                  onClick={handleSave}
                  disabled={saving || !newLabel.trim()}
                >
                  {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                  Save
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 shrink-0"
                  onClick={() => { setShowSaveInput(false); setNewLabel('') }}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-1.5"
                onClick={() => setShowSaveInput(true)}
              >
                <Plus className="h-3.5 w-3.5" />
                Save current version
              </Button>
            )}
          </div>

          {/* Version list */}
          <div className="flex-1 overflow-y-auto space-y-1 pr-1">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : versions.length === 0 ? (
              <div className="text-center py-8">
                <History className="mx-auto h-8 w-8 text-muted-foreground/30" />
                <p className="mt-2 text-sm text-muted-foreground">No versions saved yet</p>
                <p className="text-xs text-muted-foreground/70">
                  Save a version before making big changes so you can always go back
                </p>
              </div>
            ) : (
              versions.map((v) => (
                <div
                  key={v.id}
                  className="flex items-center justify-between rounded-lg border px-3 py-2.5 hover:bg-muted/50"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{v.label}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {formatDistanceToNow(new Date(v.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 shrink-0 gap-1 text-[11px]"
                    onClick={() => handleRestore(v.id, v.label)}
                    disabled={restoring === v.id}
                  >
                    {restoring === v.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <RotateCcw className="h-3 w-3" />
                    )}
                    Restore
                  </Button>
                </div>
              ))
            )}
          </div>

          <p className="text-[10px] text-muted-foreground text-center border-t pt-2">
            Up to 20 versions per resume. Current state is auto-saved before restoring.
          </p>
        </DialogContent>
      </Dialog>
    </>
  )
}
