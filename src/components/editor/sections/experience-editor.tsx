'use client'

import { useState } from 'react'
import { Plus, Trash2, Briefcase } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { BulletGenerator } from '@/components/ai/bullet-generator'
import { ConfirmDeleteDialog } from '@/components/editor/confirm-delete-dialog'
import { DateMonthYearPicker } from '@/components/editor/date-picker'
import { EmptySectionState } from './empty-section-state'
import { BulletPointEditor } from './bullet-point-editor'
import { useResumeStore } from '@/stores/resume-store'

export function ExperienceEditor({ sectionId }: { sectionId: string }) {
  const section = useResumeStore((s) => s.content.sections.find((sec) => sec.id === sectionId))
  const { addEntry, removeEntry, updateEntryField, setEntryDates } = useResumeStore()
  const [deleteId, setDeleteId] = useState<string | null>(null)

  if (!section) return null

  if (section.entries.length === 0) {
    return (
      <div className="space-y-4">
        <EmptySectionState
          icon={Briefcase}
          title="No positions added yet"
          description="Add your work experience to showcase your career history"
        />
        <Button variant="outline" size="sm" className="w-full gap-1.5 border-dashed" onClick={() => addEntry(sectionId)}>
          <Plus className="h-4 w-4" /> Add Position
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {section.entries.map((entry, index) => (
        <div key={entry.id} className="rounded-lg border bg-background">
          <div className="flex items-center justify-between px-4 py-2.5">
            <span className="text-xs font-semibold text-muted-foreground">
              {entry.fields.jobTitle || entry.fields.company
                ? `${entry.fields.jobTitle ?? ''}${entry.fields.jobTitle && entry.fields.company ? ' at ' : ''}${entry.fields.company ?? ''}`
                : `Position ${index + 1}`}
            </span>
            <button
              onClick={() => setDeleteId(entry.id)}
              className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground/40 hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <Separator />
          <div className="space-y-4 p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label className="mb-1.5 text-xs text-muted-foreground">Job Title</Label>
                <Input placeholder="Software Engineer" value={entry.fields.jobTitle ?? ''} onChange={(e) => updateEntryField(sectionId, entry.id, 'jobTitle', e.target.value)} />
              </div>
              <div>
                <Label className="mb-1.5 text-xs text-muted-foreground">Company</Label>
                <Input placeholder="Acme Corp" value={entry.fields.company ?? ''} onChange={(e) => updateEntryField(sectionId, entry.id, 'company', e.target.value)} />
              </div>
              <div>
                <Label className="mb-1.5 text-xs text-muted-foreground">Location</Label>
                <Input placeholder="San Francisco, CA" value={entry.fields.location ?? ''} onChange={(e) => updateEntryField(sectionId, entry.id, 'location', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="mb-1.5 text-xs text-muted-foreground">Start</Label>
                  <DateMonthYearPicker value={entry.startDate ?? ''} onChange={(val) => setEntryDates(sectionId, entry.id, { startDate: val })} />
                </div>
                <div>
                  <Label className="mb-1.5 text-xs text-muted-foreground">End</Label>
                  <DateMonthYearPicker value={entry.current ? 'Present' : (entry.endDate ?? '')} onChange={(val) => setEntryDates(sectionId, entry.id, { endDate: val, current: false })} disabled={entry.current} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id={`current-${entry.id}`} checked={entry.current ?? false} onCheckedChange={(checked) => setEntryDates(sectionId, entry.id, { current: checked === true, endDate: checked === true ? undefined : entry.endDate })} />
              <Label htmlFor={`current-${entry.id}`} className="text-xs text-muted-foreground">I currently work here</Label>
            </div>
            <Separator />
            <div>
              <div className="mb-2 flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">Achievements</Label>
                <BulletGenerator
                  sectionId={sectionId}
                  entryId={entry.id}
                  jobTitle={entry.fields.jobTitle}
                  company={entry.fields.company}
                />
              </div>
              <BulletPointEditor sectionId={sectionId} entryId={entry.id} />
            </div>
          </div>
        </div>
      ))}

      <Button variant="outline" size="sm" className="w-full gap-1.5 border-dashed" onClick={() => addEntry(sectionId)}>
        <Plus className="h-4 w-4" /> Add Position
      </Button>

      <ConfirmDeleteDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete this position?"
        description="This entry and all its content will be removed."
        onConfirm={() => { if (deleteId) removeEntry(sectionId, deleteId); setDeleteId(null) }}
      />
    </div>
  )
}
