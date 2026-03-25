import { NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/auth'
import { razorpay } from '@/lib/razorpay/client'
import { checkPaymentRateLimit } from '@/lib/razorpay/rate-limit'
import { CREDIT_PACKS, CURRENCY } from '@/constants/credit-costs'

const inputSchema = z.object({
  packId: z.enum(['starter', 'popular', 'power']),
})

/**
 * Create a Razorpay order for credit pack purchase.
 * Client opens the Razorpay modal with the returned order_id.
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

  let parsed: z.infer<typeof inputSchema>
  try {
    const body = await req.json()
    const result = inputSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid pack ID' }, { status: 400 })
    }
    parsed = result.data
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const pack = CREDIT_PACKS.find((p) => p.id === parsed.packId)
  if (!pack) {
    return NextResponse.json({ error: 'Pack not found' }, { status: 400 })
  }

  try {
    const order = await razorpay.orders.create({
      amount: pack.price,
      currency: CURRENCY.code,
      receipt: `credits_${session.user.id}_${Date.now()}`,
      notes: {
        userId: session.user.id,
        type: 'credit_pack',
        packId: pack.id,
        credits: String(pack.credits),
      },
    })

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      packId: pack.id,
      credits: pack.credits,
    })
  } catch (err) {
    console.error('Razorpay order creation error:', err)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
