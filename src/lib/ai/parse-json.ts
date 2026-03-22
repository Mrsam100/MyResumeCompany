/**
 * Multi-strategy JSON extraction from AI text responses.
 *
 * Tries strategies in order of reliability:
 * 1. Markdown code fence (```json ... ```)
 * 2. Balanced bracket extraction (handles nested objects/arrays)
 * 3. Greedy regex fallback
 *
 * Returns the parsed JSON or null if no valid JSON found.
 */
export function extractJSON<T = unknown>(
  text: string,
  shape: 'object' | 'array',
): { data: T; raw: string } | null {
  const open = shape === 'object' ? '{' : '['
  const close = shape === 'object' ? '}' : ']'

  const strategies = [
    // Strategy 1: Markdown fence
    () => {
      const fencePattern = shape === 'object'
        ? /```(?:json)?\s*(\{[\s\S]*\})\s*```/
        : /```(?:json)?\s*(\[[\s\S]*\])\s*```/
      return text.match(fencePattern)?.[1]
    },
    // Strategy 2: Balanced bracket extraction (first complete balanced structure)
    () => extractBalanced(text, open, close),
    // Strategy 3: Greedy fallback (first open to last close)
    () => {
      const pattern = shape === 'object'
        ? /\{[\s\S]*\}/
        : /\[[\s\S]*\]/
      return text.match(pattern)?.[0]
    },
  ]

  for (const strategy of strategies) {
    const raw = strategy()
    if (!raw) continue
    try {
      const data = JSON.parse(raw) as T
      // Verify shape matches expectation
      if (shape === 'object' && typeof data === 'object' && data !== null && !Array.isArray(data)) {
        return { data, raw }
      }
      if (shape === 'array' && Array.isArray(data)) {
        return { data, raw }
      }
    } catch {
      // Try next strategy
      continue
    }
  }

  return null
}

/**
 * Extract the first balanced bracket structure from text.
 * Handles nested objects/arrays correctly by counting bracket depth.
 */
function extractBalanced(text: string, open: string, close: string): string | undefined {
  const start = text.indexOf(open)
  if (start === -1) return undefined

  let depth = 0
  let inString = false
  let escape = false

  for (let i = start; i < text.length; i++) {
    const ch = text[i]

    if (escape) {
      escape = false
      continue
    }

    if (ch === '\\' && inString) {
      escape = true
      continue
    }

    if (ch === '"') {
      inString = !inString
      continue
    }

    if (inString) continue

    if (ch === open) depth++
    else if (ch === close) {
      depth--
      if (depth === 0) {
        return text.slice(start, i + 1)
      }
    }
  }

  return undefined
}
