import type { TemplateProps } from '@/types/template'
import { SidebarLayout } from '../components/sidebar-layout'
import { TemplateSection } from '../components/template-section'
import { ExperienceEntry, EducationEntry, SkillsEntry, GenericEntry } from '../components/entry-renderers'
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react'

export function Blueprint({ content, config, customColors, customFonts }: TemplateProps) {
  const colors = { ...config.defaultColors, ...customColors }
  const fonts = { ...config.defaultFonts, ...customFonts }
  const spacing = config.spacing
  const { personalInfo } = content
  const sidebarText = colors.sidebarText ?? '#ffffff'
  const sidebarMuted = `${sidebarText}99`

  const contactItems = [
    { v: personalInfo.email, I: Mail }, { v: personalInfo.phone, I: Phone },
    { v: personalInfo.location, I: MapPin }, { v: personalInfo.linkedin, I: Linkedin },
    { v: personalInfo.website ?? personalInfo.portfolio, I: Globe },
  ].filter((c) => c.v?.trim())

  const sidebarSections = content.sections.filter((s) => s.visible && s.entries.length > 0 && ['skills', 'languages', 'interests', 'certifications'].includes(s.type))
  const mainSections = content.sections.filter((s) => s.visible && s.entries.length > 0 && !['skills', 'languages', 'interests', 'certifications'].includes(s.type))

  const sidebar = (
    <div style={{ fontFamily: fonts.body, fontSize: '11px' }}>
      {personalInfo.fullName && <h1 style={{ fontSize: '20px', fontWeight: 700, color: sidebarText, fontFamily: fonts.heading, letterSpacing: '-0.5px' }}>{personalInfo.fullName}</h1>}
      {personalInfo.title && <p style={{ fontSize: '11px', color: colors.secondary, marginTop: '4px', fontWeight: 500 }}>{personalInfo.title}</p>}
      {contactItems.length > 0 && (
        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {contactItems.map(({ v, I: Icon }, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: sidebarMuted, fontSize: '10px' }}><Icon size={10} />{v}</span>
          ))}
        </div>
      )}
      {personalInfo.summary && (
        <div style={{ marginTop: '20px' }}>
          <h2 style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: colors.secondary, marginBottom: '8px' }}>Profile</h2>
          <p style={{ fontSize: '10px', color: sidebarMuted, lineHeight: 1.6 }}>{personalInfo.summary}</p>
        </div>
      )}
      {sidebarSections.map((section) => (
        <div key={section.id} style={{ marginTop: '20px' }}>
          <h2 style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: colors.secondary, marginBottom: '8px' }}>{section.title}</h2>
          {section.entries.map((entry) => (
            <div key={entry.id} style={{ marginBottom: '4px' }}>
              <SkillsEntry entry={entry} colors={{ ...colors, text: sidebarText, textLight: sidebarMuted }} fonts={fonts} />
            </div>
          ))}
        </div>
      ))}
    </div>
  )

  const main = (
    <div style={{ fontFamily: fonts.body, fontSize: '12px' }}>
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
