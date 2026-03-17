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
} as const

export type CreditAction = keyof typeof CREDIT_COSTS

export const CREDIT_PACKS = [
  { id: 'starter', credits: 100, price: 499, label: 'Starter', popular: false },
  { id: 'popular', credits: 300, price: 999, label: 'Popular', popular: true },
  { id: 'power', credits: 800, price: 1999, label: 'Power Pack', popular: false },
] as const

export const SUBSCRIPTION_PLANS = {
  PRO_MONTHLY: { price: 1200, interval: 'month' as const, credits: 500, label: 'Pro Monthly' },
  PRO_YEARLY: { price: 9900, interval: 'year' as const, credits: 500, label: 'Pro Yearly' },
} as const

export const SIGNUP_CREDITS = {
  FREE: 100,
  PRO: 500,
} as const
