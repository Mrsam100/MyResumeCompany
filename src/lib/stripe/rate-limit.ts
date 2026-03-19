import { NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { redis } from '@/lib/redis'

const stripeLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 m'),
  prefix: '@app/stripe-ratelimit',
  analytics: true,
})

/**
 * Redis-backed rate limiter for Stripe checkout/portal routes.
 * 10 requests per minute per user.
 * Fails open on Redis errors (allows request through).
 */
export async function checkStripeRateLimit(
  userId: string,
): Promise<NextResponse | null> {
  try {
    const { success } = await stripeLimiter.limit(userId)

    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment.' },
        { status: 429, headers: { 'Retry-After': '60' } },
      )
    }

    return null
  } catch (err) {
    console.error('[stripe-rate-limit] Redis error, allowing request:', err instanceof Error ? err.message : err)
    return null
  }
}
