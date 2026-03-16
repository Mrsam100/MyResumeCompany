'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ArrowRight,
  Check,
  X,
  Clock,
  MousePointerClick,
  ScanSearch,
  Pen,
  FileDown,
  MessageSquareText,
  ChevronRight,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { LogoIntro } from '@/components/marketing/logo-intro'

gsap.registerPlugin(ScrollTrigger)

interface Props {
  isLoggedIn: boolean
}

export function LandingPageClient({ isLoggedIn }: Props) {
  const ctaHref = isLoggedIn ? '/dashboard' : '/signup'
  const ctaLabel = isLoggedIn ? 'Go to Dashboard' : "Start building — it's free"

  const [introComplete, setIntroComplete] = useState(false)
  const handleIntroComplete = useCallback(() => setIntroComplete(true), [])

  const mainRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLElement>(null)
  const heroH1Ref = useRef<HTMLHeadingElement>(null)
  const heroSubRef = useRef<HTMLParagraphElement>(null)
  const heroTagRef = useRef<HTMLParagraphElement>(null)
  const heroCtaRef = useRef<HTMLDivElement>(null)
  const problemRef = useRef<HTMLElement>(null)
  const stepsRef = useRef<HTMLElement>(null)
  const toolsRef = useRef<HTMLElement>(null)
  const beforeAfterRef = useRef<HTMLElement>(null)
  const pricingRef = useRef<HTMLElement>(null)
  const objectionsRef = useRef<HTMLElement>(null)
  const finalCtaRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!introComplete) return

    const ctx = gsap.context(() => {
      // ─── HERO: Split text stagger reveal ───
      const heroTl = gsap.timeline({ defaults: { ease: 'power4.out' } })

      heroTl
        .fromTo(
          heroTagRef.current,
          { opacity: 0, y: 30, filter: 'blur(10px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8 },
        )
        .fromTo(
          heroH1Ref.current,
          { opacity: 0, y: 60, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 1.2 },
          '-=0.4',
        )
        .fromTo(
          heroSubRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.9 },
          '-=0.6',
        )
        .fromTo(
          heroCtaRef.current,
          { opacity: 0, y: 30, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8 },
          '-=0.4',
        )

      // Floating CTA button pulse
      const heroBtn = heroCtaRef.current?.querySelector('button')
      if (heroBtn) {
        gsap.to(heroBtn, {
          boxShadow: '0 0 0 8px rgba(0,0,0,0.05)',
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
      }

      // ─── PROBLEM SECTION: Cards fly in from different directions ───
      const problemCards = problemRef.current?.querySelectorAll('.problem-card')
      if (problemCards) {
        problemCards.forEach((card, i) => {
          const xOffset = i === 0 ? -120 : i === 2 ? 120 : 0
          const rotation = i === 0 ? -8 : i === 2 ? 8 : 0

          gsap.fromTo(
            card,
            { opacity: 0, x: xOffset, y: 80, rotation, scale: 0.8 },
            {
              opacity: 1,
              x: 0,
              y: 0,
              rotation: 0,
              scale: 1,
              duration: 1,
              ease: 'back.out(1.7)',
              scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
              },
            },
          )
        })

        // Shake the icons
        const icons = problemRef.current?.querySelectorAll('.problem-icon')
        icons?.forEach((icon) => {
          gsap.to(icon, {
            rotation: 10,
            duration: 0.15,
            repeat: 5,
            yoyo: true,
            ease: 'power1.inOut',
            scrollTrigger: {
              trigger: icon,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          })
        })
      }

      // ─── STEPS: Horizontal slide-in with stagger + number counter ───
      const steps = stepsRef.current?.querySelectorAll('.step-item')
      if (steps) {
        steps.forEach((step, i) => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: step,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          })

          // Number box: scale from 0 with elastic bounce
          tl.fromTo(
            step.querySelector('.step-number'),
            { scale: 0, rotation: -180 },
            { scale: 1, rotation: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' },
          )

          // Content slides in from the right
          tl.fromTo(
            step.querySelector('.step-content'),
            { opacity: 0, x: 100 + i * 30, filter: 'blur(5px)' },
            { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' },
            '-=0.4',
          )

          // Badges pop in one by one
          const badges = step.querySelectorAll('.badge-item')
          if (badges.length) {
            tl.fromTo(
              badges,
              { opacity: 0, scale: 0, y: 20 },
              { opacity: 1, scale: 1, y: 0, duration: 0.4, stagger: 0.1, ease: 'back.out(2)' },
              '-=0.2',
            )
          }
        })
      }

      // ─── TOOLS GRID: Stagger reveal with 3D flip ───
      const toolCards = toolsRef.current?.querySelectorAll('.tool-card')
      if (toolCards) {
        gsap.fromTo(
          toolCards,
          {
            opacity: 0,
            rotationY: 90,
            transformOrigin: 'left center',
            scale: 0.8,
          },
          {
            opacity: 1,
            rotationY: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: toolsRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          },
        )

        // Hover magnetic effect
        toolCards.forEach((card) => {
          const el = card as HTMLElement
          el.addEventListener('mouseenter', () => {
            gsap.to(el, { scale: 1.03, y: -4, duration: 0.3, ease: 'power2.out' })
            gsap.to(el.querySelector('.tool-icon'), {
              rotation: 360,
              duration: 0.6,
              ease: 'power2.out',
            })
          })
          el.addEventListener('mouseleave', () => {
            gsap.to(el, { scale: 1, y: 0, duration: 0.3, ease: 'power2.out' })
          })
        })
      }

      // ─── BEFORE/AFTER: Dramatic crossfade with typewriter ───
      const beforeCard = beforeAfterRef.current?.querySelector('.before-card')
      const afterCard = beforeAfterRef.current?.querySelector('.after-card')

      if (beforeCard && afterCard) {
        const baTl = gsap.timeline({
          scrollTrigger: {
            trigger: beforeAfterRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        })

        // Before card: slides in from left, tilts
        baTl.fromTo(
          beforeCard,
          { opacity: 0, x: -200, rotation: -5 },
          { opacity: 1, x: 0, rotation: 0, duration: 0.8, ease: 'power3.out' },
        )

        // Before bullets stagger
        baTl.fromTo(
          beforeCard.querySelectorAll('li'),
          { opacity: 0, x: -30 },
          { opacity: 1, x: 0, duration: 0.4, stagger: 0.15 },
          '-=0.3',
        )

        // Strikethrough animation on before text
        baTl.to(
          beforeCard.querySelectorAll('li'),
          {
            textDecoration: 'line-through',
            color: 'rgba(0,0,0,0.3)',
            duration: 0.3,
            stagger: 0.1,
          },
          '+=0.5',
        )

        // After card: explodes in from right
        baTl.fromTo(
          afterCard,
          { opacity: 0, x: 200, rotation: 5, scale: 0.9 },
          { opacity: 1, x: 0, rotation: 0, scale: 1, duration: 0.8, ease: 'back.out(1.4)' },
          '-=0.5',
        )

        // After bullets typewriter stagger
        baTl.fromTo(
          afterCard.querySelectorAll('li'),
          { opacity: 0, y: 20, filter: 'blur(4px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.5,
            stagger: 0.2,
            ease: 'power2.out',
          },
          '-=0.3',
        )

        // Glow effect on after card
        baTl.to(
          afterCard,
          {
            boxShadow: '0 0 40px rgba(34,197,94,0.15)',
            duration: 0.6,
            ease: 'power2.out',
          },
        )
      }

      // ─── PRICING TABLE: Rows cascade down ───
      const pricingRows = pricingRef.current?.querySelectorAll('.pricing-row')
      if (pricingRows) {
        gsap.fromTo(
          pricingRows,
          { opacity: 0, x: -60, scaleX: 0.8, transformOrigin: 'left center' },
          {
            opacity: 1,
            x: 0,
            scaleX: 1,
            duration: 0.5,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: pricingRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          },
        )
      }

      // ─── OBJECTIONS: Accordion-style drop-in ───
      const objectionItems = objectionsRef.current?.querySelectorAll('.objection-item')
      if (objectionItems) {
        objectionItems.forEach((item) => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          })

          // Question drops from above
          tl.fromTo(
            item.querySelector('.objection-q'),
            { opacity: 0, y: -40, rotationX: 45 },
            { opacity: 1, y: 0, rotationX: 0, duration: 0.6, ease: 'power3.out' },
          )

          // Answer fades up
          tl.fromTo(
            item.querySelector('.objection-a'),
            { opacity: 0, y: 20, height: 0 },
            { opacity: 1, y: 0, height: 'auto', duration: 0.5, ease: 'power2.out' },
            '-=0.2',
          )
        })
      }

      // ─── FINAL CTA: Massive scale-in ───
      const finalEl = finalCtaRef.current
      if (finalEl) {
        const finalH2 = finalEl.querySelector('h2')
        const finalP = finalEl.querySelector('p')
        const finalBtn = finalEl.querySelector('.final-cta-btn')
        const finalBtnInner = finalEl.querySelector('.final-cta-btn button')

        if (finalH2 && finalP && finalBtn) {
          const finalTl = gsap.timeline({
            scrollTrigger: {
              trigger: finalEl,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          })

          finalTl
            .fromTo(
              finalH2,
              { opacity: 0, scale: 0.5, filter: 'blur(20px)' },
              { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1, ease: 'power4.out' },
            )
            .fromTo(
              finalP,
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.6 },
              '-=0.4',
            )
            .fromTo(
              finalBtn,
              { opacity: 0, scale: 0.8, y: 20 },
              { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(2)' },
              '-=0.2',
            )
        }

        // Infinite bounce on final CTA button
        if (finalBtnInner) {
          gsap.to(finalBtnInner, {
            y: -6,
            duration: 0.8,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          })
        }
      }

      // ─── SECTION HEADINGS: Clip reveal ───
      const sectionHeadings = mainRef.current?.querySelectorAll('.section-heading')
      sectionHeadings?.forEach((heading) => {
        gsap.fromTo(
          heading,
          {
            clipPath: 'inset(0 100% 0 0)',
            opacity: 0,
          },
          {
            clipPath: 'inset(0 0% 0 0)',
            opacity: 1,
            duration: 1,
            ease: 'power4.inOut',
            scrollTrigger: {
              trigger: heading,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          },
        )
      })

      // ─── PARALLAX on section backgrounds ───
      mainRef.current?.querySelectorAll('.parallax-bg').forEach((bg) => {
        gsap.to(bg, {
          yPercent: -20,
          ease: 'none',
          scrollTrigger: {
            trigger: bg,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        })
      })
    }, mainRef)

    return () => ctx.revert()
  }, [introComplete])

  return (
    <div ref={mainRef}>
      {/* Logo intro animation */}
      {!introComplete && <LogoIntro onComplete={handleIntroComplete} />}

      {/* ─── Hero ─── */}
      <section ref={heroRef} className="relative overflow-hidden px-4 pb-24 pt-16 sm:pt-24">
        {/* Animated gradient orbs */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2">
          <div className="h-[500px] w-[800px] rounded-full bg-gradient-to-r from-primary/10 via-violet-500/10 to-primary/5 blur-3xl parallax-bg" />
        </div>
        <div className="relative mx-auto max-w-3xl text-center">
          <p
            ref={heroTagRef}
            className="text-sm font-medium tracking-wide text-muted-foreground uppercase"
            style={{ opacity: 0 }}
          >
            Stop tweaking. Start landing.
          </p>
          <h1
            ref={heroH1Ref}
            className="mt-4 text-[2.5rem] font-extrabold leading-[1.1] tracking-tight sm:text-6xl"
            style={{ opacity: 0 }}
          >
            Your resume is costing you interviews.
          </h1>
          <p
            ref={heroSubRef}
            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
            style={{ opacity: 0 }}
          >
            75% of resumes get rejected by ATS before a human sees them.
            We fix that. Pick a template, let AI write it, score it against the job — done.
          </p>
          <div
            ref={heroCtaRef}
            className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
            style={{ opacity: 0 }}
          >
            <Link href={ctaHref}>
              <Button size="lg" className="h-12 gap-2 px-8 text-base font-semibold">
                {ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <p className="text-xs text-muted-foreground">100 free credits. No card required.</p>
          </div>
        </div>
      </section>

      {/* ─── The problem ─── */}
      <section ref={problemRef} className="relative border-y bg-muted/40 px-4 py-20 overflow-hidden">
        <div className="mx-auto max-w-4xl">
          <h2 className="section-heading text-center text-2xl font-bold sm:text-3xl">
            The resume process is broken
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            <div className="problem-card space-y-3 text-center">
              <div className="problem-icon mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <Clock className="h-6 w-6 text-destructive" />
              </div>
              <p className="font-semibold">Hours wasted formatting</p>
              <p className="text-sm text-muted-foreground">
                Fiddling with margins in Word. Googling &ldquo;how to write a bullet point.&rdquo;
                Copy-pasting from templates that look like 2009.
              </p>
            </div>
            <div className="problem-card space-y-3 text-center">
              <div className="problem-icon mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <X className="h-6 w-6 text-destructive" />
              </div>
              <p className="font-semibold">Rejected by robots</p>
              <p className="text-sm text-muted-foreground">
                ATS software filters you out before anyone reads your name.
                Wrong format, missing keywords, game over.
              </p>
            </div>
            <div className="problem-card space-y-3 text-center">
              <div className="problem-icon mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <MessageSquareText className="h-6 w-6 text-destructive" />
              </div>
              <p className="font-semibold">Generic &ldquo;responsible for&rdquo;</p>
              <p className="text-sm text-muted-foreground">
                Your bullet points sound like everyone else&apos;s.
                No impact. No numbers. No reason to call you back.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── How it works ─── */}
      <section ref={stepsRef} className="px-4 py-24">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-medium uppercase tracking-wide text-primary">How it works</p>
          <h2 className="section-heading mt-2 text-2xl font-bold sm:text-3xl">
            Three moves. One resume that works.
          </h2>

          <div className="mt-16 space-y-20">
            <div className="step-item flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-10">
              <div className="step-number flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground">
                1
              </div>
              <div className="step-content">
                <h3 className="text-xl font-semibold">Pick a design that fits your industry</h3>
                <p className="mt-2 text-muted-foreground">
                  15 templates across categories — clean ATS-safe layouts for finance,
                  bold modern designs for startups, academic CVs for research. Every one
                  is tested with real ATS systems.
                </p>
                <Link
                  href="/templates"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  Browse templates <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            <div className="step-item flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-10">
              <div className="step-number flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground">
                2
              </div>
              <div className="step-content">
                <h3 className="text-xl font-semibold">Let AI do the writing you dread</h3>
                <p className="mt-2 text-muted-foreground">
                  Tell it your job title and company. It writes achievement-focused bullets
                  with real metrics. Need a full resume from scratch? The wizard asks 5 questions
                  and builds the whole thing.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {['Bullet points', 'Summaries', 'Full resumes', 'Cover letters'].map((t) => (
                    <Badge key={t} variant="secondary" className="badge-item text-xs">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="step-item flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-10">
              <div className="step-number flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground">
                3
              </div>
              <div className="step-content">
                <h3 className="text-xl font-semibold">Score it, fix it, send it</h3>
                <p className="mt-2 text-muted-foreground">
                  Paste a job description. The ATS scanner scores your resume 0-100 and shows
                  exactly which keywords you&apos;re missing. One click and the optimizer
                  rewrites your bullets to match. Export a pixel-perfect PDF and apply.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── What you get ─── */}
      <section ref={toolsRef} className="border-y bg-muted/40 px-4 py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="section-heading text-center text-2xl font-bold sm:text-3xl">
            What&apos;s inside
          </h2>
          <p className="mt-3 text-center text-muted-foreground">
            Not features. Tools that actually change your callback rate.
          </p>

          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-2" style={{ perspective: '1000px' }}>
            {TOOLS.map((tool) => (
              <div key={tool.label} className="tool-card flex gap-4 bg-card p-6 cursor-default">
                <div className="tool-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <tool.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{tool.label}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{tool.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Before / After ─── */}
      <section ref={beforeAfterRef} className="px-4 py-24 overflow-hidden">
        <div className="mx-auto max-w-3xl">
          <h2 className="section-heading text-center text-2xl font-bold sm:text-3xl">
            Same person. Different resume.
          </h2>
          <p className="mt-3 text-center text-muted-foreground">
            Here&apos;s what AI rewriting actually looks like.
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            <div className="before-card rounded-xl border border-destructive/30 bg-destructive/5 p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-destructive">Before</p>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li>&bull; Responsible for managing social media accounts</li>
                <li>&bull; Worked with the marketing team on campaigns</li>
                <li>&bull; Helped increase website traffic</li>
              </ul>
            </div>
            <div className="after-card rounded-xl border border-green-500/30 bg-green-500/5 p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-green-600">After</p>
              <ul className="mt-4 space-y-3 text-sm">
                <li>&bull; Grew Instagram following from 2K to 18K in 6 months through data-driven content strategy</li>
                <li>&bull; Led 3-person team on a $50K product launch campaign that exceeded revenue targets by 140%</li>
                <li>&bull; Increased organic website traffic 65% YoY by implementing SEO-optimized blog program</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* ─── Pricing ─── */}
      <section ref={pricingRef} className="px-4 py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="section-heading text-center text-2xl font-bold sm:text-3xl">
            Pay for what you use. Or don&apos;t.
          </h2>
          <p className="mt-3 text-center text-muted-foreground">
            100 free credits gets you a full resume with AI. Most people never need to pay.
          </p>

          <div className="mx-auto mt-12 max-w-lg overflow-hidden rounded-2xl border">
            <div className="pricing-row flex items-center justify-between bg-muted/50 px-6 py-4">
              <span className="font-semibold">Action</span>
              <span className="font-semibold">Credits</span>
            </div>
            <div className="divide-y">
              {PRICING_ROWS.map(([action, cost]) => (
                <div key={action} className="pricing-row flex items-center justify-between px-6 py-3 text-sm">
                  <span>{action}</span>
                  <span className="font-mono text-muted-foreground">{cost}</span>
                </div>
              ))}
            </div>
            <div className="pricing-row bg-muted/50 px-6 py-3 text-center text-xs text-muted-foreground">
              Pro subscribers ($12/mo) use all AI features for free + get 500 credits/month.
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link href="/pricing">
              <Button variant="outline" className="gap-2">
                Full pricing details <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Separator />

      {/* ─── Objections ─── */}
      <section ref={objectionsRef} className="px-4 py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="section-heading text-center text-2xl font-bold sm:text-3xl">
            &ldquo;But...&rdquo;
          </h2>

          <div className="mt-12 space-y-8">
            {OBJECTIONS.map((o) => (
              <div key={o.q} className="objection-item">
                <p className="objection-q font-semibold">{o.q}</p>
                <p className="objection-a mt-1.5 text-sm text-muted-foreground">{o.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section ref={finalCtaRef} className="relative border-t bg-muted/40 px-4 py-24 overflow-hidden">
        <div className="pointer-events-none absolute -bottom-40 left-1/2 -translate-x-1/2">
          <div className="h-[400px] w-[600px] rounded-full bg-gradient-to-t from-primary/10 via-violet-500/5 to-transparent blur-3xl parallax-bg" />
        </div>
        <div className="relative mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">
            You&apos;ve read this far.
          </h2>
          <p className="mt-4 text-muted-foreground">
            That&apos;s more effort than most people put into their resume.
            Give it 10 minutes. See what comes out.
          </p>
          <div className="final-cta-btn mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href={ctaHref}>
              <Button size="lg" className="h-12 gap-2 px-10 text-base font-semibold">
                {ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Free. 100 credits. No credit card. Takes 30 seconds to sign up.
          </p>
        </div>
      </section>
    </div>
  )
}

// ─── Data ───

const TOOLS = [
  {
    icon: Pen,
    label: 'AI Bullet Writer',
    detail: 'Give it your job title. Get back 5 achievement-focused bullets with real metrics you can edit.',
  },
  {
    icon: ScanSearch,
    label: 'ATS Scanner',
    detail: 'Paste a job description. Get a 0-100 score with exactly which keywords you\'re missing.',
  },
  {
    icon: MousePointerClick,
    label: 'One-Click Optimize',
    detail: 'The optimizer rewrites your bullets to match the job. You pick which rewrites to keep.',
  },
  {
    icon: FileDown,
    label: 'PDF Export',
    detail: 'Pixel-perfect PDFs that look great on screen and survive any ATS parser.',
  },
  {
    icon: MessageSquareText,
    label: 'Cover Letters',
    detail: 'Personalized to the company and role. Choose professional, enthusiastic, or conversational tone.',
  },
  {
    icon: Check,
    label: '15 Templates',
    detail: 'Classic, modern, creative, ATS-safe, academic. Every one tested with real tracking systems.',
  },
]

const PRICING_ROWS: [string, string][] = [
  ['AI bullet points', '10'],
  ['AI summary', '10'],
  ['ATS scan', '15'],
  ['ATS optimize', '15'],
  ['Cover letter', '20'],
  ['Full resume wizard', '40'],
  ['PDF export', '30'],
]

const OBJECTIONS = [
  {
    q: '"Won\'t AI-written resumes sound fake?"',
    a: 'The AI suggests. You edit. Every bullet is based on your actual experience — it just makes it sound better. Think writing partner, not ghostwriter. You stay in control of every word.',
  },
  {
    q: '"I don\'t want to pay for another subscription."',
    a: 'Then don\'t. You get 100 free credits on signup — that\'s enough for a full AI-generated resume, ATS scan, and PDF export. Most people finish their resume without ever paying. Credit packs start at $4.99 if you need more.',
  },
  {
    q: '"What about my data?"',
    a: 'Your resume data is yours. We don\'t sell it. We don\'t use it to train AI. You can delete your account and every byte of data from Settings, anytime.',
  },
  {
    q: '"Do ATS scanners actually matter?"',
    a: 'Fortune 500 companies, staffing agencies, and most mid-size companies use ATS. If your resume doesn\'t have the right keywords in the right format, it never reaches a human. Our scanner shows you exactly what\'s missing.',
  },
]
