import { NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/auth'

const inputSchema = z.object({
  url: z.string().url().max(2000),
})

// Block SSRF: reject private/reserved IP ranges and non-HTTP schemes
function isBlockedUrl(urlStr: string): boolean {
  try {
    const parsed = new URL(urlStr)
    // Only allow http/https
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return true
    const host = parsed.hostname.toLowerCase()
    // Block private/reserved hostnames and IPs
    const blocked = [
      /^localhost$/,
      /^127\./,
      /^10\./,
      /^192\.168\./,
      /^172\.(1[6-9]|2\d|3[01])\./,
      /^169\.254\./,
      /^0\./,
      /^\[::1\]$/,
      /^\[fc/,
      /^\[fd/,
      /^\[fe80:/,
      /^metadata\.google\.internal$/,
    ]
    return blocked.some((p) => p.test(host))
  } catch {
    return true
  }
}

/**
 * POST /api/jd-extract
 * Fetches a job listing URL and extracts the job description text.
 * No credits charged — this is a utility to reduce friction.
 */
export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const parsed = inputSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
  }

  const { url } = parsed.data

  if (isBlockedUrl(url)) {
    return NextResponse.json({ error: 'URL not allowed' }, { status: 403 })
  }

  try {
    // Fetch the page with a browser-like user agent
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MyResumeCompany/1.0; +https://myresumecompany.canmero.com)',
        'Accept': 'text/html,application/xhtml+xml',
      },
      signal: controller.signal,
      redirect: 'follow',
    })
    clearTimeout(timeout)

    if (!res.ok) {
      return NextResponse.json({ error: `Failed to fetch URL (${res.status})` }, { status: 422 })
    }

    const contentType = res.headers.get('content-type') || ''
    if (!contentType.includes('text/html') && !contentType.includes('application/xhtml')) {
      return NextResponse.json({ error: 'URL does not point to an HTML page' }, { status: 422 })
    }

    const html = await res.text()

    // Extract text content — strip HTML tags, scripts, styles
    const text = html
      // Remove script/style blocks
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<nav[\s\S]*?<\/nav>/gi, '')
      .replace(/<footer[\s\S]*?<\/footer>/gi, '')
      .replace(/<header[\s\S]*?<\/header>/gi, '')
      // Remove HTML tags
      .replace(/<[^>]+>/g, ' ')
      // Decode HTML entities
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      // Normalize whitespace
      .replace(/\s+/g, ' ')
      .trim()

    if (text.length < 50) {
      return NextResponse.json({ error: 'Could not extract meaningful content from URL' }, { status: 422 })
    }

    // Extract the most relevant portion (job descriptions are usually in the middle 30-70% of text)
    // Cap at 5000 chars to match our JD field limit
    const jobText = text.length > 5000 ? text.slice(0, 5000) : text

    // Try to extract job title from page title
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
    const pageTitle = titleMatch?.[1]?.replace(/\s+/g, ' ').trim() || ''

    return NextResponse.json({
      text: jobText,
      pageTitle,
      sourceUrl: url,
      charCount: jobText.length,
    })
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      return NextResponse.json({ error: 'URL fetch timed out (10s)' }, { status: 504 })
    }
    return NextResponse.json({ error: 'Failed to fetch URL' }, { status: 500 })
  }
}
