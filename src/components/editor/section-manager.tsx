'use client'

import { useRef, useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  GripVertical,
  Eye,
  EyeOff,
  Trash2,
  ChevronDown,
  ChevronRight,
  Plus,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderOpen,
  Award,
  Globe,
  Heart,
  BookOpen,
  Users,
  Star,
  Layers,
  Pencil,
  type LucideIcon,
} from 'lucide-react'

import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { ConfirmDeleteDialog } from '@/components/editor/confirm-delete-dialog'
import { useResumeStore } from '@/stores/resume-store'
import { useEditorStore } from '@/stores/editor-store'
import { cn } from '@/lib/utils'
import type { SectionType } from '@/types/resume'

import { ExperienceEditor } from './sections/experience-editor'
import { EducationEditor } from './sections/education-editor'
import { SkillsEditor } from './sections/skills-editor'
import { LanguagesEditor } from './sections/languages-editor'
import { GenericEditor } from './sections/generic-editor'

const sectionMeta: Record<SectionType, { label: string; icon: LucideIcon; iconColor: string; bgColor: string }> = {
  experience: { label: 'Work Experience', icon: Briefcase, iconColor: 'text-blue-500', bgColor: 'bg-blue-500/10' },
  education: { label: 'Education', icon: GraduationCap, iconColor: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
  skills: { label: 'Skills', icon: Wrench, iconColor: 'text-orange-500', bgColor: 'bg-orange-500/10' },
  projects: { label: 'Projects', icon: FolderOpen, iconColor: 'text-violet-500', bgColor: 'bg-violet-500/10' },
  certifications: { label: 'Certifications', icon: Award, iconColor: 'text-amber-500', bgColor: 'bg-amber-500/10' },
  awards: { label: 'Awards', icon: Star, iconColor: 'text-yellow-500', bgColor: 'bg-yellow-500/10' },
  languages: { label: 'Languages', icon: Globe, iconColor: 'text-cyan-500', bgColor: 'bg-cyan-500/10' },
  volunteer: { label: 'Volunteer', icon: Heart, iconColor: 'text-pink-500', bgColor: 'bg-pink-500/10' },
  publications: { label: 'Publications', icon: BookOpen, iconColor: 'text-indigo-500', bgColor: 'bg-indigo-500/10' },
  interests: { label: 'Interests', icon: Star, iconColor: 'text-teal-500', bgColor: 'bg-teal-500/10' },
  references: { label: 'References', icon: Users, iconColor: 'text-slate-500', bgColor: 'bg-slate-500/10' },
  custom: { label: 'Custom Section', icon: Layers, iconColor: 'text-gray-500', bgColor: 'bg-gray-500/10' },
}

function SortableSection({
  sectionId,
  title,
  type,
  visible,
  entryCount,
}: {
  sectionId: string
  title: string
  type: SectionType
  visible: boolean
  entryCount: number
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: sectionId,
  })
  const { activeSection, setActiveSection } = useEditorStore()
  const { removeSection, renameSection, toggleSectionVisibility } = useResumeStore()
  const sectionRef = useRef<HTMLDivElement>(null)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(title)

  const isExpanded = activeSection === sectionId
  const meta = sectionMeta[type] ?? sectionMeta.custom
  const IconComponent = meta.icon

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  function handleExpand() {
    const newState = isExpanded ? null : sectionId
    setActiveSection(newState)
    if (newState) {
      requestAnimationFrame(() => {
        sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      })
    }
  }

  function handleSaveTitle() {
    const trimmed = editValue.trim()
    if (trimmed && trimmed !== title) {
      renameSection(sectionId, trimmed)
    } else {
      setEditValue(title)
    }
    setIsEditing(false)
  }

  return (
    <>
      <div
        ref={(node) => {
          setNodeRef(node)
          ;(sectionRef as React.MutableRefObject<HTMLDivElement | null>).current = node
        }}
        style={style}
        data-section-id={sectionId}
        className={cn(
          'overflow-hidden rounded-xl border bg-card transition-all',
          isDragging && 'z-10 shadow-lg ring-2 ring-primary/20',
          !visible && 'opacity-50',
          isExpanded && 'ring-1 ring-primary/10',
        )}
      >
        {/* Section header */}
        <div className={cn('flex items-center gap-2.5 px-3 py-3', isExpanded && 'border-b bg-muted/30')}>
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab touch-none text-muted-foreground/30 transition-colors hover:text-muted-foreground active:cursor-grabbing"
            aria-label="Drag to reorder"
          >
            <GripVertical className="h-4 w-4" />
          </button>

          <div className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-md', meta.bgColor)}>
            <IconComponent className={cn('h-3.5 w-3.5', meta.iconColor)} />
          </div>

          {isEditing ? (
            <div className="flex-1 min-w-0">
              <Input
                autoFocus
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={handleSaveTitle}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveTitle()
                  if (e.key === 'Escape') {
                    setEditValue(title)
                    setIsEditing(false)
                  }
                }}
                onClick={(e) => e.stopPropagation()}
                className="h-7 text-sm font-medium ring-2 ring-primary/30"
              />
              <p className="mt-0.5 text-[9px] text-muted-foreground/60">Enter to save · Escape to cancel</p>
            </div>
          ) : (
            <button onClick={handleExpand} className="flex flex-1 items-center gap-2 text-left min-w-0">
              <span
                className="truncate text-sm font-medium"
                onDoubleClick={(e) => {
                  e.stopPropagation()
                  setIsEditing(true)
                }}
                title="Double-click to rename"
              >
                {title}
              </span>
              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                {entryCount}
              </span>
              {isExpanded ? (
                <ChevronDown className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
              ) : (
                <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
              )}
            </button>
          )}

          <div className="flex items-center gap-0.5">
            <Tooltip>
              <TooltipTrigger
                onClick={() => setIsEditing(true)}
                className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground/40 transition-colors hover:bg-muted hover:text-muted-foreground"
                aria-label="Rename section"
              >
                <Pencil className="h-3.5 w-3.5" />
              </TooltipTrigger>
              <TooltipContent>Rename section</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger
                onClick={() => toggleSectionVisibility(sectionId)}
                className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground/40 transition-colors hover:bg-muted hover:text-muted-foreground"
                aria-label={visible ? 'Hide from resume' : 'Show on resume'}
                aria-pressed={visible}
              >
                {visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
              </TooltipTrigger>
              <TooltipContent>{visible ? 'Hide from resume' : 'Show on resume'}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger
                onClick={() => setDeleteOpen(true)}
                className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground/40 transition-colors hover:bg-destructive/10 hover:text-destructive"
                aria-label="Delete section"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </TooltipTrigger>
              <TooltipContent>Delete section</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {isExpanded && (
          <div className="p-4">
            <SectionEditorSwitch sectionId={sectionId} type={type} />
          </div>
        )}
      </div>

      <ConfirmDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete "${title}"?`}
        description="This section and all its entries will be removed."
        onConfirm={() => removeSection(sectionId)}
      />
    </>
  )
}

function SectionEditorSwitch({ sectionId, type }: { sectionId: string; type: SectionType }) {
  switch (type) {
    case 'experience':
      return <ExperienceEditor sectionId={sectionId} />
    case 'education':
      return <EducationEditor sectionId={sectionId} />
    case 'skills':
      return <SkillsEditor sectionId={sectionId} />
    case 'languages':
      return <LanguagesEditor sectionId={sectionId} />
    default:
      return <GenericEditor sectionId={sectionId} type={type} />
  }
}

export function SectionManager() {
  const sections = useResumeStore((s) => s.content.sections)
  const { addSection, reorderSections } = useResumeStore()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = sections.findIndex((s) => s.id === active.id)
    const newIndex = sections.findIndex((s) => s.id === over.id)
    if (oldIndex !== -1 && newIndex !== -1) {
      reorderSections(oldIndex, newIndex)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
          <Layers className="h-4 w-4 text-amber-500" />
        </div>
        <div>
          <h3 className="text-sm font-semibold">Resume Sections</h3>
          <p className="text-xs text-muted-foreground">Drag to reorder, double-click to rename</p>
        </div>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {sections.map((section) => (
              <SortableSection
                key={section.id}
                sectionId={section.id}
                title={section.title}
                type={section.type}
                visible={section.visible}
                entryCount={section.entries.length}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <DropdownMenu>
        <DropdownMenuTrigger className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary">
          <Plus className="h-4 w-4" />
          Add Section
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[calc(100vw-3rem)] max-w-64 sm:w-64">
          {Object.entries(sectionMeta).map(([type, meta]) => {
            const IconComp = meta.icon
            return (
              <DropdownMenuItem key={type} onClick={() => addSection(type as SectionType)} className="gap-2.5">
                <div className={cn('flex h-6 w-6 items-center justify-center rounded', meta.bgColor)}>
                  <IconComp className={cn('h-3.5 w-3.5', meta.iconColor)} />
                </div>
                {meta.label}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
