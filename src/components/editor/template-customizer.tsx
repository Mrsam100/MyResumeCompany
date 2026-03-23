'use client'

import { useState } from 'react'
import { Palette, Type, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useResumeStore } from '@/stores/resume-store'
import { getTemplateConfig } from '@/templates/registry'
import { FormatSelector } from './format-selector'
import type { TemplateColors } from '@/types/template'

// ── Color Presets ──

const COLOR_PRESETS: { name: string; colors: Partial<TemplateColors> }[] = [
  { name: 'Navy', colors: { primary: '#1e3a5f', secondary: '#4a6fa5' } },
  { name: 'Emerald', colors: { primary: '#065f46', secondary: '#10b981' } },
  { name: 'Royal Blue', colors: { primary: '#1e40af', secondary: '#3b82f6' } },
  { name: 'Crimson', colors: { primary: '#991b1b', secondary: '#ef4444' } },
  { name: 'Purple', colors: { primary: '#6b21a8', secondary: '#a855f7' } },
  { name: 'Teal', colors: { primary: '#0d9488', secondary: '#2dd4bf' } },
  { name: 'Slate', colors: { primary: '#334155', secondary: '#64748b' } },
  { name: 'Charcoal & Gold', colors: { primary: '#2d2d2d', secondary: '#c9a84c' } },
  { name: 'Ocean', colors: { primary: '#0c4a6e', secondary: '#0ea5e9' } },
  { name: 'Rose', colors: { primary: '#9f1239', secondary: '#fb7185' } },
  { name: 'Forest', colors: { primary: '#14532d', secondary: '#22c55e' } },
  { name: 'Midnight', colors: { primary: '#0f172a', secondary: '#3b82f6' } },
]

// ── Font Options ──

const FONT_OPTIONS = [
  { value: 'Inter, sans-serif', label: 'Inter' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: 'Times New Roman, serif', label: 'Times New Roman' },
  { value: 'Helvetica, sans-serif', label: 'Helvetica' },
  { value: 'Palatino, serif', label: 'Palatino' },
  { value: 'Garamond, serif', label: 'Garamond' },
  { value: 'JetBrains Mono, monospace', label: 'JetBrains Mono' },
  { value: 'Cambria, serif', label: 'Cambria' },
  { value: 'Calibri, sans-serif', label: 'Calibri' },
  { value: 'Roboto, sans-serif', label: 'Roboto' },
  { value: 'Lato, sans-serif', label: 'Lato' },
]

// ── Color Swatch Input ──

function ColorInput({
  label,
  value,
  defaultValue,
  onChange,
}: {
  label: string
  value: string | undefined
  defaultValue: string
  onChange: (hex: string) => void
}) {
  const display = value || defaultValue
  return (
    <div className="flex items-center gap-2">
      <label className="relative cursor-pointer">
        <input
          type="color"
          value={display}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
        <div
          className="h-7 w-7 rounded-md border shadow-sm"
          style={{ backgroundColor: display }}
        />
      </label>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}

// ── Main Component ──

export function TemplateCustomizer() {
  const [expanded, setExpanded] = useState(false)
  const templateId = useResumeStore((s) => s.templateId)
  const customColors = useResumeStore((s) => s.content.customColors)
  const customFonts = useResumeStore((s) => s.content.customFonts)
  const setCustomColors = useResumeStore((s) => s.setCustomColors)
  const setCustomFont = useResumeStore((s) => s.setCustomFont)
  const resetCustomColors = useResumeStore((s) => s.resetCustomColors)
  const resetCustomFonts = useResumeStore((s) => s.resetCustomFonts)

  const config = getTemplateConfig(templateId)
  const hasSidebar = config.layout === 'sidebar-left' || config.layout === 'sidebar-right'

  const headingFont = customFonts?.heading || config.defaultFonts.heading
  const bodyFont = customFonts?.body || config.defaultFonts.body

  return (
    <div className="space-y-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between rounded-lg border bg-muted/30 px-3 py-2.5 text-left transition-colors hover:bg-muted/50"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
            <Palette className="h-3.5 w-3.5 text-primary" />
          </div>
          <div>
            <p className="text-xs font-semibold">Customize Template</p>
            <p className="text-[10px] text-muted-foreground">Colors & fonts</p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {expanded && (
        <div className="space-y-4 rounded-lg border bg-card p-3">
          {/* Resume Format */}
          <FormatSelector />

          {/* Color Presets */}
          <div>
            <p className="mb-2 text-xs font-medium">Quick Colors</p>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => setCustomColors(preset.colors)}
                  className="group relative"
                  title={preset.name}
                >
                  <div className="flex h-8 sm:h-7 w-full overflow-hidden rounded-md border shadow-sm transition-transform group-hover:scale-110">
                    <div className="flex-1" style={{ backgroundColor: preset.colors.primary }} />
                    <div className="flex-1" style={{ backgroundColor: preset.colors.secondary }} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Individual Color Pickers */}
          <div>
            <p className="mb-2 text-xs font-medium">Fine-tune Colors</p>
            <div className="grid grid-cols-2 gap-2">
              <ColorInput
                label="Primary"
                value={customColors?.primary}
                defaultValue={config.defaultColors.primary}
                onChange={(hex) => setCustomColors({ primary: hex })}
              />
              <ColorInput
                label="Secondary"
                value={customColors?.secondary}
                defaultValue={config.defaultColors.secondary}
                onChange={(hex) => setCustomColors({ secondary: hex })}
              />
              <ColorInput
                label="Text"
                value={customColors?.text}
                defaultValue={config.defaultColors.text}
                onChange={(hex) => setCustomColors({ text: hex })}
              />
              <ColorInput
                label="Text Light"
                value={customColors?.textLight}
                defaultValue={config.defaultColors.textLight}
                onChange={(hex) => setCustomColors({ textLight: hex })}
              />
              {hasSidebar && (
                <>
                  <ColorInput
                    label="Sidebar"
                    value={customColors?.sidebarBg}
                    defaultValue={config.defaultColors.sidebarBg || '#2d2d2d'}
                    onChange={(hex) => setCustomColors({ sidebarBg: hex })}
                  />
                  <ColorInput
                    label="Sidebar Text"
                    value={customColors?.sidebarText}
                    defaultValue={config.defaultColors.sidebarText || '#ffffff'}
                    onChange={(hex) => setCustomColors({ sidebarText: hex })}
                  />
                </>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 h-7 gap-1 text-[10px] text-muted-foreground"
              onClick={resetCustomColors}
            >
              <RotateCcw className="h-3 w-3" /> Reset colors
            </Button>
          </div>

          {/* Font Selectors */}
          <div>
            <div className="mb-2 flex items-center gap-1.5">
              <Type className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="text-xs font-medium">Fonts</p>
            </div>
            <div className="space-y-2">
              <div>
                <p className="mb-1 text-[10px] text-muted-foreground">Headings</p>
                <Select
                  value={headingFont}
                  onValueChange={(val) => { if (val) setCustomFont('heading', val) }}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_OPTIONS.map((f) => (
                      <SelectItem key={f.value} value={f.value}>
                        <span style={{ fontFamily: f.value }}>{f.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="mb-1 text-[10px] text-muted-foreground">Body</p>
                <Select
                  value={bodyFont}
                  onValueChange={(val) => { if (val) setCustomFont('body', val) }}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_OPTIONS.map((f) => (
                      <SelectItem key={f.value} value={f.value}>
                        <span style={{ fontFamily: f.value }}>{f.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1 text-[10px] text-muted-foreground"
                onClick={resetCustomFonts}
              >
                <RotateCcw className="h-3 w-3" /> Reset fonts
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
