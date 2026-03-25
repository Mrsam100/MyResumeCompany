import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import * as Sentry from '@sentry/nextjs'
import { verifyWebhookSignature } from '@/lib/razorpay/verify'
import { db } from '@/lib/db'
import { paymentEvents } from '@/lib/db/schema'
import { addCredits } from '@/lib/db/credits'
import { CREDIT_PACKS } from '@/constants/credit-costs'

export const dynamic = 'force-dynamic'

interface RazorpayWebhookEvent {
  entity: string
  account_id: string
  event: string
  contains: string[]
  payload: {
    payment?: { entity: RazorpayPayment }
    order?: { entity: RazorpayOrder }
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
  notes: Record<string, string>
}

interface RazorpayOrder {
  id: string
  entity: string
  amount: number
  currency: string
  status: string
  notes: Record<string, string>
}

/**
 * Build a unique event ID for idempotency.
 */
function buildEventId(event: RazorpayWebhookEvent): string {
  const entityId = event.payload.payment?.entity?.id ?? 'unknown'
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
    // Record event first (unique PK prevents duplicates)
    try {
      await db.insert(paymentEvents).values({ id: eventId, type: event.event })
    } catch (insertErr: unknown) {
      if (insertErr instanceof Error && 'code' in insertErr && (insertErr as { code: string }).code === '23505') {
        return NextResponse.json({ received: true, duplicate: true })
      }
      throw insertErr
    }

    // Only handle payment.captured — this is the backup for credit pack purchases
    // in case the client-side verify call failed after modal success.
    if (event.event === 'payment.captured') {
      await handlePaymentCaptured(event)
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
       (('code' in err) && (err as { code: string }).code === '23503'))

    if (isPermanent) {
      Sentry.captureMessage(`PERMANENT webhook failure for event ${eventId}`, {
        level: 'fatal',
        tags: { component: 'razorpay-webhook', event_type: event.event },
      })
      return NextResponse.json({ received: true, error: 'permanent failure' })
    }

    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

/**
 * Handle payment.captured — backup credit award for credit pack purchases.
 * The primary path is the client-side verify call. This handles the case
 * where the client verify timed out or failed after payment succeeded.
 *
 * Idempotency: checks payment_events for verify_{payment_id} before crediting.
 */
async function handlePaymentCaptured(event: RazorpayWebhookEvent) {
  const payment = event.payload.payment?.entity
  if (!payment) return

  const userId = payment.notes?.userId
  const type = payment.notes?.type
  const packId = payment.notes?.packId
  const creditsStr = payment.notes?.credits

  if (!userId || type !== 'credit_pack' || !packId || !creditsStr) return

  // Check if verify endpoint already credited this payment
  const verifyEventId = `verify_${payment.id}`
  const alreadyVerified = await db.query.paymentEvents.findFirst({
    where: eq(paymentEvents.id, verifyEventId),
  })
  if (alreadyVerified) {
    console.log(`Payment ${payment.id} already verified by client, skipping webhook credit`)
    return
  }

  // Record that we're crediting via webhook (prevents double if verify comes later)
  try {
    await db.insert(paymentEvents).values({ id: verifyEventId, type: 'webhook_credit' })
  } catch (insertErr: unknown) {
    if (insertErr instanceof Error && 'code' in insertErr && (insertErr as { code: string }).code === '23505') {
      return // Already processed
    }
    throw insertErr
  }

  const credits = parseInt(creditsStr, 10)
  if (isNaN(credits) || credits <= 0) {
    Sentry.captureMessage('Invalid credit amount in payment notes', { level: 'error', extra: { paymentId: payment.id } })
    return
  }

  const pack = CREDIT_PACKS.find((p) => p.id === packId)
  await addCredits(
    userId,
    credits,
    'PURCHASE',
    `Credit pack: ${pack?.label ?? packId} (${credits} credits) — Payment: ${payment.id} (webhook)`,
  )

  console.log(`Webhook credited ${credits} credits for user ${userId} (payment: ${payment.id})`)
}
