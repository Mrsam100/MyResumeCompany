import type { TemplateProps } from '@/types/template'
import { SidebarLayout } from '../components/sidebar-layout'
import { TemplateSection } from '../components/template-section'
import { ExperienceEntry, EducationEntry, SkillsEntry, GenericEntry } from '../components/entry-renderers'
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react'

export function NoirEdge({ content, config, customColors, customFonts }: TemplateProps) {
  const colors = { ...config.defaultColors, ...customColors }
  const fonts = { ...config.defaultFonts, ...customFonts }
  const spacing = config.spacing
  const { personalInfo } = content
  const sidebarText = colors.sidebarText ?? '#e2e8f0'
  const sidebarMuted = `${sidebarText}77`

  const contactItems = [
    { v: personalInfo.email, I: Mail }, { v: personalInfo.phone, I: Phone },
    { v: personalInfo.location, I: MapPin }, { v: personalInfo.linkedin, I: Linkedin },
    { v: personalInfo.website ?? personalInfo.portfolio, I: Globe },
  ].filter((c) => c.v?.trim())

  const sidebarSections = content.sections.filter((s) => s.visible && s.entries.length > 0 && ['skills', 'languages', 'interests', 'certifications'].includes(s.type))
  const mainSections = content.sections.filter((s) => s.visible && s.entries.length > 0 && !['skills', 'languages', 'interests', 'certifications'].includes(s.type))

  const sidebar = (
    <div style={{ fontFamily: fonts.body, fontSize: '11px' }}>
      {personalInfo.fullName && <h1 style={{ fontSize: '22px', fontWeight: 800, color: sidebarText, fontFamily: fonts.heading, letterSpacing: '-1px', lineHeight: 1.1 }}>{personalInfo.fullName}</h1>}
      {personalInfo.title && <p style={{ fontSize: '11px', color: colors.secondary, marginTop: '6px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 500 }}>{personalInfo.title}</p>}
      {contactItems.length > 0 && (
        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {contactItems.map(({ v, I: Icon }, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: sidebarMuted, fontSize: '10px' }}><Icon size={10} />{v}</span>
          ))}
        </div>
      )}
      {sidebarSections.map((section) => (
        <div key={section.id} style={{ marginTop: '20px' }}>
          <h2 style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: colors.secondary, marginBottom: '8px', borderBottom: `1px solid ${sidebarMuted}`, paddingBottom: '4px' }}>{section.title}</h2>
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
        <p style={{ fontSize: '11px', color: colors.textLight, lineHeight: 1.7, marginBottom: `${spacing.sectionGap}px` }}>{personalInfo.summary}</p>
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
