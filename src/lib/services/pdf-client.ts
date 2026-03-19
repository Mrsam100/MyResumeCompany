/**
 * HTTP client for the PDF microservice (Fly.io).
 * Handles PDF rendering, PDF text extraction.
 * Authenticated via Authorization: Basic header.
 */

import type { ResumeContent } from '@/types/resume'
import type { TemplateConfig } from '@/types/template'

const PDF_TIMEOUT = 30_000 // 30 seconds
const MAX_PDF_SIZE = 50 * 1024 * 1024 // 50MB safety limit

function getServiceConfig() {
  const url = process.env.PDF_SERVICE_URL
  const secret = process.env.PDF_SERVICE_SECRET
  if (!url || !secret) {
    throw new Error('PDF_SERVICE_URL and PDF_SERVICE_SECRET must be configured')
  }
  // Encode as Basic Auth: service:<secret>
  const credentials = typeof Buffer !== 'undefined'
    ? Buffer.from(`service:${secret}`).toString('base64')
    : btoa(`service:${secret}`)
  return { url, credentials }
}

// ─── PDF Rendering ───

interface RenderResult {
  buffer: ArrayBuffer
  size: number
}

export async function renderPdf(
  content: ResumeContent,
  config: TemplateConfig,
  resumeId: string,
): Promise<RenderResult> {
  const { url, credentials } = getServiceConfig()

  const response = await fetch(`${url}/render`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${credentials}`,
    },
    body: JSON.stringify({ content, config, resumeId }),
    signal: AbortSignal.timeout(PDF_TIMEOUT),
  })

  if (!response.ok) {
    const text = await response.text().catch(() => 'unknown error')
    throw new Error(`PDF service render failed (${response.status}): ${text}`)
  }

  const buffer = await response.arrayBuffer()

  // Validate PDF magic bytes (%PDF-)
  const magic = new Uint8Array(buffer.slice(0, 4))
  if (magic[0] !== 0x25 || magic[1] !== 0x50 || magic[2] !== 0x44 || magic[3] !== 0x46) {
    throw new Error('PDF service returned invalid PDF data')
  }

  // Validate size
  if (buffer.byteLength > MAX_PDF_SIZE) {
    throw new Error(`PDF too large: ${buffer.byteLength} bytes`)
  }

  return { buffer, size: buffer.byteLength }
}

// ─── PDF Text Extraction ───

interface ParseResult {
  text: string
  pages: number
}

export async function parsePdf(file: File): Promise<ParseResult> {
  const { url, credentials } = getServiceConfig()

  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${url}/parse`, {
    method: 'POST',
    headers: { 'Authorization': `Basic ${credentials}` },
    body: formData,
    signal: AbortSignal.timeout(PDF_TIMEOUT),
  })

  if (!response.ok) {
    const text = await response.text().catch(() => 'unknown error')
    throw new Error(`PDF service parse failed (${response.status}): ${text}`)
  }

  return (await response.json()) as ParseResult
}
