'use client'

import { useRef } from 'react'
import { Plus, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useResumeStore } from '@/stores/resume-store'

export function BulletPointEditor({
  sectionId,
  entryId,
}: {
  sectionId: string
  entryId: string
}) {
  const entry = useResumeStore((s) => {
    const section = s.content.sections.find((sec) => sec.id === sectionId)
    return section?.entries.find((e) => e.id === entryId)
  })
  const { addBulletPoint, removeBulletPoint, updateBulletPoint } = useResumeStore()
  const inputRefs = useRef<Map<number, HTMLInputElement>>(new Map())

  if (!entry) return null

  function handleAdd() {
    addBulletPoint(sectionId, entryId)
    // Focus new input after render
    requestAnimationFrame(() => {
      const newIndex = (entry?.bulletPoints.length ?? 0)
      inputRefs.current.get(newIndex)?.focus()
    })
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    // Enter on last bullet → add new bullet
    if (e.key === 'Enter' && index === (entry?.bulletPoints.length ?? 0) - 1) {
      e.preventDefault()
      handleAdd()
    }
    // Backspace on empty bullet → remove it and focus previous
    if (e.key === 'Backspace' && entry?.bulletPoints[index] === '' && entry.bulletPoints.length > 1) {
      e.preventDefault()
      removeBulletPoint(sectionId, entryId, index)
      requestAnimationFrame(() => {
        inputRefs.current.get(Math.max(0, index - 1))?.focus()
      })
    }
  }

  return (
    <div className="space-y-1">
      {entry.bulletPoints.map((bullet, index) => (
        <div key={index} className="group flex items-center gap-1">
          <div className="flex h-8 w-5 shrink-0 items-center justify-center">
            <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
          </div>
          <Input
            ref={(el) => {
              if (el) inputRefs.current.set(index, el)
              else inputRefs.current.delete(index)
            }}
            placeholder={index === 0 ? 'Led a team of 5 engineers to deliver...' : 'Add another achievement...'}
            value={bullet}
            onChange={(e) => updateBulletPoint(sectionId, entryId, index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="h-8 text-sm"
          />
          <button
            onClick={() => removeBulletPoint(sectionId, entryId, index)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground/30 opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}

      <button
        onClick={handleAdd}
        className="flex h-8 w-full items-center gap-1.5 rounded-md px-6 text-xs text-muted-foreground/60 transition-colors hover:bg-muted hover:text-muted-foreground"
      >
        <Plus className="h-3 w-3" />
        Add bullet point
      </button>
    </div>
  )
}
