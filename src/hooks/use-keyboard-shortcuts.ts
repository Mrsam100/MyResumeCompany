'use client'

import { useEffect } from 'react'
import { useResumeStore } from '@/stores/resume-store'

export function useKeyboardShortcuts(save: () => void) {
  const undo = useResumeStore((s) => s.undo)
  const redo = useResumeStore((s) => s.redo)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const isCtrl = e.ctrlKey || e.metaKey
      if (!isCtrl) return

      const target = e.target as HTMLElement
      const isInputField =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable

      // Ctrl+S: always save (even from input fields)
      if (e.key === 's') {
        e.preventDefault()
        save()
        return
      }

      // Undo/Redo: skip if user is in an input field (let browser handle it)
      if (isInputField) return

      if (e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      }

      if (e.key === 'z' && e.shiftKey) {
        e.preventDefault()
        redo()
      }

      if (e.key === 'y') {
        e.preventDefault()
        redo()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [save, undo, redo])
}
