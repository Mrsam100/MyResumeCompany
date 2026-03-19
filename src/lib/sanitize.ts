/**
 * HTML sanitization for resume content rendering.
 * Prevents XSS from user-supplied resume data (names, titles, bullet points, etc.)
 *
 * Uses isomorphic-dompurify which works on both server and client.
 */

import DOMPurify from 'isomorphic-dompurify'

/**
 * Sanitize a string for safe HTML rendering.
 * Strips ALL HTML tags — returns plain text only.
 * Use for resume fields like names, titles, descriptions, bullet points.
 */
export function sanitizeText(input: string): string {
  if (!input) return ''
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] })
}

/**
 * Sanitize a record of string fields (e.g., SectionEntry.fields).
 * Returns a new object with all string values sanitized.
 */
export function sanitizeFields(fields: Record<string, string>): Record<string, string> {
  const sanitized: Record<string, string> = {}
  for (const [key, value] of Object.entries(fields)) {
    sanitized[key] = typeof value === 'string' ? sanitizeText(value) : value
  }
  return sanitized
}

/**
 * Sanitize an array of bullet points.
 */
export function sanitizeBulletPoints(bullets: string[]): string[] {
  return bullets.map(sanitizeText)
}
