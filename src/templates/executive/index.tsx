import type { TemplateProps } from '@/types/template'
import { SidebarLayout } from '../components/sidebar-layout'
import { TemplateSection } from '../components/template-section'
import { ExperienceEntry, EducationEntry, SkillsEntry, GenericEntry } from '../components/entry-renderers'
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react'

export function Executive({ content, config, customColors, customFonts }: TemplateProps) {
  const colors = { ...config.defaultColors, ...customColors }
  const fonts = { ...config.defaultFonts, ...customFonts }
  const spacing = config.spacing
  const { personalInfo } = content
  const sidebarTextColor = colors.sidebarText ?? '#ffffff'
  const sidebarMuted = `${sidebarTextColor}99`

  const contactItems = [
    { value: personalInfo.email, icon: Mail },
    { value: personalInfo.phone, icon: Phone },
    { value: personalInfo.location, icon: MapPin },
    { value: personalInfo.linkedin, icon: Linkedin },
    { value: personalInfo.website ?? personalInfo.portfolio, icon: Globe },
  ].filter((c) => c.value?.trim())

  const sidebarSections = content.sections.filter((s) => s.visible && s.entries.length > 0 && ['skills', 'languages', 'certifications', 'interests'].includes(s.type))
  const mainSections = content.sections.filter((s) => s.visible && s.entries.length > 0 && !['skills', 'languages', 'certifications', 'interests'].includes(s.type))

  const sidebar = (
    <div style={{ fontFamily: fonts.body, fontSize: '11px' }}>
      {personalInfo.fullName && (
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: sidebarTextColor, fontFamily: fonts.heading, lineHeight: 1.2 }}>
          {personalInfo.fullName}
        </h1>
      )}
      {personalInfo.title && (
        <p style={{ fontSize: '12px', color: colors.secondary, marginTop: '4px' }}>{personalInfo.title}</p>
      )}

      {contactItems.length > 0 && (
        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {contactItems.map(({ value, icon: Icon }, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: sidebarMuted, fontSize: '10px' }}>
              <Icon size={10} color={colors.secondary} />
              {value}
            </span>
          ))}
        </div>
      )}

      {sidebarSections.map((section) => (
        <div key={section.id} style={{ marginTop: '20px' }}>
          <h2 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: colors.secondary, fontFamily: fonts.heading, borderBottom: `1px solid ${sidebarMuted}`, paddingBottom: '3px', marginBottom: '8px' }}>
            {section.title}
          </h2>
          {section.entries.map((entry) => (
            <div key={entry.id} style={{ marginBottom: '4px' }}>
              {section.type === 'skills' ? (
                <SkillsEntry entry={entry} colors={{ ...colors, text: sidebarTextColor, textLight: sidebarMuted }} fonts={fonts} />
              ) : (
                <GenericEntry entry={entry} colors={{ ...colors, text: sidebarTextColor, textLight: sidebarMuted }} fonts={fonts} />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  )

  const main = (
    <div style={{ fontFamily: fonts.body, fontSize: '12px' }}>
      {personalInfo.summary && (
        <div style={{ marginBottom: `${spacing.sectionGap}px` }}>
          <h2 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: colors.primary, fontFamily: fonts.heading, borderBottom: `1.5px solid ${colors.primary}`, paddingBottom: '3px', marginBottom: '6px' }}>
            Professional Summary
          </h2>
          <p style={{ fontSize: '11px', color: colors.text, lineHeight: 1.6 }}>{personalInfo.summary}</p>
        </div>
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
