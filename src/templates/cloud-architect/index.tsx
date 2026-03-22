import type { TemplateProps } from '@/types/template'
import { SidebarLayout } from '../components/sidebar-layout'
import { TemplateSection } from '../components/template-section'
import { ExperienceEntry, EducationEntry, SkillsEntry, GenericEntry } from '../components/entry-renderers'
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react'

export function CloudArchitect({ content, config, customColors, customFonts }: TemplateProps) {
  const colors = { ...config.defaultColors, ...customColors }
  const fonts = { ...config.defaultFonts, ...customFonts }
  const spacing = config.spacing
  const { personalInfo } = content
  const sidebarText = colors.sidebarText ?? '#e2e8f0'
  const sidebarMuted = `${sidebarText}88`

  const contactItems = [
    { v: personalInfo.email, I: Mail }, { v: personalInfo.phone, I: Phone },
    { v: personalInfo.location, I: MapPin }, { v: personalInfo.linkedin, I: Linkedin },
    { v: personalInfo.website ?? personalInfo.portfolio, I: Globe },
  ].filter((c) => c.v?.trim())

  const sidebarSections = content.sections.filter((s) => s.visible && s.entries.length > 0 && ['skills', 'languages', 'certifications'].includes(s.type))
  const mainSections = content.sections.filter((s) => s.visible && s.entries.length > 0 && !['skills', 'languages', 'certifications'].includes(s.type))

  const sidebar = (
    <div style={{ fontFamily: fonts.body, fontSize: '11px' }}>
      {personalInfo.fullName && <h1 style={{ fontSize: '18px', fontWeight: 700, color: sidebarText, fontFamily: fonts.heading }}>{personalInfo.fullName}</h1>}
      {personalInfo.title && <p style={{ fontSize: '10px', color: colors.secondary, marginTop: '4px', fontFamily: fonts.accent ?? fonts.body }}>{personalInfo.title}</p>}
      {contactItems.length > 0 && (
        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {contactItems.map(({ v, I: Icon }, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: sidebarMuted, fontSize: '10px', fontFamily: fonts.accent ?? fonts.body }}><Icon size={10} />{v}</span>
          ))}
        </div>
      )}
      {sidebarSections.map((section) => (
        <div key={section.id} style={{ marginTop: '18px' }}>
          <h2 style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: colors.secondary, marginBottom: '6px' }}>{section.title}</h2>
          {section.entries.map((entry) => (
            <div key={entry.id} style={{ marginBottom: '3px' }}>
              <SkillsEntry entry={entry} colors={{ ...colors, text: sidebarText, textLight: sidebarMuted }} fonts={fonts} />
            </div>
          ))}
        </div>
      ))}
    </div>
  )

  const main = (
    <div style={{ fontFamily: fonts.body, fontSize: '12px' }}>
      {personalInfo.summary && (
        <p style={{ fontSize: '11px', color: colors.textLight, lineHeight: 1.6, marginBottom: `${spacing.sectionGap}px` }}>{personalInfo.summary}</p>
      )}
      {mainSections.map((section) => (
        <TemplateSection key={section.id} section={section} colors={colors} fonts={fonts} spacing={spacing}
          renderEntry={(entry) => {
            switch (section.type) {
              case 'experience': return <ExperienceEntry entry={entry} colors={colors} fonts={fonts} />
              case 'education': return <EducationEntry entry={entry} colors={colors} fonts={fonts} />
              default: return <GenericEntry entry={entry} colors={colors} fonts={fonts} />
            }
          }}
        />
      ))}
    </div>
  )

  return <SidebarLayout colors={colors} fonts={fonts} spacing={spacing} sidebar={sidebar} main={main} side="left" />
}
