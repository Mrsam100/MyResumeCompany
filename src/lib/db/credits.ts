import { eq, desc, and, count, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { users, creditTransactions } from './schema'
import type { CreditTransactionType } from './schema'

export async function checkSufficientCredits(userId: string, cost: number) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { credits: true, subscriptionTier: true },
  })

  if (!user) throw new Error('User not found')

  if (user.subscriptionTier === 'PRO') return true

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

  return db.transaction(async (tx) => {
    const [user] = await tx
      .select({ credits: users.credits, subscriptionTier: users.subscriptionTier })
      .from(users)
      .where(eq(users.id, userId))
      .for('update')

    if (!user) throw new Error('User not found')

    if (user.subscriptionTier === 'PRO') {
      await tx.insert(creditTransactions).values({
        userId,
        amount: 0,
        type,
        description: `${description ?? type} (Pro — free)`,
        resumeId,
      })
      return { credits: user.credits, charged: 0 }
    }

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
}

export async function addCredits(
  userId: string,
  amount: number,
  type: CreditTransactionType,
  description?: string,
) {
  if (amount <= 0) throw new Error('Credit amount must be positive')

  return db.transaction(async (tx) => {
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
    columns: { credits: true, subscriptionTier: true },
  })

  if (!user) throw new Error('User not found')

  return { credits: user.credits, tier: user.subscriptionTier }
}
