'use client'

import { useState } from 'react'
import { Plus, Trash2, GraduationCap } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ConfirmDeleteDialog } from '@/components/editor/confirm-delete-dialog'
import { DateMonthYearPicker } from '@/components/editor/date-picker'
import { EmptySectionState } from './empty-section-state'
import { useResumeStore } from '@/stores/resume-store'

export function EducationEditor({ sectionId }: { sectionId: string }) {
  const section = useResumeStore((s) => s.content.sections.find((sec) => sec.id === sectionId))
  const { addEntry, removeEntry, updateEntryField, setEntryDates } = useResumeStore()
  const [deleteId, setDeleteId] = useState<string | null>(null)

  if (!section) return null

  if (section.entries.length === 0) {
    return (
      <div className="space-y-4">
        <EmptySectionState
          icon={GraduationCap}
          title="No education added yet"
          description="Add your academic background and qualifications"
        />
        <Button variant="outline" size="sm" className="w-full gap-1.5 border-dashed" onClick={() => addEntry(sectionId)}>
          <Plus className="h-4 w-4" /> Add Education
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {section.entries.map((entry, index) => (
        <div key={entry.id} className="space-y-3 rounded-lg border bg-background p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              {entry.fields.school || `Education ${index + 1}`}
            </span>
            <button onClick={() => setDeleteId(entry.id)} className="flex h-8 w-8 items-center justify-center rounded text-muted-foreground/40 hover:bg-destructive/10 hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label className="mb-1.5 text-xs text-muted-foreground">School / University</Label>
              <Input placeholder="Stanford University" value={entry.fields.school ?? ''} onChange={(e) => updateEntryField(sectionId, entry.id, 'school', e.target.value)} />
            </div>
            <div>
              <Label className="mb-1.5 text-xs text-muted-foreground">Degree</Label>
              <Input placeholder="Bachelor of Science" value={entry.fields.degree ?? ''} onChange={(e) => updateEntryField(sectionId, entry.id, 'degree', e.target.value)} />
            </div>
            <div>
              <Label className="mb-1.5 text-xs text-muted-foreground">Field of Study</Label>
              <Input placeholder="Computer Science" value={entry.fields.fieldOfStudy ?? ''} onChange={(e) => updateEntryField(sectionId, entry.id, 'fieldOfStudy', e.target.value)} />
            </div>
            <div className="sm:col-span-2 grid grid-cols-2 gap-3 sm:grid-cols-[1fr_1fr_auto]">
              <div>
                <Label className="mb-1.5 text-xs text-muted-foreground">Start</Label>
                <DateMonthYearPicker value={entry.startDate ?? ''} onChange={(val) => setEntryDates(sectionId, entry.id, { startDate: val })} />
              </div>
              <div>
                <Label className="mb-1.5 text-xs text-muted-foreground">End</Label>
                <DateMonthYearPicker value={entry.endDate ?? ''} onChange={(val) => setEntryDates(sectionId, entry.id, { endDate: val })} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <Label className="mb-1.5 text-xs text-muted-foreground">GPA</Label>
                <Input placeholder="3.8 / 4.0" className="w-full sm:w-24" value={entry.fields.gpa ?? ''} onChange={(e) => updateEntryField(sectionId, entry.id, 'gpa', e.target.value)} />
              </div>
            </div>
          </div>
        </div>
      ))}

      <Button variant="outline" size="sm" className="w-full gap-1.5 border-dashed" onClick={() => addEntry(sectionId)}>
        <Plus className="h-4 w-4" /> Add Education
      </Button>

      <ConfirmDeleteDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete this education?"
        description="This entry and all its content will be removed."
        onConfirm={() => { if (deleteId) removeEntry(sectionId, deleteId); setDeleteId(null) }}
      />
    </div>
  )
}
