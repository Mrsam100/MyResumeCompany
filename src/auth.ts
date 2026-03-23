import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { eq } from 'drizzle-orm'

import { db } from '@/lib/db'
import { users, accounts, sessions, verificationTokens } from '@/lib/db/schema'
import { addCredits } from '@/lib/db/credits'
import { getCachedSession, setCachedSession } from '@/lib/redis'
import { loginSchema } from '@/lib/validations/auth'
import { verifyPassword, needsHashUpgrade, hashPassword } from '@/lib/auth/password'
import { sendWelcomeEmail } from '@/lib/email'

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // (#2) Normalize OAuth email before it reaches the adapter
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email?.toLowerCase().trim(),
          image: profile.picture,
        }
      },
    }),
    Credentials({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const { email, password } = parsed.data
        const normalizedEmail = email.toLowerCase().trim()

        const user = await db.query.users.findFirst({
          where: eq(users.email, normalizedEmail),
        })

        if (!user || !user.hashedPassword) return null

        const isValid = await verifyPassword(password, user.hashedPassword)
        if (!isValid) return null

        // Upgrade legacy bcrypt hashes to PBKDF2 on successful login.
        // Uses double-check pattern to prevent race conditions on concurrent logins.
        if (needsHashUpgrade(user.hashedPassword)) {
          try {
            const newHash = await hashPassword(password)
            await db.transaction(async (tx) => {
              const current = await tx.query.users.findFirst({
                where: eq(users.id, user.id),
                columns: { hashedPassword: true },
              })
              // Only upgrade if still a bcrypt hash (another request may have already upgraded)
              if (current?.hashedPassword && needsHashUpgrade(current.hashedPassword)) {
                await tx.update(users).set({ hashedPassword: newHash }).where(eq(users.id, user.id))
              }
            })
          } catch (err) {
            // Hash upgrade failure is non-fatal — user can still log in
            console.error('[auth] Hash upgrade failed:', err)
          }
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      },
    }),
  ],
  events: {
    async createUser({ user }) {
      if (user.id) {
        // (#2) Ensure email is normalized in DB (belt + suspenders with profile() hooks)
        if (user.email) {
          const normalized = user.email.toLowerCase().trim()
          if (normalized !== user.email) {
            await db.update(users).set({ email: normalized }).where(eq(users.id, user.id))
          }
        }

        await addCredits(user.id, 100, 'SIGNUP_BONUS', 'Welcome bonus — 100 free credits')

        // Send welcome email (non-blocking — don't fail signup on email error)
        if (user.email) {
          sendWelcomeEmail(user.email, user.name || 'there').catch((err) =>
            console.error('[auth] Welcome email failed:', err),
          )
        }
      }
    },
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id

        // Try Redis cache first, fall back to DB
        const cached = await getCachedSession(user.id as string)
        if (cached) {
          token.credits = cached.credits
          token.subscriptionTier = cached.subscriptionTier
          token.hasPassword = cached.hasPassword
        } else {
          const dbUser = await db.query.users.findFirst({
            where: eq(users.id, user.id as string),
            columns: { credits: true, subscriptionTier: true, hashedPassword: true },
          })
          if (dbUser) {
            token.credits = dbUser.credits
            token.subscriptionTier = dbUser.subscriptionTier
            token.hasPassword = !!dbUser.hashedPassword

            // Populate cache for next time
            await setCachedSession(user.id as string, {
              credits: dbUser.credits,
              subscriptionTier: dbUser.subscriptionTier,
              hasPassword: !!dbUser.hashedPassword,
            })
          }
        }
      }

      if (trigger === 'update' && session) {
        if (typeof session.credits === 'number') token.credits = session.credits
        if (typeof session.subscriptionTier === 'string')
          token.subscriptionTier = session.subscriptionTier
      }

      return token
    },
    async session({ session, token }) {
      if (session.user && token?.id) {
        session.user.id = token.id as string
        session.user.credits = (token.credits as number) ?? 0
        session.user.subscriptionTier = (token.subscriptionTier as string) ?? 'FREE'
        session.user.hasPassword = (token.hasPassword as boolean) ?? false
      }
      return session
    },
  },
})
