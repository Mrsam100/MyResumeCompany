import { NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/auth'
import { stripe } from '@/lib/stripe/client'
import { getOrCreateStripeCustomer } from '@/lib/stripe/helpers'
import { checkStripeRateLimit } from '@/lib/stripe/rate-limit'
import { CREDIT_PACKS } from '@/constants/credit-costs'

const inputSchema = z.object({
  packId: z.enum(['starter', 'popular', 'power']),
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
  const rateLimitError = await checkStripeRateLimit(session.user.id)
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
    const customerId = await getOrCreateStripeCustomer(session.user.id)

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${pack.label} — ${pack.credits} Credits`,
              description: `${pack.credits} credits for AI resume features`,
            },
            unit_amount: pack.price,
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: session.user.id,
        type: 'credit_pack',
        packId: pack.id,
        credits: String(pack.credits),
      },
      success_url: `${appUrl}/credits?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${appUrl}/credits?canceled=true`,
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (err) {
    console.error('Stripe credit checkout error:', err)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
