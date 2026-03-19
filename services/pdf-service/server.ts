/**
 * PDF Microservice — Handles operations requiring full Node.js runtime.
 *
 * Endpoints:
 *   POST /render          — Render resume to PDF buffer
 *   POST /parse           — Extract text from uploaded PDF
 *   POST /verify-password — Verify bcrypt hash (legacy migration)
 *   GET  /health          — Health check (no auth required)
 *
 * Deployed on Fly.io. Authenticated via Authorization: Basic header.
 */

import { Hono } from 'hono'
import { compare } from 'bcryptjs'

const app = new Hono()

const SERVICE_SECRET = process.env.PDF_SERVICE_SECRET
const PORT = parseInt(process.env.PORT ?? '3001', 10)

// Fail fast if secret is not configured
if (!SERVICE_SECRET) {
  console.error('FATAL: PDF_SERVICE_SECRET environment variable is required')
  process.exit(1)
}

// ─── Auth middleware (Basic Auth) ───

function checkAuth(c: { req: { header: (name: string) => string | undefined } }): string | null {
  const authHeader = c.req.header('authorization')
  if (!authHeader?.startsWith('Basic ')) {
    return 'Missing or invalid Authorization header'
  }

  try {
    const decoded = Buffer.from(authHeader.slice(6), 'base64').toString('utf-8')
    const [, secret] = decoded.split(':', 2)
    if (secret !== SERVICE_SECRET) {
      return 'Invalid credentials'
    }
  } catch {
    return 'Malformed Authorization header'
  }

  return null // Auth passed
}

// ─── Health check (no auth) ───

app.get('/health', (c) => {
  return c.json({ status: 'ok', service: 'pdf-service', timestamp: new Date().toISOString() })
})

// ─── PDF Render ───

app.post('/render', async (c) => {
  const authError = checkAuth(c)
  if (authError) return c.json({ error: authError }, 401)

  try {
    const { content, config, resumeId } = await c.req.json()

    if (!content || !config) {
      return c.json({ error: 'content and config are required' }, 400)
    }

    // Lazy-import to keep startup fast
    const { renderToBuffer } = await import('@react-pdf/renderer')
    // NOTE: PDFResume and fonts must be copied from the main repo
    // into this service during the build step
    const { PDFResume } = await import('./pdf-template.js')

    const buffer = await renderToBuffer(PDFResume({ content, config }))

    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'X-Resume-Id': resumeId ?? '',
      },
    })
  } catch (err) {
    console.error('[render] Error:', err)
    return c.json({ error: 'PDF render failed' }, 500)
  }
})

// ─── PDF Parse (text extraction) ───

app.post('/parse', async (c) => {
  const authError = checkAuth(c)
  if (authError) return c.json({ error: authError }, 401)

  try {
    const formData = await c.req.formData()
    const file = formData.get('file')

    if (!file || !(file instanceof File)) {
      return c.json({ error: 'file is required' }, 400)
    }

    // Limit file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return c.json({ error: 'File too large (max 10MB)' }, 413)
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const pdfParse = (await import('pdf-parse')).default
    const parsed = await pdfParse(buffer)

    return c.json({
      text: parsed.text,
      pages: parsed.numpages,
    })
  } catch (err) {
    console.error('[parse] Error:', err)
    return c.json({ error: 'PDF parse failed' }, 500)
  }
})

// ─── Password Verification (bcrypt legacy migration) ───

app.post('/verify-password', async (c) => {
  const authError = checkAuth(c)
  if (authError) return c.json({ error: authError }, 401)

  try {
    const { password, hash } = await c.req.json()

    if (!password || !hash || typeof password !== 'string' || typeof hash !== 'string') {
      return c.json({ error: 'password and hash are required (strings)' }, 400)
    }

    // Only allow bcrypt hashes to prevent abuse as a general hashing oracle
    if (!hash.startsWith('$2a$') && !hash.startsWith('$2b$')) {
      return c.json({ error: 'Only bcrypt hashes accepted' }, 400)
    }

    // Limit password length to prevent ReDoS or excessive compute
    if (password.length > 72) {
      return c.json({ error: 'Password too long' }, 400)
    }

    const valid = await compare(password, hash)

    // Add artificial delay to prevent timing-based oracle attacks
    // bcrypt is already constant-time, but HTTP response timing is not
    await new Promise((r) => setTimeout(r, 100 + Math.random() * 50))

    return c.json({ valid })
  } catch (err) {
    console.error('[verify-password] Error:', err)
    return c.json({ error: 'Verification failed' }, 500)
  }
})

// ─── Start server ───

console.log(`PDF service starting on port ${PORT}`)

export default {
  port: PORT,
  fetch: app.fetch,
}
