'use client'

import { useEffect, useRef } from 'react'

/**
 * Full-screen animated mesh gradient that shifts colors smoothly.
 * Pure CSS animations — no JS per-frame. GPU-accelerated via will-change.
 */
export function AnimatedGradient() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Orb 1 — top-right, blue → violet */}
      <div
        className="absolute -right-[20%] -top-[20%] h-[800px] w-[800px] rounded-full opacity-40 blur-[120px] will-change-transform"
        style={{
          background: 'radial-gradient(circle, oklch(0.65 0.25 265) 0%, oklch(0.55 0.28 290) 50%, transparent 70%)',
          animation: 'orbFloat1 20s ease-in-out infinite',
        }}
      />
      {/* Orb 2 — bottom-left, indigo → cyan */}
      <div
        className="absolute -bottom-[15%] -left-[15%] h-[700px] w-[700px] rounded-full opacity-30 blur-[100px] will-change-transform"
        style={{
          background: 'radial-gradient(circle, oklch(0.6 0.2 250) 0%, oklch(0.7 0.15 200) 50%, transparent 70%)',
          animation: 'orbFloat2 25s ease-in-out infinite',
        }}
      />
      {/* Orb 3 — center, purple accent */}
      <div
        className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-[80px] will-change-transform"
        style={{
          background: 'radial-gradient(circle, oklch(0.6 0.3 300) 0%, transparent 60%)',
          animation: 'orbFloat3 18s ease-in-out infinite',
        }}
      />
    </div>
  )
}

/**
 * Floating particles that drift upward slowly.
 * Adds subtle depth and movement.
 */
export function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let particles: Array<{ x: number; y: number; size: number; speed: number; opacity: number }> = []

    function resize() {
      if (!canvas) return
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx!.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    function initParticles() {
      if (!canvas) return
      particles = Array.from({ length: 30 }, () => ({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.3 + 0.1,
      }))
    }

    function draw() {
      if (!canvas || !ctx) return
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      ctx.clearRect(0, 0, w, h)

      for (const p of particles) {
        p.y -= p.speed
        if (p.y < -10) {
          p.y = h + 10
          p.x = Math.random() * w
        }
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(139, 92, 246, ${p.opacity})`
        ctx.fill()
      }

      animId = requestAnimationFrame(draw)
    }

    resize()
    initParticles()
    draw()

    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full opacity-60"
      aria-hidden="true"
    />
  )
}
