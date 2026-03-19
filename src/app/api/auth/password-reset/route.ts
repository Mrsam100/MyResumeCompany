import { NextResponse } from 'next/server'
import { z } from 'zod'
import { eq, and, gt, isNull } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { hashPassword } from '@/lib/auth/password'

import { db } from '@/lib/db'
import { users, passwordResetTokens } from '@/lib/db/schema'
import { checkAuthRateLimit } from '@/lib/auth/rate-limit'

const requestSchema = z.object({
  email: z.string().email().transform((v) => v.toLowerCase().trim()),
})

const resetSchema = z.object({
  token: z.string().min(1),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/[0-9]/),
})

// POST /api/auth/password-reset — Request a reset token
export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const rateLimitError = await checkAuthRateLimit(ip, 'password-reset')
  if (rateLimitError) return rateLimitError

  try {
    const body = await req.json()
    const parsed = requestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const user = await db.query.users.findFirst({
      where: eq(users.email, parsed.data.email),
      columns: { id: true, hashedPassword: true },
    })

    // Always return success to prevent email enumeration
    if (!user || !user.hashedPassword) {
      return NextResponse.json({ success: true })
    }

    // Generate secure token (48 chars)
    const token = nanoid(48)
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Cleanup old tokens + insert new one atomically
    await db.transaction(async (tx) => {
      // Delete all previous tokens for this user (expired, used, or superseded)
      await tx
        .delete(passwordResetTokens)
        .where(eq(passwordResetTokens.userId, user.id))

      await tx.insert(passwordResetTokens).values({
        userId: user.id,
        token,
        expiresAt,
      })
    })

    // TODO: Send email via Resend with reset link
    // For now, log the token in development
    if (process.env.NODE_ENV !== 'production') {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      console.log(`[DEV] Password reset link: ${appUrl}/reset-password?token=${token}`)
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

// PUT /api/auth/password-reset — Use token to set new password
export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const parsed = resetSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      )
    }

    const { token, password } = parsed.data

    // Find valid, unused, non-expired token
    const resetToken = await db.query.passwordResetTokens.findFirst({
      where: and(
        eq(passwordResetTokens.token, token),
        isNull(passwordResetTokens.usedAt),
        gt(passwordResetTokens.expiresAt, new Date()),
      ),
    })

    if (!resetToken) {
      return NextResponse.json(
        { error: 'Invalid or expired reset link. Please request a new one.' },
        { status: 400 },
      )
    }

    const hashedPassword = await hashPassword(password)

    // Atomic: update password + mark token as used
    await db.transaction(async (tx) => {
      await tx
        .update(users)
        .set({ hashedPassword })
        .where(eq(users.id, resetToken.userId))

      await tx
        .update(passwordResetTokens)
        .set({ usedAt: new Date() })
        .where(eq(passwordResetTokens.id, resetToken.id))
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
