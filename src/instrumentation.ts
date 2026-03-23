export async function register() {
  // Trim whitespace/newlines from env vars that may have been copy-pasted with trailing \n
  if (process.env.NEXT_PUBLIC_APP_URL) {
    process.env.NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL.trim()
  }
  if (process.env.NEXTAUTH_URL) {
    process.env.NEXTAUTH_URL = process.env.NEXTAUTH_URL.trim()
  }

  // Only run Sentry + env validation on Node.js (Vercel).
  // Cloudflare Workers uses edge runtime — Sentry server SDK is incompatible.
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('../sentry.server.config')
    const { validateEnv } = await import('@/lib/env')
    validateEnv()
  }
}
