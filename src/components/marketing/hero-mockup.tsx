/**
 * CSS-only resume mockup for hero section.
 * No images needed — pure divs mimicking a resume layout.
 */
export function HeroMockup() {
  return (
    <div className="relative mx-auto w-[280px] sm:w-[320px]">
      {/* Gradient glow behind the mockup */}
      <div className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-blue-400/20 via-violet-400/20 to-blue-300/10 blur-2xl" />

      {/* Resume card */}
      <div
        className="relative rounded-xl border border-slate-200 bg-white p-6 shadow-2xl shadow-blue-500/10"
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

        {/* ATS Score badge */}
        <div className="absolute -right-3 -top-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30">
          <div className="text-center">
            <p className="text-[10px] font-bold text-white leading-none">92</p>
            <p className="text-[6px] text-white/80">ATS</p>
          </div>
        </div>
      </div>
    </div>
  )
}
