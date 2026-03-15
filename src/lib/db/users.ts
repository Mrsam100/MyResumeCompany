import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { users } from './schema'
import type { SubscriptionTier } from './schema'

export async function getUserById(id: string) {
  const result = await db.query.users.findFirst({
    where: eq(users.id, id),
    with: { subscription: true },
  })
  return result ?? null
}

export async function getUserByEmail(email: string) {
  const result = await db.query.users.findFirst({
    where: eq(users.email, email),
    with: { subscription: true },
  })
  return result ?? null
}

export async function updateUserProfile(
  userId: string,
  data: { name?: string; image?: string },
) {
  const [updated] = await db.update(users).set(data).where(eq(users.id, userId)).returning()
  return updated ?? null
}

export async function updateUserSubscriptionTier(userId: string, tier: SubscriptionTier) {
  const [updated] = await db
    .update(users)
    .set({ subscriptionTier: tier })
    .where(eq(users.id, userId))
    .returning()
  return updated ?? null
}

export async function deleteUser(userId: string) {
  const [deleted] = await db.delete(users).where(eq(users.id, userId)).returning()
  return deleted ?? null
}
