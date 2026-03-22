'use client'

import { useRef, useState, useCallback } from 'react'
import { Plus, X, GripVertical } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useResumeStore } from '@/stores/resume-store'
import { cn } from '@/lib/utils'

const IDEAL_MIN = 80
const IDEAL_MAX = 150
const HARD_MAX = 300

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
  const { addBulletPoint, removeBulletPoint, updateBulletPoint, reorderBulletPoints } = useResumeStore()
  const inputRefs = useRef<Map<number, HTMLInputElement>>(new Map())
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)

  if (!entry) return null

  function handleAdd() {
    addBulletPoint(sectionId, entryId)
    requestAnimationFrame(() => {
      const newIndex = (entry?.bulletPoints.length ?? 0)
      inputRefs.current.get(newIndex)?.focus()
    })
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === 'Enter' && index === (entry?.bulletPoints.length ?? 0) - 1) {
      e.preventDefault()
      handleAdd()
    }
    if (e.key === 'Backspace' && entry?.bulletPoints[index] === '' && entry.bulletPoints.length > 1) {
      e.preventDefault()
      removeBulletPoint(sectionId, entryId, index)
      requestAnimationFrame(() => {
        inputRefs.current.get(Math.max(0, index - 1))?.focus()
      })
    }
    // Alt+Up/Down to reorder
    if (e.altKey && e.key === 'ArrowUp' && index > 0) {
      e.preventDefault()
      reorderBulletPoints(sectionId, entryId, index, index - 1)
      requestAnimationFrame(() => inputRefs.current.get(index - 1)?.focus())
    }
    if (e.altKey && e.key === 'ArrowDown' && index < (entry?.bulletPoints.length ?? 0) - 1) {
      e.preventDefault()
      reorderBulletPoints(sectionId, entryId, index, index + 1)
      requestAnimationFrame(() => inputRefs.current.get(index + 1)?.focus())
    }
  }

  function handleDragStart(index: number) {
    setDragIndex(index)
  }

  function handleDragOver(index: number, e: React.DragEvent) {
    e.preventDefault()
    setOverIndex(index)
  }

  function handleDrop(index: number) {
    if (dragIndex !== null && dragIndex !== index) {
      reorderBulletPoints(sectionId, entryId, dragIndex, index)
    }
    setDragIndex(null)
    setOverIndex(null)
  }

  function handleDragEnd() {
    setDragIndex(null)
    setOverIndex(null)
  }

  function charColor(len: number): string {
    if (len === 0) return 'text-muted-foreground/40'
    if (len < IDEAL_MIN) return 'text-amber-500'
    if (len <= IDEAL_MAX) return 'text-green-500'
    return 'text-amber-500'
  }

  return (
    <div className="space-y-0.5">
      {entry.bulletPoints.map((bullet, index) => (
        <div
          key={`${entryId}-bullet-${index}`}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(index, e)}
          onDrop={() => handleDrop(index)}
          onDragEnd={handleDragEnd}
          className={cn(
            'group flex items-center gap-0.5 rounded-md transition-all duration-150',
            dragIndex === index && 'opacity-40',
            overIndex === index && dragIndex !== null && dragIndex !== index && 'ring-2 ring-primary/30 ring-offset-1',
          )}
        >
          <div
            className="flex h-8 w-5 shrink-0 cursor-grab items-center justify-center text-muted-foreground/20 transition-colors hover:text-muted-foreground/60 active:cursor-grabbing"
            title="Drag to reorder (or Alt+Up/Down)"
          >
            <GripVertical className="h-3 w-3" />
          </div>
          <div className="relative flex-1">
            <Input
              ref={(el) => {
                if (el) inputRefs.current.set(index, el)
                else inputRefs.current.delete(index)
              }}
              placeholder={index === 0 ? 'Led a team of 5 engineers to deliver...' : 'Add another achievement...'}
              value={bullet}
              onChange={(e) => updateBulletPoint(sectionId, entryId, index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(null)}
              maxLength={HARD_MAX}
              className="h-8 pr-12 text-sm"
            />
            {focusedIndex === index && bullet.length > 0 && (
              <span className={cn('absolute right-2 top-1/2 -translate-y-1/2 text-[10px] tabular-nums transition-colors', charColor(bullet.length))}>
                {bullet.length}
              </span>
            )}
          </div>
          <button
            onClick={() => removeBulletPoint(sectionId, entryId, index)}
            className="flex h-8 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground/20 opacity-0 transition-all hover:text-destructive group-hover:opacity-100"
            aria-label="Remove bullet point"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}

      <button
        onClick={handleAdd}
        className="flex h-8 w-full items-center gap-1.5 rounded-md px-6 text-xs text-muted-foreground/50 transition-colors hover:bg-muted hover:text-muted-foreground"
      >
        <Plus className="h-3 w-3" />
        Add bullet point
      </button>
      {entry.bulletPoints.length > 0 && (
        <p className="px-6 text-[10px] text-muted-foreground/40">
          Aim for {IDEAL_MIN}-{IDEAL_MAX} characters per bullet. Use STAR format: Action + Result + Metric.
        </p>
      )}
    </div>
  )
}
