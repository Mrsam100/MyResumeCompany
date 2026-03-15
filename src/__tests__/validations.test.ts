import { describe, it, expect } from 'vitest'
import { loginSchema, signupSchema } from '@/lib/validations/auth'
import { resumeContentSchema, personalInfoSchema } from '@/lib/validations/resume'

describe('Auth Validations', () => {
  describe('loginSchema', () => {
    it('accepts valid email and password', () => {
      const result = loginSchema.safeParse({ email: 'user@test.com', password: 'pass123' })
      expect(result.success).toBe(true)
    })

    it('normalizes email to lowercase', () => {
      const result = loginSchema.safeParse({ email: 'USER@TEST.COM', password: 'pass' })
      expect(result.success).toBe(true)
      if (result.success) expect(result.data.email).toBe('user@test.com')
    })

    it('rejects invalid email', () => {
      const result = loginSchema.safeParse({ email: 'notanemail', password: 'pass' })
      expect(result.success).toBe(false)
    })

    it('rejects empty password', () => {
      const result = loginSchema.safeParse({ email: 'user@test.com', password: '' })
      expect(result.success).toBe(false)
    })
  })

  describe('signupSchema', () => {
    const valid = {
      name: 'John Doe',
      email: 'john@test.com',
      password: 'Pass1234',
    }

    it('accepts valid signup data', () => {
      const result = signupSchema.safeParse(valid)
      expect(result.success).toBe(true)
    })

    it('rejects password without uppercase', () => {
      const result = signupSchema.safeParse({ ...valid, password: 'pass1234' })
      expect(result.success).toBe(false)
    })

    it('rejects password without number', () => {
      const result = signupSchema.safeParse({ ...valid, password: 'Password' })
      expect(result.success).toBe(false)
    })

    it('rejects short name', () => {
      const result = signupSchema.safeParse({ ...valid, name: 'A' })
      expect(result.success).toBe(false)
    })

    it('rejects short password', () => {
      const result = signupSchema.safeParse({ ...valid, password: 'Pa1' })
      expect(result.success).toBe(false)
    })
  })
})

describe('Resume Validations', () => {
  describe('personalInfoSchema', () => {
    it('accepts valid personal info', () => {
      const result = personalInfoSchema.safeParse({
        fullName: 'John Doe',
        title: 'Software Engineer',
        email: 'john@test.com',
        phone: '555-1234',
        location: 'New York, NY',
      })
      expect(result.success).toBe(true)
    })

    it('requires fullName', () => {
      const result = personalInfoSchema.safeParse({ fullName: '' })
      expect(result.success).toBe(false)
    })

    it('rejects invalid email', () => {
      const result = personalInfoSchema.safeParse({
        fullName: 'John',
        email: 'not-email',
      })
      expect(result.success).toBe(false)
    })

    it('allows empty email string', () => {
      const result = personalInfoSchema.safeParse({
        fullName: 'John',
        email: '',
      })
      expect(result.success).toBe(true)
    })

    it('rejects overly long name', () => {
      const result = personalInfoSchema.safeParse({
        fullName: 'A'.repeat(101),
      })
      expect(result.success).toBe(false)
    })
  })

  describe('resumeContentSchema', () => {
    it('accepts valid resume content', () => {
      const result = resumeContentSchema.safeParse({
        personalInfo: { fullName: 'John Doe' },
        sections: [
          {
            id: 'sec1',
            type: 'experience',
            title: 'Work Experience',
            visible: true,
            entries: [
              {
                id: 'e1',
                fields: { company: 'Acme Inc', title: 'Engineer' },
                bulletPoints: ['Built API'],
              },
            ],
          },
        ],
      })
      expect(result.success).toBe(true)
    })

    it('rejects invalid section type', () => {
      const result = resumeContentSchema.safeParse({
        personalInfo: { fullName: 'John' },
        sections: [
          { id: 's1', type: 'invalid_type', title: 'Test', visible: true, entries: [] },
        ],
      })
      expect(result.success).toBe(false)
    })

    it('rejects too many sections', () => {
      const sections = Array.from({ length: 21 }, (_, i) => ({
        id: `s${i}`,
        type: 'experience',
        title: `Section ${i}`,
        visible: true,
        entries: [],
      }))
      const result = resumeContentSchema.safeParse({
        personalInfo: { fullName: 'John' },
        sections,
      })
      expect(result.success).toBe(false)
    })
  })
})
