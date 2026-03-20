/**
 * PDF utilities — inline rendering and parsing.
 * Uses @react-pdf/renderer and pdf-parse directly (nodejs_compat on Workers).
 */

import type { ResumeContent } from '@/types/resume'
import type { TemplateConfig } from '@/types/template'

// ─── PDF Rendering ───

interface RenderResult {
  /** Raw PDF bytes as a Node.js Buffer */
  buffer: Buffer
  size: number
}

export async function renderPdf(
  content: ResumeContent,
  config: TemplateConfig,
  _resumeId: string,
): Promise<RenderResult> {
  const { renderToBuffer } = await import('@react-pdf/renderer')
  const { PDFResume } = await import('@/lib/pdf/pdf-template')

  const buffer = await renderToBuffer(PDFResume({ content, config }))

  // Validate PDF magic bytes (%PDF-)
  if (buffer[0] !== 0x25 || buffer[1] !== 0x50 || buffer[2] !== 0x44 || buffer[3] !== 0x46) {
    throw new Error('Rendered output is not valid PDF data')
  }

  return { buffer, size: buffer.byteLength }
}

// ─── PDF Text Extraction ───

interface ParseResult {
  text: string
  pages: number
}

export async function parsePdf(file: File): Promise<ParseResult> {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const pdfParse = (await import('pdf-parse')).default
  const parsed = await pdfParse(buffer)

  return {
    text: parsed.text,
    pages: parsed.numpages,
  }
}
