import { NextResponse } from 'next/server'
import { hashPassword } from '@/lib/auth/password'

import { db } from '@/lib/db'
import { users, creditTransactions } from '@/lib/db/schema'
import { signupSchema } from '@/lib/validations/auth'
import { checkAuthRateLimit } from '@/lib/auth/rate-limit'
import { sql } from 'drizzle-orm'

export async function POST(req: Request) {
  // (#4) Rate limit: 10 signups per IP per hour
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const rateLimitError = await checkAuthRateLimit(ip, 'register')
  if (rateLimitError) return rateLimitError

  try {
    const body = await req.json()
    const parsed = signupSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      )
    }

    const { name, password } = parsed.data
    // (#1) Explicit email normalization — don't rely on Zod transform alone
    const email = parsed.data.email.toLowerCase().trim()

    const hashedPassword = await hashPassword(password)

    // (#6) Atomic: user creation + credit award in single transaction
    let newUser: { id: string }
    try {
      newUser = await db.transaction(async (tx) => {
        const [inserted] = await tx
          .insert(users)
          .values({ name, email, hashedPassword })
          .returning({ id: users.id })

        // Award signup bonus atomically
        await tx
          .update(users)
          .set({ credits: sql`${users.credits} + 100` })
          .where(sql`${users.id} = ${inserted.id}`)

        await tx.insert(creditTransactions).values({
          userId: inserted.id,
          amount: 100,
          type: 'SIGNUP_BONUS',
          description: 'Welcome bonus — 100 free credits',
        })

        return inserted
      })
    } catch (err: unknown) {
      if (err instanceof Error && 'code' in err && (err as { code: string }).code === '23505') {
        return NextResponse.json(
          { error: 'An account with this email already exists' },
          { status: 409 },
        )
      }
      throw err
    }

    return NextResponse.json({ success: true, userId: newUser.id }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
