'use client'

import { useState } from 'react'
import { Mail, Loader2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface NewsletterSignupProps {
  source?: 'footer' | 'blog' | 'landing'
  compact?: boolean
}

export function NewsletterSignup({ source = 'footer', compact = false }: NewsletterSignupProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || loading) return

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError((data as { error?: string }).error || 'Failed to subscribe')
        return
      }

      setSuccess(true)
      setEmail('')
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className={`flex items-center gap-2 ${compact ? '' : 'rounded-lg border bg-green-50 p-3'}`}>
        <Check className="h-4 w-4 text-green-600 shrink-0" />
        <p className="text-sm text-green-700">You're subscribed! Check your inbox.</p>
      </div>
    )
  }

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="h-9 text-sm"
          required
        />
        <Button type="submit" size="sm" className="h-9 shrink-0" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Subscribe'}
        </Button>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </form>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Mail className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold">Get resume tips in your inbox</h3>
      </div>
      <p className="text-xs text-muted-foreground">
        Weekly resume tips, job search advice, and AI-powered career insights. No spam.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="h-9 text-sm"
          required
        />
        <Button type="submit" size="sm" className="h-9 shrink-0 gap-1.5" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Mail className="h-3.5 w-3.5" /> Subscribe</>}
        </Button>
      </form>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
