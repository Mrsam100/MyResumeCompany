import { NextRequest } from 'next/server'
import { handlers } from '@/auth'
import { checkAuthRateLimit } from '@/lib/auth/rate-limit'

export const { GET } = handlers

export async function POST(req: NextRequest) {
  // Rate-limit credential login attempts (20/hr per IP)
  // Check URL path only — don't consume the request body
  const isCredentialsLogin = req.nextUrl.pathname.endsWith('/callback/credentials')

  if (isCredentialsLogin) {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const rateLimitError = await checkAuthRateLimit(ip, 'login')
    if (rateLimitError) return rateLimitError
  }

  // Pass original request through untouched
  return handlers.POST(req)
}
