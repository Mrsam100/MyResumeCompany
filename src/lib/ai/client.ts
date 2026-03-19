import { GoogleGenerativeAI } from '@google/generative-ai'

export const AI_MODEL = 'gemini-2.5-flash'

let _client: GoogleGenerativeAI | null = null

function getClient(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
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

    // Log error details in development only
    if (process.env.NODE_ENV === 'development' && err instanceof Error) {
      console.error('Gemini API error:', err.name, err.message)
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
