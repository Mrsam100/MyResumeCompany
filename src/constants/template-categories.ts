import { type TemplateCategory } from '@/types'

export const TEMPLATE_CATEGORIES: { value: TemplateCategory; label: string; description: string }[] = [
  { value: 'PROFESSIONAL', label: 'Professional', description: 'Traditional designs for corporate roles' },
  { value: 'MODERN', label: 'Modern', description: 'Clean, contemporary layouts' },
  { value: 'CREATIVE', label: 'Creative', description: 'Bold designs that stand out' },
  { value: 'TECH', label: 'Tech', description: 'Tailored for developers and engineers' },
  { value: 'ATS_OPTIMIZED', label: 'ATS-Optimized', description: 'Maximum compatibility with applicant tracking systems' },
  { value: 'ACADEMIC', label: 'Academic', description: 'Multi-page CVs for researchers and professors' },
  { value: 'MINIMAL', label: 'Minimal', description: 'Simple, clean, and focused on content' },
]

export const SECTION_TYPE_LABELS: Record<string, string> = {
  experience: 'Work Experience',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  certifications: 'Certifications',
  awards: 'Awards',
  languages: 'Languages',
  volunteer: 'Volunteer Experience',
  publications: 'Publications',
  interests: 'Interests',
  references: 'References',
  custom: 'Custom Section',
}

export const DEFAULT_SECTIONS = ['experience', 'education', 'skills', 'projects'] as const
