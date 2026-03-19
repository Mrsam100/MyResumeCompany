/**
 * Session cache layer — dual-mode for Cloudflare KV and Upstash Redis.
 *
 * - On Cloudflare Workers: uses KV namespace (SESSION_CACHE binding)
 * - On Node.js (Vercel/local): uses Upstash Redis REST
 *
 * Both are gracefully degraded — cache misses fall through to DB queries.
 */

import { Redis } from '@upstash/redis'
import { isCloudflareWorkers, getCfEnv } from '@/lib/cloudflare/context'

// ─── Upstash Redis client (Node.js + Workers rate limiting) ───

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined
}

function getRedis(): Redis {
  if (globalForRedis.redis) return globalForRedis.redis

  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) {
    throw new Error('UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set')
  }

  const client = new Redis({ url, token })
  globalForRedis.redis = client
  return client
}

// Export redis for @upstash/ratelimit (used by AI and Stripe rate limiters).
// Works on both Node.js and Workers since Upstash uses REST/HTTP.
export const redis = new Proxy({} as Redis, {
  get(_, prop) {
    return Reflect.get(getRedis(), prop)
  },
})

// ─── Session Cache Interface ───

const SESSION_CACHE_TTL = 300 // 5 minutes in seconds

export interface CachedSessionData {
  credits: number
  subscriptionTier: string
  hasPassword: boolean
}

// ─── Session Cache: Get ───

export async function getCachedSession(userId: string): Promise<CachedSessionData | null> {
  try {
    if (isCloudflareWorkers()) {
      const env = getCfEnv()
      return await env.SESSION_CACHE.get<CachedSessionData>(`session:${userId}`, { type: 'json' })
    }

    return await getRedis().get<CachedSessionData>(`session:${userId}`)
  } catch {
    return null
  }
}

// ─── Session Cache: Set ───

export async function setCachedSession(userId: string, data: CachedSessionData): Promise<void> {
  try {
    if (isCloudflareWorkers()) {
      const env = getCfEnv()
      await env.SESSION_CACHE.put(`session:${userId}`, JSON.stringify(data), {
        expirationTtl: SESSION_CACHE_TTL,
      })
      return
    }

    await getRedis().set(`session:${userId}`, data, { ex: SESSION_CACHE_TTL })
  } catch {
    // Cache failure is non-fatal — next request hits DB
  }
}

// ─── Session Cache: Invalidate ───

export async function invalidateSessionCache(userId: string): Promise<void> {
  try {
    if (isCloudflareWorkers()) {
      const env = getCfEnv()
      await env.SESSION_CACHE.delete(`session:${userId}`)
      return
    }

    await getRedis().del(`session:${userId}`)
  } catch {
    // Cache expires naturally via TTL
  }
}
