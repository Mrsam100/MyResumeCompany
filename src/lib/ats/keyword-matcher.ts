import type { ResumeContent } from '@/types/resume'

export interface KeywordMatchResult {
  score: number
  matched: string[]
  missing: string[]
  total: number
}

const STOPWORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
  'by', 'from', 'as', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has',
  'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'shall',
  'can', 'need', 'must', 'it', 'its', 'we', 'our', 'you', 'your', 'they', 'them', 'their',
  'he', 'she', 'his', 'her', 'this', 'that', 'these', 'those', 'which', 'who', 'whom',
  'what', 'where', 'when', 'how', 'why', 'all', 'each', 'every', 'both', 'few', 'more',
  'most', 'other', 'some', 'such', 'no', 'not', 'only', 'own', 'same', 'so', 'than',
  'too', 'very', 'just', 'about', 'above', 'after', 'again', 'also', 'any', 'before',
  'below', 'between', 'during', 'into', 'through', 'under', 'until', 'up', 'while',
  'if', 'then', 'else', 'over', 'out', 'off', 'down', 'here', 'there', 'etc', 'per',
  'via', 'including', 'work', 'working', 'experience', 'years', 'year', 'role', 'team',
  'company', 'ability', 'strong', 'required', 'preferred', 'including', 'within', 'across',
  'using', 'used', 'new', 'well', 'make', 'like', 'time', 'way', 'part',
])

// Common multi-word tech/business terms to preserve
const COMPOUND_TERMS = [
  'machine learning', 'deep learning', 'data science', 'data analysis', 'data engineering',
  'project management', 'product management', 'business intelligence', 'user experience',
  'user interface', 'full stack', 'front end', 'back end', 'cloud computing',
  'artificial intelligence', 'natural language processing', 'computer vision',
  'supply chain', 'quality assurance', 'continuous integration', 'continuous deployment',
  'agile methodology', 'scrum master', 'six sigma', 'lean manufacturing',
  'financial analysis', 'risk management', 'digital marketing', 'content marketing',
  'search engine optimization', 'customer success', 'account management',
  'software development', 'system design', 'database management', 'version control',
  'api development', 'microservices', 'distributed systems', 'real time',
]

export function extractKeywords(jobDescription: string): string[] {
  const text = jobDescription.toLowerCase()
  const keywords = new Set<string>()

  // Extract compound terms first
  for (const term of COMPOUND_TERMS) {
    if (text.includes(term)) {
      keywords.add(term)
    }
  }

  // Extract single-word tokens
  const tokens = text
    .replace(/[^\w\s.#+-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)

  for (const token of tokens) {
    const cleaned = token.replace(/^[.]+|[.]+$/g, '')
    if (cleaned.length < 2) continue
    if (STOPWORDS.has(cleaned)) continue
    // Keep tech terms with special chars: C#, .NET, Node.js, C++
    if (/^[a-z]/.test(cleaned) || /[.#+-]/.test(cleaned)) {
      keywords.add(cleaned)
    }
  }

  return Array.from(keywords)
}

export function matchKeywords(resumeText: string, keywords: string[]): KeywordMatchResult {
  if (keywords.length === 0) {
    return { score: 0, matched: [], missing: [], total: 0 }
  }

  const text = resumeText.toLowerCase()
  const matched: string[] = []
  const missing: string[] = []

  for (const keyword of keywords) {
    const hasSpecialChars = /[^a-zA-Z0-9\s]/.test(keyword)

    if (hasSpecialChars) {
      // Tech terms like c++, c#, .net, node.js — use case-insensitive includes
      if (text.includes(keyword)) {
        matched.push(keyword)
      } else {
        missing.push(keyword)
      }
    } else if (keyword.length <= 3) {
      // Short alphanumeric keywords — use word boundary to avoid false positives
      const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
      if (regex.test(text)) {
        matched.push(keyword)
      } else {
        missing.push(keyword)
      }
    } else {
      if (text.includes(keyword)) {
        matched.push(keyword)
      } else {
        missing.push(keyword)
      }
    }
  }

  const score = Math.round((matched.length / keywords.length) * 100)

  return { score, matched, missing, total: keywords.length }
}

export function resumeContentToText(content: ResumeContent): string {
  if (!content) return ''
  const lines: string[] = []

  const personalInfo = content.personalInfo
  if (personalInfo) {
    if (personalInfo.fullName) lines.push(personalInfo.fullName)
    if (personalInfo.title) lines.push(personalInfo.title)
    if (personalInfo.summary) lines.push(personalInfo.summary)
    if (personalInfo.email) lines.push(personalInfo.email)
    if (personalInfo.location) lines.push(personalInfo.location)
  }

  const sections = content.sections
  if (Array.isArray(sections)) {
    for (const section of sections) {
      if (!section.visible || !Array.isArray(section.entries) || section.entries.length === 0) continue
      if (section.title) lines.push(section.title)

      for (const entry of section.entries) {
        if (entry.fields) {
          for (const value of Object.values(entry.fields)) {
            if (value?.trim()) lines.push(value)
          }
        }
        if (Array.isArray(entry.bulletPoints)) {
          for (const bullet of entry.bulletPoints) {
            if (bullet?.trim()) lines.push(bullet)
          }
        }
      }
    }
  }

  return lines.join(' ')
}
