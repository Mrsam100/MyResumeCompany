/**
 * CSS-only resume mockup for hero section.
 * No images needed — pure divs mimicking a resume layout.
 * Enhanced with animated glow + floating effect.
 */
export function HeroMockup() {
  return (
    <div className="relative mx-auto w-[280px] sm:w-[320px]">
      {/* Animated gradient glow behind the mockup */}
      <div
        className="absolute -inset-8 rounded-3xl opacity-60 blur-3xl animate-gradient-shift"
        style={{ background: 'linear-gradient(135deg, oklch(0.7 0.15 260) 0%, oklch(0.6 0.2 290) 50%, oklch(0.7 0.12 230) 100%)', backgroundSize: '200% 200%' }}
      />

      {/* Resume card */}
      <div
        className="relative rounded-xl border border-slate-200/80 bg-white/95 p-6 shadow-2xl shadow-blue-500/10 backdrop-blur-sm"
        style={{ transform: 'perspective(800px) rotateY(-3deg) rotateX(2deg)' }}
      >
        {/* Header */}
        <div className="mb-4">
          <div className="h-3 w-28 rounded bg-slate-800" />
          <div className="mt-1.5 h-2 w-20 rounded bg-blue-500/60" />
          <div className="mt-3 flex gap-3">
            <div className="h-1.5 w-16 rounded bg-slate-300" />
            <div className="h-1.5 w-14 rounded bg-slate-300" />
          </div>
        </div>

        {/* Summary */}
        <div className="mb-4 space-y-1">
          <div className="h-1.5 w-full rounded bg-slate-200" />
          <div className="h-1.5 w-11/12 rounded bg-slate-200" />
          <div className="h-1.5 w-9/12 rounded bg-slate-200" />
        </div>

        {/* Section: Experience */}
        <div className="mb-3">
          <div className="mb-2 h-2 w-24 rounded bg-blue-600" />
          <div className="space-y-2">
            <div>
              <div className="flex justify-between">
                <div className="h-1.5 w-20 rounded bg-slate-700" />
                <div className="h-1.5 w-12 rounded bg-slate-300" />
              </div>
              <div className="mt-1 h-1.5 w-16 rounded bg-slate-400" />
              <div className="mt-1.5 space-y-1 pl-2">
                <div className="flex items-center gap-1">
                  <div className="h-1 w-1 rounded-full bg-blue-500" />
                  <div className="h-1 w-full rounded bg-slate-200" />
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-1 w-1 rounded-full bg-blue-500" />
                  <div className="h-1 w-10/12 rounded bg-slate-200" />
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-1 w-1 rounded-full bg-blue-500" />
                  <div className="h-1 w-11/12 rounded bg-slate-200" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Education */}
        <div className="mb-3">
          <div className="mb-2 h-2 w-16 rounded bg-blue-600" />
          <div className="flex justify-between">
            <div className="h-1.5 w-24 rounded bg-slate-700" />
            <div className="h-1.5 w-10 rounded bg-slate-300" />
          </div>
          <div className="mt-1 h-1.5 w-20 rounded bg-slate-400" />
        </div>

        {/* Section: Skills */}
        <div>
          <div className="mb-2 h-2 w-12 rounded bg-blue-600" />
          <div className="flex flex-wrap gap-1">
            {[16, 20, 14, 18, 12, 16, 22, 14].map((w, i) => (
              <div key={i} className="h-3 rounded-full bg-slate-100 border border-slate-200" style={{ width: `${w * 3}px` }} />
            ))}
          </div>
        </div>

        {/* ATS Score badge — pulsing glow */}
        <div className="absolute -right-3 -top-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30 animate-pulse-glow">
          <div className="text-center">
            <p className="text-[10px] font-bold text-white leading-none">92</p>
            <p className="text-[6px] text-white/80">ATS</p>
          </div>
        </div>
      </div>
    </div>
  )
}
