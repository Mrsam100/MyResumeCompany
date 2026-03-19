import { NextResponse } from 'next/server'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { verifyPassword, hashPassword } from '@/lib/auth/password'
import { invalidateSessionCache } from '@/lib/redis'

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'At least 8 characters')
    .regex(/[A-Z]/, 'One uppercase letter required')
    .regex(/[a-z]/, 'One lowercase letter required')
    .regex(/[0-9]/, 'One number required'),
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const parsed = changePasswordSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      )
    }

    const { currentPassword, newPassword } = parsed.data

    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
      columns: { hashedPassword: true },
    })

    if (!user?.hashedPassword) {
      return NextResponse.json(
        { error: 'Password change is not available for social login accounts' },
        { status: 400 },
      )
    }

    const isValid = await verifyPassword(currentPassword, user.hashedPassword)
    if (!isValid) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 403 })
    }

    const newHash = await hashPassword(newPassword)
    await db.update(users).set({ hashedPassword: newHash }).where(eq(users.id, session.user.id))

    // Invalidate session cache so next request fetches fresh data
    await invalidateSessionCache(session.user.id)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to change password' }, { status: 500 })
  }
}
