import type { SectionEntry, TemplateColors, TemplateFonts } from '@/types'

interface EntryProps {
  entry: SectionEntry
  colors: TemplateColors
  fonts: TemplateFonts
}

export function ExperienceEntry({ entry, colors, fonts }: EntryProps) {
  const { jobTitle, company, location } = entry.fields
  const dateRange = formatDateRange(entry)
  if (!jobTitle && !company) return null

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div>
          {jobTitle && <span style={{ fontWeight: 600, fontSize: '12px', color: colors.text, fontFamily: fonts.heading }}>{jobTitle}</span>}
          {company && <span style={{ fontSize: '12px', color: colors.textLight }}>{jobTitle ? ' | ' : ''}{company}</span>}
        </div>
        {dateRange && <span style={{ fontSize: '11px', color: colors.textLight, whiteSpace: 'nowrap', marginLeft: '8px' }}>{dateRange}</span>}
      </div>
      {location && <p style={{ fontSize: '11px', color: colors.textLight, marginTop: '1px', margin: 0, marginBlockStart: '1px' }}>{location}</p>}
      <BulletList bullets={entry.bulletPoints} colors={colors} fonts={fonts} />
    </div>
  )
}

export function EducationEntry({ entry, colors, fonts }: EntryProps) {
  const { school, degree, fieldOfStudy, gpa } = entry.fields
  const dateRange = formatDateRange(entry)
  if (!school && !degree) return null

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        {school && <span style={{ fontWeight: 600, fontSize: '12px', color: colors.text, fontFamily: fonts.heading }}>{school}</span>}
        {dateRange && <span style={{ fontSize: '11px', color: colors.textLight, whiteSpace: 'nowrap', marginLeft: '8px' }}>{dateRange}</span>}
      </div>
      {(degree || fieldOfStudy) && (
        <p style={{ fontSize: '11px', color: colors.textLight, marginTop: '1px', margin: 0, marginBlockStart: '1px' }}>
          {degree}{degree && fieldOfStudy ? ' in ' : ''}{fieldOfStudy}
          {gpa ? ` — GPA: ${gpa}` : ''}
        </p>
      )}
    </div>
  )
}

export function SkillsEntry({ entry, colors, fonts }: EntryProps) {
  const { groupName, skills } = entry.fields
  if (!skills?.trim()) return null

  return (
    <div style={{ display: 'flex', gap: '4px', fontSize: '11px', lineHeight: 1.5 }}>
      {groupName && <span style={{ fontWeight: 600, color: colors.text, fontFamily: fonts.heading, whiteSpace: 'nowrap' }}>{groupName}:</span>}
      <span style={{ color: colors.textLight }}>{skills}</span>
    </div>
  )
}

export function GenericEntry({ entry, colors, fonts }: EntryProps) {
  const dateRange = formatDateRange(entry)
  const title = entry.fields.name ?? entry.fields.title ?? entry.fields.language ?? ''
  const subtitle = entry.fields.company ?? entry.fields.issuer ?? entry.fields.organization ?? entry.fields.publisher ?? entry.fields.proficiency ?? entry.fields.subtitle ?? ''
  const description = entry.fields.description ?? ''

  if (!title && !subtitle && !description && entry.bulletPoints.filter((b) => b.trim()).length === 0) return null

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div>
          {title && <span style={{ fontWeight: 600, fontSize: '12px', color: colors.text, fontFamily: fonts.heading }}>{title}</span>}
          {subtitle && <span style={{ fontSize: '11px', color: colors.textLight }}>{title ? ' — ' : ''}{subtitle}</span>}
        </div>
        {dateRange && <span style={{ fontSize: '11px', color: colors.textLight, whiteSpace: 'nowrap', marginLeft: '8px' }}>{dateRange}</span>}
      </div>
      {description && <p style={{ fontSize: '11px', color: colors.textLight, marginTop: '2px', margin: 0, marginBlockStart: '2px' }}>{description}</p>}
      <BulletList bullets={entry.bulletPoints} colors={colors} fonts={fonts} />
    </div>
  )
}

function BulletList({ bullets, colors, fonts }: { bullets: string[]; colors: TemplateColors; fonts: TemplateFonts }) {
  const filtered = bullets.filter((b) => b.trim())
  if (filtered.length === 0) return null

  return (
    <ul style={{ margin: '4px 0 0 0', paddingLeft: '16px', listStyleType: 'disc' }}>
      {filtered.map((bullet, i) => (
        <li key={`${i}-${bullet.slice(0, 20)}`} style={{ fontSize: '11px', color: colors.text, fontFamily: fonts.body, lineHeight: 1.5 }}>
          {bullet}
        </li>
      ))}
    </ul>
  )
}

function formatDateRange(entry: SectionEntry): string {
  const start = entry.startDate ?? entry.fields.date ?? ''
  const end = entry.current ? 'Present' : (entry.endDate ?? '')
  if (start && end) return `${start} — ${end}`
  return start || end
}
