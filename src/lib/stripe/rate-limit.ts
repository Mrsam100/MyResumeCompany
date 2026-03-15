import { NextResponse } from 'next/server'

// Simple in-memory rate limiter for Stripe checkout/portal routes
// 10 requests per minute per user
const WINDOW_MS = 60_000
const MAX_REQUESTS = 10

const requestCounts = new Map<string, number[]>()

// Cleanup every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, timestamps] of requestCounts) {
    const valid = timestamps.filter((t) => now - t < WINDOW_MS)
    if (valid.length === 0) requestCounts.delete(key)
    else requestCounts.set(key, valid)
  }
}, 5 * 60_000)

export function checkStripeRateLimit(userId: string): NextResponse | null {
  const now = Date.now()
  const timestamps = requestCounts.get(userId) ?? []
  const recent = timestamps.filter((t) => now - t < WINDOW_MS)

  if (recent.length >= MAX_REQUESTS) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment.' },
      { status: 429, headers: { 'Retry-After': '60' } },
    )
  }

  recent.push(now)
  requestCounts.set(userId, recent)
  return null
}
