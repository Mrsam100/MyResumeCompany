'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

const STORAGE_KEY = 'trc_visited'

interface LogoIntroProps {
  onComplete: () => void
}

export function LogoIntro({ onComplete }: LogoIntroProps) {
  const [phase, setPhase] = useState<'check' | 'show' | 'fade' | 'done'>('check')

  useEffect(() => {
    // Skip intro for returning visitors
    if (typeof window !== 'undefined' && sessionStorage.getItem(STORAGE_KEY)) {
      setPhase('done')
      onComplete()
      return
    }

    // Show logo briefly, then fade out
    setPhase('show')
    const fadeTimer = setTimeout(() => setPhase('fade'), 400)
    const doneTimer = setTimeout(() => {
      setPhase('done')
      onComplete()
      try {
        sessionStorage.setItem(STORAGE_KEY, '1')
      } catch {}
    }, 700)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(doneTimer)
    }
  }, [onComplete])

  if (phase === 'check' || phase === 'done') return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
      style={{
        opacity: phase === 'fade' ? 0 : 1,
        transition: 'opacity 300ms ease-out',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          opacity: phase === 'show' || phase === 'fade' ? 1 : 0,
          transform: phase === 'show' || phase === 'fade' ? 'scale(1)' : 'scale(0.8)',
          transition: 'opacity 200ms ease-out, transform 200ms ease-out',
        }}
      >
        <Image
          src="/logo-full.svg"
          alt="MyResumeCompany"
          width={200}
          height={160}
          priority
          className="h-40 w-auto sm:h-48"
        />
      </div>
    </div>
  )
}
