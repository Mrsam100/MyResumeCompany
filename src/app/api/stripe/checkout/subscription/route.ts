import { NextResponse } from 'next/server'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { auth } from '@/auth'
import { stripe } from '@/lib/stripe/client'
import { getOrCreateStripeCustomer, getSubscriptionPriceId } from '@/lib/stripe/helpers'
import { db } from '@/lib/db'
import { subscriptions } from '@/lib/db/schema'
import { checkStripeRateLimit } from '@/lib/stripe/rate-limit'

const inputSchema = z.object({
  plan: z.enum(['monthly', 'yearly']),
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // (#15) CSRF: verify Origin header
  const origin = req.headers.get('origin')
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  if (origin && new URL(appUrl).origin !== new URL(origin).origin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // (#5) Rate limit
  const rateLimitError = checkStripeRateLimit(session.user.id)
  if (rateLimitError) return rateLimitError

  // (#3) Query DB directly instead of trusting stale JWT session
  const existingSub = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.userId, session.user.id),
    columns: { status: true },
  })
  if (existingSub?.status === 'ACTIVE') {
    return NextResponse.json({ error: 'Already subscribed to Pro' }, { status: 400 })
  }

  let parsed: z.infer<typeof inputSchema>
  try {
    const body = await req.json()
    const result = inputSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }
    parsed = result.data
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const priceId = getSubscriptionPriceId(parsed.plan)
  if (!priceId) {
    return NextResponse.json(
      { error: 'Subscription plan not configured. Please contact support.' },
      { status: 500 },
    )
  }

  try {
    const customerId = await getOrCreateStripeCustomer(session.user.id)

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: {
        userId: session.user.id,
        type: 'subscription',
        plan: parsed.plan,
      },
      success_url: `${appUrl}/credits?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${appUrl}/credits?canceled=true`,
      subscription_data: {
        metadata: {
          userId: session.user.id,
        },
      },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (err) {
    console.error('Stripe subscription checkout error:', err)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
