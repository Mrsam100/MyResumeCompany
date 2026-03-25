export const CURRENCY = { code: 'INR' as const, symbol: '₹' }

export const CREDIT_COSTS = {
  AI_BULLET_POINTS: 10,
  AI_SUMMARY: 10,
  AI_FULL_RESUME: 40,
  AI_ATS_SCAN: 15,
  AI_ATS_OPTIMIZE: 15,
  AI_COVER_LETTER: 20,
  AI_LINKEDIN_IMPORT: 20,
  AI_RESUME_IMPORT: 25,
  PDF_EXPORT: 30,
  DOCX_EXPORT: 25,
} as const

export type CreditAction = keyof typeof CREDIT_COSTS

export const CREDIT_PACKS = [
  { id: 'starter', credits: 200, price: 19900, label: 'Starter', popular: false },    // ₹199
  { id: 'popular', credits: 500, price: 44900, label: 'Popular', popular: true },      // ₹449
  { id: 'pro', credits: 1200, price: 89900, label: 'Pro Pack', popular: false },       // ₹899
] as const

export const SIGNUP_CREDITS = 100
