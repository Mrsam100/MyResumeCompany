'use client'

import { useState, useRef, useCallback } from 'react'
import { Camera, X, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useResumeStore } from '@/stores/resume-store'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB raw input
const OUTPUT_SIZE = 200 // 200x200px output
const OUTPUT_QUALITY = 0.8

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const reader = new FileReader()

    reader.onload = () => {
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = OUTPUT_SIZE
        canvas.height = OUTPUT_SIZE

        const ctx = canvas.getContext('2d')
        if (!ctx) { reject(new Error('Canvas not supported')); return }

        // Center-crop to square
        const size = Math.min(img.width, img.height)
        const sx = (img.width - size) / 2
        const sy = (img.height - size) / 2
        ctx.drawImage(img, sx, sy, size, size, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE)

        const dataUrl = canvas.toDataURL('image/jpeg', OUTPUT_QUALITY)
        resolve(dataUrl)
      }
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = reader.result as string
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

export function PhotoUpload() {
  const photoUrl = useResumeStore((s) => s.content.personalInfo.photoUrl)
  const setPersonalInfo = useResumeStore((s) => s.setPersonalInfo)
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error('Image must be under 5MB')
      return
    }
    try {
      const dataUrl = await compressImage(file)
      setPersonalInfo('photoUrl', dataUrl)
      toast.success('Photo updated')
    } catch {
      toast.error('Failed to process image')
    }
  }, [setPersonalInfo])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleRemove = () => {
    setPersonalInfo('photoUrl', '')
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div className="flex items-center gap-3">
      {photoUrl ? (
        <div className="relative">
          <img
            src={photoUrl}
            alt="Profile"
            className="h-16 w-16 rounded-full border-2 border-muted object-cover"
          />
          <button
            onClick={handleRemove}
            className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-sm"
            aria-label="Remove photo"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className={`flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border-2 border-dashed transition-colors ${
            dragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/20 hover:border-primary/50'
          }`}
        >
          {dragging ? (
            <Upload className="h-5 w-5 text-primary" />
          ) : (
            <Camera className="h-5 w-5 text-muted-foreground/40" />
          )}
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
      />

      <div>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs"
          onClick={() => fileRef.current?.click()}
        >
          {photoUrl ? 'Change photo' : 'Upload photo'}
        </Button>
        <p className="text-[10px] text-muted-foreground">JPG, PNG. Max 5MB. Auto-cropped to square.</p>
      </div>
    </div>
  )
}
