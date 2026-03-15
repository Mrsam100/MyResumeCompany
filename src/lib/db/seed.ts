import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { templates } from './schema'
import type { TemplateConfig } from '@/types/template'

const connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error('DATABASE_URL is required for seeding')

const client = postgres(connectionString, { max: 1 })
const db = drizzle(client)

interface TemplateSeed {
  name: string
  slug: string
  description: string
  category: 'PROFESSIONAL' | 'MODERN' | 'CREATIVE' | 'TECH' | 'ATS_OPTIMIZED' | 'ACADEMIC' | 'MINIMAL'
  isPremium: boolean
  sortOrder: number
  config: TemplateConfig
}

const templateData: TemplateSeed[] = [
  // ==================== PROFESSIONAL (3) ====================
  {
    name: 'Classic Professional',
    slug: 'classic-professional',
    description:
      'Traditional single-column layout with serif fonts and navy accent. Perfect for law, finance, consulting, and government roles.',
    category: 'PROFESSIONAL',
    isPremium: false,
    sortOrder: 1,
    config: {
      id: 'classic-professional',
      name: 'Classic Professional',
      slug: 'classic-professional',
      category: 'PROFESSIONAL',
      description: 'Traditional single-column layout with serif fonts and navy accent.',
      isPremium: false,
      layout: 'single-column',
      defaultColors: {
        primary: '#1e3a5f',
        secondary: '#4a6fa5',
        text: '#1a1a1a',
        textLight: '#6b7280',
        background: '#ffffff',
      },
      defaultFonts: {
        heading: 'Georgia',
        body: 'Georgia',
      },
      spacing: {
        margins: 20,
        sectionGap: 12,
        entryGap: 8,
      },
    },
  },
  {
    name: 'Executive',
    slug: 'executive',
    description:
      'Two-column sidebar layout with bold header and charcoal + gold accents. Best for C-suite, VP, and Director level positions.',
    category: 'PROFESSIONAL',
    isPremium: true,
    sortOrder: 2,
    config: {
      id: 'executive',
      name: 'Executive',
      slug: 'executive',
      category: 'PROFESSIONAL',
      description: 'Two-column sidebar layout with charcoal + gold accents.',
      isPremium: true,
      layout: 'sidebar-left',
      defaultColors: {
        primary: '#2d2d2d',
        secondary: '#c9a84c',
        text: '#1a1a1a',
        textLight: '#6b7280',
        background: '#ffffff',
        sidebarBg: '#2d2d2d',
        sidebarText: '#ffffff',
      },
      defaultFonts: {
        heading: 'Georgia',
        body: 'Inter',
      },
      spacing: {
        margins: 18,
        sectionGap: 14,
        entryGap: 10,
      },
    },
  },
  {
    name: 'Corporate',
    slug: 'corporate',
    description:
      'Highly structured single-column layout with minimal color. Maximum ATS compatibility for banking, insurance, and enterprise roles.',
    category: 'PROFESSIONAL',
    isPremium: false,
    sortOrder: 3,
    config: {
      id: 'corporate',
      name: 'Corporate',
      slug: 'corporate',
      category: 'PROFESSIONAL',
      description: 'Structured single-column layout with minimal color.',
      isPremium: false,
      layout: 'single-column',
      defaultColors: {
        primary: '#374151',
        secondary: '#6b7280',
        text: '#111827',
        textLight: '#6b7280',
        background: '#ffffff',
      },
      defaultFonts: {
        heading: 'Arial',
        body: 'Arial',
      },
      spacing: {
        margins: 22,
        sectionGap: 12,
        entryGap: 8,
      },
    },
  },

  // ==================== MODERN (3) ====================
  {
    name: 'Modern Minimal',
    slug: 'modern-minimal',
    description:
      'Clean single-column layout with generous whitespace and thin accent bar. Ideal for startups, marketing, and design-adjacent roles.',
    category: 'MODERN',
    isPremium: false,
    sortOrder: 4,
    config: {
      id: 'modern-minimal',
      name: 'Modern Minimal',
      slug: 'modern-minimal',
      category: 'MODERN',
      description: 'Clean layout with generous whitespace and accent bar.',
      isPremium: false,
      layout: 'single-column',
      defaultColors: {
        primary: '#3b82f6',
        secondary: '#60a5fa',
        text: '#1f2937',
        textLight: '#9ca3af',
        background: '#ffffff',
      },
      defaultFonts: {
        heading: 'Inter',
        body: 'Inter',
      },
      spacing: {
        margins: 24,
        sectionGap: 16,
        entryGap: 10,
      },
    },
  },
  {
    name: 'Metro',
    slug: 'metro',
    description:
      'Tile-inspired blocks with bold section headers and icon-based contact row. Great for project managers, product managers, and analysts.',
    category: 'MODERN',
    isPremium: true,
    sortOrder: 5,
    config: {
      id: 'metro',
      name: 'Metro',
      slug: 'metro',
      category: 'MODERN',
      description: 'Tile-inspired blocks with bold section headers.',
      isPremium: true,
      layout: 'single-column',
      defaultColors: {
        primary: '#0ea5e9',
        secondary: '#38bdf8',
        text: '#0f172a',
        textLight: '#64748b',
        background: '#ffffff',
      },
      defaultFonts: {
        heading: 'Inter',
        body: 'Inter',
      },
      spacing: {
        margins: 20,
        sectionGap: 14,
        entryGap: 10,
      },
    },
  },
  {
    name: 'Sleek',
    slug: 'sleek',
    description:
      'Dark sidebar with white main area for striking visual contrast. A modern, visually distinct resume for any professional.',
    category: 'MODERN',
    isPremium: true,
    sortOrder: 6,
    config: {
      id: 'sleek',
      name: 'Sleek',
      slug: 'sleek',
      category: 'MODERN',
      description: 'Dark sidebar with white main area for visual contrast.',
      isPremium: true,
      layout: 'sidebar-left',
      defaultColors: {
        primary: '#1e293b',
        secondary: '#3b82f6',
        text: '#1e293b',
        textLight: '#64748b',
        background: '#ffffff',
        sidebarBg: '#1e293b',
        sidebarText: '#f1f5f9',
      },
      defaultFonts: {
        heading: 'Inter',
        body: 'Inter',
      },
      spacing: {
        margins: 0,
        sectionGap: 14,
        entryGap: 10,
      },
    },
  },

  // ==================== CREATIVE (3) ====================
  {
    name: 'Creative Bold',
    slug: 'creative-bold',
    description:
      'Full-width colored header with unique dividers and vibrant color options. Perfect for marketing, creative agencies, and media roles.',
    category: 'CREATIVE',
    isPremium: true,
    sortOrder: 7,
    config: {
      id: 'creative-bold',
      name: 'Creative Bold',
      slug: 'creative-bold',
      category: 'CREATIVE',
      description: 'Full-width colored header with unique dividers.',
      isPremium: true,
      layout: 'single-column',
      defaultColors: {
        primary: '#0d9488',
        secondary: '#f97316',
        text: '#1a1a1a',
        textLight: '#6b7280',
        background: '#ffffff',
      },
      defaultFonts: {
        heading: 'Inter',
        body: 'Inter',
      },
      spacing: {
        margins: 20,
        sectionGap: 16,
        entryGap: 10,
      },
    },
  },
  {
    name: 'Designer',
    slug: 'designer',
    description:
      'Portfolio-style layout with custom icons and asymmetric visual hierarchy. Best for graphic designers, UX designers, and art directors.',
    category: 'CREATIVE',
    isPremium: true,
    sortOrder: 8,
    config: {
      id: 'designer',
      name: 'Designer',
      slug: 'designer',
      category: 'CREATIVE',
      description: 'Portfolio-style layout with custom icons.',
      isPremium: true,
      layout: 'two-column',
      defaultColors: {
        primary: '#7c3aed',
        secondary: '#a78bfa',
        text: '#1f2937',
        textLight: '#6b7280',
        background: '#ffffff',
      },
      defaultFonts: {
        heading: 'Inter',
        body: 'Inter',
        accent: 'Inter',
      },
      spacing: {
        margins: 18,
        sectionGap: 14,
        entryGap: 8,
      },
    },
  },
  {
    name: 'Starter',
    slug: 'starter',
    description:
      'Clean, simple, no-fuss layout focused on content readability. Perfect first resume for students, interns, and career changers.',
    category: 'CREATIVE',
    isPremium: false,
    sortOrder: 9,
    config: {
      id: 'starter',
      name: 'Starter',
      slug: 'starter',
      category: 'CREATIVE',
      description: 'Clean, simple layout focused on readability.',
      isPremium: false,
      layout: 'single-column',
      defaultColors: {
        primary: '#2563eb',
        secondary: '#60a5fa',
        text: '#1f2937',
        textLight: '#9ca3af',
        background: '#ffffff',
      },
      defaultFonts: {
        heading: 'Inter',
        body: 'Inter',
      },
      spacing: {
        margins: 22,
        sectionGap: 14,
        entryGap: 10,
      },
    },
  },

  // ==================== TECH (2) ====================
  {
    name: 'Developer',
    slug: 'developer',
    description:
      'GitHub-profile inspired layout with monospace accents and tech stack badges. Built for software engineers, DevOps, and SREs.',
    category: 'TECH',
    isPremium: false,
    sortOrder: 10,
    config: {
      id: 'developer',
      name: 'Developer',
      slug: 'developer',
      category: 'TECH',
      description: 'GitHub-inspired layout with monospace accents.',
      isPremium: false,
      layout: 'single-column',
      defaultColors: {
        primary: '#22c55e',
        secondary: '#4ade80',
        text: '#e2e8f0',
        textLight: '#94a3b8',
        background: '#0f172a',
      },
      defaultFonts: {
        heading: 'JetBrains Mono',
        body: 'Inter',
        accent: 'JetBrains Mono',
      },
      spacing: {
        margins: 20,
        sectionGap: 14,
        entryGap: 8,
      },
    },
  },
  {
    name: 'Data',
    slug: 'data',
    description:
      'Metrics-forward layout with clean tables and skill proficiency bars. Ideal for data scientists, analysts, and ML engineers.',
    category: 'TECH',
    isPremium: true,
    sortOrder: 11,
    config: {
      id: 'data',
      name: 'Data',
      slug: 'data',
      category: 'TECH',
      description: 'Metrics-forward layout with clean tables.',
      isPremium: true,
      layout: 'single-column',
      defaultColors: {
        primary: '#6366f1',
        secondary: '#818cf8',
        text: '#1e293b',
        textLight: '#64748b',
        background: '#ffffff',
      },
      defaultFonts: {
        heading: 'Inter',
        body: 'Inter',
        accent: 'JetBrains Mono',
      },
      spacing: {
        margins: 20,
        sectionGap: 12,
        entryGap: 8,
      },
    },
  },

  // ==================== ATS-OPTIMIZED (2) ====================
  {
    name: 'ATS Simple',
    slug: 'ats-simple',
    description:
      'Zero graphics, pure text hierarchy. Maximum ATS parsing compatibility — will pass ANY applicant tracking system.',
    category: 'ATS_OPTIMIZED',
    isPremium: false,
    sortOrder: 12,
    config: {
      id: 'ats-simple',
      name: 'ATS Simple',
      slug: 'ats-simple',
      category: 'ATS_OPTIMIZED',
      description: 'Zero graphics, pure text hierarchy for maximum ATS compatibility.',
      isPremium: false,
      layout: 'single-column',
      defaultColors: {
        primary: '#000000',
        secondary: '#333333',
        text: '#000000',
        textLight: '#555555',
        background: '#ffffff',
      },
      defaultFonts: {
        heading: 'Times New Roman',
        body: 'Times New Roman',
      },
      spacing: {
        margins: 25,
        sectionGap: 10,
        entryGap: 6,
      },
    },
  },
  {
    name: 'ATS Professional',
    slug: 'ats-professional',
    description:
      'Minimal styling that is still visually pleasant. ATS compatibility with style — not a plain text document.',
    category: 'ATS_OPTIMIZED',
    isPremium: false,
    sortOrder: 13,
    config: {
      id: 'ats-professional',
      name: 'ATS Professional',
      slug: 'ats-professional',
      category: 'ATS_OPTIMIZED',
      description: 'Minimal styling, ATS compatible with style.',
      isPremium: false,
      layout: 'single-column',
      defaultColors: {
        primary: '#1e40af',
        secondary: '#3b82f6',
        text: '#111827',
        textLight: '#6b7280',
        background: '#ffffff',
      },
      defaultFonts: {
        heading: 'Arial',
        body: 'Arial',
      },
      spacing: {
        margins: 22,
        sectionGap: 12,
        entryGap: 8,
      },
    },
  },

  // ==================== ACADEMIC (1) ====================
  {
    name: 'Academic CV',
    slug: 'academic-cv',
    description:
      'Multi-page academic CV with sections for publications, research, teaching, and grants. For professors, researchers, and PhD candidates.',
    category: 'ACADEMIC',
    isPremium: true,
    sortOrder: 14,
    config: {
      id: 'academic-cv',
      name: 'Academic CV',
      slug: 'academic-cv',
      category: 'ACADEMIC',
      description: 'Multi-page academic CV for professors and researchers.',
      isPremium: true,
      layout: 'single-column',
      defaultColors: {
        primary: '#7f1d1d',
        secondary: '#991b1b',
        text: '#1a1a1a',
        textLight: '#6b7280',
        background: '#ffffff',
      },
      defaultFonts: {
        heading: 'Georgia',
        body: 'Georgia',
      },
      spacing: {
        margins: 25,
        sectionGap: 14,
        entryGap: 8,
      },
    },
  },

  // ==================== MINIMAL (1) ====================
  {
    name: 'Clean Slate',
    slug: 'clean-slate',
    description:
      'Ultra-minimal single-column layout with maximum whitespace. Lets your content speak for itself.',
    category: 'MINIMAL',
    isPremium: false,
    sortOrder: 15,
    config: {
      id: 'clean-slate',
      name: 'Clean Slate',
      slug: 'clean-slate',
      category: 'MINIMAL',
      description: 'Ultra-minimal layout with maximum whitespace.',
      isPremium: false,
      layout: 'single-column',
      defaultColors: {
        primary: '#374151',
        secondary: '#9ca3af',
        text: '#1f2937',
        textLight: '#9ca3af',
        background: '#ffffff',
      },
      defaultFonts: {
        heading: 'Inter',
        body: 'Inter',
      },
      spacing: {
        margins: 28,
        sectionGap: 18,
        entryGap: 12,
      },
    },
  },
]

async function main() {
  console.log('Seeding templates...')

  try {
    for (const template of templateData) {
      await db
        .insert(templates)
        .values(template)
        .onConflictDoUpdate({
          target: templates.slug,
          set: {
            name: template.name,
            description: template.description,
            category: template.category,
            isPremium: template.isPremium,
            config: template.config,
            sortOrder: template.sortOrder,
          },
        })
      console.log(`  + ${template.name}`)
    }

    console.log(`\nSeeded ${templateData.length} templates successfully!`)
  } catch (e) {
    console.error('Seed failed:', e)
    process.exitCode = 1
  } finally {
    await client.end()
  }
}

main()
