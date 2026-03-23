'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const TEMPLATES = [
  { name: 'Classic Professional', category: 'Professional', color: '#1e3a5f', secondary: '#4a6fa5', free: true },
  { name: 'Modern Minimal', category: 'Modern', color: '#3b82f6', secondary: '#60a5fa', free: true },
  { name: 'Executive', category: 'Professional', color: '#2d2d2d', secondary: '#c9a84c', free: false },
  { name: 'Developer', category: 'Tech', color: '#22c55e', secondary: '#4ade80', free: true },
  { name: 'Creative Bold', category: 'Creative', color: '#0d9488', secondary: '#f97316', free: false },
  { name: 'ATS Simple', category: 'ATS', color: '#000000', secondary: '#333333', free: true },
  { name: 'Sleek', category: 'Modern', color: '#1e293b', secondary: '#3b82f6', free: false },
  { name: 'Blueprint', category: 'Professional', color: '#1e40af', secondary: '#60a5fa', free: false },
  { name: 'Noir Edge', category: 'Modern', color: '#111111', secondary: '#e11d48', free: false },
  { name: 'Starter', category: 'Creative', color: '#2563eb', secondary: '#60a5fa', free: true },
]

export function TemplateCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)

  function scroll(direction: 'left' | 'right') {
    scrollRef.current?.scrollBy({
      left: direction === 'left' ? -280 : 280,
      behavior: 'smooth',
    })
  }

  return (
    <div className="relative">
      {/* Scroll buttons */}
      <button
        onClick={() => scroll('left')}
        className="absolute -left-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border bg-white p-2 shadow-md transition-all hover:shadow-lg md:flex"
        aria-label="Scroll left"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={() => scroll('right')}
        className="absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border bg-white p-2 shadow-md transition-all hover:shadow-lg md:flex"
        aria-label="Scroll right"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {/* Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {TEMPLATES.map((t) => (
          <div key={t.name} className="w-[220px] shrink-0 snap-start">
            <div className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
              {/* Color bar */}
              <div
                className="h-2"
                style={{ background: `linear-gradient(90deg, ${t.color}, ${t.secondary})` }}
              />

              {/* Mini resume preview */}
              <div className="p-4">
                <div className="mb-3 space-y-1.5">
                  <div className="h-2 w-16 rounded" style={{ backgroundColor: t.color }} />
                  <div className="h-1 w-12 rounded bg-slate-300" />
                  <div className="mt-2 space-y-0.5">
                    <div className="h-0.5 w-full rounded bg-slate-100" />
                    <div className="h-0.5 w-10/12 rounded bg-slate-100" />
                    <div className="h-0.5 w-8/12 rounded bg-slate-100" />
                  </div>
                  <div className="mt-1.5 h-1 w-14 rounded" style={{ backgroundColor: t.color, opacity: 0.6 }} />
                  <div className="space-y-0.5">
                    <div className="h-0.5 w-full rounded bg-slate-100" />
                    <div className="h-0.5 w-9/12 rounded bg-slate-100" />
                  </div>
                </div>

                {/* Template info */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-900">{t.name}</p>
                    <p className="text-[10px] text-slate-500">{t.category}</p>
                  </div>
                  {!t.free && (
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[8px] px-1.5 py-0">
                      Pro
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* View all card */}
        <div className="flex w-[220px] shrink-0 snap-start items-center justify-center">
          <Link href="/resume-templates" className="flex flex-col items-center gap-2 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-slate-300 transition-colors hover:border-blue-500">
              <ArrowRight className="h-5 w-5 text-slate-400" />
            </div>
            <span className="text-sm font-medium text-slate-600">View all 50+</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
