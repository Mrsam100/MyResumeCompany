import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { users, subscriptions } from '@/lib/db/schema'
import { stripe } from './client'

/**
 * Get or create a Stripe customer for a user.
 * Uses a transaction with row locking to prevent race conditions (#4).
 */
export async function getOrCreateStripeCustomer(userId: string): Promise<string> {
  return db.transaction(async (tx) => {
    // Lock the user row to prevent concurrent customer creation
    const [user] = await tx
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
      })
      .from(users)
      .where(eq(users.id, userId))
      .for('update')

    if (!user) throw new Error('User not found')

    // Check for existing subscription record (within the same transaction)
    const existing = await tx.query.subscriptions.findFirst({
      where: eq(subscriptions.userId, userId),
      columns: { stripeCustomerId: true },
    })

    if (existing?.stripeCustomerId) {
      return existing.stripeCustomerId
    }

    // Create Stripe customer (outside transaction scope, but that's OK — idempotent)
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name ?? undefined,
      metadata: { userId: user.id },
    })

    // Upsert subscription record with customer ID
    await tx
      .insert(subscriptions)
      .values({
        userId: user.id,
        stripeCustomerId: customer.id,
        status: 'CANCELED',
      })
      .onConflictDoUpdate({
        target: subscriptions.userId,
        set: { stripeCustomerId: customer.id },
      })

    return customer.id
  })
}

/**
 * Get subscription price ID from env vars.
 */
export function getSubscriptionPriceId(plan: 'monthly' | 'yearly'): string | null {
  if (plan === 'monthly') return process.env.STRIPE_PRO_MONTHLY_PRICE_ID ?? null
  return process.env.STRIPE_PRO_YEARLY_PRICE_ID ?? null
}
