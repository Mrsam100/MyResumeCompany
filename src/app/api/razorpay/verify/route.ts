import { NextResponse } from 'next/server'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import * as Sentry from '@sentry/nextjs'
import { auth } from '@/auth'
import { verifyPaymentSignature } from '@/lib/razorpay/verify'
import { db } from '@/lib/db'
import { paymentEvents } from '@/lib/db/schema'
import { addCredits } from '@/lib/db/credits'
import { CREDIT_PACKS } from '@/constants/credit-costs'

const inputSchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
  packId: z.enum(['starter', 'popular', 'pro']),
})

/**
 * Verify Razorpay payment after checkout modal completes.
 * Awards credits for credit pack purchases. Idempotent via payment_id.
 */
export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let parsed: z.infer<typeof inputSchema>
  try {
    const body = await req.json()
    const result = inputSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid verification data' }, { status: 400 })
    }
    parsed = result.data
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  try {
    const isValid = verifyPaymentSignature(
      parsed.razorpay_order_id,
      parsed.razorpay_payment_id,
      parsed.razorpay_signature,
    )
    if (!isValid) {
      Sentry.captureMessage('Invalid Razorpay payment signature', {
        level: 'error',
        extra: { orderId: parsed.razorpay_order_id, userId: session.user.id },
      })
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 })
    }

    // Idempotency: check if this payment was already processed
    const paymentEventId = `verify_${parsed.razorpay_payment_id}`
    try {
      await db.insert(paymentEvents).values({ id: paymentEventId, type: 'credit_pack_verify' })
    } catch (insertErr: unknown) {
      if (insertErr instanceof Error && 'code' in insertErr && (insertErr as { code: string }).code === '23505') {
        return NextResponse.json({ success: true, duplicate: true })
      }
      throw insertErr
    }

    const pack = CREDIT_PACKS.find((p) => p.id === parsed.packId)
    if (!pack) {
      Sentry.captureMessage('Pack config mismatch on verify', {
        level: 'warning',
        extra: { packId: parsed.packId, paymentId: parsed.razorpay_payment_id },
      })
      return NextResponse.json({ error: 'Pack not found' }, { status: 400 })
    }

    await addCredits(
      session.user.id,
      pack.credits,
      'PURCHASE',
      `Credit pack: ${pack.id} (${pack.credits} credits) — Payment: ${parsed.razorpay_payment_id}`,
    )

    return NextResponse.json({ success: true, credits: pack.credits })
  } catch (err) {
    console.error('Razorpay verification error:', err)
    Sentry.captureException(err, { tags: { component: 'razorpay-verify' } })
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
