/**
 * Environment variable validation.
 * Call validateEnv() at app startup to catch missing config early.
 *
 * Works on both Vercel (process.env) and Cloudflare Workers (secrets in env bindings).
 * On Workers, most secrets are set via `wrangler secret put` and accessed differently,
 * but process.env still works for vars defined in wrangler.toml [vars].
 */

const REQUIRED_VARS = [
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
] as const

const REQUIRED_IN_PRODUCTION = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GEMINI_API_KEY',
  'NEXT_PUBLIC_APP_URL',
  'UPSTASH_REDIS_REST_URL',
  'UPSTASH_REDIS_REST_TOKEN',
  'SENTRY_DSN',
  'NEXT_PUBLIC_SENTRY_DSN',
  'RESEND_API_KEY',
] as const

// Stripe vars are optional — app runs without payments until configured
const OPTIONAL_IN_PRODUCTION = [
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'STRIPE_PRO_MONTHLY_PRICE_ID',
  'STRIPE_PRO_YEARLY_PRICE_ID',
] as const

// DATABASE_URL is only required on Node.js (Vercel/local).
// On Cloudflare Workers, the database is accessed via Hyperdrive bindings.
const NODE_ONLY_VARS = [
  'DATABASE_URL',
] as const

export function validateEnv() {
  const missing: string[] = []
  const isProduction = process.env.NODE_ENV === 'production'
  const isCloudflare = !process.env.DATABASE_URL && process.env.ENVIRONMENT === 'production'

  for (const key of REQUIRED_VARS) {
    if (!process.env[key]) missing.push(key)
  }

  if (isProduction) {
    for (const key of REQUIRED_IN_PRODUCTION) {
      if (!process.env[key]) missing.push(key)
    }
  }

  // Only check DATABASE_URL on Node.js (not Cloudflare Workers)
  if (!isCloudflare) {
    for (const key of NODE_ONLY_VARS) {
      if (!process.env[key]) missing.push(key)
    }
  }

  // Warn about optional Stripe vars (don't block startup)
  if (isProduction) {
    const optionalMissing = OPTIONAL_IN_PRODUCTION.filter((k) => !process.env[k])
    if (optionalMissing.length > 0) {
      console.warn(`[env] Optional vars not set (payments disabled):\n${optionalMissing.map((k) => `  - ${k}`).join('\n')}`)
    }
  }

  if (missing.length > 0) {
    const msg = `Missing environment variables:\n${missing.map((k) => `  - ${k}`).join('\n')}`
    if (isProduction) {
      throw new Error(`[env] FATAL: ${msg}`)
    } else {
      console.warn(`[env] ${msg}`)
    }
  }
}
