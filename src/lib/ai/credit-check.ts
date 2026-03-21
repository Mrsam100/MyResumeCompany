import { NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { auth } from '@/auth'
import { deductCredits, addCredits } from '@/lib/db/credits'
import type { CreditTransactionType } from '@/lib/db/schema'
import { checkRateLimit } from '@/lib/ai/rate-limiter'

interface AuthResult {
  userId: string
  tier: string
  error?: Response
}

/**
 * Authenticate the user, check rate limit, and return their ID + tier.
 * Does NOT deduct credits — call deductCreditsForAI separately after validation.
 *
 * @param rateLimitPrefix - Namespace for rate limiting (e.g., 'ai', 'pdf')
 */
export async function checkAuth(rateLimitPrefix = 'ai'): Promise<AuthResult> {
  const session = await auth()
  if (!session?.user?.id) {
    return { userId: '', tier: 'FREE', error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }

  const tier = (session.user as { subscriptionTier?: string }).subscriptionTier ?? 'FREE'

  // Rate limit check
  const rateLimitError = await checkRateLimit(session.user.id, tier, rateLimitPrefix)
  if (rateLimitError) {
    return { userId: session.user.id, tier, error: rateLimitError }
  }

  return { userId: session.user.id, tier }
}

/**
 * Deduct credits for an AI operation. Call AFTER input validation succeeds.
 * Returns a NextResponse error on failure, or undefined on success.
 */
export async function deductCreditsForAI(
  userId: string,
  cost: number,
  type: CreditTransactionType,
  description: string,
): Promise<Response | undefined> {
  try {
    await deductCredits(userId, cost, type, description)
    return undefined
  } catch (err) {
    if (err instanceof Error && err.message === 'Insufficient credits') {
      return NextResponse.json({ error: 'Insufficient credits', required: cost }, { status: 402 })
    }
    return NextResponse.json({ error: 'Credit check failed' }, { status: 500 })
  }
}

/**
 * Refund credits if AI generation fails after deduction.
 * Retries up to 2 times with 500ms delay. Never throws.
 */
export async function refundCredits(
  userId: string,
  amount: number,
  type: CreditTransactionType,
  description: string,
): Promise<void> {
  const maxRetries = 3
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await addCredits(userId, amount, 'REFUND', `Refund (${type}): ${description}`)
      return
    } catch (err) {
      if (attempt === maxRetries) {
        Sentry.captureException(err, {
          level: 'fatal',
          tags: { component: 'credits', reason: 'refund_failed' },
          extra: { userId, amount, type, description, attempts: maxRetries },
        })
        console.error(
          `CRITICAL: Refund failed after ${maxRetries} attempts. userId=${userId} amount=${amount} type=${type} description="${description}"`,
          err,
        )
        return
      }
      await new Promise((r) => setTimeout(r, 500))
    }
  }
}
