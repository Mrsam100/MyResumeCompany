import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { newsletterSubscribers } from '@/lib/db/schema'
import { sendNewsletterWelcomeEmail } from '@/lib/email'

const subscribeSchema = z.object({
  email: z.string().email('Invalid email').max(255),
  source: z.enum(['footer', 'blog', 'landing', 'popup']).optional(),
})

// Simple in-memory rate limit: 5 requests per IP per minute
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function checkNewsletterRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 })
    return true
  }
  if (entry.count >= 5) return false
  entry.count++
  return true
}

// Cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of rateLimitMap) {
      if (now > entry.resetAt) rateLimitMap.delete(key)
    }
  }, 300_000)
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (!checkNewsletterRateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests. Try again later.' }, { status: 429 })
  }

  const body = await req.json().catch(() => null)
  const parsed = subscribeSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  const { email, source } = parsed.data

  try {
    await db.insert(newsletterSubscribers).values({
      email,
      source: source ?? 'footer',
    }).onConflictDoNothing()

    // Send welcome email (don't block response)
    sendNewsletterWelcomeEmail(email).catch(console.error)

    return NextResponse.json({ subscribed: true })
  } catch (err) {
    console.error('Newsletter subscribe error:', err)
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }
}
