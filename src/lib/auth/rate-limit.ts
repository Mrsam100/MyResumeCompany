import { NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { redis } from '@/lib/redis'

/**
 * Redis-backed rate limiting for auth endpoints.
 * Distributed and Workers-compatible (no in-memory state, no setInterval).
 *
 * Limits:
 *   register:       10/hour per IP
 *   login:          20/hour per IP
 *   password-reset:  5/hour per IP
 *   password-change: 5/hour per user
 */

const registerLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 h'),
  prefix: '@app/auth/register',
})

const loginLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, '1 h'),
  prefix: '@app/auth/login',
})

const passwordResetLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 h'),
  prefix: '@app/auth/password-reset',
})

const passwordChangeLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 h'),
  prefix: '@app/auth/password-change',
})

const limiters: Record<string, Ratelimit> = {
  register: registerLimiter,
  login: loginLimiter,
  'password-reset': passwordResetLimiter,
  'password-change': passwordChangeLimiter,
}

/**
 * Check auth rate limit for a given IP/action.
 * Returns NextResponse 429 if exceeded, null if allowed.
 * Fails open on Redis errors (allows request through).
 */
export async function checkAuthRateLimit(
  identifier: string,
  action: string,
): Promise<NextResponse | null> {
  const limiter = limiters[action]
  if (!limiter) return null

  try {
    const { success, limit, remaining, reset } = await limiter.limit(
      `${action}:${identifier}`,
    )

    if (!success) {
      const retryAfter = Math.max(1, Math.ceil((reset - Date.now()) / 1000))
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
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

    return null
  } catch (err) {
    console.error(
      '[auth-rate-limit] Redis error, allowing request:',
      err instanceof Error ? err.message : err,
    )
    return null
  }
}
