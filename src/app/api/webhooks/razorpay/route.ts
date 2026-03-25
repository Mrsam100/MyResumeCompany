import { NextResponse } from 'next/server'
import { eq, sql } from 'drizzle-orm'
import * as Sentry from '@sentry/nextjs'
import { verifyWebhookSignature } from '@/lib/razorpay/verify'
import { db } from '@/lib/db'
import { users, subscriptions, paymentEvents, creditTransactions } from '@/lib/db/schema'
import { addCredits } from '@/lib/db/credits'
import { invalidateSessionCache } from '@/lib/redis'
import { SIGNUP_CREDITS } from '@/constants/credit-costs'

export const dynamic = 'force-dynamic'

interface RazorpayWebhookEvent {
  entity: string
  account_id: string
  event: string
  contains: string[]
  payload: {
    payment?: { entity: RazorpayPayment }
    subscription?: { entity: RazorpaySubscription }
  }
  created_at: number
}

interface RazorpayPayment {
  id: string
  entity: string
  amount: number
  currency: string
  status: string
  order_id: string | null
  description: string | null
  notes: Record<string, string>
}

interface RazorpaySubscription {
  id: string
  entity: string
  plan_id: string
  status: string
  current_start: number | null
  current_end: number | null
  notes: Record<string, string>
}

/**
 * Build a unique event ID from the webhook payload.
 * Includes entity ID to prevent collisions when multiple entities
 * have events at the same timestamp.
 */
function buildEventId(event: RazorpayWebhookEvent): string {
  const entityId =
    event.payload.subscription?.entity?.id ??
    event.payload.payment?.entity?.id ??
    'unknown'
  return `${event.event}_${entityId}_${event.created_at}`
}

export async function POST(req: Request) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('RAZORPAY_WEBHOOK_SECRET not configured')
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }

  const body = await req.text()
  const signature = req.headers.get('x-razorpay-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing x-razorpay-signature header' }, { status: 400 })
  }

  let isValid: boolean
  try {
    isValid = verifyWebhookSignature(body, signature)
  } catch (err) {
    Sentry.captureException(err, { tags: { component: 'razorpay-webhook', reason: 'signature_error' } })
    return NextResponse.json({ error: 'Signature verification error' }, { status: 400 })
  }

  if (!isValid) {
    Sentry.captureMessage('Invalid Razorpay webhook signature', { level: 'error' })
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  let event: RazorpayWebhookEvent
  try {
    event = JSON.parse(body)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const eventId = buildEventId(event)

  // Idempotency check
  try {
    const existing = await db.query.paymentEvents.findFirst({
      where: eq(paymentEvents.id, eventId),
    })
    if (existing) {
      return NextResponse.json({ received: true, duplicate: true })
    }
  } catch (err) {
    Sentry.captureException(err, { tags: { component: 'razorpay-webhook', reason: 'idempotency_check_failed' } })
    return NextResponse.json({ error: 'Idempotency check failed' }, { status: 500 })
  }

  try {
    // Record event first (unique PK prevents duplicates on concurrent retries)
    try {
      await db.insert(paymentEvents).values({ id: eventId, type: event.event })
    } catch (insertErr: unknown) {
      if (insertErr instanceof Error && 'code' in insertErr && (insertErr as { code: string }).code === '23505') {
        return NextResponse.json({ received: true, duplicate: true })
      }
      throw insertErr
    }

    switch (event.event) {
      case 'subscription.activated':
        await handleSubscriptionActivated(event)
        break

      case 'subscription.charged':
        await handleSubscriptionCharged(event)
        break

      case 'subscription.cancelled':
        await handleSubscriptionCancelled(event)
        break

      case 'subscription.halted':
        await handleSubscriptionHalted(event)
        break

      case 'subscription.pending':
        await handleSubscriptionPending(event)
        break

      case 'payment.failed':
        await handlePaymentFailed(event)
        break

      default:
        break
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    Sentry.captureException(err, {
      tags: { component: 'razorpay-webhook', event_type: event.event, event_id: eventId },
    })

    const isPermanent =
      err instanceof Error &&
      (err.message === 'User not found' ||
       err.message === 'Credit amount must be positive' ||
       (('code' in err) && (err as { code: string }).code === '23503')) // FK violation = user deleted

    if (isPermanent) {
      Sentry.captureMessage(`PERMANENT webhook failure for event ${eventId}`, {
        level: 'fatal',
        tags: { component: 'razorpay-webhook', event_type: event.event },
      })
      return NextResponse.json({ received: true, error: 'permanent failure' })
    }

    // Transient error — return 500 so Razorpay retries
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

// ─── Subscription activated (first payment successful) ───
// This is the ONLY path that awards signup bonus credits.
// The verify endpoint only upserts the subscription record.
async function handleSubscriptionActivated(event: RazorpayWebhookEvent) {
  const sub = event.payload.subscription?.entity
  if (!sub) return

  const userId = sub.notes?.userId
  if (!userId) {
    Sentry.captureMessage('Subscription missing userId in notes', { level: 'error', extra: { subscriptionId: sub.id } })
    return
  }

  await db.transaction(async (tx) => {
    await tx
      .insert(subscriptions)
      .values({
        userId,
        razorpaySubscriptionId: sub.id,
        razorpayPlanId: sub.plan_id,
        status: 'ACTIVE',
        currentPeriodStart: sub.current_start ? new Date(sub.current_start * 1000) : null,
        currentPeriodEnd: sub.current_end ? new Date(sub.current_end * 1000) : null,
      })
      .onConflictDoUpdate({
        target: subscriptions.userId,
        set: {
          razorpaySubscriptionId: sub.id,
          razorpayPlanId: sub.plan_id,
          status: 'ACTIVE',
          currentPeriodStart: sub.current_start ? new Date(sub.current_start * 1000) : null,
          currentPeriodEnd: sub.current_end ? new Date(sub.current_end * 1000) : null,
        },
      })

    await tx
      .update(users)
      .set({ subscriptionTier: 'PRO' })
      .where(eq(users.id, userId))

    await tx
      .update(users)
      .set({ credits: sql`${users.credits} + ${SIGNUP_CREDITS.PRO}` })
      .where(eq(users.id, userId))

    await tx.insert(creditTransactions).values({
      userId,
      amount: SIGNUP_CREDITS.PRO,
      type: 'SIGNUP_BONUS',
      description: `Pro subscription activated — ${SIGNUP_CREDITS.PRO} bonus credits`,
    })
  })

  await invalidateSessionCache(userId).catch((err) => {
    Sentry.captureException(err, { tags: { component: 'razorpay-webhook', feature: 'session-cache' } })
  })

  console.log(`Subscription activated for user ${userId}`)
}

// ─── Recurring subscription charge successful ───
async function handleSubscriptionCharged(event: RazorpayWebhookEvent) {
  const sub = event.payload.subscription?.entity
  if (!sub) return

  const existing = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.razorpaySubscriptionId, sub.id),
    columns: { userId: true },
  })

  if (!existing) {
    Sentry.captureMessage('No subscription found for charge', { level: 'warning', extra: { subscriptionId: sub.id } })
    return
  }

  // Update period dates + ensure ACTIVE status
  await db
    .update(subscriptions)
    .set({
      currentPeriodStart: sub.current_start ? new Date(sub.current_start * 1000) : null,
      currentPeriodEnd: sub.current_end ? new Date(sub.current_end * 1000) : null,
      status: 'ACTIVE',
    })
    .where(eq(subscriptions.razorpaySubscriptionId, sub.id))

  // Skip monthly credits on first charge (activation already awarded SIGNUP_BONUS).
  // Check if a SUBSCRIPTION_MONTHLY credit was ever given for this user.
  // If not, this is the first billing cycle — skip.
  const hasMonthlyCredit = await db.query.creditTransactions.findFirst({
    where: eq(creditTransactions.userId, existing.userId),
    columns: { id: true },
  })

  // The first charge coincides with activation, so check if SIGNUP_BONUS
  // was recently added (within last minute) — if so, skip
  const recentBonus = await db.query.creditTransactions.findFirst({
    where: eq(creditTransactions.userId, existing.userId),
    columns: { id: true, type: true, createdAt: true },
    orderBy: (ct, { desc }) => [desc(ct.createdAt)],
  })

  if (recentBonus?.type === 'SIGNUP_BONUS') {
    const bonusAge = Date.now() - new Date(recentBonus.createdAt).getTime()
    if (bonusAge < 5 * 60 * 1000) {
      // SIGNUP_BONUS was added less than 5 minutes ago — this is the first charge
      console.log(`Skipping monthly credits for user ${existing.userId} (first charge, activation credits already given)`)
      return
    }
  }

  try {
    await addCredits(
      existing.userId,
      SIGNUP_CREDITS.PRO,
      'SUBSCRIPTION_MONTHLY',
      'Pro monthly credit refill — 500 credits',
    )
    console.log(`Monthly credits added for user ${existing.userId}`)
  } catch (err) {
    Sentry.captureException(err, { level: 'fatal', tags: { component: 'razorpay-webhook', feature: 'monthly-credits' } })
    throw err
  }
}

// ─── Subscription cancelled ───
async function handleSubscriptionCancelled(event: RazorpayWebhookEvent) {
  const sub = event.payload.subscription?.entity
  if (!sub) return

  const existing = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.razorpaySubscriptionId, sub.id),
    columns: { userId: true },
  })

  if (!existing) return

  await db.transaction(async (tx) => {
    await tx
      .update(subscriptions)
      .set({ status: 'CANCELED' })
      .where(eq(subscriptions.razorpaySubscriptionId, sub.id))

    await tx
      .update(users)
      .set({ subscriptionTier: 'FREE' })
      .where(eq(users.id, existing.userId))
  })

  await invalidateSessionCache(existing.userId).catch((err) => {
    Sentry.captureException(err, { tags: { component: 'razorpay-webhook', feature: 'session-cache' } })
  })

  console.log(`Subscription cancelled, user ${existing.userId} downgraded to FREE`)
}

// ─── Subscription halted (all payment retries exhausted) ───
// This is the correct place to fully downgrade the user.
async function handleSubscriptionHalted(event: RazorpayWebhookEvent) {
  const sub = event.payload.subscription?.entity
  if (!sub) return

  const existing = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.razorpaySubscriptionId, sub.id),
    columns: { userId: true },
  })

  if (!existing) return

  await db.transaction(async (tx) => {
    await tx
      .update(subscriptions)
      .set({ status: 'CANCELED' })
      .where(eq(subscriptions.razorpaySubscriptionId, sub.id))

    await tx
      .update(users)
      .set({ subscriptionTier: 'FREE' })
      .where(eq(users.id, existing.userId))
  })

  await invalidateSessionCache(existing.userId).catch((err) => {
    Sentry.captureException(err, { tags: { component: 'razorpay-webhook', feature: 'session-cache' } })
  })

  console.log(`Subscription halted (retries exhausted), user ${existing.userId} downgraded to FREE`)
}

// ─── Subscription payment pending ───
async function handleSubscriptionPending(event: RazorpayWebhookEvent) {
  const sub = event.payload.subscription?.entity
  if (!sub) return

  const existing = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.razorpaySubscriptionId, sub.id),
    columns: { userId: true },
  })

  if (!existing) return

  await db
    .update(subscriptions)
    .set({ status: 'PAST_DUE' })
    .where(eq(subscriptions.razorpaySubscriptionId, sub.id))

  console.log(`Subscription pending for user ${existing.userId}`)
}

// ─── Payment failed ───
// Only mark as PAST_DUE — don't downgrade tier yet.
// Razorpay retries automatically. Full downgrade happens on subscription.halted.
async function handlePaymentFailed(event: RazorpayWebhookEvent) {
  const payment = event.payload.payment?.entity
  if (!payment) return

  const userId = payment.notes?.userId
  if (!userId) return

  const existing = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.userId, userId),
    columns: { userId: true, status: true },
  })

  if (!existing || existing.status !== 'ACTIVE') return

  // Only mark PAST_DUE — keep PRO tier until halted
  await db
    .update(subscriptions)
    .set({ status: 'PAST_DUE' })
    .where(eq(subscriptions.userId, userId))

  await invalidateSessionCache(userId).catch((err) => {
    Sentry.captureException(err, { tags: { component: 'razorpay-webhook', feature: 'session-cache' } })
  })

  console.log(`Payment failed for user ${userId}, subscription marked PAST_DUE (retries pending)`)
}
