import { NextResponse } from 'next/server'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { auth } from '@/auth'
import { razorpay } from '@/lib/razorpay/client'
import { db } from '@/lib/db'
import { subscriptions } from '@/lib/db/schema'
import { checkPaymentRateLimit } from '@/lib/razorpay/rate-limit'

const inputSchema = z.object({
  plan: z.enum(['monthly', 'yearly']),
})

function getPlanId(plan: 'monthly' | 'yearly'): string | null {
  if (plan === 'monthly') return process.env.RAZORPAY_PLAN_ID_MONTHLY ?? null
  return process.env.RAZORPAY_PLAN_ID_YEARLY ?? null
}

/**
 * Create a Razorpay subscription.
 * Client opens the Razorpay modal with the returned subscription_id.
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

  // Check if already subscribed
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

  const planId = getPlanId(parsed.plan)
  if (!planId) {
    return NextResponse.json(
      { error: 'Subscription plan not configured. Please contact support.' },
      { status: 500 },
    )
  }

  try {
    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      total_count: parsed.plan === 'monthly' ? 120 : 10, // max billing cycles
      notes: {
        userId: session.user.id,
        type: 'subscription',
        plan: parsed.plan,
      },
    })

    return NextResponse.json({
      subscriptionId: subscription.id,
      plan: parsed.plan,
    })
  } catch (err) {
    console.error('Razorpay subscription creation error:', err)
    return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 })
  }
}
