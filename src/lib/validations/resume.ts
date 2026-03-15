import { z } from 'zod'

// ==================== Personal Info ====================

export const personalInfoSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(100),
  title: z.string().max(100).default(''),
  email: z.union([z.string().email('Invalid email address'), z.literal('')]).default(''),
  phone: z.string().max(20).default(''),
  location: z.string().max(100).default(''),
  linkedin: z.union([z.string().url('Invalid URL'), z.literal('')]).optional(),
  website: z.union([z.string().url('Invalid URL'), z.literal('')]).optional(),
  portfolio: z.union([z.string().url('Invalid URL'), z.literal('')]).optional(),
  summary: z.string().max(2000).optional(),
  photoUrl: z.union([z.string().url(), z.literal('')]).optional(),
})

// ==================== Section Entry ====================

export const sectionEntrySchema = z.object({
  id: z.string().min(1),
  fields: z
    .record(z.string(), z.string().max(500))
    .refine((obj) => Object.keys(obj).length <= 20, {
      message: 'Maximum 20 fields per entry',
    }),
  bulletPoints: z.array(z.string().max(500)).max(20, 'Maximum 20 bullet points'),
  startDate: z.string().max(20).optional(),
  endDate: z.string().max(20).optional(),
  current: z.boolean().optional(),
})

// ==================== Section Types ====================

export const sectionTypeSchema = z.enum([
  'experience',
  'education',
  'skills',
  'projects',
  'certifications',
  'awards',
  'languages',
  'volunteer',
  'publications',
  'interests',
  'references',
  'custom',
])

// ==================== Resume Section ====================

export const resumeSectionSchema = z.object({
  id: z.string().min(1),
  type: sectionTypeSchema,
  title: z.string().min(1).max(100),
  visible: z.boolean(),
  entries: z.array(sectionEntrySchema).max(50, 'Maximum 50 entries per section'),
})

// ==================== Resume Content ====================

export const resumeContentSchema = z.object({
  personalInfo: personalInfoSchema,
  sections: z.array(resumeSectionSchema).max(20, 'Maximum 20 sections'),
})

// ==================== API Schemas ====================

export const createResumeSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  templateId: z.string().min(1).max(50).optional(),
  content: resumeContentSchema.optional(),
})

export const updateResumeSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  templateId: z.string().min(1).max(50).optional(),
  content: resumeContentSchema.optional(),
  isPublic: z.boolean().optional(),
})

// ==================== Inferred Types ====================

export type PersonalInfoInput = z.infer<typeof personalInfoSchema>
export type SectionEntryInput = z.infer<typeof sectionEntrySchema>
export type ResumeSectionInput = z.infer<typeof resumeSectionSchema>
export type ResumeContentInput = z.infer<typeof resumeContentSchema>
export type CreateResumeInput = z.infer<typeof createResumeSchema>
export type UpdateResumeInput = z.infer<typeof updateResumeSchema>
