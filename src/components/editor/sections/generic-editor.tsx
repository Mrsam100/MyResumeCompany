'use client'

import { Plus, Trash2 } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useResumeStore } from '@/stores/resume-store'
import { BulletPointEditor } from './bullet-point-editor'
import type { SectionType } from '@/types/resume'

const fieldConfigs: Record<string, { key: string; label: string; placeholder: string }[]> = {
  projects: [
    { key: 'name', label: 'Project Name', placeholder: 'My Awesome Project' },
    { key: 'description', label: 'Description', placeholder: 'A brief description...' },
    { key: 'technologies', label: 'Technologies', placeholder: 'React, Node.js, PostgreSQL' },
    { key: 'url', label: 'URL', placeholder: 'https://...' },
  ],
  certifications: [
    { key: 'name', label: 'Certification Name', placeholder: 'AWS Solutions Architect' },
    { key: 'issuer', label: 'Issuing Organization', placeholder: 'Amazon Web Services' },
    { key: 'date', label: 'Date', placeholder: 'Mar 2023' },
    { key: 'credentialId', label: 'Credential ID', placeholder: 'ABC123' },
  ],
  awards: [
    { key: 'title', label: 'Award Title', placeholder: 'Employee of the Year' },
    { key: 'issuer', label: 'Issuer', placeholder: 'Company Name' },
    { key: 'date', label: 'Date', placeholder: '2023' },
    { key: 'description', label: 'Description', placeholder: 'Brief description...' },
  ],
  languages: [
    { key: 'language', label: 'Language', placeholder: 'Spanish' },
    { key: 'proficiency', label: 'Proficiency', placeholder: 'Professional Working' },
  ],
  volunteer: [
    { key: 'organization', label: 'Organization', placeholder: 'Red Cross' },
    { key: 'role', label: 'Role', placeholder: 'Volunteer Coordinator' },
    { key: 'description', label: 'Description', placeholder: 'Brief description...' },
  ],
  publications: [
    { key: 'title', label: 'Title', placeholder: 'Publication Title' },
    { key: 'publisher', label: 'Publisher / Journal', placeholder: 'IEEE' },
    { key: 'date', label: 'Date', placeholder: '2023' },
    { key: 'url', label: 'URL / DOI', placeholder: 'https://...' },
  ],
  interests: [
    { key: 'name', label: 'Interest', placeholder: 'Open Source, Hiking, Photography' },
  ],
  references: [
    { key: 'name', label: 'Name', placeholder: 'Jane Smith' },
    { key: 'title', label: 'Title', placeholder: 'Engineering Manager' },
    { key: 'company', label: 'Company', placeholder: 'Acme Corp' },
    { key: 'email', label: 'Email', placeholder: 'jane@acme.com' },
    { key: 'phone', label: 'Phone', placeholder: '+1 (555) 123-4567' },
  ],
  custom: [
    { key: 'title', label: 'Title', placeholder: 'Entry title' },
    { key: 'subtitle', label: 'Subtitle', placeholder: 'Subtitle or organization' },
    { key: 'description', label: 'Description', placeholder: 'Description...' },
  ],
}

const addButtonLabels: Record<string, string> = {
  projects: 'Add Project',
  certifications: 'Add Certification',
  awards: 'Add Award',
  languages: 'Add Language',
  volunteer: 'Add Experience',
  publications: 'Add Publication',
  interests: 'Add Interest',
  references: 'Add Reference',
  custom: 'Add Entry',
}

const hasBullets = new Set(['projects', 'volunteer', 'custom'])

export function GenericEditor({ sectionId, type }: { sectionId: string; type: SectionType }) {
  const section = useResumeStore((s) => s.content.sections.find((sec) => sec.id === sectionId))
  const { addEntry, removeEntry, updateEntryField, setEntryDates } = useResumeStore()

  if (!section) return null

  const fields = fieldConfigs[type] ?? fieldConfigs.custom
  const showDates = ['projects', 'volunteer'].includes(type)

  return (
    <div className="space-y-4">
      {section.entries.map((entry, index) => (
        <div key={entry.id} className="space-y-3 rounded-md border bg-background p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Entry {index + 1}
            </span>
            <button
              onClick={() => removeEntry(sectionId, entry.id)}
              className="text-muted-foreground/50 hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {fields.map((field) => (
              <div key={field.key} className={fields.length === 1 ? 'sm:col-span-2' : ''}>
                <Label className="mb-1 text-xs">{field.label}</Label>
                <Input
                  placeholder={field.placeholder}
                  value={entry.fields[field.key] ?? ''}
                  onChange={(e) =>
                    updateEntryField(sectionId, entry.id, field.key, e.target.value)
                  }
                />
              </div>
            ))}

            {showDates && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="mb-1 text-xs">Start Date</Label>
                  <Input
                    placeholder="Jan 2023"
                    value={entry.startDate ?? ''}
                    onChange={(e) =>
                      setEntryDates(sectionId, entry.id, { startDate: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label className="mb-1 text-xs">End Date</Label>
                  <Input
                    placeholder="Present"
                    value={entry.endDate ?? ''}
                    onChange={(e) =>
                      setEntryDates(sectionId, entry.id, { endDate: e.target.value })
                    }
                  />
                </div>
              </div>
            )}
          </div>

          {hasBullets.has(type) && (
            <div className="space-y-2">
              <Label className="text-xs">Details</Label>
              <BulletPointEditor sectionId={sectionId} entryId={entry.id} />
            </div>
          )}
        </div>
      ))}

      <Button
        variant="outline"
        size="sm"
        className="w-full gap-1.5"
        onClick={() => addEntry(sectionId)}
      >
        <Plus className="h-4 w-4" />
        {addButtonLabels[type] ?? 'Add Entry'}
      </Button>
    </div>
  )
}
