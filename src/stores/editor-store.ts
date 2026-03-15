import { create } from 'zustand'

interface EditorState {
  // Panel
  activeSection: string | null
  activeEntry: string | null

  // Preview
  zoom: number
  showPreview: boolean // mobile toggle

  // Actions
  setActiveSection: (id: string | null) => void
  setActiveEntry: (id: string | null) => void
  setZoom: (zoom: number) => void
  togglePreview: () => void
}

export const useEditorStore = create<EditorState>((set) => ({
  activeSection: null,
  activeEntry: null,
  zoom: 100,
  showPreview: false,

  setActiveSection: (id) => set({ activeSection: id, activeEntry: null }),
  setActiveEntry: (id) => set({ activeEntry: id }),
  setZoom: (zoom) => set({ zoom: Math.min(200, Math.max(25, zoom)) }),
  togglePreview: () => set((s) => ({ showPreview: !s.showPreview })),
}))
