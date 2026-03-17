import { create } from 'zustand'
import { nanoid } from 'nanoid'
import type { ResumeContent, PersonalInfo, ResumeSection, SectionType } from '@/types/resume'

// ==================== History for undo/redo ====================

interface HistoryState {
  past: ResumeContent[]
  future: ResumeContent[]
}

const MAX_HISTORY = 50

// ==================== Store State ====================

interface ResumeState {
  // Resume metadata
  resumeId: string | null
  title: string
  templateId: string

  // Resume content
  content: ResumeContent

  // Status
  isDirty: boolean
  isSaving: boolean
  lastSavedAt: Date | null
  saveError: string | null

  // History
  history: HistoryState

  // ── Actions: Lifecycle ──
  loadResume: (data: {
    id: string
    title: string
    templateId: string
    content: ResumeContent
    targetJobDescription?: string | null
  }) => void
  resetStore: () => void

  // ── Actions: Title & Template ──
  setTitle: (title: string) => void
  setTemplate: (templateId: string) => void

  // ── Actions: Personal Info ──
  setPersonalInfo: <K extends keyof PersonalInfo>(field: K, value: PersonalInfo[K]) => void
  setPersonalInfoBulk: (info: Partial<PersonalInfo>) => void

  // ── Actions: Sections ──
  addSection: (type: SectionType, title?: string) => void
  removeSection: (sectionId: string) => void
  reorderSections: (fromIndex: number, toIndex: number) => void
  renameSection: (sectionId: string, title: string) => void
  toggleSectionVisibility: (sectionId: string) => void

  // ── Actions: Entries ──
  addEntry: (sectionId: string) => void
  removeEntry: (sectionId: string, entryId: string) => void
  updateEntryField: (sectionId: string, entryId: string, field: string, value: string) => void
  reorderEntries: (sectionId: string, fromIndex: number, toIndex: number) => void
  setEntryDates: (
    sectionId: string,
    entryId: string,
    dates: { startDate?: string; endDate?: string; current?: boolean },
  ) => void

  // ── Actions: Bullet Points ──
  addBulletPoint: (sectionId: string, entryId: string) => void
  removeBulletPoint: (sectionId: string, entryId: string, bulletIndex: number) => void
  updateBulletPoint: (
    sectionId: string,
    entryId: string,
    bulletIndex: number,
    value: string,
  ) => void
  reorderBulletPoints: (
    sectionId: string,
    entryId: string,
    fromIndex: number,
    toIndex: number,
  ) => void
  setBulletPoints: (sectionId: string, entryId: string, bullets: string[]) => void

  // ── Actions: Undo/Redo ──
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean

  // ── Actions: Save Status ──
  markSaving: () => void
  markSaved: () => void
  markSaveError: (error: string) => void

  // ── Actions: Job Description (for live ATS) ──
  targetJobDescription: string | null
  setTargetJobDescription: (jd: string | null) => void
}

// ==================== Default Content ====================

const defaultContent: ResumeContent = {
  personalInfo: {
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
  },
  sections: [],
}

// ==================== Helpers ====================

function pushHistory(state: ResumeState): HistoryState {
  const past = [...state.history.past, state.content].slice(-MAX_HISTORY)
  return { past, future: [] }
}

function updateSection(
  content: ResumeContent,
  sectionId: string,
  updater: (section: ResumeSection) => ResumeSection,
): ResumeContent {
  return {
    ...content,
    sections: content.sections.map((s) => (s.id === sectionId ? updater(s) : s)),
  }
}

function arrayMove<T>(arr: T[], from: number, to: number): T[] {
  if (from < 0 || from >= arr.length || to < 0 || to >= arr.length || from === to) {
    return arr
  }
  const result = [...arr]
  const [item] = result.splice(from, 1)
  result.splice(to, 0, item)
  return result
}

// ==================== Store ====================

export const useResumeStore = create<ResumeState>((set, get) => ({
  // Initial state
  resumeId: null,
  title: 'Untitled Resume',
  templateId: 'classic-professional',
  content: defaultContent,
  isDirty: false,
  isSaving: false,
  lastSavedAt: null,
  saveError: null,
  history: { past: [], future: [] },
  targetJobDescription: null,

  // ── Lifecycle ──

  loadResume: (data) =>
    set({
      resumeId: data.id,
      title: data.title,
      templateId: data.templateId,
      content: data.content,
      targetJobDescription: data.targetJobDescription ?? null,
      isDirty: false,
      isSaving: false,
      lastSavedAt: null,
      saveError: null,
      history: { past: [], future: [] },
    }),

  resetStore: () =>
    set({
      resumeId: null,
      title: 'Untitled Resume',
      templateId: 'classic-professional',
      content: defaultContent,
      targetJobDescription: null,
      isDirty: false,
      isSaving: false,
      lastSavedAt: null,
      saveError: null,
      history: { past: [], future: [] },
    }),

  // ── Title & Template ──

  setTitle: (title) => set({ title, isDirty: true }),

  setTemplate: (templateId) => set({ templateId, isDirty: true }),

  // ── Personal Info ──

  setPersonalInfo: (field, value) =>
    set((state) => ({
      content: {
        ...state.content,
        personalInfo: { ...state.content.personalInfo, [field]: value },
      },
      isDirty: true,
      // No history push — field-level typing shouldn't create undo steps
    })),

  setPersonalInfoBulk: (info) =>
    set((state) => ({
      content: {
        ...state.content,
        personalInfo: { ...state.content.personalInfo, ...info },
      },
      isDirty: true,
      history: pushHistory(state),
    })),

  // ── Sections ──

  addSection: (type, title) =>
    set((state) => {
      const defaultTitles: Record<SectionType, string> = {
        experience: 'Work Experience',
        education: 'Education',
        skills: 'Skills',
        projects: 'Projects',
        certifications: 'Certifications',
        awards: 'Awards',
        languages: 'Languages',
        volunteer: 'Volunteer Experience',
        publications: 'Publications',
        interests: 'Interests',
        references: 'References',
        custom: 'Custom Section',
      }

      const newSection: ResumeSection = {
        id: nanoid(10),
        type,
        title: title ?? defaultTitles[type],
        visible: true,
        entries: [],
      }

      return {
        content: {
          ...state.content,
          sections: [...state.content.sections, newSection],
        },
        isDirty: true,
        history: pushHistory(state),
      }
    }),

  removeSection: (sectionId) =>
    set((state) => ({
      content: {
        ...state.content,
        sections: state.content.sections.filter((s) => s.id !== sectionId),
      },
      isDirty: true,
      history: pushHistory(state),
    })),

  reorderSections: (fromIndex, toIndex) =>
    set((state) => ({
      content: {
        ...state.content,
        sections: arrayMove(state.content.sections, fromIndex, toIndex),
      },
      isDirty: true,
      history: pushHistory(state),
    })),

  renameSection: (sectionId, title) =>
    set((state) => ({
      content: updateSection(state.content, sectionId, (s) => ({ ...s, title })),
      isDirty: true,
    })),

  toggleSectionVisibility: (sectionId) =>
    set((state) => ({
      content: updateSection(state.content, sectionId, (s) => ({
        ...s,
        visible: !s.visible,
      })),
      isDirty: true,
      history: pushHistory(state),
    })),

  // ── Entries ──

  addEntry: (sectionId) =>
    set((state) => ({
      content: updateSection(state.content, sectionId, (s) => ({
        ...s,
        entries: [
          ...s.entries,
          { id: nanoid(10), fields: {}, bulletPoints: [] },
        ],
      })),
      isDirty: true,
      history: pushHistory(state),
    })),

  removeEntry: (sectionId, entryId) =>
    set((state) => ({
      content: updateSection(state.content, sectionId, (s) => ({
        ...s,
        entries: s.entries.filter((e) => e.id !== entryId),
      })),
      isDirty: true,
      history: pushHistory(state),
    })),

  updateEntryField: (sectionId, entryId, field, value) =>
    set((state) => ({
      content: updateSection(state.content, sectionId, (s) => ({
        ...s,
        entries: s.entries.map((e) =>
          e.id === entryId ? { ...e, fields: { ...e.fields, [field]: value } } : e,
        ),
      })),
      isDirty: true,
    })),

  reorderEntries: (sectionId, fromIndex, toIndex) =>
    set((state) => ({
      content: updateSection(state.content, sectionId, (s) => ({
        ...s,
        entries: arrayMove(s.entries, fromIndex, toIndex),
      })),
      isDirty: true,
      history: pushHistory(state),
    })),

  setEntryDates: (sectionId, entryId, dates) =>
    set((state) => ({
      content: updateSection(state.content, sectionId, (s) => ({
        ...s,
        entries: s.entries.map((e) => (e.id === entryId ? { ...e, ...dates } : e)),
      })),
      isDirty: true,
    })),

  // ── Bullet Points ──

  addBulletPoint: (sectionId, entryId) =>
    set((state) => ({
      content: updateSection(state.content, sectionId, (s) => ({
        ...s,
        entries: s.entries.map((e) =>
          e.id === entryId ? { ...e, bulletPoints: [...e.bulletPoints, ''] } : e,
        ),
      })),
      isDirty: true,
      history: pushHistory(state),
    })),

  removeBulletPoint: (sectionId, entryId, bulletIndex) =>
    set((state) => ({
      content: updateSection(state.content, sectionId, (s) => ({
        ...s,
        entries: s.entries.map((e) =>
          e.id === entryId
            ? { ...e, bulletPoints: e.bulletPoints.filter((_, i) => i !== bulletIndex) }
            : e,
        ),
      })),
      isDirty: true,
      history: pushHistory(state),
    })),

  updateBulletPoint: (sectionId, entryId, bulletIndex, value) =>
    set((state) => ({
      content: updateSection(state.content, sectionId, (s) => ({
        ...s,
        entries: s.entries.map((e) =>
          e.id === entryId
            ? {
                ...e,
                bulletPoints: e.bulletPoints.map((b, i) => (i === bulletIndex ? value : b)),
              }
            : e,
        ),
      })),
      isDirty: true,
    })),

  reorderBulletPoints: (sectionId, entryId, fromIndex, toIndex) =>
    set((state) => ({
      content: updateSection(state.content, sectionId, (s) => ({
        ...s,
        entries: s.entries.map((e) =>
          e.id === entryId
            ? { ...e, bulletPoints: arrayMove(e.bulletPoints, fromIndex, toIndex) }
            : e,
        ),
      })),
      isDirty: true,
      history: pushHistory(state),
    })),

  setBulletPoints: (sectionId, entryId, bullets) =>
    set((state) => ({
      content: updateSection(state.content, sectionId, (s) => ({
        ...s,
        entries: s.entries.map((e) =>
          e.id === entryId ? { ...e, bulletPoints: bullets } : e,
        ),
      })),
      isDirty: true,
      history: pushHistory(state),
    })),

  // ── Undo/Redo ──

  undo: () =>
    set((state) => {
      if (state.history.past.length === 0) return state
      const previous = state.history.past[state.history.past.length - 1]
      return {
        content: previous,
        isDirty: true,
        history: {
          past: state.history.past.slice(0, -1),
          future: [state.content, ...state.history.future].slice(0, MAX_HISTORY),
        },
      }
    }),

  redo: () =>
    set((state) => {
      if (state.history.future.length === 0) return state
      const next = state.history.future[0]
      return {
        content: next,
        isDirty: true,
        history: {
          past: [...state.history.past, state.content],
          future: state.history.future.slice(1),
        },
      }
    }),

  canUndo: () => get().history.past.length > 0,
  canRedo: () => get().history.future.length > 0,

  // ── Save Status ──

  markSaving: () => set({ isSaving: true, saveError: null }),
  markSaved: () => set({ isSaving: false, isDirty: false, lastSavedAt: new Date(), saveError: null }),
  markSaveError: (error) => set({ isSaving: false, saveError: error }),

  // ── Job Description (for live ATS) ──

  setTargetJobDescription: (jd) => set({ targetJobDescription: jd, isDirty: true }),
}))
