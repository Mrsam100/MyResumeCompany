import type { ComponentType } from 'react'
import type { TemplateProps, TemplateConfig } from '@/types/template'

import { ClassicProfessional } from './classic-professional'
import { ModernMinimal } from './modern-minimal'
import { Executive } from './executive'
import { Corporate } from './corporate'
import { Metro } from './metro'
import { Sleek } from './sleek'
import { CreativeBold } from './creative-bold'
import { Designer } from './designer'
import { Starter } from './starter'
import { Developer } from './developer'
import { Data } from './data'
import { ATSSimple } from './ats-simple'
import { ATSProfessional } from './ats-professional'
import { AcademicCV } from './academic-cv'
import { CleanSlate } from './clean-slate'

interface TemplateEntry {
  component: ComponentType<TemplateProps>
  config: TemplateConfig
}

const FALLBACK_TEMPLATE = 'classic-professional'

// ── Configs matching seed data ──

const c = (id: string, name: string, category: TemplateConfig['category'], isPremium: boolean, layout: TemplateConfig['layout'], colors: TemplateConfig['defaultColors'], fonts: TemplateConfig['defaultFonts'], spacing: TemplateConfig['spacing']): TemplateConfig => ({
  id, name, slug: id, category, description: name, isPremium, layout, defaultColors: colors, defaultFonts: fonts, spacing,
})

const templateRegistry: Record<string, TemplateEntry> = {
  'classic-professional': {
    component: ClassicProfessional,
    config: c('classic-professional', 'Classic Professional', 'PROFESSIONAL', false, 'single-column',
      { primary: '#1e3a5f', secondary: '#4a6fa5', text: '#1a1a1a', textLight: '#6b7280', background: '#ffffff' },
      { heading: 'Georgia, serif', body: 'Georgia, serif' },
      { margins: 20, sectionGap: 12, entryGap: 8 }),
  },
  executive: {
    component: Executive,
    config: c('executive', 'Executive', 'PROFESSIONAL', true, 'sidebar-left',
      { primary: '#2d2d2d', secondary: '#c9a84c', text: '#1a1a1a', textLight: '#6b7280', background: '#ffffff', sidebarBg: '#2d2d2d', sidebarText: '#ffffff' },
      { heading: 'Georgia, serif', body: 'Inter, sans-serif' },
      { margins: 18, sectionGap: 14, entryGap: 10 }),
  },
  corporate: {
    component: Corporate,
    config: c('corporate', 'Corporate', 'PROFESSIONAL', false, 'single-column',
      { primary: '#374151', secondary: '#6b7280', text: '#111827', textLight: '#6b7280', background: '#ffffff' },
      { heading: 'Arial, sans-serif', body: 'Arial, sans-serif' },
      { margins: 22, sectionGap: 12, entryGap: 8 }),
  },
  'modern-minimal': {
    component: ModernMinimal,
    config: c('modern-minimal', 'Modern Minimal', 'MODERN', false, 'single-column',
      { primary: '#3b82f6', secondary: '#60a5fa', text: '#1f2937', textLight: '#9ca3af', background: '#ffffff' },
      { heading: 'Inter, sans-serif', body: 'Inter, sans-serif' },
      { margins: 24, sectionGap: 16, entryGap: 10 }),
  },
  metro: {
    component: Metro,
    config: c('metro', 'Metro', 'MODERN', true, 'single-column',
      { primary: '#0ea5e9', secondary: '#38bdf8', text: '#0f172a', textLight: '#64748b', background: '#ffffff' },
      { heading: 'Inter, sans-serif', body: 'Inter, sans-serif' },
      { margins: 20, sectionGap: 14, entryGap: 10 }),
  },
  sleek: {
    component: Sleek,
    config: c('sleek', 'Sleek', 'MODERN', true, 'sidebar-left',
      { primary: '#1e293b', secondary: '#3b82f6', text: '#1e293b', textLight: '#64748b', background: '#ffffff', sidebarBg: '#1e293b', sidebarText: '#f1f5f9' },
      { heading: 'Inter, sans-serif', body: 'Inter, sans-serif' },
      { margins: 16, sectionGap: 14, entryGap: 10 }),
  },
  'creative-bold': {
    component: CreativeBold,
    config: c('creative-bold', 'Creative Bold', 'CREATIVE', true, 'single-column',
      { primary: '#0d9488', secondary: '#f97316', text: '#1a1a1a', textLight: '#6b7280', background: '#ffffff' },
      { heading: 'Inter, sans-serif', body: 'Inter, sans-serif' },
      { margins: 20, sectionGap: 16, entryGap: 10 }),
  },
  designer: {
    component: Designer,
    config: c('designer', 'Designer', 'CREATIVE', true, 'single-column',
      { primary: '#7c3aed', secondary: '#a78bfa', text: '#1f2937', textLight: '#6b7280', background: '#ffffff' },
      { heading: 'Inter, sans-serif', body: 'Inter, sans-serif' },
      { margins: 18, sectionGap: 14, entryGap: 8 }),
  },
  starter: {
    component: Starter,
    config: c('starter', 'Starter', 'CREATIVE', false, 'single-column',
      { primary: '#2563eb', secondary: '#60a5fa', text: '#1f2937', textLight: '#9ca3af', background: '#ffffff' },
      { heading: 'Inter, sans-serif', body: 'Inter, sans-serif' },
      { margins: 22, sectionGap: 14, entryGap: 10 }),
  },
  developer: {
    component: Developer,
    config: c('developer', 'Developer', 'TECH', false, 'single-column',
      { primary: '#22c55e', secondary: '#4ade80', text: '#e2e8f0', textLight: '#94a3b8', background: '#0f172a' },
      { heading: 'JetBrains Mono, monospace', body: 'Inter, sans-serif', accent: 'JetBrains Mono, monospace' },
      { margins: 20, sectionGap: 14, entryGap: 8 }),
  },
  data: {
    component: Data,
    config: c('data', 'Data', 'TECH', true, 'single-column',
      { primary: '#6366f1', secondary: '#818cf8', text: '#1e293b', textLight: '#64748b', background: '#ffffff' },
      { heading: 'Inter, sans-serif', body: 'Inter, sans-serif', accent: 'JetBrains Mono, monospace' },
      { margins: 20, sectionGap: 12, entryGap: 8 }),
  },
  'ats-simple': {
    component: ATSSimple,
    config: c('ats-simple', 'ATS Simple', 'ATS_OPTIMIZED', false, 'single-column',
      { primary: '#000000', secondary: '#333333', text: '#000000', textLight: '#555555', background: '#ffffff' },
      { heading: 'Times New Roman, serif', body: 'Times New Roman, serif' },
      { margins: 25, sectionGap: 10, entryGap: 6 }),
  },
  'ats-professional': {
    component: ATSProfessional,
    config: c('ats-professional', 'ATS Professional', 'ATS_OPTIMIZED', false, 'single-column',
      { primary: '#1e40af', secondary: '#3b82f6', text: '#111827', textLight: '#6b7280', background: '#ffffff' },
      { heading: 'Arial, sans-serif', body: 'Arial, sans-serif' },
      { margins: 22, sectionGap: 12, entryGap: 8 }),
  },
  'academic-cv': {
    component: AcademicCV,
    config: c('academic-cv', 'Academic CV', 'ACADEMIC', true, 'single-column',
      { primary: '#7f1d1d', secondary: '#991b1b', text: '#1a1a1a', textLight: '#6b7280', background: '#ffffff' },
      { heading: 'Georgia, serif', body: 'Georgia, serif' },
      { margins: 25, sectionGap: 14, entryGap: 8 }),
  },
  'clean-slate': {
    component: CleanSlate,
    config: c('clean-slate', 'Clean Slate', 'MINIMAL', false, 'single-column',
      { primary: '#374151', secondary: '#9ca3af', text: '#1f2937', textLight: '#9ca3af', background: '#ffffff' },
      { heading: 'Inter, sans-serif', body: 'Inter, sans-serif' },
      { margins: 28, sectionGap: 18, entryGap: 12 }),
  },
}

export function getTemplate(slug: string): TemplateEntry {
  return templateRegistry[slug] ?? templateRegistry[FALLBACK_TEMPLATE]
}

export function getTemplateConfig(slug: string): TemplateConfig {
  return (templateRegistry[slug] ?? templateRegistry[FALLBACK_TEMPLATE]).config
}

export function getAllTemplateConfigs(): TemplateConfig[] {
  return Object.values(templateRegistry).map((e) => e.config)
}

export function isTemplateRegistered(slug: string): boolean {
  return slug in templateRegistry
}
