import type { TemplateProps } from '@/types/template'
import { TemplateSection } from '../components/template-section'
import { ExperienceEntry, EducationEntry, SkillsEntry, GenericEntry } from '../components/entry-renderers'
import { Mail, Phone, MapPin } from 'lucide-react'

export function CreativeBold({ content, config, customColors, customFonts }: TemplateProps) {
  const colors = { ...config.defaultColors, ...customColors }
  const fonts = { ...config.defaultFonts, ...customFonts }
  const spacing = config.spacing
  const { personalInfo } = content

  return (
    <div style={{ width: '100%', minHeight: '100%', backgroundColor: colors.background, fontFamily: fonts.body, fontSize: '12px', lineHeight: 1.5 }}>
      {/* Full-width colored header */}
      <div style={{ backgroundColor: colors.primary, color: '#ffffff', padding: `${spacing.margins}px`, paddingTop: `${spacing.margins + 8}px`, paddingBottom: `${spacing.margins + 8}px` }}>
        {personalInfo.fullName && <h1 style={{ fontSize: '26px', fontWeight: 800, fontFamily: fonts.heading, lineHeight: 1.1 }}>{personalInfo.fullName}</h1>}
        {personalInfo.title && <p style={{ fontSize: '14px', color: `${colors.secondary}`, marginTop: '4px' }}>{personalInfo.title}</p>}
        <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '14px', fontSize: '10px', opacity: 0.8 }}>
          {[{ v: personalInfo.email, I: Mail }, { v: personalInfo.phone, I: Phone }, { v: personalInfo.location, I: MapPin }].filter((c) => c.v?.trim()).map(({ v, I: Icon }, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Icon size={10} />{v}</span>
          ))}
        </div>
      </div>

      <div style={{ padding: `${spacing.margins}px`, color: colors.text }}>
        {personalInfo.summary && (
          <p style={{ fontSize: '11px', color: colors.textLight, lineHeight: 1.7, marginBottom: `${spacing.sectionGap}px` }}>{personalInfo.summary}</p>
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
    </div>
  )
}
