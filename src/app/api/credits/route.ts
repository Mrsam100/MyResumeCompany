import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getCreditBalance, getTransactionHistory } from '@/lib/db/credits'

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = new URL(req.url)
  // (#5) Validate and clamp pagination params
  const rawPage = parseInt(url.searchParams.get('page') ?? '1', 10)
  const rawLimit = parseInt(url.searchParams.get('limit') ?? '20', 10)
  const page = Math.max(1, Number.isFinite(rawPage) ? rawPage : 1)
  const limit = Math.min(100, Math.max(1, Number.isFinite(rawLimit) ? rawLimit : 20))

  try {
    const [balance, history] = await Promise.all([
      getCreditBalance(session.user.id),
      getTransactionHistory(session.user.id, { page, limit }),
    ])

    return NextResponse.json({
      credits: balance.credits,
      tier: balance.tier,
      transactions: history.transactions,
      totalTransactions: history.total,
      page: history.page,
      totalPages: history.totalPages,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch credits' }, { status: 500 })
  }
}
