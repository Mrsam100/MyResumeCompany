import { describe, it, expect } from 'vitest'
import { extractJSON } from '@/lib/ai/parse-json'

describe('extractJSON', () => {
  describe('object extraction', () => {
    it('extracts from markdown fence', () => {
      const text = 'Here is the result:\n```json\n{"name": "John"}\n```\nDone.'
      const result = extractJSON(text, 'object')
      expect(result).not.toBeNull()
      expect(result!.data).toEqual({ name: 'John' })
    })

    it('extracts from plain text with non-greedy match', () => {
      const text = 'The answer is {"score": 85, "feedback": "Good"} and that is all.'
      const result = extractJSON(text, 'object')
      expect(result).not.toBeNull()
      expect(result!.data).toEqual({ score: 85, feedback: 'Good' })
    })

    it('extracts nested object with greedy fallback', () => {
      const text = 'Result: {"outer": {"inner": "value"}, "list": [1,2,3]}'
      const result = extractJSON(text, 'object')
      expect(result).not.toBeNull()
      expect((result!.data as Record<string, unknown>).outer).toEqual({ inner: 'value' })
    })

    it('returns null for invalid JSON', () => {
      const result = extractJSON('no json here', 'object')
      expect(result).toBeNull()
    })

    it('returns null when shape is object but found array', () => {
      const text = '```json\n[1, 2, 3]\n```'
      const result = extractJSON(text, 'object')
      expect(result).toBeNull()
    })

    it('handles preamble text with braces', () => {
      const text = 'Using {best practices} here is the data:\n```json\n{"score": 42}\n```'
      const result = extractJSON(text, 'object')
      expect(result).not.toBeNull()
      expect(result!.data).toEqual({ score: 42 })
    })
  })

  describe('array extraction', () => {
    it('extracts from markdown fence', () => {
      const text = '```json\n["a", "b", "c"]\n```'
      const result = extractJSON(text, 'array')
      expect(result).not.toBeNull()
      expect(result!.data).toEqual(['a', 'b', 'c'])
    })

    it('extracts array of objects', () => {
      const text = 'Bullets: [{"text": "Led team"}, {"text": "Built API"}]'
      const result = extractJSON(text, 'array')
      expect(result).not.toBeNull()
      expect(result!.data).toHaveLength(2)
    })

    it('returns null when shape is array but found object', () => {
      const text = '{"key": "value"}'
      const result = extractJSON(text, 'array')
      expect(result).toBeNull()
    })

    it('returns null for empty text', () => {
      const result = extractJSON('', 'array')
      expect(result).toBeNull()
    })
  })
})
