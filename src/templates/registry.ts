import type { ComponentType } from 'react'
import type { TemplateProps, TemplateConfig } from '@/types/template'

// ── Original 15 templates ──
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

// ── New 36 templates ──
// Professional (6)
import { ElegantSerif } from './elegant-serif'
import { Oxford } from './oxford'
import { Blueprint } from './blueprint'
import { Consulting } from './consulting'
import { Diplomat } from './diplomat'
import { RefinedGold } from './refined-gold'
// Professional extras
import { HeritageSerif } from './heritage-serif'
import { PremiumEdge } from './premium-edge'
import { Catalyst } from './catalyst'
import { ZenMaster } from './zen-master'
// Modern (5)
import { NoirEdge } from './noir-edge'
import { VibrantPop } from './vibrant-pop'
import { FreshStart } from './fresh-start'
import { ImpactOne } from './impact-one'
import { BrightSpark } from './bright-spark'
// Creative (4)
import { Mosaic } from './mosaic'
import { PixelArt } from './pixel-art'
import { Origami } from './origami'
import { Timeline } from './timeline'
// Tech (6)
import { DevopsPipeline } from './devops-pipeline'
import { CloudArchitect } from './cloud-architect'
import { CyberMatrix } from './cyber-matrix'
import { QuantumBits } from './quantum-bits'
import { Fintech } from './fintech'
import { Ledger } from './ledger'
// ATS (4)
import { HealthcareVitals } from './healthcare-vitals'
import { LegalBrief } from './legal-brief'
import { GovernmentService } from './government-service'
import { NonprofitMission } from './nonprofit-mission'
// Academic (3)
import { EducatorClassic } from './educator-classic'
import { ResearchLab } from './research-lab'
import { IvyLeague } from './ivy-league'
// Minimal (7)
import { WhisperLight } from './whisper-light'
import { PaperCut } from './paper-cut'
import { AirySpace } from './airy-space'
import { NordicFrost } from './nordic-frost'
import { CleanLine } from './clean-line'
import { ZenGarden } from './zen-garden'
import { BareMinimum } from './bare-minimum'

interface TemplateEntry {
  component: ComponentType<TemplateProps>
  config: TemplateConfig
}

const FALLBACK_TEMPLATE = 'classic-professional'

// ── Config factory ──

const c = (id: string, name: string, category: TemplateConfig['category'], isPremium: boolean, layout: TemplateConfig['layout'], colors: TemplateConfig['defaultColors'], fonts: TemplateConfig['defaultFonts'], spacing: TemplateConfig['spacing']): TemplateConfig => ({
  id, name, slug: id, category, description: name, isPremium, layout, defaultColors: colors, defaultFonts: fonts, spacing,
})

const templateRegistry: Record<string, TemplateEntry> = {
  // ═══════════════════════════════════
  // PROFESSIONAL (9 total: 3 original + 6 new)
  // ═══════════════════════════════════
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
  'elegant-serif': {
    component: ElegantSerif,
    config: c('elegant-serif', 'Elegant Serif', 'PROFESSIONAL', false, 'single-column',
      { primary: '#4a3728', secondary: '#8b6f47', text: '#2c2c2c', textLight: '#7a7a7a', background: '#ffffff' },
      { heading: 'Palatino, serif', body: 'Palatino, serif' },
      { margins: 24, sectionGap: 14, entryGap: 8 }),
  },
  oxford: {
    component: Oxford,
    config: c('oxford', 'Oxford', 'PROFESSIONAL', true, 'single-column',
      { primary: '#1a3a5c', secondary: '#2d5f8a', text: '#1a1a1a', textLight: '#5c6b7a', background: '#ffffff' },
      { heading: 'Georgia, serif', body: 'Cambria, serif' },
      { margins: 22, sectionGap: 12, entryGap: 8 }),
  },
  blueprint: {
    component: Blueprint,
    config: c('blueprint', 'Blueprint', 'PROFESSIONAL', true, 'sidebar-left',
      { primary: '#1e40af', secondary: '#60a5fa', text: '#1e293b', textLight: '#64748b', background: '#ffffff', sidebarBg: '#1e3a5f', sidebarText: '#f1f5f9' },
      { heading: 'Inter, sans-serif', body: 'Inter, sans-serif' },
      { margins: 18, sectionGap: 14, entryGap: 8 }),
  },
  consulting: {
    component: Consulting,
    config: c('consulting', 'Consulting', 'PROFESSIONAL', false, 'single-column',
      { primary: '#1e293b', secondary: '#0ea5e9', text: '#0f172a', textLight: '#64748b', background: '#ffffff' },
      { heading: 'Calibri, sans-serif', body: 'Calibri, sans-serif' },
      { margins: 22, sectionGap: 12, entryGap: 8 }),
  },
  diplomat: {
    component: Diplomat,
    config: c('diplomat', 'Diplomat', 'PROFESSIONAL', true, 'single-column',
      { primary: '#3d3d3d', secondary: '#7c7c7c', text: '#1a1a1a', textLight: '#888888', background: '#ffffff' },
      { heading: 'Garamond, serif', body: 'Garamond, serif' },
      { margins: 26, sectionGap: 14, entryGap: 10 }),
  },
  'refined-gold': {
    component: RefinedGold,
    config: c('refined-gold', 'Refined Gold', 'PROFESSIONAL', true, 'sidebar-left',
      { primary: '#1c1c1c', secondary: '#d4a853', text: '#2a2a2a', textLight: '#777777', background: '#ffffff', sidebarBg: '#1c1c1c', sidebarText: '#f0e6d2' },
      { heading: 'Georgia, serif', body: 'Inter, sans-serif' },
      { margins: 18, sectionGap: 14, entryGap: 8 }),
  },

  // ═══════════════════════════════════
  // MODERN (8 total: 3 original + 5 new)
  // ═══════════════════════════════════
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
  'noir-edge': {
    component: NoirEdge,
    config: c('noir-edge', 'Noir Edge', 'MODERN', true, 'sidebar-left',
      { primary: '#111111', secondary: '#e11d48', text: '#1a1a1a', textLight: '#6b7280', background: '#ffffff', sidebarBg: '#111111', sidebarText: '#e2e8f0' },
      { heading: 'Inter, sans-serif', body: 'Inter, sans-serif' },
      { margins: 16, sectionGap: 14, entryGap: 8 }),
  },
  'vibrant-pop': {
    component: VibrantPop,
    config: c('vibrant-pop', 'Vibrant Pop', 'MODERN', false, 'single-column',
      { primary: '#7c3aed', secondary: '#f59e0b', text: '#1f2937', textLight: '#6b7280', background: '#ffffff' },
      { heading: 'Inter, sans-serif', body: 'Inter, sans-serif' },
      { margins: 22, sectionGap: 14, entryGap: 8 }),
  },
  'fresh-start': {
    component: FreshStart,
    config: c('fresh-start', 'Fresh Start', 'MODERN', false, 'single-column',
      { primary: '#059669', secondary: '#34d399', text: '#1f2937', textLight: '#6b7280', background: '#ffffff' },
      { heading: 'Inter, sans-serif', body: 'Inter, sans-serif' },
      { margins: 24, sectionGap: 16, entryGap: 10 }),
  },
  'impact-one': {
    component: ImpactOne,
    config: c('impact-one', 'Impact One', 'MODERN', true, 'single-column',
      { primary: '#0f172a', secondary: '#3b82f6', text: '#0f172a', textLight: '#64748b', background: '#ffffff' },
      { heading: 'Inter, sans-serif', body: 'Inter, sans-serif' },
      { margins: 20, sectionGap: 14, entryGap: 8 }),
  },
  'bright-spark': {
    component: BrightSpark,
    config: c('bright-spark', 'Bright Spark', 'MODERN', false, 'single-column',
      { primary: '#2563eb', secondary: '#f97316', text: '#1e293b', textLight: '#64748b', background: '#ffffff' },
      { heading: 'Inter, sans-serif', body: 'Inter, sans-serif' },
      { margins: 22, sectionGap: 14, entryGap: 8 }),
  },

  // ═══════════════════════════════════
  // CREATIVE (7 total: 3 original + 4 new)
  // ═══════════════════════════════════
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
  mosaic: {
    component: Mosaic,
    config: c('mosaic', 'Mosaic', 'CREATIVE', true, 'single-column',
      { primary: '#dc2626', secondary: '#f59e0b', text: '#1f2937', textLight: '#6b7280', background: '#ffffff' },
      { heading: 'Inter, sans-serif', body: 'Inter, sans-serif' },
      { margins: 20, sectionGap: 14, entryGap: 8 }),
  },
  'pixel-art': {
    component: PixelArt,
    config: c('pixel-art', 'Pixel Art', 'CREATIVE', false, 'single-column',
      { primary: '#8b5cf6', secondary: '#06b6d4', text: '#1e293b', textLight: '#64748b', background: '#ffffff' },
      { heading: 'JetBrains Mono, monospace', body: 'Inter, sans-serif' },
      { margins: 20, sectionGap: 14, entryGap: 8 }),
  },
  origami: {
    component: Origami,
    config: c('origami', 'Origami', 'CREATIVE', true, 'sidebar-right',
      { primary: '#be185d', secondary: '#ec4899', text: '#1f2937', textLight: '#6b7280', background: '#ffffff', sidebarBg: '#831843', sidebarText: '#fce7f3' },
      { heading: 'Inter, sans-serif', body: 'Inter, sans-serif' },
      { margins: 16, sectionGap: 12, entryGap: 8 }),
  },
  timeline: {
    component: Timeline,
    config: c('timeline', 'Timeline', 'CREATIVE', false, 'single-column',
      { primary: '#0891b2', secondary: '#22d3ee', text: '#1e293b', textLight: '#64748b', background: '#ffffff' },
      { heading: 'Inter, sans-serif', body: 'Inter, sans-serif' },
      { margins: 22, sectionGap: 16, entryGap: 10 }),
  },

  // ═══════════════════════════════════
  // TECH (8 total: 2 original + 6 new)
  // ═══════════════════════════════════
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
  'devops-pipeline': {
    component: DevopsPipeline,
    config: c('devops-pipeline', 'DevOps Pipeline', 'TECH', false, 'single-column',
      { primary: '#ea580c', secondary: '#f97316', text: '#1c1917', textLight: '#78716c', background: '#ffffff' },
      { heading: 'JetBrains Mono, monospace', body: 'Inter, sans-serif', accent: 'JetBrains Mono, monospace' },
      { margins: 20, sectionGap: 12, entryGap: 8 }),
  },
  'cloud-architect': {
    component: CloudArchitect,
    config: c('cloud-architect', 'Cloud Architect', 'TECH', true, 'sidebar-left',
      { primary: '#0369a1', secondary: '#38bdf8', text: '#1e293b', textLight: '#64748b', background: '#ffffff', sidebarBg: '#0c4a6e', sidebarText: '#e0f2fe' },
      { heading: 'Inter, sans-serif', body: 'Inter, sans-serif', accent: 'JetBrains Mono, monospace' },
      { margins: 16, sectionGap: 14, entryGap: 8 }),
  },
  'cyber-matrix': {
    component: CyberMatrix,
    config: c('cyber-matrix', 'Cyber Matrix', 'TECH', true, 'single-column',
      { primary: '#10b981', secondary: '#34d399', text: '#d1fae5', textLight: '#6ee7b7', background: '#022c22' },
      { heading: 'JetBrains Mono, monospace', body: 'JetBrains Mono, monospace', accent: 'JetBrains Mono, monospace' },
      { margins: 20, sectionGap: 12, entryGap: 6 }),
  },
  'quantum-bits': {
    component: QuantumBits,
    config: c('quantum-bits', 'Quantum Bits', 'TECH', false, 'single-column',
      { primary: '#7c3aed', secondary: '#a78bfa', text: '#1e293b', textLight: '#6b7280', background: '#ffffff' },
      { heading: 'JetBrains Mono, monospace', body: 'Inter, sans-serif', accent: 'JetBrains Mono, monospace' },
      { margins: 22, sectionGap: 14, entryGap: 8 }),
  },
  fintech: {
    component: Fintech,
    config: c('fintech', 'Fintech', 'TECH', true, 'single-column',
      { primary: '#0f766e', secondary: '#14b8a6', text: '#134e4a', textLight: '#5eead4', background: '#ffffff' },
      { heading: 'Inter, sans-serif', body: 'Inter, sans-serif' },
      { margins: 22, sectionGap: 12, entryGap: 8 }),
  },
  ledger: {
    component: Ledger,
    config: c('ledger', 'Ledger', 'TECH', false, 'single-column',
      { primary: '#1d4ed8', secondary: '#3b82f6', text: '#1e293b', textLight: '#64748b', background: '#ffffff' },
      { heading: 'Inter, sans-serif', body: 'Inter, sans-serif', accent: 'JetBrains Mono, monospace' },
      { margins: 20, sectionGap: 12, entryGap: 8 }),
  },

  // ═══════════════════════════════════
  // ATS_OPTIMIZED (6 total: 2 original + 4 new)
  // ═══════════════════════════════════
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
  'healthcare-vitals': {
    component: HealthcareVitals,
    config: c('healthcare-vitals', 'Healthcare Vitals', 'ATS_OPTIMIZED', false, 'single-column',
      { primary: '#0d9488', secondary: '#14b8a6', text: '#111827', textLight: '#6b7280', background: '#ffffff' },
      { heading: 'Arial, sans-serif', body: 'Arial, sans-serif' },
      { margins: 22, sectionGap: 12, entryGap: 8 }),
  },
  'legal-brief': {
    component: LegalBrief,
    config: c('legal-brief', 'Legal Brief', 'ATS_OPTIMIZED', false, 'single-column',
      { primary: '#1a1a1a', secondary: '#4a4a4a', text: '#111111', textLight: '#666666', background: '#ffffff' },
      { heading: 'Times New Roman, serif', body: 'Times New Roman, serif' },
      { margins: 25, sectionGap: 10, entryGap: 6 }),
  },
  'government-service': {
    component: GovernmentService,
    config: c('government-service', 'Government Service', 'ATS_OPTIMIZED', false, 'single-column',
      { primary: '#1e3a5f', secondary: '#2563eb', text: '#111827', textLight: '#6b7280', background: '#ffffff' },
      { heading: 'Arial, sans-serif', body: 'Arial, sans-serif' },
      { margins: 25, sectionGap: 12, entryGap: 8 }),
  },
  'nonprofit-mission': {
    component: NonprofitMission,
    config: c('nonprofit-mission', 'Nonprofit Mission', 'ATS_OPTIMIZED', false, 'single-column',
      { primary: '#065f46', secondary: '#10b981', text: '#111827', textLight: '#6b7280', background: '#ffffff' },
      { heading: 'Georgia, serif', body: 'Georgia, serif' },
      { margins: 22, sectionGap: 12, entryGap: 8 }),
  },

  // ═══════════════════════════════════
  // ACADEMIC (4 total: 1 original + 3 new)
  // ═══════════════════════════════════
  'academic-cv': {
    component: AcademicCV,
    config: c('academic-cv', 'Academic CV', 'ACADEMIC', true, 'single-column',
      { primary: '#7f1d1d', secondary: '#991b1b', text: '#1a1a1a', textLight: '#6b7280', background: '#ffffff' },
      { heading: 'Georgia, serif', body: 'Georgia, serif' },
      { margins: 25, sectionGap: 14, entryGap: 8 }),
  },
  'educator-classic': {
    component: EducatorClassic,
    config: c('educator-classic', 'Educator Classic', 'ACADEMIC', false, 'single-column',
      { primary: '#1e40af', secondary: '#3b82f6', text: '#1a1a1a', textLight: '#6b7280', background: '#ffffff' },
      { heading: 'Cambria, serif', body: 'Cambria, serif' },
      { margins: 24, sectionGap: 14, entryGap: 8 }),
  },
  'research-lab': {
    component: ResearchLab,
    config: c('research-lab', 'Research Lab', 'ACADEMIC', true, 'single-column',
      { primary: '#4338ca', secondary: '#6366f1', text: '#1e1b4b', textLight: '#6b7280', background: '#ffffff' },
      { heading: 'Georgia, serif', body: 'Inter, sans-serif' },
      { margins: 22, sectionGap: 12, entryGap: 8 }),
  },
  'ivy-league': {
    component: IvyLeague,
    config: c('ivy-league', 'Ivy League', 'ACADEMIC', true, 'single-column',
      { primary: '#7f1d1d', secondary: '#b91c1c', text: '#1a1a1a', textLight: '#6b7280', background: '#ffffff' },
      { heading: 'Palatino, serif', body: 'Palatino, serif' },
      { margins: 26, sectionGap: 14, entryGap: 10 }),
  },

  // ═══════════════════════════════════
  // MINIMAL (8 total: 1 original + 7 new)
  // ═══════════════════════════════════
  'clean-slate': {
    component: CleanSlate,
    config: c('clean-slate', 'Clean Slate', 'MINIMAL', false, 'single-column',
      { primary: '#374151', secondary: '#9ca3af', text: '#1f2937', textLight: '#9ca3af', background: '#ffffff' },
      { heading: 'Inter, sans-serif', body: 'Inter, sans-serif' },
      { margins: 28, sectionGap: 18, entryGap: 12 }),
  },
  'heritage-serif': {
    component: HeritageSerif,
    config: c('heritage-serif', 'Heritage Serif', 'MINIMAL', false, 'single-column',
      { primary: '#57534e', secondary: '#a8a29e', text: '#292524', textLight: '#78716c', background: '#ffffff' },
      { heading: 'Georgia, serif', body: 'Georgia, serif' },
      { margins: 28, sectionGap: 16, entryGap: 10 }),
  },
  'premium-edge': {
    component: PremiumEdge,
    config: c('premium-edge', 'Premium Edge', 'MINIMAL', true, 'single-column',
      { primary: '#0f172a', secondary: '#475569', text: '#0f172a', textLight: '#64748b', background: '#ffffff' },
      { heading: 'Inter, sans-serif', body: 'Inter, sans-serif' },
      { margins: 26, sectionGap: 16, entryGap: 10 }),
  },
  catalyst: {
    component: Catalyst,
    config: c('catalyst', 'Catalyst', 'MINIMAL', false, 'single-column',
      { primary: '#1e293b', secondary: '#3b82f6', text: '#1e293b', textLight: '#94a3b8', background: '#ffffff' },
      { heading: 'Inter, sans-serif', body: 'Inter, sans-serif' },
      { margins: 24, sectionGap: 14, entryGap: 8 }),
  },
  'zen-master': {
    component: ZenMaster,
    config: c('zen-master', 'Zen Master', 'MINIMAL', false, 'single-column',
      { primary: '#525252', secondary: '#a3a3a3', text: '#262626', textLight: '#a3a3a3', background: '#ffffff' },
      { heading: 'Inter, sans-serif', body: 'Inter, sans-serif' },
      { margins: 30, sectionGap: 20, entryGap: 12 }),
  },
  'whisper-light': {
    component: WhisperLight,
    config: c('whisper-light', 'Whisper Light', 'MINIMAL', false, 'single-column',
      { primary: '#9ca3af', secondary: '#d1d5db', text: '#374151', textLight: '#9ca3af', background: '#ffffff' },
      { heading: 'Inter, sans-serif', body: 'Inter, sans-serif' },
      { margins: 30, sectionGap: 20, entryGap: 12 }),
  },
  'paper-cut': {
    component: PaperCut,
    config: c('paper-cut', 'Paper Cut', 'MINIMAL', false, 'single-column',
      { primary: '#44403c', secondary: '#78716c', text: '#1c1917', textLight: '#a8a29e', background: '#ffffff' },
      { heading: 'Georgia, serif', body: 'Inter, sans-serif' },
      { margins: 26, sectionGap: 16, entryGap: 10 }),
  },
  'airy-space': {
    component: AirySpace,
    config: c('airy-space', 'Airy Space', 'MINIMAL', false, 'single-column',
      { primary: '#6b7280', secondary: '#d1d5db', text: '#1f2937', textLight: '#9ca3af', background: '#ffffff' },
      { heading: 'Inter, sans-serif', body: 'Inter, sans-serif' },
      { margins: 32, sectionGap: 22, entryGap: 14 }),
  },
  'nordic-frost': {
    component: NordicFrost,
    config: c('nordic-frost', 'Nordic Frost', 'MINIMAL', true, 'single-column',
      { primary: '#334155', secondary: '#94a3b8', text: '#1e293b', textLight: '#94a3b8', background: '#ffffff' },
      { heading: 'Inter, sans-serif', body: 'Inter, sans-serif' },
      { margins: 28, sectionGap: 18, entryGap: 10 }),
  },
  'clean-line': {
    component: CleanLine,
    config: c('clean-line', 'Clean Line', 'MINIMAL', false, 'single-column',
      { primary: '#404040', secondary: '#737373', text: '#171717', textLight: '#a3a3a3', background: '#ffffff' },
      { heading: 'Helvetica, sans-serif', body: 'Helvetica, sans-serif' },
      { margins: 26, sectionGap: 16, entryGap: 10 }),
  },
  'zen-garden': {
    component: ZenGarden,
    config: c('zen-garden', 'Zen Garden', 'MINIMAL', true, 'single-column',
      { primary: '#78716c', secondary: '#a8a29e', text: '#292524', textLight: '#a8a29e', background: '#ffffff' },
      { heading: 'Palatino, serif', body: 'Palatino, serif' },
      { margins: 32, sectionGap: 22, entryGap: 14 }),
  },
  'bare-minimum': {
    component: BareMinimum,
    config: c('bare-minimum', 'Bare Minimum', 'MINIMAL', false, 'single-column',
      { primary: '#000000', secondary: '#666666', text: '#000000', textLight: '#888888', background: '#ffffff' },
      { heading: 'Arial, sans-serif', body: 'Arial, sans-serif' },
      { margins: 25, sectionGap: 14, entryGap: 8 }),
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
