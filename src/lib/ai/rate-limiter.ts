import { NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { redis } from '@/lib/redis'

const freeLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, '1 h'),
  prefix: '@app/rl/free',
  analytics: true,
})

const proLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 h'),
  prefix: '@app/rl/pro',
  analytics: true,
})

/**
 * Redis-backed rate limiter per user.
 * Returns a NextResponse error if rate limit exceeded, undefined otherwise.
 * Fails open on Redis errors (allows request through).
 */
export async function checkRateLimit(
  userId: string,
  tier: string,
  prefix: string,
): Promise<Response | undefined> {
  try {
    const limiter = tier === 'PRO' ? proLimiter : freeLimiter
    const identifier = `${prefix}:${userId}`
    const { success, limit, remaining, reset } = await limiter.limit(identifier)

    if (!success) {
      const retryAfter = Math.max(1, Math.ceil((reset - Date.now()) / 1000))
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfter),
            'X-RateLimit-Limit': String(limit),
            'X-RateLimit-Remaining': String(remaining),
            'X-RateLimit-Reset': String(Math.ceil(reset / 1000)),
          },
        },
      )
    }

    return undefined
  } catch (err) {
    console.error('[rate-limiter] Redis error, allowing request:', err instanceof Error ? err.message : err)
    return undefined
  }
}
