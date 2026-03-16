'use client'

import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import Image from 'next/image'

interface LogoIntroProps {
  onComplete: () => void
}

export function LogoIntro({ onComplete }: LogoIntroProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setDone(true)
        onComplete()
      },
    })

    // Phase 1: Logo fades in at center, large
    tl.fromTo(
      logoRef.current,
      { scale: 0, rotation: -180, opacity: 0 },
      { scale: 1, rotation: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.7)' },
    )

    // Phase 2: Brand name types in
    tl.fromTo(
      textRef.current,
      { opacity: 0, x: -20, filter: 'blur(10px)' },
      { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.6, ease: 'power3.out' },
      '-=0.2',
    )

    // Phase 3: Hold for a beat
    tl.to({}, { duration: 0.5 })

    // Phase 4: Shrink logo + text and fly to top-left corner
    tl.to(logoRef.current, {
      scale: 0.35,
      x: () => {
        const vw = window.innerWidth
        return -(vw / 2) + 100
      },
      y: () => {
        const vh = window.innerHeight
        return -(vh / 2) + 32
      },
      duration: 0.8,
      ease: 'power3.inOut',
    })

    tl.to(
      textRef.current,
      {
        scale: 0.5,
        x: () => {
          const vw = window.innerWidth
          return -(vw / 2) + 160
        },
        y: () => {
          const vh = window.innerHeight
          return -(vh / 2) + 32
        },
        opacity: 0,
        duration: 0.8,
        ease: 'power3.inOut',
      },
      '<',
    )

    // Phase 5: Overlay fades out
    tl.to(overlayRef.current, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.out',
    })

    return () => {
      tl.kill()
    }
  }, [onComplete])

  if (done) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
    >
      <div className="flex items-center gap-4">
        <div ref={logoRef} style={{ opacity: 0 }}>
          <Image
            src="/file.svg"
            alt="TheResumeCompany"
            width={80}
            height={80}
            priority
            className="h-20 w-20"
          />
        </div>
        <span
          ref={textRef}
          className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl"
          style={{ opacity: 0 }}
        >
          TheResumeCompany
        </span>
      </div>
    </div>
  )
}
