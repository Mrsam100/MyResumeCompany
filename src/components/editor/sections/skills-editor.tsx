'use client'

import { useState } from 'react'
import { Plus, X, Trash2, Wrench } from 'lucide-react'
import { toast } from 'sonner'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ConfirmDeleteDialog } from '@/components/editor/confirm-delete-dialog'
import { EmptySectionState } from './empty-section-state'
import { useResumeStore } from '@/stores/resume-store'

export function SkillsEditor({ sectionId }: { sectionId: string }) {
  const section = useResumeStore((s) => s.content.sections.find((sec) => sec.id === sectionId))
  const { addEntry, removeEntry, updateEntryField } = useResumeStore()
  const [inputValues, setInputValues] = useState<Record<string, string>>({})
  const [deleteId, setDeleteId] = useState<string | null>(null)

  if (!section) return null

  if (section.entries.length === 0) {
    return (
      <div className="space-y-4">
        <EmptySectionState
          icon={Wrench}
          title="No skill groups added yet"
          description="Organize your skills into groups like Languages, Frameworks, Tools"
        />
        <Button variant="outline" size="sm" className="w-full gap-1.5 border-dashed" onClick={() => addEntry(sectionId)}>
          <Plus className="h-4 w-4" /> Add Skill Group
        </Button>
      </div>
    )
  }

  function handleKeyDown(entryId: string, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== 'Enter' && e.key !== ',') return
    e.preventDefault()

    const value = (inputValues[entryId] ?? '').trim()
    if (!value) return

    const entry = section?.entries.find((en) => en.id === entryId)
    if (!entry) return

    const existing = entry.fields.skills ?? ''
    const skills = existing ? existing.split(',').map((s) => s.trim()) : []

    if (skills.includes(value)) {
      toast.error(`"${value}" is already in this group`)
      return
    }

    updateEntryField(sectionId, entryId, 'skills', [...skills, value].join(', '))
    setInputValues((prev) => ({ ...prev, [entryId]: '' }))
  }

  function removeSkill(entryId: string, skillToRemove: string) {
    const entry = section?.entries.find((en) => en.id === entryId)
    if (!entry) return

    const skills = (entry.fields.skills ?? '').split(',').map((s) => s.trim()).filter(Boolean)
    const updated = skills.filter((s) => s !== skillToRemove)
    updateEntryField(sectionId, entryId, 'skills', updated.join(', '))
  }

  return (
    <div className="space-y-4">
      {section.entries.map((entry, index) => {
        const skills = (entry.fields.skills ?? '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)

        return (
          <div key={entry.id} className="space-y-3 rounded-md border bg-background p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Group {index + 1}
              </span>
              <button
                onClick={() => setDeleteId(entry.id)}
                className="text-muted-foreground/50 hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            <div>
              <Label className="mb-1 text-xs">Group Name</Label>
              <Input
                placeholder="e.g. Programming Languages, Frameworks, Tools"
                value={entry.fields.groupName ?? ''}
                onChange={(e) => updateEntryField(sectionId, entry.id, 'groupName', e.target.value)}
              />
            </div>

            <div>
              <Label className="mb-1 text-xs">Skills</Label>
              <Input
                placeholder="Type a skill and press Enter"
                value={inputValues[entry.id] ?? ''}
                onChange={(e) =>
                  setInputValues((prev) => ({ ...prev, [entry.id]: e.target.value }))
                }
                onKeyDown={(e) => handleKeyDown(entry.id, e)}
              />
            </div>

            {skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="gap-1 pr-1">
                    {skill}
                    <button
                      onClick={() => removeSkill(entry.id, skill)}
                      className="rounded-sm hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )
      })}

      <Button
        variant="outline"
        size="sm"
        className="w-full gap-1.5 border-dashed"
        onClick={() => addEntry(sectionId)}
      >
        <Plus className="h-4 w-4" />
        Add Skill Group
      </Button>

      <ConfirmDeleteDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete this skill group?"
        description="This group and all its skills will be removed."
        onConfirm={() => {
          if (deleteId) {
            removeEntry(sectionId, deleteId)
            setInputValues((prev) => { const next = { ...prev }; delete next[deleteId]; return next })
          }
          setDeleteId(null)
        }}
      />
    </div>
  )
}
