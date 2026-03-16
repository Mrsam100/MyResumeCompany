import Anthropic from '@anthropic-ai/sdk'

export const AI_MODEL = 'claude-sonnet-4-6'

let _client: Anthropic | null = null

function getClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    console.warn('ANTHROPIC_API_KEY not set — AI features will not work')
    throw new Error('ANTHROPIC_API_KEY is not configured.')
  }
  if (!_client) _client = new Anthropic({ apiKey })
  return _client
}

/**
 * Unified AI generation function for all routes.
 * Wraps Claude API with timeout, system prompt, and text extraction.
 */
export async function generateAIResponse(options: {
  system: string
  prompt: string
  maxTokens: number
  timeoutMs: number
}): Promise<string> {
  const client = getClient()

  try {
    const response = await Promise.race([
      client.messages.create({
        model: AI_MODEL,
        max_tokens: options.maxTokens,
        system: options.system,
        messages: [{ role: 'user', content: options.prompt }],
      }),
      new Promise<never>((_, reject) => {
        setTimeout(() => {
          const err = new Error('AI request timed out')
          err.name = 'AbortError'
          reject(err)
        }, options.timeoutMs)
      }),
    ])

    // Extract text from response content blocks
    const text = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map((block) => block.text)
      .join('')

    if (!text) throw new Error('Empty AI response')
    return text
  } catch (err: unknown) {
    // Re-throw timeout errors as-is
    if (err instanceof Error && err.name === 'AbortError') throw err

    // Handle Anthropic SDK typed errors
    if (err instanceof Anthropic.RateLimitError) {
      const apiErr = new Error('AI service rate limit exceeded. Please try again later.')
      apiErr.name = 'QuotaError'
      throw apiErr
    }
    if (err instanceof Anthropic.AuthenticationError || err instanceof Anthropic.PermissionDeniedError) {
      const apiErr = new Error('AI service authentication failed. Please check the API key configuration.')
      apiErr.name = 'AuthError'
      throw apiErr
    }
    if (err instanceof Anthropic.APIError) {
      console.error(`Claude API error [${err.status}]:`, err.message)
    }

    throw err
  }
}
