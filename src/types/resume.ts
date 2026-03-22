export type ResumeFormat = 'chronological' | 'functional' | 'hybrid'

export interface ResumeCustomColors {
  primary?: string
  secondary?: string
  text?: string
  textLight?: string
  background?: string
  sidebarBg?: string
  sidebarText?: string
}

export interface ResumeCustomFonts {
  heading?: string
  body?: string
}

export interface ResumeContent {
  personalInfo: PersonalInfo
  sections: ResumeSection[]
  customColors?: ResumeCustomColors
  customFonts?: ResumeCustomFonts
  format?: ResumeFormat
}

export interface PersonalInfo {
  fullName: string
  title: string
  email: string
  phone: string
  location: string
  linkedin?: string
  website?: string
  portfolio?: string
  summary?: string
  photoUrl?: string
}

export interface ResumeSection {
  id: string
  type: SectionType
  title: string
  visible: boolean
  entries: SectionEntry[]
}

export type SectionType =
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'awards'
  | 'languages'
  | 'volunteer'
  | 'publications'
  | 'interests'
  | 'references'
  | 'custom'

export interface SectionEntry {
  id: string
  fields: Record<string, string>
  bulletPoints: string[]
  startDate?: string
  endDate?: string
  current?: boolean
}
