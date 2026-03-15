import { GoogleGenerativeAI } from '@google/generative-ai'

export const AI_MODEL = 'gemini-2.0-flash'

let _client: GoogleGenerativeAI | null = null

function getClient(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.warn('GEMINI_API_KEY not set — AI features will not work')
    throw new Error('GEMINI_API_KEY is not configured.')
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

  // Race between AI call and timeout
  const result = await Promise.race([
    model.generateContent(options.prompt),
    new Promise<never>((_, reject) => {
      setTimeout(() => {
        const err = new Error('AI request timed out')
        err.name = 'AbortError'
        reject(err)
      }, options.timeoutMs)
    }),
  ])

  const text = result.response.text()
  if (!text) throw new Error('Empty AI response')
  return text
}
