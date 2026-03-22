import { NextResponse } from 'next/server'
import { z } from 'zod'
import { nanoid } from 'nanoid'
import { eq } from 'drizzle-orm'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { users, referrals } from '@/lib/db/schema'
import { addCredits } from '@/lib/db/credits'
import { sendReferralRewardEmail } from '@/lib/email'

const REFERRAL_CREDITS = 50

// GET — get current user's referral code + stats
export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
    columns: { referralCode: true },
  })

  // Generate referral code if user doesn't have one
  let referralCode = user?.referralCode
  if (!referralCode) {
    referralCode = nanoid(10)
    await db.update(users).set({ referralCode }).where(eq(users.id, session.user.id))
  }

  // Count successful referrals
  const referralList = await db.query.referrals.findMany({
    where: eq(referrals.referrerId, session.user.id),
    columns: { id: true, referrerCredited: true, createdAt: true },
  })

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://myresumecompany.com'

  return NextResponse.json({
    referralCode,
    referralLink: `${appUrl}/signup?ref=${referralCode}`,
    totalReferrals: referralList.length,
    creditsEarned: referralList.filter((r) => r.referrerCredited).length * REFERRAL_CREDITS,
  })
}

// POST — claim referral (called during signup when ref code is present)
const claimSchema = z.object({
  referralCode: z.string().min(1).max(20),
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const parsed = claimSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid referral code' }, { status: 400 })
  }

  const { referralCode } = parsed.data

  // Find referrer
  const referrer = await db.query.users.findFirst({
    where: eq(users.referralCode, referralCode),
    columns: { id: true, email: true, name: true },
  })

  if (!referrer || referrer.id === session.user.id) {
    return NextResponse.json({ error: 'Invalid referral code' }, { status: 400 })
  }

  // Insert referral record — unique constraint on referredId prevents duplicates
  try {
    await db.insert(referrals).values({
      referrerId: referrer.id,
      referredId: session.user.id,
    })
  } catch (insertErr: unknown) {
    // Unique violation = already referred
    if (insertErr instanceof Error && 'code' in insertErr && (insertErr as { code: string }).code === '23505') {
      return NextResponse.json({ error: 'Already referred' }, { status: 409 })
    }
    throw insertErr
  }

  // Credit both users
  const currentUser = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
    columns: { name: true },
  })

  await addCredits(referrer.id, REFERRAL_CREDITS, 'REFERRAL_BONUS', `Referral bonus: ${currentUser?.name || 'a friend'} signed up`)
  await addCredits(session.user.id, REFERRAL_CREDITS, 'REFERRAL_BONUS', `Welcome bonus: referred by ${referrer.name || 'a friend'}`)

  // Mark as credited + store referral on user
  await db.update(referrals)
    .set({ referrerCredited: true, referredCredited: true })
    .where(eq(referrals.referredId, session.user.id))
  await db.update(users).set({ referredBy: referrer.id }).where(eq(users.id, session.user.id))

  // Send reward email to referrer
  if (referrer.email) {
    sendReferralRewardEmail(referrer.email, referrer.name || 'there', currentUser?.name || 'Your friend').catch(console.error)
  }

  return NextResponse.json({ credited: REFERRAL_CREDITS })
}
