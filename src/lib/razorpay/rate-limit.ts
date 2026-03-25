import { NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { redis } from '@/lib/redis'

const paymentLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 m'),
  prefix: '@app/payment-ratelimit',
  analytics: true,
})

/**
 * Redis-backed rate limiter for payment checkout routes.
 * 10 requests per minute per user.
 * Fails open on Redis errors (allows request through).
 */
export async function checkPaymentRateLimit(
  userId: string,
): Promise<NextResponse | null> {
  try {
    const { success } = await paymentLimiter.limit(userId)

    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment.' },
        { status: 429, headers: { 'Retry-After': '60' } },
      )
    }

    return null
  } catch (err) {
    console.error('[payment-rate-limit] Redis error, allowing request:', err instanceof Error ? err.message : err)
    return null
  }
}
