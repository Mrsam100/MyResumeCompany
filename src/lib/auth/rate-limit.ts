import { NextResponse } from 'next/server'

// Per-IP rate limiting for auth endpoints
// register: 10/hour, login: 20/hour, password-reset: 5/hour
const LIMITS: Record<string, { max: number; windowMs: number }> = {
  register: { max: 10, windowMs: 60 * 60 * 1000 },
  login: { max: 20, windowMs: 60 * 60 * 1000 },
  'password-reset': { max: 5, windowMs: 60 * 60 * 1000 },
}

const requestCounts = new Map<string, number[]>()

// Cleanup every 10 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, timestamps] of requestCounts) {
    const valid = timestamps.filter((t) => now - t < 60 * 60 * 1000)
    if (valid.length === 0) requestCounts.delete(key)
    else requestCounts.set(key, valid)
  }
}, 10 * 60_000)

export function checkAuthRateLimit(
  ip: string,
  action: keyof typeof LIMITS,
): NextResponse | null {
  const config = LIMITS[action]
  if (!config) return null

  const key = `${action}:${ip}`
  const now = Date.now()
  const timestamps = requestCounts.get(key) ?? []
  const recent = timestamps.filter((t) => now - t < config.windowMs)

  if (recent.length >= config.max) {
    const retryAfter = Math.ceil((recent[0] + config.windowMs - now) / 1000)
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } },
    )
  }

  recent.push(now)
  requestCounts.set(key, recent)
  return null
}
