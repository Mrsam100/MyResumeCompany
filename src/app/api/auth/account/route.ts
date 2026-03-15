import { NextResponse } from 'next/server'
import { z } from 'zod'
import { compare } from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { deleteUser } from '@/lib/db/users'

const deleteSchema = z.object({
  password: z.string().min(1).optional(),
})

export async function DELETE(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // (#5) Require password for credential accounts
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
      columns: { hashedPassword: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // If user has a password (credential account), require re-authentication
    if (user.hashedPassword) {
      let body: { password?: string } = {}
      try {
        body = await req.json()
      } catch {
        // No body provided
      }

      const parsed = deleteSchema.safeParse(body)
      const password = parsed.success ? parsed.data.password : undefined

      if (!password) {
        return NextResponse.json(
          { error: 'Password is required to delete your account', requiresPassword: true },
          { status: 400 },
        )
      }

      const isValid = await compare(password, user.hashedPassword)
      if (!isValid) {
        return NextResponse.json({ error: 'Incorrect password' }, { status: 403 })
      }
    }

    const deleted = await deleteUser(session.user.id)
    if (!deleted) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 })
  }
}
