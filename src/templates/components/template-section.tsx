import type { ResumeSection, TemplateColors, TemplateFonts, TemplateSpacing } from '@/types'

interface TemplateSectionProps {
  section: ResumeSection
  colors: TemplateColors
  fonts: TemplateFonts
  spacing: TemplateSpacing
  renderEntry: (entry: ResumeSection['entries'][0], index: number) => React.ReactNode
}

export function TemplateSection({ section, colors, fonts, spacing, renderEntry }: TemplateSectionProps) {
  if (!section.visible) return null

  return (
    <div style={{ marginTop: `${spacing.sectionGap}px` }}>
      {/* Section title */}
      <div style={{ borderBottom: `1.5px solid ${colors.primary}`, paddingBottom: '3px', marginBottom: `${spacing.entryGap}px` }}>
        <h2 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: colors.primary, fontFamily: fonts.heading }}>
          {section.title}
        </h2>
      </div>

      {/* Entries — each renderer returns null if entry is empty */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: `${spacing.entryGap}px` }}>
        {section.entries.map((entry, i) => {
          const rendered = renderEntry(entry, i)
          if (!rendered) return null
          return <div key={entry.id}>{rendered}</div>
        })}
      </div>
    </div>
  )
}
