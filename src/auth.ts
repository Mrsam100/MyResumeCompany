import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import GitHub from 'next-auth/providers/github'
import Credentials from 'next-auth/providers/credentials'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { compare } from 'bcryptjs'
import { eq } from 'drizzle-orm'

import { db } from '@/lib/db'
import { users, accounts, sessions, verificationTokens } from '@/lib/db/schema'
import { addCredits } from '@/lib/db/credits'
import { loginSchema } from '@/lib/validations/auth'

export const { handlers, auth, signIn, signOut } = NextAuth({
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
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      // (#2) Normalize OAuth email before it reaches the adapter
      profile(profile) {
        return {
          id: String(profile.id),
          name: profile.name ?? profile.login,
          email: profile.email?.toLowerCase().trim(),
          image: profile.avatar_url,
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

        const isValid = await compare(password, user.hashedPassword)
        if (!isValid) return null

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
      }
    },
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id

        const dbUser = await db.query.users.findFirst({
          where: eq(users.id, user.id as string),
          columns: { credits: true, subscriptionTier: true, hashedPassword: true },
        })
        if (dbUser) {
          token.credits = dbUser.credits
          token.subscriptionTier = dbUser.subscriptionTier
          token.hasPassword = !!dbUser.hashedPassword
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
      if (session.user && token) {
        session.user.id = (token.id as string) ?? ''
        session.user.credits = (token.credits as number) ?? 0
        session.user.subscriptionTier = (token.subscriptionTier as string) ?? 'FREE'
        session.user.hasPassword = (token.hasPassword as boolean) ?? false
      }
      return session
    },
  },
})
