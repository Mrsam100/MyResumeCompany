import { GoogleGenerativeAI } from '@google/generative-ai'

export const AI_MODEL = 'gemini-2.5-flash'

let _client: GoogleGenerativeAI | null = null

function getClient(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_API_KEY
  console.log('[AI DEBUG] GEMINI_API_KEY present:', !!apiKey, '| length:', apiKey?.length ?? 0, '| first 10:', apiKey?.slice(0, 10), '| last 5:', apiKey?.slice(-5))
  if (!apiKey) {
    console.warn('GEMINI_API_KEY not set — AI features will not work')
    const err = new Error('GEMINI_API_KEY is not configured.')
    err.name = 'ConfigError'
    throw err
  }
  if (!_client) _client = new GoogleGenerativeAI(apiKey)
  return _client
}

/**
 * Unified AI generation function for all routes.
 * Wraps Gemini API with timeout, system prompt, and text extraction.
 */
export async function generateAIResponse(options: {
  system: string
  prompt: string
  maxTokens: number
  timeoutMs: number
}): Promise<string> {
  const client = getClient()
  const model = client.getGenerativeModel({
    model: AI_MODEL,
    systemInstruction: options.system,
    generationConfig: {
      maxOutputTokens: options.maxTokens,
    },
  })

  try {
    const response = await Promise.race([
      model.generateContent(options.prompt),
      new Promise<never>((_, reject) => {
        setTimeout(() => {
          const err = new Error('AI request timed out')
          err.name = 'AbortError'
          reject(err)
        }, options.timeoutMs)
      }),
    ])

    const text = response.response.text()

    if (!text) throw new Error('Empty AI response')
    return text
  } catch (err: unknown) {
    // Re-throw timeout errors as-is
    if (err instanceof Error && err.name === 'AbortError') throw err

    // Log the full error for debugging
    if (err instanceof Error) {
      console.error('Gemini API error [FULL]:', err.name, err.message, JSON.stringify(err, Object.getOwnPropertyNames(err)).slice(0, 500))
    }

    // Handle Gemini API errors
    if (err instanceof Error) {
      const message = err.message.toLowerCase()

      if (message.includes('quota') || message.includes('rate limit') || message.includes('resource has been exhausted')) {
        const apiErr = new Error('AI service rate limit exceeded. Please try again later.')
        apiErr.name = 'QuotaError'
        throw apiErr
      }
      if (message.includes('api_key_invalid') || message.includes('permission denied')) {
        const apiErr = new Error('AI service authentication failed. Please check the API key configuration.')
        apiErr.name = 'AuthError'
        throw apiErr
      }

      console.error('Gemini API error:', err.message)
    }

    throw err
  }
}
