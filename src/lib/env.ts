/**
 * Environment variable validation.
 * Call validateEnv() at app startup to catch missing config early.
 */

const REQUIRED_VARS = [
  'DATABASE_URL',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
] as const

const REQUIRED_IN_PRODUCTION = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GITHUB_CLIENT_ID',
  'GITHUB_CLIENT_SECRET',
  'GEMINI_API_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'STRIPE_PRO_MONTHLY_PRICE_ID',
  'STRIPE_PRO_YEARLY_PRICE_ID',
  'NEXT_PUBLIC_APP_URL',
] as const

export function validateEnv() {
  const missing: string[] = []
  const isProduction = process.env.NODE_ENV === 'production'

  for (const key of REQUIRED_VARS) {
    if (!process.env[key]) missing.push(key)
  }

  if (isProduction) {
    for (const key of REQUIRED_IN_PRODUCTION) {
      if (!process.env[key]) missing.push(key)
    }
  }

  if (missing.length > 0) {
    const msg = `Missing environment variables:\n${missing.map((k) => `  - ${k}`).join('\n')}`
    console.warn(`[env] ${msg}`)
  }
}
