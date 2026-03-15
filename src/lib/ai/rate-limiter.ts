import { NextResponse } from 'next/server'

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store) {
    if (entry.resetAt <= now) store.delete(key)
  }
}, 5 * 60 * 1000)

/**
 * In-memory rate limiter per user.
 * Returns a NextResponse error if rate limit exceeded, undefined otherwise.
 *
 * @param userId - The user to rate limit
 * @param tier - 'FREE' or 'PRO' subscription tier
 * @param prefix - Namespace prefix (e.g., 'ai', 'pdf') to separate limits
 */
export function checkRateLimit(
  userId: string,
  tier: string,
  prefix: string,
): Response | undefined {
  const maxRequests = tier === 'PRO' ? 100 : 20
  const windowMs = 60 * 60 * 1000 // 1 hour

  const key = `${prefix}:${userId}`
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || entry.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return undefined
  }

  if (entry.count >= maxRequests) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000)
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfter),
          'X-RateLimit-Limit': String(maxRequests),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.ceil(entry.resetAt / 1000)),
        },
      },
    )
  }

  entry.count++
  return undefined
}
