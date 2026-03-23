'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FAQ_ITEMS } from '@/constants/faq-data'

export function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="mx-auto max-w-2xl divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
      {FAQ_ITEMS.map((item, i) => (
        <div key={i}>
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-slate-50"
            aria-expanded={openIndex === i}
          >
            <span className="pr-4 text-sm font-semibold text-slate-900">{item.question}</span>
            <ChevronDown
              className={cn(
                'h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200',
                openIndex === i && 'rotate-180',
              )}
            />
          </button>
          <div
            className={cn(
              'grid transition-all duration-200 ease-in-out',
              openIndex === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
            )}
          >
            <div className="overflow-hidden">
              <p className="px-6 pb-5 text-sm leading-relaxed text-slate-600">
                {item.answer}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
