export async function register() {
  // Only run Sentry + env validation on Node.js (Vercel).
  // Cloudflare Workers uses edge runtime — Sentry server SDK is incompatible.
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('../sentry.server.config')
    const { validateEnv } = await import('@/lib/env')
    validateEnv()
  }
}
