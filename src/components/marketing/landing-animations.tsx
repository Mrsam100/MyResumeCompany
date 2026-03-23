'use client'

import { useRef, useEffect, type ReactNode } from 'react'
import type { default as GSAPType } from 'gsap'

let gsap: typeof GSAPType | null = null

async function loadGsap() {
  if (gsap) return gsap
  const [gsapMod, scrollMod] = await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
  ])
  gsapMod.default.registerPlugin(scrollMod.ScrollTrigger)
  gsap = gsapMod.default
  return gsap
}

interface Props {
  children: ReactNode
}

/**
 * Landing page animation wrapper.
 * Clean fade-in-up animations on scroll. No intro screen, no 3D flips.
 */
export function LandingAnimations({ children }: Props) {
  const mainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let ctx: ReturnType<typeof GSAPType.context> | undefined

    loadGsap().then((gsap) => {
      ctx = gsap.context(() => {
        const root = mainRef.current
        if (!root) return

        // ─── Universal fade-in-up for all sections ───
        root.querySelectorAll('section').forEach((section) => {
          // Animate direct children of each section
          const targets = section.querySelectorAll('h1, h2, h3, p, .grid, .flex, button, a, .rounded-2xl, ul')
          if (targets.length === 0) return

          gsap.fromTo(
            targets,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.08,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                toggleActions: 'play none none none',
              },
            },
          )
        })
      }, mainRef)
    })

    return () => { ctx?.revert() }
  }, [])

  return (
    <div ref={mainRef}>
      {children}
    </div>
  )
}
