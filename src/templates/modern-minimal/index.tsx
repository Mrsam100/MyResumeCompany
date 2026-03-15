import type { TemplateProps } from '@/types/template'
import { TemplateHeader } from '../components/template-header'
import { TemplateSection } from '../components/template-section'
import { ExperienceEntry, EducationEntry, SkillsEntry, GenericEntry } from '../components/entry-renderers'

export function ModernMinimal({ content, config, customColors, customFonts }: TemplateProps) {
  const colors = { ...config.defaultColors, ...customColors }
  const fonts = { ...config.defaultFonts, ...customFonts }
  const spacing = config.spacing

  return (
    <div style={{ width: '100%', minHeight: '100%', backgroundColor: colors.background, fontFamily: fonts.body, color: colors.text, padding: `${spacing.margins}px`, fontSize: '12px', lineHeight: 1.5 }}>
      {/* Accent bar */}
      <div style={{ width: '40px', height: '4px', backgroundColor: colors.primary, marginBottom: '16px', borderRadius: '2px' }} />

      <TemplateHeader info={content.personalInfo} colors={colors} fonts={fonts} layout="left" />

      {content.personalInfo.summary && (
        <div style={{ marginTop: `${spacing.sectionGap + 4}px` }}>
          <p style={{ fontSize: '11px', color: colors.textLight, lineHeight: 1.7, borderLeft: `2px solid ${colors.primary}20`, paddingLeft: '12px' }}>
            {content.personalInfo.summary}
          </p>
        </div>
      )}

      {content.sections.filter((s) => s.visible && s.entries.length > 0).map((section) => (
        <TemplateSection key={section.id} section={section} colors={colors} fonts={fonts} spacing={spacing}
          renderEntry={(entry) => {
            switch (section.type) {
              case 'experience': return <ExperienceEntry entry={entry} colors={colors} fonts={fonts} />
              case 'education': return <EducationEntry entry={entry} colors={colors} fonts={fonts} />
              case 'skills': return <SkillsEntry entry={entry} colors={colors} fonts={fonts} />
              default: return <GenericEntry entry={entry} colors={colors} fonts={fonts} />
            }
          }}
        />
      ))}
    </div>
  )
}
