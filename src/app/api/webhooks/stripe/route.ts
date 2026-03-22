import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { eq, sql } from 'drizzle-orm'
import Stripe from 'stripe'
import * as Sentry from '@sentry/nextjs'
import { getStripe } from '@/lib/stripe/client'
import { db } from '@/lib/db'
import { users, subscriptions, stripeEvents, creditTransactions } from '@/lib/db/schema'
import { addCredits } from '@/lib/db/credits'
import { invalidateSessionCache } from '@/lib/redis'
import { SIGNUP_CREDITS } from '@/constants/credit-costs'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  // Read webhook secret at request time, not module load (#9)
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET not configured')
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }

  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    Sentry.captureException(err, { tags: { component: 'stripe-webhook', reason: 'invalid_signature' } })
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // ── Idempotency: skip already-processed events (fail-closed) ──
  try {
    const existing = await db.query.stripeEvents.findFirst({
      where: eq(stripeEvents.id, event.id),
    })
    if (existing) {
      return NextResponse.json({ received: true, duplicate: true })
    }
  } catch (err) {
    Sentry.captureException(err, { tags: { component: 'stripe-webhook', reason: 'idempotency_check_failed' } })
    return NextResponse.json({ error: 'Idempotency check failed' }, { status: 500 })
  }

  try {
    // Record event FIRST via insert (unique PK prevents duplicates even on concurrent retries)
    // If this fails with conflict, another instance already claimed it
    try {
      await db.insert(stripeEvents).values({ id: event.id, type: event.type })
    } catch (insertErr: unknown) {
      if (insertErr instanceof Error && 'code' in insertErr && (insertErr as { code: string }).code === '23505') {
        return NextResponse.json({ received: true, duplicate: true })
      }
      throw insertErr
    }

    // Now process the event — we own it
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'invoice.paid':
        await handleInvoicePaid(event.data.object as Stripe.Invoice)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice)
        break

      default:
        break
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    Sentry.captureException(err, { tags: { component: 'stripe-webhook', event_type: event.type, event_id: event.id } })

    // Distinguish transient vs permanent errors
    const isPermanent =
      err instanceof Error &&
      (err.message === 'User not found' || err.message === 'Credit amount must be positive')

    if (isPermanent) {
      Sentry.captureMessage(`PERMANENT webhook failure for event ${event.id}`, { level: 'fatal', tags: { component: 'stripe-webhook', event_type: event.type } })
      return NextResponse.json({ received: true, error: 'permanent failure' })
    }

    // Transient error — return 500 so Stripe retries
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

// ─── Checkout completed (credit purchase OR new subscription) ───
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId
  if (!userId) {
    Sentry.captureMessage('Checkout session missing userId metadata', { level: 'error', extra: { sessionId: session.id } })
    return
  }

  const type = session.metadata?.type

  if (type === 'credit_pack') {
    const credits = parseInt(session.metadata?.credits ?? '0', 10)
    if (credits <= 0 || isNaN(credits)) {
      Sentry.captureMessage('Invalid credit amount in checkout metadata', { level: 'error', extra: { sessionId: session.id } })
      return
    }

    const packId = session.metadata?.packId ?? 'unknown'
    await addCredits(
      userId,
      credits,
      'PURCHASE',
      `Credit pack purchase: ${packId} (${credits} credits)`,
    )
    console.log(`Credits added: ${credits} for user ${userId} (pack: ${packId})`)
  }

  if (type === 'subscription') {
    const stripeSubscriptionId =
      typeof session.subscription === 'string'
        ? session.subscription
        : session.subscription?.id

    if (stripeSubscriptionId && session.customer) {
      const customerId =
        typeof session.customer === 'string' ? session.customer : session.customer.id

      // (#2) Atomic: subscription upsert + tier upgrade + bonus credits in one transaction
      await db.transaction(async (tx) => {
        await tx
          .insert(subscriptions)
          .values({
            userId,
            stripeCustomerId: customerId,
            stripeSubscriptionId,
            status: 'ACTIVE',
          })
          .onConflictDoUpdate({
            target: subscriptions.userId,
            set: {
              stripeSubscriptionId,
              stripeCustomerId: customerId,
              status: 'ACTIVE',
            },
          })

        await tx
          .update(users)
          .set({ subscriptionTier: 'PRO' })
          .where(eq(users.id, userId))

        // (#13) Use SIGNUP_BONUS for initial activation, not SUBSCRIPTION_MONTHLY
        const [updatedUser] = await tx
          .update(users)
          .set({ credits: sql`${users.credits} + ${SIGNUP_CREDITS.PRO}` })
          .where(eq(users.id, userId))
          .returning({ credits: users.credits })

        await tx.insert(creditTransactions).values({
          userId,
          amount: SIGNUP_CREDITS.PRO,
          type: 'SIGNUP_BONUS',
          description: 'Pro subscription activated — 500 bonus credits',
        })

        console.log(
          `Subscription activated for user ${userId}, credits: ${updatedUser?.credits}`,
        )
      })

      await invalidateSessionCache(userId).catch((err) => {
        Sentry.captureException(err, { tags: { component: 'stripe-webhook', feature: 'session-cache' } })
      })
    }
  }
}

// ─── Invoice paid (recurring subscription payment) ───
async function handleInvoicePaid(invoice: Stripe.Invoice) {
  if (invoice.billing_reason === 'subscription_create') return

  const customerId =
    typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id
  if (!customerId) return

  const subscription = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.stripeCustomerId, customerId),
    columns: { userId: true },
  })

  if (!subscription) {
    Sentry.captureMessage('No subscription found for customer', { level: 'warning', extra: { customerId } })
    return
  }

  try {
    await addCredits(
      subscription.userId,
      SIGNUP_CREDITS.PRO,
      'SUBSCRIPTION_MONTHLY',
      'Pro monthly credit refill — 500 credits',
    )
    console.log(`Monthly credits added for user ${subscription.userId}`)
  } catch (err) {
    Sentry.captureException(err, { level: 'fatal', tags: { component: 'stripe-webhook', feature: 'monthly-credits' }, extra: { userId: subscription.userId } })
    throw err // Re-throw so Stripe retries
  }
}

// ─── Subscription updated (plan change, status change) ───
async function handleSubscriptionUpdated(sub: Stripe.Subscription) {
  const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id

  const existing = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.stripeCustomerId, customerId),
    columns: { userId: true },
  })

  if (!existing) return

  const status = mapStripeStatus(sub.status)
  const priceId = sub.items.data[0]?.price?.id ?? null

  // Atomic: update subscription + tier in one transaction
  await db.transaction(async (tx) => {
    await tx
      .update(subscriptions)
      .set({
        status,
        stripePriceId: priceId,
        stripeSubscriptionId: sub.id,
        currentPeriodStart: sub.items.data[0]?.current_period_start
          ? new Date(sub.items.data[0].current_period_start * 1000) : null,
        currentPeriodEnd: sub.items.data[0]?.current_period_end
          ? new Date(sub.items.data[0].current_period_end * 1000) : null,
      })
      .where(eq(subscriptions.stripeCustomerId, customerId))

    if (status === 'CANCELED') {
      await tx.update(users).set({ subscriptionTier: 'FREE' }).where(eq(users.id, existing.userId))
      console.log(`User ${existing.userId} downgraded to FREE`)
    } else if (status === 'ACTIVE') {
      await tx.update(users).set({ subscriptionTier: 'PRO' }).where(eq(users.id, existing.userId))
    }
  })

  await invalidateSessionCache(existing.userId).catch((err) => {
    Sentry.captureException(err, { tags: { component: 'stripe-webhook', feature: 'session-cache' } })
  })
}

// ─── Subscription deleted (cancellation finalized) ───
async function handleSubscriptionDeleted(sub: Stripe.Subscription) {
  const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id

  const existing = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.stripeCustomerId, customerId),
    columns: { userId: true },
  })

  if (!existing) return

  // (#14) Keep stripeSubscriptionId for audit trail, only update status
  await db.transaction(async (tx) => {
    await tx
      .update(subscriptions)
      .set({ status: 'CANCELED' })
      .where(eq(subscriptions.stripeCustomerId, customerId))

    await tx.update(users).set({ subscriptionTier: 'FREE' }).where(eq(users.id, existing.userId))
  })

  await invalidateSessionCache(existing.userId).catch((err) => {
    Sentry.captureException(err, { tags: { component: 'stripe-webhook', feature: 'session-cache' } })
  })
  console.log(`Subscription deleted, user ${existing.userId} downgraded to FREE`)
}

// ─── Payment failed ───
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId =
    typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id
  if (!customerId) return

  const existing = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.stripeCustomerId, customerId),
    columns: { userId: true },
  })

  if (!existing) return

  // Atomic: mark subscription PAST_DUE + downgrade tier to prevent free Pro usage
  await db.transaction(async (tx) => {
    await tx
      .update(subscriptions)
      .set({ status: 'PAST_DUE' })
      .where(eq(subscriptions.stripeCustomerId, customerId))

    await tx
      .update(users)
      .set({ subscriptionTier: 'FREE' })
      .where(eq(users.id, existing.userId))
  })

  await invalidateSessionCache(existing.userId).catch((err) => {
    Sentry.captureException(err, { tags: { component: 'stripe-webhook', feature: 'session-cache' } })
  })
  console.log(`Payment failed for user ${existing.userId}, downgraded to FREE + PAST_DUE`)
}

// ─── Map Stripe status to our enum ───
function mapStripeStatus(
  status: Stripe.Subscription.Status,
): 'ACTIVE' | 'CANCELED' | 'PAST_DUE' | 'TRIALING' {
  switch (status) {
    case 'active':
      return 'ACTIVE'
    case 'trialing':
      return 'TRIALING'
    case 'past_due':
      return 'PAST_DUE'
    case 'canceled':
    case 'unpaid':
    case 'incomplete':
    case 'incomplete_expired':
    case 'paused':
    default:
      return 'CANCELED'
  }
}
