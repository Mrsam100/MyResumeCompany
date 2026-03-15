'use client'

import { Plus, Trash2 } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { useResumeStore } from '@/stores/resume-store'
import { EmptySectionState } from './empty-section-state'
import { Globe } from 'lucide-react'

const PROFICIENCY_LEVELS = [
  'Native / Bilingual',
  'Full Professional',
  'Professional Working',
  'Limited Working',
  'Elementary',
]

export function LanguagesEditor({ sectionId }: { sectionId: string }) {
  const section = useResumeStore((s) => s.content.sections.find((sec) => sec.id === sectionId))
  const { addEntry, removeEntry, updateEntryField } = useResumeStore()

  if (!section) return null

  if (section.entries.length === 0) {
    return (
      <div className="space-y-4">
        <EmptySectionState
          icon={Globe}
          title="No languages added yet"
          description="Add languages you speak and your proficiency level"
        />
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-1.5 border-dashed"
          onClick={() => addEntry(sectionId)}
        >
          <Plus className="h-4 w-4" />
          Add Language
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {section.entries.map((entry) => (
        <div key={entry.id} className="flex items-center gap-3">
          <div className="flex-1">
            <Input
              placeholder="e.g. Spanish, French, Mandarin"
              value={entry.fields.language ?? ''}
              onChange={(e) => updateEntryField(sectionId, entry.id, 'language', e.target.value)}
              className="h-9"
            />
          </div>
          <div className="w-44">
            <Select
              value={entry.fields.proficiency ?? ''}
              onValueChange={(val) => { if (val) updateEntryField(sectionId, entry.id, 'proficiency', val) }}
            >
              <SelectTrigger size="sm">
                <SelectValue placeholder="Proficiency" />
              </SelectTrigger>
              <SelectContent>
                {PROFICIENCY_LEVELS.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <button
            onClick={() => removeEntry(sectionId, entry.id)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-muted-foreground/40 hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}

      <Button
        variant="outline"
        size="sm"
        className="w-full gap-1.5 border-dashed"
        onClick={() => addEntry(sectionId)}
      >
        <Plus className="h-4 w-4" />
        Add Language
      </Button>
    </div>
  )
}
