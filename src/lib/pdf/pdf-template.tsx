import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer'
import type { ResumeContent, ResumeSection, SectionEntry } from '@/types/resume'
import type { TemplateConfig, TemplateColors } from '@/types/template'
import '@/lib/pdf/fonts'

// ── Styles ──

function createStyles(colors: TemplateColors, margins: number) {
  return StyleSheet.create({
    page: {
      backgroundColor: colors.background,
      fontFamily: 'Inter',
      fontSize: 11,
      color: colors.text,
      padding: margins,
      lineHeight: 1.5,
    },
    name: {
      fontSize: 22,
      fontWeight: 700,
      color: colors.text,
    },
    title: {
      fontSize: 13,
      color: colors.primary,
      marginTop: 2,
    },
    contactRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 4,
      marginTop: 6,
      fontSize: 9,
      color: colors.textLight,
    },
    contactSep: {
      color: colors.textLight,
      opacity: 0.4,
    },
    sectionTitle: {
      fontSize: 11,
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      color: colors.primary,
      borderBottomWidth: 1.2,
      borderBottomColor: colors.primary,
      paddingBottom: 2,
      marginBottom: 6,
    },
    entryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    entryTitle: {
      fontSize: 11,
      fontWeight: 600,
      color: colors.text,
    },
    entrySubtitle: {
      fontSize: 10,
      color: colors.textLight,
    },
    dateText: {
      fontSize: 9,
      color: colors.textLight,
    },
    bulletList: {
      marginTop: 3,
      paddingLeft: 12,
    },
    bulletItem: {
      fontSize: 10,
      color: colors.text,
      lineHeight: 1.5,
      marginBottom: 1,
    },
    summary: {
      fontSize: 10,
      color: colors.text,
      lineHeight: 1.6,
    },
    skillRow: {
      flexDirection: 'row',
      gap: 4,
      fontSize: 10,
      lineHeight: 1.5,
    },
    // Prevent entries from breaking across pages
    entryWrap: {
      marginBottom: 0,
    },
  })
}

// ── Helper ──

function formatDate(entry: SectionEntry): string {
  const start = entry.startDate || entry.fields.date || ''
  const end = entry.current ? 'Present' : (entry.endDate || '')
  if (start && end) return `${start} — ${end}`
  return start || end
}

type Styles = ReturnType<typeof createStyles>

// ── Components ──

function PDFHeader({ info, styles }: { info: ResumeContent['personalInfo']; styles: Styles }) {
  const contacts = [
    info.email,
    info.phone,
    info.location,
    info.linkedin,
    info.website ?? info.portfolio,
  ].filter((v) => v?.trim())

  return (
    <View style={{ alignItems: 'center', marginBottom: 10 }}>
      {info.fullName ? <Text style={styles.name}>{info.fullName}</Text> : null}
      {info.title ? <Text style={styles.title}>{info.title}</Text> : null}
      {contacts.length > 0 && (
        <View style={styles.contactRow}>
          {contacts.map((c, i) => (
            <View key={i} style={{ flexDirection: 'row', gap: 4 }}>
              <Text>{c}</Text>
              {i < contacts.length - 1 && <Text style={styles.contactSep}>|</Text>}
            </View>
          ))}
        </View>
      )}
    </View>
  )
}

function PDFSection({
  section,
  styles,
  sectionGap,
  entryGap,
}: {
  section: ResumeSection
  styles: Styles
  sectionGap: number
  entryGap: number
}) {
  if (!section.visible || section.entries.length === 0) return null

  return (
    <View style={{ marginTop: sectionGap }}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      {section.entries.map((entry) => {
        if (!hasContent(entry, section.type)) return null
        return (
          <View key={entry.id} wrap={false} style={{ marginBottom: entryGap }}>
            <PDFEntry entry={entry} type={section.type} styles={styles} />
          </View>
        )
      })}
    </View>
  )
}

function hasContent(entry: SectionEntry, type: string): boolean {
  if (type === 'skills') return !!entry.fields.skills?.trim()
  const title = entry.fields.jobTitle ?? entry.fields.school ?? entry.fields.name ?? entry.fields.title ?? entry.fields.language ?? ''
  const subtitle = entry.fields.company ?? entry.fields.degree ?? entry.fields.issuer ?? entry.fields.organization ?? ''
  const description = entry.fields.description ?? ''
  const bullets = entry.bulletPoints.filter((b) => b.trim())
  return !!(title || subtitle || description || bullets.length > 0)
}

function PDFEntry({
  entry,
  type,
  styles,
}: {
  entry: SectionEntry
  type: string
  styles: Styles
}) {
  const dateRange = formatDate(entry)

  if (type === 'skills') {
    const { groupName, skills } = entry.fields
    if (!skills?.trim()) return null
    return (
      <View style={styles.skillRow}>
        {groupName ? <Text style={{ fontWeight: 600 }}>{groupName}:</Text> : null}
        <Text style={{ color: styles.entrySubtitle.color }}>{skills}</Text>
      </View>
    )
  }

  const title = entry.fields.jobTitle ?? entry.fields.school ?? entry.fields.name ?? entry.fields.title ?? entry.fields.language ?? ''
  const subtitle = entry.fields.company ?? entry.fields.degree ?? entry.fields.issuer ?? entry.fields.organization ?? entry.fields.publisher ?? entry.fields.proficiency ?? entry.fields.subtitle ?? ''
  const extra = entry.fields.fieldOfStudy ? (entry.fields.degree ? ` in ${entry.fields.fieldOfStudy}` : entry.fields.fieldOfStudy) : ''
  const gpa = entry.fields.gpa ? ` — GPA: ${entry.fields.gpa}` : ''
  const description = entry.fields.description ?? ''
  const bullets = entry.bulletPoints.filter((b) => b.trim())

  return (
    <View>
      <View style={styles.entryRow}>
        <View style={{ flex: 1 }}>
          {title ? <Text style={styles.entryTitle}>{title}</Text> : null}
          {(subtitle || extra) ? (
            <Text style={styles.entrySubtitle}>{subtitle}{extra}{gpa}</Text>
          ) : null}
        </View>
        {dateRange ? <Text style={styles.dateText}>{dateRange}</Text> : null}
      </View>
      {entry.fields.location ? <Text style={styles.entrySubtitle}>{entry.fields.location}</Text> : null}
      {description ? <Text style={{ ...styles.entrySubtitle, marginTop: 2 }}>{description}</Text> : null}
      {bullets.length > 0 && (
        <View style={styles.bulletList}>
          {bullets.map((b, i) => (
            <Text key={i} style={styles.bulletItem}>• {b}</Text>
          ))}
        </View>
      )}
    </View>
  )
}

// ── Main Document ──

interface PDFResumeProps {
  content: ResumeContent
  config: TemplateConfig
}

export function PDFResume({ content, config }: PDFResumeProps) {
  const colors = config.defaultColors
  const spacing = config.spacing
  const styles = createStyles(colors, spacing.margins)

  return (
    <Document title={content.personalInfo.fullName || 'Resume'} author="MyResumeCompany">
      <Page size="A4" style={styles.page} wrap>
        <PDFHeader info={content.personalInfo} styles={styles} />

        {content.personalInfo.summary && (
          <View style={{ marginTop: spacing.sectionGap }}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.summary}>{content.personalInfo.summary}</Text>
          </View>
        )}

        {content.sections
          .filter((s) => s.visible && s.entries.length > 0)
          .map((section) => (
            <PDFSection
              key={section.id}
              section={section}
              styles={styles}
              sectionGap={spacing.sectionGap}
              entryGap={spacing.entryGap}
            />
          ))}
      </Page>
    </Document>
  )
}
