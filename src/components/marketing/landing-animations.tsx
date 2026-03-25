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
 * Smooth fade-in-up + staggered reveals on scroll.
 * Hero gets special entrance animation.
 */
export function LandingAnimations({ children }: Props) {
  const mainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let ctx: ReturnType<typeof GSAPType.context> | undefined

    // Respect reduced-motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    loadGsap().then((gsap) => {
      ctx = gsap.context(() => {
        const root = mainRef.current
        if (!root) return
        const sections = root.querySelectorAll('section')

        // ─── Hero entrance (first section) ───
        const hero = sections[0]
        if (hero) {
          const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } })

          // Badge slides down
          const badge = hero.querySelector('[class*="Badge"], [class*="badge"]')
          if (badge) {
            heroTimeline.fromTo(badge, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.5 }, 0.2)
          }

          // H1 slides up
          const h1 = hero.querySelector('h1')
          if (h1) {
            heroTimeline.fromTo(h1, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7 }, 0.3)
          }

          // Paragraph fades in
          const p = hero.querySelector('h1 + p')
          if (p) {
            heroTimeline.fromTo(p, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, 0.5)
          }

          // CTA buttons slide up
          const ctas = hero.querySelectorAll('a[href], button')
          if (ctas.length) {
            heroTimeline.fromTo(ctas, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, 0.7)
          }
        }

        // ─── Scroll-triggered sections ───
        sections.forEach((section, sIdx) => {
          if (sIdx === 0) return // skip hero (already animated)

          const targets = section.querySelectorAll('h2, h3, p, .grid > *, .rounded-2xl, ul, button, a, [class*="Badge"]')
          if (targets.length === 0) return

          gsap.fromTo(
            targets,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.06,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 82%',
                toggleActions: 'play none none none',
              },
            },
          )
        })

        // ─── Parallax on gradient blobs ───
        root.querySelectorAll('[class*="blur-["]').forEach((blob) => {
          gsap.to(blob, {
            y: -60,
            ease: 'none',
            scrollTrigger: {
              trigger: blob.parentElement,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          })
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
