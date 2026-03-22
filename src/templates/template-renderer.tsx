import type { ResumeContent, ResumeSection, SectionEntry, PersonalInfo } from '@/types/resume'
import type { TemplateColors, TemplateFonts } from '@/types/template'
import { getTemplate } from './registry'
import { sanitizeText, sanitizeFields, sanitizeBulletPoints } from '@/lib/sanitize'

interface TemplateRendererProps {
  templateSlug: string
  content: ResumeContent
  customColors?: Partial<TemplateColors>
  customFonts?: Partial<TemplateFonts>
}

/**
 * Sanitize all user-supplied text in resume content before rendering.
 * Prevents stored XSS from malicious resume data.
 */
function sanitizeUrl(url: string): string | undefined {
  const cleaned = sanitizeText(url)
  if (!cleaned) return undefined
  // Only allow http(s), data:image (for photo uploads), and relative paths
  if (/^(https?:\/\/|data:image\/)/i.test(cleaned)) return cleaned
  if (cleaned.startsWith('/')) return cleaned
  return undefined
}

function sanitizeContent(content: ResumeContent): ResumeContent {
  const personalInfo: PersonalInfo = {
    ...content.personalInfo,
    fullName: sanitizeText(content.personalInfo.fullName),
    title: sanitizeText(content.personalInfo.title),
    email: sanitizeText(content.personalInfo.email),
    phone: sanitizeText(content.personalInfo.phone),
    location: sanitizeText(content.personalInfo.location),
    linkedin: content.personalInfo.linkedin ? sanitizeText(content.personalInfo.linkedin) : undefined,
    website: content.personalInfo.website ? sanitizeText(content.personalInfo.website) : undefined,
    portfolio: content.personalInfo.portfolio ? sanitizeText(content.personalInfo.portfolio) : undefined,
    summary: content.personalInfo.summary ? sanitizeText(content.personalInfo.summary) : undefined,
    photoUrl: content.personalInfo.photoUrl ? sanitizeUrl(content.personalInfo.photoUrl) : undefined,
  }

  const sections: ResumeSection[] = content.sections.map((section) => ({
    ...section,
    title: sanitizeText(section.title),
    entries: section.entries.map((entry): SectionEntry => ({
      ...entry,
      fields: sanitizeFields(entry.fields),
      bulletPoints: sanitizeBulletPoints(entry.bulletPoints),
    })),
  }))

  return { personalInfo, sections }
}

export function TemplateRenderer({
  templateSlug,
  content,
  customColors,
  customFonts,
}: TemplateRendererProps) {
  const { component: Component, config } = getTemplate(templateSlug)

  // Sanitize all user content before rendering to prevent XSS
  const safeContent = sanitizeContent(content)

  return (
    <Component
      content={safeContent}
      config={config}
      customColors={customColors}
      customFonts={customFonts}
    />
  )
}
