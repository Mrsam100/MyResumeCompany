import type { TemplateProps } from '@/types/template'
import { TemplateSection } from '../components/template-section'
import { ExperienceEntry, EducationEntry, SkillsEntry, GenericEntry } from '../components/entry-renderers'

export function Developer({ content, config, customColors, customFonts }: TemplateProps) {
  const colors = { ...config.defaultColors, ...customColors }
  const fonts = { ...config.defaultFonts, ...customFonts }
  const spacing = config.spacing

  return (
    <div style={{ width: '100%', minHeight: '100%', backgroundColor: colors.background, fontFamily: fonts.body, color: colors.text, padding: `${spacing.margins}px`, fontSize: '12px', lineHeight: 1.5 }}>
      {/* Terminal-style header */}
      <div style={{ backgroundColor: `${colors.primary}15`, borderRadius: '6px', padding: '16px', border: `1px solid ${colors.primary}30` }}>
        {content.personalInfo.fullName && (
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: colors.primary, fontFamily: fonts.heading, lineHeight: 1.2 }}>
            <span style={{ color: colors.textLight, fontFamily: fonts.accent ?? fonts.heading }}>$ </span>
            {content.personalInfo.fullName}
          </h1>
        )}
        {content.personalInfo.title && (
          <p style={{ fontSize: '13px', color: colors.textLight, marginTop: '2px', fontFamily: fonts.accent ?? fonts.body }}>
            {`// ${content.personalInfo.title}`}
          </p>
        )}
        <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '10px', color: colors.textLight }}>
          {[content.personalInfo.email, content.personalInfo.phone, content.personalInfo.location, content.personalInfo.linkedin, content.personalInfo.website].filter((v) => v?.trim()).map((v, i) => (
            <span key={i} style={{ backgroundColor: `${colors.primary}20`, padding: '2px 8px', borderRadius: '3px', fontFamily: fonts.accent ?? fonts.body }}>{v}</span>
          ))}
        </div>
      </div>

      {content.personalInfo.summary && (
        <div style={{ marginTop: `${spacing.sectionGap}px` }}>
          <p style={{ fontSize: '11px', color: colors.textLight, lineHeight: 1.7, fontFamily: fonts.body }}>
            {content.personalInfo.summary}
          </p>
        </div>
      )}

      {/* Reorder: Skills first for dev template */}
      {[...content.sections].sort((a, b) => {
        const order: Record<string, number> = { skills: 0, projects: 1, experience: 2, education: 3 }
        return (order[a.type] ?? 4) - (order[b.type] ?? 4)
      }).filter((s) => s.visible && s.entries.length > 0).map((section) => (
        <TemplateSection key={section.id} section={section} colors={colors} fonts={{ ...fonts, heading: fonts.accent ?? fonts.heading }} spacing={spacing}
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
