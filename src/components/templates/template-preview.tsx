'use client'

/**
 * CSS-based resume preview mockups.
 * Each template gets a unique visual style rendered at small scale to look like a real document thumbnail.
 */

const LINE = 'rounded-full bg-current'
const BLOCK = 'rounded bg-current'

function HeaderBlock({ style }: { style: 'centered' | 'left' | 'sidebar-left' | 'bold-top' }) {
  if (style === 'centered') {
    return (
      <div className="flex flex-col items-center gap-1 pb-2 border-b border-current/10">
        <div className={`h-2 w-20 ${BLOCK} opacity-80`} />
        <div className={`h-1 w-14 ${LINE} opacity-40`} />
        <div className="flex gap-2 mt-0.5">
          <div className={`h-0.5 w-8 ${LINE} opacity-20`} />
          <div className={`h-0.5 w-8 ${LINE} opacity-20`} />
          <div className={`h-0.5 w-8 ${LINE} opacity-20`} />
        </div>
      </div>
    )
  }
  if (style === 'bold-top') {
    return (
      <div className="pb-2 mb-1 border-b-2 border-current/30">
        <div className={`h-2.5 w-24 ${BLOCK} opacity-80`} />
        <div className={`h-1 w-16 ${LINE} opacity-40 mt-1`} />
        <div className="flex gap-2 mt-1">
          <div className={`h-0.5 w-10 ${LINE} opacity-20`} />
          <div className={`h-0.5 w-10 ${LINE} opacity-20`} />
        </div>
      </div>
    )
  }
  return (
    <div className="pb-2 border-b border-current/10">
      <div className={`h-2 w-20 ${BLOCK} opacity-80`} />
      <div className={`h-1 w-14 ${LINE} opacity-40 mt-0.5`} />
      <div className="flex gap-2 mt-0.5">
        <div className={`h-0.5 w-8 ${LINE} opacity-20`} />
        <div className={`h-0.5 w-6 ${LINE} opacity-20`} />
      </div>
    </div>
  )
}

function SectionBlock({ lines = 3, withTitle = true }: { lines?: number; withTitle?: boolean }) {
  return (
    <div className="mt-2">
      {withTitle && <div className={`h-1.5 w-16 ${BLOCK} opacity-50 mb-1`} />}
      <div className="space-y-1">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className={`h-0.5 ${LINE} opacity-15`} style={{ width: `${85 - i * 10}%` }} />
        ))}
      </div>
    </div>
  )
}

function BulletBlock({ count = 3 }: { count?: number }) {
  return (
    <div className="mt-1 space-y-0.5 pl-1.5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-1">
          <div className="h-0.5 w-0.5 rounded-full bg-current opacity-30 shrink-0" />
          <div className={`h-0.5 ${LINE} opacity-15`} style={{ width: `${80 - i * 8}%` }} />
        </div>
      ))}
    </div>
  )
}

function EntryBlock() {
  return (
    <div className="mt-1.5">
      <div className="flex items-center justify-between">
        <div className={`h-1 w-20 ${BLOCK} opacity-35`} />
        <div className={`h-0.5 w-8 ${LINE} opacity-15`} />
      </div>
      <div className={`h-0.5 w-14 ${LINE} opacity-20 mt-0.5`} />
      <BulletBlock count={3} />
    </div>
  )
}

function SkillTags() {
  return (
    <div className="flex flex-wrap gap-0.5 mt-1">
      {[12, 10, 14, 8, 11, 9, 13].map((w, i) => (
        <div key={i} className="h-1.5 rounded-sm bg-current opacity-10" style={{ width: w * 2 }} />
      ))}
    </div>
  )
}

// ─── Individual template styles ───

function ClassicProfessional() {
  return (
    <div className="text-[#1a365d]">
      <HeaderBlock style="centered" />
      <SectionBlock lines={2} withTitle={false} />
      <div className="mt-2 border-t border-[#1a365d]/10 pt-1">
        <div className="h-1.5 w-20 rounded bg-[#1a365d] opacity-40 mb-1" />
        <EntryBlock />
        <EntryBlock />
      </div>
      <div className="mt-2 border-t border-[#1a365d]/10 pt-1">
        <div className="h-1.5 w-14 rounded bg-[#1a365d] opacity-40 mb-1" />
        <SkillTags />
      </div>
    </div>
  )
}

function Executive() {
  return (
    <div className="flex gap-3 text-[#2d3748]">
      <div className="w-[35%] bg-[#2d3748]/5 rounded p-1.5 space-y-2">
        <div className="h-6 w-6 rounded-full bg-[#2d3748]/10 mx-auto" />
        <div className="h-1.5 w-full rounded bg-[#2d3748] opacity-30" />
        <div className="space-y-0.5">
          {[1,2,3].map(i => <div key={i} className="h-0.5 w-full rounded bg-[#2d3748] opacity-10" />)}
        </div>
        <div className="h-1 w-12 rounded bg-[#d4a43a] opacity-50 mt-2" />
        <SkillTags />
      </div>
      <div className="flex-1">
        <div className="border-b-2 border-[#d4a43a]/40 pb-1 mb-2">
          <div className="h-2.5 w-24 rounded bg-[#2d3748] opacity-80" />
          <div className="h-1 w-16 rounded bg-[#d4a43a] opacity-40 mt-0.5" />
        </div>
        <EntryBlock />
        <EntryBlock />
      </div>
    </div>
  )
}

function Corporate() {
  return (
    <div className="text-[#1a202c]">
      <HeaderBlock style="left" />
      <SectionBlock lines={2} withTitle={false} />
      <SectionBlock />
      <EntryBlock />
      <EntryBlock />
      <SectionBlock />
      <SkillTags />
    </div>
  )
}

function ModernMinimal() {
  return (
    <div className="text-[#2b6cb0]">
      <div className="border-l-2 border-[#2b6cb0]/40 pl-2 pb-2">
        <div className="h-2.5 w-20 rounded bg-[#2b6cb0] opacity-70" />
        <div className="h-1 w-14 rounded-full bg-[#2b6cb0] opacity-30 mt-0.5" />
      </div>
      <SectionBlock lines={2} withTitle={false} />
      <div className="mt-2">
        <div className="h-1.5 w-20 rounded bg-[#2b6cb0] opacity-40 border-b border-[#2b6cb0]/20 pb-0.5 mb-1" />
        <EntryBlock />
        <EntryBlock />
      </div>
      <div className="mt-2">
        <div className="h-1.5 w-10 rounded bg-[#2b6cb0] opacity-40 mb-1" />
        <SkillTags />
      </div>
    </div>
  )
}

function Metro() {
  return (
    <div className="text-[#553c9a]">
      <div className="bg-[#553c9a]/8 rounded p-2 mb-2">
        <div className="h-2.5 w-24 rounded bg-[#553c9a] opacity-70" />
        <div className="h-1 w-16 rounded bg-[#553c9a] opacity-30 mt-0.5" />
        <div className="flex gap-2 mt-1">
          <div className="h-0.5 w-10 rounded bg-[#553c9a] opacity-15" />
          <div className="h-0.5 w-10 rounded bg-[#553c9a] opacity-15" />
        </div>
      </div>
      <SectionBlock />
      <EntryBlock />
      <SectionBlock />
      <SkillTags />
    </div>
  )
}

function Sleek() {
  return (
    <div className="flex gap-3 text-[#e2e8f0]">
      <div className="w-[35%] bg-[#1a202c] rounded p-1.5 space-y-2">
        <div className="h-2 w-full rounded bg-white opacity-60" />
        <div className="h-0.5 w-10 rounded bg-white opacity-20" />
        <div className="h-0.5 w-12 rounded bg-white opacity-20" />
        <div className="mt-2 h-1 w-10 rounded bg-[#63b3ed] opacity-60" />
        <div className="space-y-0.5">
          {[1,2,3,4].map(i => <div key={i} className="h-1.5 rounded bg-white opacity-8" style={{width: `${50+i*10}%`}} />)}
        </div>
      </div>
      <div className="flex-1 text-[#2d3748]">
        <HeaderBlock style="left" />
        <SectionBlock lines={2} withTitle={false} />
        <EntryBlock />
        <EntryBlock />
      </div>
    </div>
  )
}

function CreativeBold() {
  return (
    <div className="text-[#c53030]">
      <div className="bg-[#c53030]/10 rounded-lg p-2 mb-2">
        <div className="h-3 w-28 rounded bg-[#c53030] opacity-70" />
        <div className="h-1 w-16 rounded bg-[#c53030] opacity-30 mt-1" />
      </div>
      <div className="border-l-4 border-[#c53030]/30 pl-2">
        <SectionBlock lines={2} withTitle={false} />
      </div>
      <SectionBlock />
      <EntryBlock />
      <div className="mt-2 flex gap-1">
        {[1,2,3].map(i => <div key={i} className="h-3 flex-1 rounded bg-[#c53030] opacity-8" />)}
      </div>
    </div>
  )
}

function Designer() {
  return (
    <div className="text-[#d53f8c]">
      <div className="flex items-center gap-2 pb-2 border-b-2 border-[#d53f8c]/20">
        <div className="h-8 w-8 rounded-full bg-[#d53f8c]/15" />
        <div>
          <div className="h-2 w-20 rounded bg-[#d53f8c] opacity-70" />
          <div className="h-1 w-14 rounded bg-[#d53f8c] opacity-30 mt-0.5" />
        </div>
      </div>
      <SectionBlock lines={2} withTitle={false} />
      <SectionBlock />
      <EntryBlock />
      <SectionBlock />
      <SkillTags />
    </div>
  )
}

function Starter() {
  return (
    <div className="text-[#4a5568]">
      <HeaderBlock style="centered" />
      <SectionBlock lines={2} withTitle={false} />
      <SectionBlock />
      <EntryBlock />
      <SectionBlock />
      <SkillTags />
    </div>
  )
}

function Developer() {
  return (
    <div className="text-[#38a169] font-mono">
      <div className="pb-2 border-b border-[#38a169]/20">
        <div className="h-2.5 w-24 rounded bg-[#38a169] opacity-60" />
        <div className="flex gap-1 mt-1">
          {['gh', 'li', 'web'].map(t => (
            <div key={t} className="h-1 px-1 rounded bg-[#38a169] opacity-15 text-[3px]" />
          ))}
        </div>
      </div>
      <SectionBlock lines={2} withTitle={false} />
      <SectionBlock />
      <EntryBlock />
      <div className="mt-2">
        <div className="h-1.5 w-10 rounded bg-[#38a169] opacity-40 mb-1" />
        <div className="flex flex-wrap gap-0.5">
          {[10,14,8,12,9,11,7,13].map((w,i) => (
            <div key={i} className="h-1.5 rounded-sm bg-[#38a169] opacity-15" style={{width: w*2}} />
          ))}
        </div>
      </div>
    </div>
  )
}

function DataTemplate() {
  return (
    <div className="text-[#3182ce]">
      <HeaderBlock style="left" />
      <SectionBlock lines={2} withTitle={false} />
      <SectionBlock />
      <EntryBlock />
      <div className="mt-2">
        <div className="h-1.5 w-10 rounded bg-[#3182ce] opacity-40 mb-1" />
        <div className="space-y-1">
          {[90,70,85,60].map((w,i) => (
            <div key={i} className="flex items-center gap-1">
              <div className="h-0.5 w-8 rounded bg-[#3182ce] opacity-20" />
              <div className="h-1 rounded bg-[#3182ce] opacity-15 flex-1" style={{width: `${w}%`}} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ATSSimple() {
  return (
    <div className="text-[#1a202c]">
      <div className="pb-1 mb-1 border-b border-black/20">
        <div className="h-2 w-24 rounded bg-black opacity-80" />
        <div className="h-0.5 w-32 rounded bg-black opacity-15 mt-0.5" />
      </div>
      <SectionBlock lines={2} withTitle={false} />
      <div className="mt-1.5 border-t border-black/10 pt-1">
        <div className="h-1 w-20 rounded bg-black opacity-50 mb-0.5 uppercase" />
        <EntryBlock />
        <EntryBlock />
      </div>
      <div className="mt-1.5 border-t border-black/10 pt-1">
        <div className="h-1 w-10 rounded bg-black opacity-50 mb-0.5" />
        <div className="h-0.5 w-full rounded bg-black opacity-10" />
      </div>
    </div>
  )
}

function ATSProfessional() {
  return (
    <div className="text-[#2d3748]">
      <HeaderBlock style="bold-top" />
      <SectionBlock lines={2} withTitle={false} />
      <div className="mt-2 border-t border-[#2d3748]/15 pt-1">
        <div className="h-1.5 w-24 rounded bg-[#2d3748] opacity-45 mb-1" />
        <EntryBlock />
        <EntryBlock />
      </div>
      <div className="mt-2 border-t border-[#2d3748]/15 pt-1">
        <div className="h-1.5 w-10 rounded bg-[#2d3748] opacity-45 mb-1" />
        <SkillTags />
      </div>
    </div>
  )
}

function AcademicCV() {
  return (
    <div className="text-[#2c5282]">
      <HeaderBlock style="centered" />
      <SectionBlock lines={3} withTitle={false} />
      <SectionBlock />
      <EntryBlock />
      <SectionBlock />
      <BulletBlock count={2} />
      <SectionBlock />
      <BulletBlock count={2} />
    </div>
  )
}

function CleanSlate() {
  return (
    <div className="text-[#4a5568]">
      <div className="pb-2">
        <div className="h-2.5 w-20 rounded bg-[#4a5568] opacity-70" />
        <div className="h-1 w-14 rounded bg-[#4a5568] opacity-30 mt-0.5" />
        <div className="h-px w-full bg-[#4a5568] opacity-10 mt-2" />
      </div>
      <SectionBlock lines={2} withTitle={false} />
      <div className="h-px w-full bg-[#4a5568] opacity-10 my-2" />
      <SectionBlock />
      <EntryBlock />
      <div className="h-px w-full bg-[#4a5568] opacity-10 my-2" />
      <SectionBlock />
      <SkillTags />
    </div>
  )
}

// ─── Map slug → preview component ───

const PREVIEW_MAP: Record<string, () => React.ReactNode> = {
  'classic-professional': ClassicProfessional,
  executive: Executive,
  corporate: Corporate,
  'modern-minimal': ModernMinimal,
  metro: Metro,
  sleek: Sleek,
  'creative-bold': CreativeBold,
  designer: Designer,
  starter: Starter,
  developer: Developer,
  data: DataTemplate,
  'ats-simple': ATSSimple,
  'ats-professional': ATSProfessional,
  'academic-cv': AcademicCV,
  'clean-slate': CleanSlate,
}

export function TemplatePreview({ slug }: { slug: string }) {
  const Preview = PREVIEW_MAP[slug]

  if (!Preview) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        <p className="text-xs">Preview</p>
      </div>
    )
  }

  return (
    <div className="h-full w-full bg-white p-4 shadow-sm">
      <Preview />
    </div>
  )
}
