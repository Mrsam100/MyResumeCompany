import { NextResponse } from 'next/server'
import { auth } from '@/auth'

const INDEXNOW_KEY = process.env.INDEXNOW_KEY

export async function POST(req: Request) {
  // Require authentication — only admins/internal tools should submit URLs
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!INDEXNOW_KEY) {
    return NextResponse.json({ error: 'IndexNow key not configured' }, { status: 500 })
  }

  const { urls } = (await req.json()) as { urls?: string[] }
  if (!urls?.length || urls.length > 100) {
    return NextResponse.json({ error: 'Provide 1-100 URLs' }, { status: 400 })
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://myresumecompany.canmero.com'
  const allowedHost = new URL(baseUrl).host

  // Validate all URLs belong to our domain
  for (const url of urls) {
    try {
      const parsed = new URL(url)
      if (parsed.host !== allowedHost) {
        return NextResponse.json({ error: `URL not allowed: ${url}` }, { status: 400 })
      }
    } catch {
      return NextResponse.json({ error: `Invalid URL: ${url}` }, { status: 400 })
    }
  }

  const payload = {
    host: allowedHost,
    key: INDEXNOW_KEY,
    keyLocation: `${baseUrl}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  }

  const response = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  return NextResponse.json(
    { submitted: urls.length, status: response.status },
    { status: response.ok ? 200 : 502 },
  )
}
