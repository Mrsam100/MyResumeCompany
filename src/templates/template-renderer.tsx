import type { ResumeContent } from '@/types/resume'
import type { TemplateColors, TemplateFonts } from '@/types/template'
import { getTemplate } from './registry'

interface TemplateRendererProps {
  templateSlug: string
  content: ResumeContent
  customColors?: Partial<TemplateColors>
  customFonts?: Partial<TemplateFonts>
}

export function TemplateRenderer({
  templateSlug,
  content,
  customColors,
  customFonts,
}: TemplateRendererProps) {
  const { component: Component, config } = getTemplate(templateSlug)

  return (
    <Component
      content={content}
      config={config}
      customColors={customColors}
      customFonts={customFonts}
    />
  )
}
