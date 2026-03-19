import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { auth } from '@/auth'
import { stripe } from '@/lib/stripe/client'
import { db } from '@/lib/db'
import { subscriptions } from '@/lib/db/schema'
import { checkStripeRateLimit } from '@/lib/stripe/rate-limit'

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

  const subscription = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.userId, session.user.id),
    columns: { stripeCustomerId: true },
  })

  if (!subscription?.stripeCustomerId) {
    return NextResponse.json({ error: 'No billing account found' }, { status: 400 })
  }

  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: `${appUrl}/settings`,
    })

    return NextResponse.json({ url: portalSession.url })
  } catch (err) {
    console.error('Stripe portal error:', err)
    return NextResponse.json({ error: 'Failed to create portal session' }, { status: 500 })
  }
}
