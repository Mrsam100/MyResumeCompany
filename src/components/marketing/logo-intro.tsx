'use client'

import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import Image from 'next/image'

interface LogoIntroProps {
  onComplete: () => void
}

export function LogoIntro({ onComplete }: LogoIntroProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const bigLogoRef = useRef<HTMLDivElement>(null)
  const smallLogoRef = useRef<HTMLDivElement>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setDone(true)
        onComplete()
      },
    })

    // Phase 1: Big origami logo fades in at center
    tl.fromTo(
      bigLogoRef.current,
      { scale: 0, rotation: -180, opacity: 0 },
      { scale: 1, rotation: 0, opacity: 1, duration: 1, ease: 'back.out(1.7)' },
    )

    // Phase 2: Hold for a beat
    tl.to({}, { duration: 0.6 })

    // Phase 3: Shrink and fly to top-left corner position
    tl.to(bigLogoRef.current, {
      scale: 0.15,
      x: () => -(window.innerWidth / 2) + 36,
      y: () => -(window.innerHeight / 2) + 32,
      duration: 0.8,
      ease: 'power3.inOut',
    })

    // Phase 4: Crossfade — big logo fades out, small doc icon fades in at corner
    tl.to(bigLogoRef.current, {
      opacity: 0,
      duration: 0.2,
      ease: 'power2.out',
    })

    tl.fromTo(
      smallLogoRef.current,
      { opacity: 0, scale: 0.5 },
      { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(2)' },
      '-=0.15',
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
      {/* Big origami logo — starts centered */}
      <div ref={bigLogoRef} style={{ opacity: 0 }}>
        <Image
          src="/logo-full.svg"
          alt="TheResumeCompany"
          width={200}
          height={160}
          priority
          className="h-40 w-auto sm:h-48"
        />
      </div>

      {/* Small doc icon — appears at top-left corner position */}
      <div
        ref={smallLogoRef}
        className="fixed left-4 top-5"
        style={{ opacity: 0 }}
      >
        <Image
          src="/file.svg"
          alt=""
          width={24}
          height={24}
          className="h-6 w-6"
        />
      </div>
    </div>
  )
}
