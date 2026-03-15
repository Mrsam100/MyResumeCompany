export type TemplateCategory =
  | 'PROFESSIONAL'
  | 'MODERN'
  | 'CREATIVE'
  | 'TECH'
  | 'ATS_OPTIMIZED'
  | 'ACADEMIC'
  | 'MINIMAL'

export type TemplateLayout =
  | 'single-column'
  | 'two-column'
  | 'sidebar-left'
  | 'sidebar-right'

export interface TemplateColors {
  primary: string
  secondary: string
  text: string
  textLight: string
  background: string
  sidebarBg?: string
  sidebarText?: string
}

export interface TemplateFonts {
  heading: string
  body: string
  accent?: string
}

export interface TemplateSpacing {
  margins: number
  sectionGap: number
  entryGap: number
}

export interface TemplateConfig {
  id: string
  name: string
  slug: string
  category: TemplateCategory
  description: string
  isPremium: boolean
  layout: TemplateLayout
  defaultColors: TemplateColors
  defaultFonts: TemplateFonts
  spacing: TemplateSpacing
}

export interface TemplateProps {
  content: import('./resume').ResumeContent
  config: TemplateConfig
  customColors?: Partial<TemplateColors>
  customFonts?: Partial<TemplateFonts>
}
