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
  { id: 'starter', credits: 100, price: 29900, label: 'Starter', popular: false },   // ₹299
  { id: 'popular', credits: 300, price: 59900, label: 'Popular', popular: true },     // ₹599
  { id: 'power', credits: 800, price: 119900, label: 'Power Pack', popular: false },  // ₹1,199
] as const

export const SUBSCRIPTION_PLANS = {
  PRO_MONTHLY: { price: 79900, interval: 'month' as const, credits: 500, label: 'Pro Monthly' },   // ₹799/mo
  PRO_YEARLY: { price: 649900, interval: 'year' as const, credits: 500, label: 'Pro Yearly' },     // ₹6,499/yr
} as const

export const SIGNUP_CREDITS = {
  FREE: 100,
  PRO: 500,
} as const
