import { NextResponse } from 'next/server'

const INDEXNOW_KEY = process.env.INDEXNOW_KEY

export async function POST(req: Request) {
  if (!INDEXNOW_KEY) {
    return NextResponse.json({ error: 'IndexNow key not configured' }, { status: 500 })
  }

  const { urls } = (await req.json()) as { urls?: string[] }
  if (!urls?.length) {
    return NextResponse.json({ error: 'No URLs provided' }, { status: 400 })
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://theresumecompany.com'

  const payload = {
    host: new URL(baseUrl).host,
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
