'use client'

import { useRef, useEffect, useState, useCallback, type ReactNode } from 'react'
import type { default as GSAPType } from 'gsap'
import { LogoIntro } from '@/components/marketing/logo-intro'

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

export function LandingAnimations({ children }: Props) {
  const [introComplete, setIntroComplete] = useState(false)
  const handleIntroComplete = useCallback(() => setIntroComplete(true), [])
  const mainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!introComplete) return

    let ctx: ReturnType<typeof GSAPType.context> | undefined

    loadGsap().then((gsap) => {
      ctx = gsap.context(() => {
        const root = mainRef.current
        if (!root) return

        // ─── HERO: Subtle pulse on CTA (no opacity:0 — hero stays visible from SSR for LCP) ───
        const heroSection = root.querySelector('[data-section="hero"]')
        if (heroSection) {
          const heroBtn = heroSection.querySelector('button')
          if (heroBtn) {
            gsap.to(heroBtn, { boxShadow: '0 0 0 8px rgba(0,0,0,0.05)', duration: 1.5, repeat: -1, yoyo: true, ease: 'sine.inOut' })
          }
        }

        // ─── PROBLEM: Cards fly in ───
        const problemCards = root.querySelectorAll('.problem-card')
        problemCards.forEach((card, i) => {
          const xOffset = i === 0 ? -120 : i === 2 ? 120 : 0
          const rotation = i === 0 ? -8 : i === 2 ? 8 : 0
          gsap.fromTo(card,
            { opacity: 0, x: xOffset, y: 80, rotation, scale: 0.8 },
            { opacity: 1, x: 0, y: 0, rotation: 0, scale: 1, duration: 1, ease: 'back.out(1.7)',
              scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none reverse' } })
        })

        const icons = root.querySelectorAll('.problem-icon')
        icons.forEach((icon) => {
          gsap.to(icon, { rotation: 10, duration: 0.15, repeat: 5, yoyo: true, ease: 'power1.inOut',
            scrollTrigger: { trigger: icon, start: 'top 80%', toggleActions: 'play none none none' } })
        })

        // ─── STEPS: Slide-in ───
        const steps = root.querySelectorAll('.step-item')
        steps.forEach((step, i) => {
          const tl = gsap.timeline({
            scrollTrigger: { trigger: step, start: 'top 80%', toggleActions: 'play none none reverse' },
          })
          tl.fromTo(step.querySelector('.step-number'), { scale: 0, rotation: -180 }, { scale: 1, rotation: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' })
          tl.fromTo(step.querySelector('.step-content'), { opacity: 0, x: 100 + i * 30, filter: 'blur(5px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' }, '-=0.4')
          const badges = step.querySelectorAll('.badge-item')
          if (badges.length) {
            tl.fromTo(badges, { opacity: 0, scale: 0, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.4, stagger: 0.1, ease: 'back.out(2)' }, '-=0.2')
          }
        })

        // ─── TOOLS: 3D flip stagger ───
        const toolCards = root.querySelectorAll('.tool-card')
        if (toolCards.length) {
          gsap.fromTo(toolCards,
            { opacity: 0, rotationY: 90, transformOrigin: 'left center', scale: 0.8 },
            { opacity: 1, rotationY: 0, scale: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out',
              scrollTrigger: { trigger: root.querySelector('[data-section="tools"]'), start: 'top 75%', toggleActions: 'play none none reverse' } })

          toolCards.forEach((card) => {
            const el = card as HTMLElement
            el.addEventListener('mouseenter', () => {
              gsap.to(el, { scale: 1.03, y: -4, duration: 0.3, ease: 'power2.out' })
              gsap.to(el.querySelector('.tool-icon'), { rotation: 360, duration: 0.6, ease: 'power2.out' })
            })
            el.addEventListener('mouseleave', () => {
              gsap.to(el, { scale: 1, y: 0, duration: 0.3, ease: 'power2.out' })
            })
          })
        }

        // ─── BEFORE/AFTER: Crossfade ───
        const beforeCard = root.querySelector('.before-card')
        const afterCard = root.querySelector('.after-card')
        if (beforeCard && afterCard) {
          const baTl = gsap.timeline({
            scrollTrigger: { trigger: root.querySelector('[data-section="before-after"]'), start: 'top 70%', toggleActions: 'play none none reverse' },
          })
          baTl.fromTo(beforeCard, { opacity: 0, x: -200, rotation: -5 }, { opacity: 1, x: 0, rotation: 0, duration: 0.8, ease: 'power3.out' })
          baTl.fromTo(beforeCard.querySelectorAll('li'), { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.4, stagger: 0.15 }, '-=0.3')
          baTl.to(beforeCard.querySelectorAll('li'), { textDecoration: 'line-through', color: 'rgba(0,0,0,0.3)', duration: 0.3, stagger: 0.1 }, '+=0.5')
          baTl.fromTo(afterCard, { opacity: 0, x: 200, rotation: 5, scale: 0.9 }, { opacity: 1, x: 0, rotation: 0, scale: 1, duration: 0.8, ease: 'back.out(1.4)' }, '-=0.5')
          baTl.fromTo(afterCard.querySelectorAll('li'), { opacity: 0, y: 20, filter: 'blur(4px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5, stagger: 0.2, ease: 'power2.out' }, '-=0.3')
          baTl.to(afterCard, { boxShadow: '0 0 40px rgba(34,197,94,0.15)', duration: 0.6, ease: 'power2.out' })
        }

        // ─── PRICING: Cascade rows ───
        const pricingRows = root.querySelectorAll('.pricing-row')
        if (pricingRows.length) {
          gsap.fromTo(pricingRows,
            { opacity: 0, x: -60, scaleX: 0.8, transformOrigin: 'left center' },
            { opacity: 1, x: 0, scaleX: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out',
              scrollTrigger: { trigger: root.querySelector('[data-section="pricing"]'), start: 'top 75%', toggleActions: 'play none none reverse' } })
        }

        // ─── OBJECTIONS: Drop-in ───
        const objectionItems = root.querySelectorAll('.objection-item')
        objectionItems.forEach((item) => {
          const tl = gsap.timeline({
            scrollTrigger: { trigger: item, start: 'top 85%', toggleActions: 'play none none reverse' },
          })
          tl.fromTo(item.querySelector('.objection-q'), { opacity: 0, y: -40, rotationX: 45 }, { opacity: 1, y: 0, rotationX: 0, duration: 0.6, ease: 'power3.out' })
          tl.fromTo(item.querySelector('.objection-a'), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2')
        })

        // ─── FINAL CTA: Scale-in ───
        const finalEl = root.querySelector('[data-section="final-cta"]')
        if (finalEl) {
          const finalH2 = finalEl.querySelector('h2')
          const finalP = finalEl.querySelector('p')
          const finalBtn = finalEl.querySelector('.final-cta-btn')
          const finalBtnInner = finalEl.querySelector('.final-cta-btn button')

          if (finalH2 && finalP && finalBtn) {
            const finalTl = gsap.timeline({
              scrollTrigger: { trigger: finalEl, start: 'top 80%', toggleActions: 'play none none reverse' },
            })
            finalTl.fromTo(finalH2, { opacity: 0, scale: 0.5, filter: 'blur(20px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1, ease: 'power4.out' })
            finalTl.fromTo(finalP, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
            finalTl.fromTo(finalBtn, { opacity: 0, scale: 0.8, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(2)' }, '-=0.2')
          }

          if (finalBtnInner) {
            gsap.to(finalBtnInner, { y: -6, duration: 0.8, repeat: -1, yoyo: true, ease: 'sine.inOut' })
          }
        }

        // ─── SECTION HEADINGS: Clip reveal ───
        root.querySelectorAll('.section-heading').forEach((heading) => {
          gsap.fromTo(heading,
            { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
            { clipPath: 'inset(0 0% 0 0)', opacity: 1, duration: 1, ease: 'power4.inOut',
              scrollTrigger: { trigger: heading, start: 'top 85%', toggleActions: 'play none none reverse' } })
        })

        // ─── PARALLAX backgrounds ───
        root.querySelectorAll('.parallax-bg').forEach((bg) => {
          gsap.to(bg, { yPercent: -20, ease: 'none',
            scrollTrigger: { trigger: bg, start: 'top bottom', end: 'bottom top', scrub: 1 } })
        })
      }, mainRef)
    })

    return () => { ctx?.revert() }
  }, [introComplete])

  return (
    <div ref={mainRef}>
      {!introComplete && <LogoIntro onComplete={handleIntroComplete} />}
      {children}
    </div>
  )
}
