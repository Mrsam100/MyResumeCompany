import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Packer,
  SectionType,
} from 'docx'
import type { ResumeContent, ResumeSection, SectionEntry } from '@/types/resume'
import type { TemplateColors, TemplateFonts } from '@/types/template'

function hexToDocxColor(hex: string): string {
  return hex.replace('#', '')
}

function formatDate(start?: string, end?: string, current?: boolean): string {
  const parts: string[] = []
  if (start) parts.push(start)
  if (current) parts.push('Present')
  else if (end) parts.push(end)
  return parts.join(' - ')
}

function createHeader(
  info: ResumeContent['personalInfo'],
  colors: TemplateColors,
  fonts: TemplateFonts,
): Paragraph[] {
  const paragraphs: Paragraph[] = []

  if (info.fullName) {
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 40 },
        children: [
          new TextRun({
            text: info.fullName,
            bold: true,
            size: 28 * 2, // half-points
            color: hexToDocxColor(colors.text),
            font: fonts.heading.split(',')[0].trim(),
          }),
        ],
      }),
    )
  }

  if (info.title) {
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
        children: [
          new TextRun({
            text: info.title,
            size: 13 * 2,
            color: hexToDocxColor(colors.primary),
            font: fonts.body.split(',')[0].trim(),
          }),
        ],
      }),
    )
  }

  // Contact line
  const contactParts: string[] = []
  if (info.email) contactParts.push(info.email)
  if (info.phone) contactParts.push(info.phone)
  if (info.location) contactParts.push(info.location)
  if (info.linkedin) contactParts.push(info.linkedin)
  if (info.website || info.portfolio) contactParts.push((info.website || info.portfolio)!)

  if (contactParts.length > 0) {
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: contactParts.join('  |  '),
            size: 10 * 2,
            color: hexToDocxColor(colors.textLight),
            font: fonts.body.split(',')[0].trim(),
          }),
        ],
      }),
    )
  }

  return paragraphs
}

function createSummary(
  summary: string,
  colors: TemplateColors,
  fonts: TemplateFonts,
): Paragraph[] {
  return [
    createSectionHeading('Professional Summary', colors, fonts),
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: summary,
          size: 11 * 2,
          color: hexToDocxColor(colors.text),
          font: fonts.body.split(',')[0].trim(),
        }),
      ],
    }),
  ]
}

function createSectionHeading(
  title: string,
  colors: TemplateColors,
  fonts: TemplateFonts,
): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 80 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 1, color: hexToDocxColor(colors.primary) },
    },
    children: [
      new TextRun({
        text: title.toUpperCase(),
        bold: true,
        size: 12 * 2,
        color: hexToDocxColor(colors.primary),
        font: fonts.heading.split(',')[0].trim(),
      }),
    ],
  })
}

function createExperienceEntry(
  entry: SectionEntry,
  colors: TemplateColors,
  fonts: TemplateFonts,
): Paragraph[] {
  const paragraphs: Paragraph[] = []
  const bodyFont = fonts.body.split(',')[0].trim()
  const dateStr = formatDate(entry.startDate, entry.endDate, entry.current)

  // Title + Company line
  const titleRuns: TextRun[] = []
  if (entry.fields.jobTitle || entry.fields.title) {
    titleRuns.push(new TextRun({
      text: entry.fields.jobTitle || entry.fields.title || '',
      bold: true,
      size: 11 * 2,
      color: hexToDocxColor(colors.text),
      font: bodyFont,
    }))
  }
  if (entry.fields.company || entry.fields.organization || entry.fields.institution) {
    if (titleRuns.length > 0) {
      titleRuns.push(new TextRun({ text: ' at ', size: 11 * 2, color: hexToDocxColor(colors.textLight), font: bodyFont }))
    }
    titleRuns.push(new TextRun({
      text: entry.fields.company || entry.fields.organization || entry.fields.institution || '',
      size: 11 * 2,
      color: hexToDocxColor(colors.text),
      font: bodyFont,
    }))
  }
  if (dateStr) {
    titleRuns.push(new TextRun({ text: `\t${dateStr}`, size: 10 * 2, color: hexToDocxColor(colors.textLight), font: bodyFont }))
  }

  if (titleRuns.length > 0) {
    paragraphs.push(new Paragraph({ spacing: { after: 40 }, children: titleRuns }))
  }

  // Location
  if (entry.fields.location) {
    paragraphs.push(new Paragraph({
      spacing: { after: 40 },
      children: [new TextRun({ text: entry.fields.location, size: 10 * 2, color: hexToDocxColor(colors.textLight), font: bodyFont, italics: true })],
    }))
  }

  // Bullet points
  for (const bullet of entry.bulletPoints) {
    if (!bullet.trim()) continue
    paragraphs.push(new Paragraph({
      bullet: { level: 0 },
      spacing: { after: 40 },
      children: [new TextRun({ text: bullet, size: 11 * 2, color: hexToDocxColor(colors.text), font: bodyFont })],
    }))
  }

  return paragraphs
}

function createEducationEntry(
  entry: SectionEntry,
  colors: TemplateColors,
  fonts: TemplateFonts,
): Paragraph[] {
  const paragraphs: Paragraph[] = []
  const bodyFont = fonts.body.split(',')[0].trim()
  const dateStr = formatDate(entry.startDate, entry.endDate, entry.current)

  const titleParts: string[] = []
  if (entry.fields.degree) titleParts.push(entry.fields.degree)
  if (entry.fields.field) titleParts.push(`in ${entry.fields.field}`)

  const titleRuns: TextRun[] = []
  if (titleParts.length > 0) {
    titleRuns.push(new TextRun({ text: titleParts.join(' '), bold: true, size: 11 * 2, color: hexToDocxColor(colors.text), font: bodyFont }))
  }
  if (entry.fields.school || entry.fields.institution) {
    if (titleRuns.length > 0) titleRuns.push(new TextRun({ text: ' — ', size: 11 * 2, color: hexToDocxColor(colors.textLight), font: bodyFont }))
    titleRuns.push(new TextRun({ text: entry.fields.school || entry.fields.institution || '', size: 11 * 2, color: hexToDocxColor(colors.text), font: bodyFont }))
  }
  if (dateStr) {
    titleRuns.push(new TextRun({ text: `\t${dateStr}`, size: 10 * 2, color: hexToDocxColor(colors.textLight), font: bodyFont }))
  }

  if (titleRuns.length > 0) {
    paragraphs.push(new Paragraph({ spacing: { after: 40 }, children: titleRuns }))
  }

  if (entry.fields.gpa) {
    paragraphs.push(new Paragraph({
      spacing: { after: 40 },
      children: [new TextRun({ text: `GPA: ${entry.fields.gpa}`, size: 10 * 2, color: hexToDocxColor(colors.textLight), font: bodyFont })],
    }))
  }

  for (const bullet of entry.bulletPoints) {
    if (!bullet.trim()) continue
    paragraphs.push(new Paragraph({
      bullet: { level: 0 },
      spacing: { after: 40 },
      children: [new TextRun({ text: bullet, size: 11 * 2, color: hexToDocxColor(colors.text), font: bodyFont })],
    }))
  }

  return paragraphs
}

function createSkillsEntry(
  entry: SectionEntry,
  colors: TemplateColors,
  fonts: TemplateFonts,
): Paragraph[] {
  const bodyFont = fonts.body.split(',')[0].trim()
  const runs: TextRun[] = []

  if (entry.fields.category || entry.fields.name) {
    runs.push(new TextRun({
      text: `${entry.fields.category || entry.fields.name}: `,
      bold: true,
      size: 11 * 2,
      color: hexToDocxColor(colors.text),
      font: bodyFont,
    }))
  }

  const skills = entry.fields.skills || entry.bulletPoints.join(', ')
  if (skills) {
    runs.push(new TextRun({
      text: skills,
      size: 11 * 2,
      color: hexToDocxColor(colors.text),
      font: bodyFont,
    }))
  }

  if (runs.length === 0) return []
  return [new Paragraph({ spacing: { after: 60 }, children: runs })]
}

function createGenericEntry(
  entry: SectionEntry,
  colors: TemplateColors,
  fonts: TemplateFonts,
): Paragraph[] {
  const paragraphs: Paragraph[] = []
  const bodyFont = fonts.body.split(',')[0].trim()
  const dateStr = formatDate(entry.startDate, entry.endDate, entry.current)

  // Title from first non-empty field
  const fieldValues = Object.entries(entry.fields).filter(([, v]) => v.trim())
  const titleRuns: TextRun[] = []

  if (fieldValues.length > 0) {
    titleRuns.push(new TextRun({ text: fieldValues[0][1], bold: true, size: 11 * 2, color: hexToDocxColor(colors.text), font: bodyFont }))
    for (let i = 1; i < fieldValues.length; i++) {
      titleRuns.push(new TextRun({ text: ` — ${fieldValues[i][1]}`, size: 11 * 2, color: hexToDocxColor(colors.textLight), font: bodyFont }))
    }
  }
  if (dateStr) {
    titleRuns.push(new TextRun({ text: `\t${dateStr}`, size: 10 * 2, color: hexToDocxColor(colors.textLight), font: bodyFont }))
  }

  if (titleRuns.length > 0) {
    paragraphs.push(new Paragraph({ spacing: { after: 40 }, children: titleRuns }))
  }

  for (const bullet of entry.bulletPoints) {
    if (!bullet.trim()) continue
    paragraphs.push(new Paragraph({
      bullet: { level: 0 },
      spacing: { after: 40 },
      children: [new TextRun({ text: bullet, size: 11 * 2, color: hexToDocxColor(colors.text), font: bodyFont })],
    }))
  }

  return paragraphs
}

function createSectionParagraphs(
  section: ResumeSection,
  colors: TemplateColors,
  fonts: TemplateFonts,
): Paragraph[] {
  if (!section.visible) return []

  const paragraphs: Paragraph[] = [
    createSectionHeading(section.title, colors, fonts),
  ]

  for (const entry of section.entries) {
    switch (section.type) {
      case 'experience':
      case 'volunteer':
        paragraphs.push(...createExperienceEntry(entry, colors, fonts))
        break
      case 'education':
        paragraphs.push(...createEducationEntry(entry, colors, fonts))
        break
      case 'skills':
      case 'languages':
      case 'interests':
        paragraphs.push(...createSkillsEntry(entry, colors, fonts))
        break
      default:
        paragraphs.push(...createGenericEntry(entry, colors, fonts))
        break
    }
  }

  return paragraphs
}

export async function renderDocx(
  content: ResumeContent,
  colors: TemplateColors,
  fonts: TemplateFonts,
): Promise<Buffer> {
  const children: Paragraph[] = []

  // Header
  children.push(...createHeader(content.personalInfo, colors, fonts))

  // Summary
  if (content.personalInfo.summary?.trim()) {
    children.push(...createSummary(content.personalInfo.summary, colors, fonts))
  }

  // Sections
  for (const section of content.sections) {
    children.push(...createSectionParagraphs(section, colors, fonts))
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          type: SectionType.CONTINUOUS,
          page: {
            margin: {
              top: 720, // 0.5 inch
              bottom: 720,
              left: 1080, // 0.75 inch
              right: 1080,
            },
          },
        },
        children,
      },
    ],
  })

  const buffer = await Packer.toBuffer(doc)
  return Buffer.from(buffer)
}
