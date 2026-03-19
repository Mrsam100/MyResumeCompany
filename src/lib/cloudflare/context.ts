/**
 * Safe accessor for Cloudflare Workers request context.
 * Uses dynamic require to avoid build-time errors when
 * @cloudflare/next-on-pages is not installed (Node.js/Vercel builds).
 *
 * Only call getCfEnv() when isCloudflareWorkers() returns true.
 */

import type { CloudflareEnv } from './bindings'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _getRequestContext: (() => { env: CloudflareEnv }) | null = null

export function getCfEnv(): CloudflareEnv {
  if (!_getRequestContext) {
    try {
      // Dynamic import that webpack/turbopack won't statically analyze
      const mod = Function('return require("@cloudflare/next-on-pages")')() as {
        getRequestContext: () => { env: CloudflareEnv }
      }
      _getRequestContext = mod.getRequestContext
    } catch {
      throw new Error('Cloudflare context not available — not running in Workers')
    }
  }
  return _getRequestContext().env
}

/**
 * Check if running in Cloudflare Workers environment.
 *
 * Simple and reliable: if DATABASE_URL exists in env, we're on Node.js.
 * On Cloudflare Workers, database access comes via Hyperdrive bindings,
 * not process.env.DATABASE_URL.
 */
export function isCloudflareWorkers(): boolean {
  try {
    // If DATABASE_URL is set, we're on Node.js (Vercel/local dev)
    if (process.env.DATABASE_URL) {
      return false
    }
  } catch {
    // process.env may not exist in some edge runtimes
  }

  // If we get here, try to access the CF context.
  // If it succeeds, we're in Workers.
  try {
    getCfEnv()
    return true
  } catch {
    return false
  }
}
