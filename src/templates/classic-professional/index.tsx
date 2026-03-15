import type { TemplateProps } from '@/types/template'
import { TemplateHeader } from '../components/template-header'
import { TemplateSection } from '../components/template-section'
import { ExperienceEntry, EducationEntry, SkillsEntry, GenericEntry } from '../components/entry-renderers'

export function ClassicProfessional({ content, config, customColors, customFonts }: TemplateProps) {
  const colors = { ...config.defaultColors, ...customColors }
  const fonts = { ...config.defaultFonts, ...customFonts }
  const spacing = config.spacing

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100%',
        backgroundColor: colors.background,
        fontFamily: fonts.body,
        color: colors.text,
        padding: `${spacing.margins}px`,
        fontSize: '12px',
        lineHeight: 1.5,
      }}
    >
      {/* Header */}
      <TemplateHeader info={content.personalInfo} colors={colors} fonts={fonts} layout="centered" />

      {/* Summary */}
      {content.personalInfo.summary && (
        <div style={{ marginTop: `${spacing.sectionGap}px` }}>
          <div style={{ borderBottom: `1.5px solid ${colors.primary}`, paddingBottom: '3px', marginBottom: '6px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: colors.primary, fontFamily: fonts.heading }}>
              Professional Summary
            </h2>
          </div>
          <p style={{ fontSize: '11px', color: colors.text, lineHeight: 1.6 }}>
            {content.personalInfo.summary}
          </p>
        </div>
      )}

      {/* Sections */}
      {content.sections
        .filter((s) => s.visible && s.entries.length > 0)
        .map((section) => (
          <TemplateSection
            key={section.id}
            section={section}
            colors={colors}
            fonts={fonts}
            spacing={spacing}
            renderEntry={(entry) => {
              switch (section.type) {
                case 'experience':
                  return <ExperienceEntry entry={entry} colors={colors} fonts={fonts} />
                case 'education':
                  return <EducationEntry entry={entry} colors={colors} fonts={fonts} />
                case 'skills':
                  return <SkillsEntry entry={entry} colors={colors} fonts={fonts} />
                default:
                  return <GenericEntry entry={entry} colors={colors} fonts={fonts} />
              }
            }}
          />
        ))}
    </div>
  )
}
