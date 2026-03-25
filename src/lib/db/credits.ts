import { eq, desc, and, count, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { users, creditTransactions } from './schema'
import type { CreditTransactionType } from './schema'
import { invalidateSessionCache } from '@/lib/redis'
import { sendLowCreditsEmail } from '@/lib/email'

const LOW_CREDITS_THRESHOLD = 20

export async function checkSufficientCredits(userId: string, cost: number) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { credits: true },
  })

  if (!user) throw new Error('User not found')

  return user.credits >= cost
}

export async function deductCredits(
  userId: string,
  amount: number,
  type: CreditTransactionType,
  description?: string,
  resumeId?: string,
) {
  if (amount <= 0) throw new Error('Deduction amount must be positive')

  const result = await db.transaction(async (tx) => {
    const [user] = await tx
      .select({ credits: users.credits })
      .from(users)
      .where(eq(users.id, userId))
      .for('update')

    if (!user) throw new Error('User not found')

    if (user.credits < amount) {
      throw new Error('Insufficient credits')
    }

    const [updatedUser] = await tx
      .update(users)
      .set({ credits: sql`${users.credits} - ${amount}` })
      .where(eq(users.id, userId))
      .returning({ credits: users.credits })

    await tx.insert(creditTransactions).values({
      userId,
      amount: -amount,
      type,
      description,
      resumeId,
    })

    return { credits: updatedUser.credits, charged: amount }
  })

  await invalidateSessionCache(userId)

  // Trigger low credits email (async, non-blocking)
  if (result.charged > 0 && result.credits > 0 && result.credits < LOW_CREDITS_THRESHOLD) {
    triggerLowCreditsEmail(userId, result.credits).catch(console.error)
  }

  return result
}

async function triggerLowCreditsEmail(userId: string, credits: number) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { email: true, name: true, lowCreditsNotifiedAt: true },
  })
  if (!user?.email) return

  // Only send once per 7 days
  if (user.lowCreditsNotifiedAt) {
    const daysSince = (Date.now() - user.lowCreditsNotifiedAt.getTime()) / (1000 * 60 * 60 * 24)
    if (daysSince < 7) return
  }

  await db.update(users).set({ lowCreditsNotifiedAt: new Date() }).where(eq(users.id, userId))
  await sendLowCreditsEmail(user.email, user.name || 'there', credits)
}

export async function addCredits(
  userId: string,
  amount: number,
  type: CreditTransactionType,
  description?: string,
) {
  if (amount <= 0) throw new Error('Credit amount must be positive')

  const result = await db.transaction(async (tx) => {
    const [updatedUser] = await tx
      .update(users)
      .set({ credits: sql`${users.credits} + ${amount}` })
      .where(eq(users.id, userId))
      .returning({ credits: users.credits })

    if (!updatedUser) throw new Error('User not found')

    await tx.insert(creditTransactions).values({
      userId,
      amount,
      type,
      description,
    })

    return { credits: updatedUser.credits }
  })

  await invalidateSessionCache(userId)
  return result
}

export async function getTransactionHistory(
  userId: string,
  options?: { page?: number; limit?: number; type?: CreditTransactionType },
) {
  const page = Math.max(1, options?.page ?? 1)
  const limit = Math.min(100, Math.max(1, options?.limit ?? 20))
  const offset = (page - 1) * limit

  const conditions = options?.type
    ? and(eq(creditTransactions.userId, userId), eq(creditTransactions.type, options.type))
    : eq(creditTransactions.userId, userId)

  const [transactions, [{ total }]] = await Promise.all([
    db.query.creditTransactions.findMany({
      where: conditions,
      orderBy: desc(creditTransactions.createdAt),
      limit,
      offset,
    }),
    db
      .select({ total: count() })
      .from(creditTransactions)
      .where(conditions),
  ])

  return { transactions, total, page, limit, totalPages: Math.ceil(total / limit) }
}

export async function getCreditBalance(userId: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { credits: true },
  })

  if (!user) throw new Error('User not found')

  return { credits: user.credits }
}
