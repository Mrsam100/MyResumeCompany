/**
 * Multi-strategy JSON extraction from AI text responses.
 *
 * Tries strategies in order of reliability:
 * 1. Markdown code fence (```json ... ```)
 * 2. Non-greedy regex match
 * 3. Greedy regex fallback
 *
 * Returns the parsed JSON or null if no valid JSON found.
 */
export function extractJSON<T = unknown>(
  text: string,
  shape: 'object' | 'array',
): { data: T; raw: string } | null {
  const strategies = shape === 'object'
    ? [
        // Strategy 1: Markdown fence
        () => text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/)?.[1],
        // Strategy 2: Non-greedy (first complete object)
        () => text.match(/\{[\s\S]*?\}/)?.[0],
        // Strategy 3: Greedy fallback (first { to last })
        () => text.match(/\{[\s\S]*\}/)?.[0],
      ]
    : [
        // Strategy 1: Markdown fence
        () => text.match(/```(?:json)?\s*(\[[\s\S]*?\])\s*```/)?.[1],
        // Strategy 2: Non-greedy
        () => text.match(/\[[\s\S]*?\]/)?.[0],
        // Strategy 3: Greedy fallback
        () => text.match(/\[[\s\S]*\]/)?.[0],
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
