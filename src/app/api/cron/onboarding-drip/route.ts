import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { and, lt, gte, eq, isNotNull } from 'drizzle-orm'
import { sendOnboardingEmail, ONBOARDING_EMAILS } from '@/lib/email'

/**
 * Cron endpoint: sends onboarding drip emails.
 * Call daily via Vercel Cron or Cloudflare Cron Trigger.
 * Protected by CRON_SECRET header.
 */
export async function GET(req: Request) {
  const cronSecret = process.env.CRON_SECRET
  const secret = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!cronSecret || secret !== cronSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()
  let sent = 0

  for (const email of ONBOARDING_EMAILS) {
    // Find users who signed up X days ago and haven't received this step yet
    const daysAgo = new Date(now.getTime() - email.day * 24 * 60 * 60 * 1000)
    const dayBefore = new Date(daysAgo.getTime() - 24 * 60 * 60 * 1000)

    const eligibleUsers = await db
      .select({ id: users.id, email: users.email, name: users.name, onboardingStep: users.onboardingStep })
      .from(users)
      .where(
        and(
          lt(users.onboardingStep, email.day),
          lt(users.createdAt, daysAgo),
          gte(users.createdAt, dayBefore),
          isNotNull(users.email),
        ),
      )
      .limit(100)

    for (const user of eligibleUsers) {
      if (!user.email) continue
      try {
        await sendOnboardingEmail(user.email, user.name || 'there', email.day)
        await db.update(users).set({ onboardingStep: email.day }).where(eq(users.id, user.id))
        sent++
      } catch (err) {
        console.error(`Failed to send onboarding email to ${user.id}:`, err)
      }
    }
  }

  return NextResponse.json({ sent, timestamp: now.toISOString() })
}
