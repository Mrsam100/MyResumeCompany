import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import * as Sentry from '@sentry/nextjs'
import { auth } from '@/auth'
import { razorpay } from '@/lib/razorpay/client'
import { db } from '@/lib/db'
import { users, subscriptions } from '@/lib/db/schema'
import { invalidateSessionCache } from '@/lib/redis'
import { checkPaymentRateLimit } from '@/lib/razorpay/rate-limit'

/**
 * Cancel the user's Razorpay subscription.
 * Downgrades to FREE tier immediately.
 */
export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // CSRF: verify Origin header
  const origin = req.headers.get('origin')
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  if (origin && new URL(appUrl).origin !== new URL(origin).origin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const rateLimitError = await checkPaymentRateLimit(session.user.id)
  if (rateLimitError) return rateLimitError

  const subscription = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.userId, session.user.id),
    columns: { razorpaySubscriptionId: true, status: true },
  })

  if (!subscription?.razorpaySubscriptionId) {
    return NextResponse.json({ error: 'No active subscription found' }, { status: 400 })
  }

  if (subscription.status !== 'ACTIVE') {
    return NextResponse.json({ error: 'Subscription is not active' }, { status: 400 })
  }

  try {
    // Cancel on Razorpay (cancel_at_cycle_end: false = immediate)
    await razorpay.subscriptions.cancel(subscription.razorpaySubscriptionId)

    // Update local DB
    await db.transaction(async (tx) => {
      await tx
        .update(subscriptions)
        .set({ status: 'CANCELED' })
        .where(eq(subscriptions.userId, session.user.id))

      await tx
        .update(users)
        .set({ subscriptionTier: 'FREE' })
        .where(eq(users.id, session.user.id))
    })

    await invalidateSessionCache(session.user.id).catch((err) => {
      Sentry.captureException(err, { tags: { component: 'razorpay-cancel', feature: 'session-cache' } })
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Razorpay subscription cancellation error:', err)
    Sentry.captureException(err, { tags: { component: 'razorpay-cancel' } })
    return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 })
  }
}
