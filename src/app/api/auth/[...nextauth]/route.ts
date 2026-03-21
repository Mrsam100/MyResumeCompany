import { NextRequest } from 'next/server'
import { handlers } from '@/auth'
import { checkAuthRateLimit } from '@/lib/auth/rate-limit'

export const { GET } = handlers

export async function POST(req: NextRequest) {
  // Rate-limit credential login attempts (20/hr per IP)
  // Only applies to credentials sign-in, not OAuth callbacks
  const body = await req.text()
  const isCredentialsLogin =
    req.nextUrl.pathname.endsWith('/callback/credentials') ||
    body.includes('"credentials"')

  if (isCredentialsLogin) {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const rateLimitError = await checkAuthRateLimit(ip, 'login')
    if (rateLimitError) return rateLimitError
  }

  // Reconstruct request with the consumed body
  const newReq = new NextRequest(req.url, {
    method: req.method,
    headers: req.headers,
    body,
  })

  return handlers.POST(newReq)
}
