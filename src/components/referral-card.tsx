'use client'

import { useState, useEffect } from 'react'
import { Gift, Copy, Check, Share2, Users } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ReferralData {
  referralCode: string
  referralLink: string
  totalReferrals: number
  creditsEarned: number
}

export function ReferralCard() {
  const [data, setData] = useState<ReferralData | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch('/api/referral')
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function handleCopy() {
    if (!data) return
    try {
      await navigator.clipboard.writeText(data.referralLink)
      setCopied(true)
      toast.success('Referral link copied!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy')
    }
  }

  async function handleShare() {
    if (!data) return
    if (navigator.share) {
      navigator.share({
        title: 'Build your resume with AI',
        text: 'I use MyResumeCompany to build ATS-optimized resumes with AI. Sign up and we both get 50 free credits!',
        url: data.referralLink,
      }).catch(() => {})
    } else {
      handleCopy()
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse rounded-xl border bg-card p-5">
        <div className="h-4 w-32 rounded bg-muted" />
        <div className="mt-3 h-9 rounded bg-muted" />
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
          <Gift className="h-4 w-4 text-amber-600" />
        </div>
        <div>
          <h3 className="text-sm font-semibold">Invite Friends, Earn Credits</h3>
          <p className="text-xs text-muted-foreground">You both get 50 credits</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Input
          readOnly
          value={data.referralLink}
          className="h-9 text-xs bg-muted/50"
          onClick={handleCopy}
        />
        <Button variant="outline" size="sm" className="h-9 shrink-0 gap-1.5" onClick={handleCopy}>
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </Button>
        <Button variant="outline" size="sm" className="h-9 shrink-0" onClick={handleShare}>
          <Share2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      {data.totalReferrals > 0 && (
        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {data.totalReferrals} friend{data.totalReferrals !== 1 ? 's' : ''} referred
          </span>
          <span className="font-medium text-green-600">+{data.creditsEarned} credits earned</span>
        </div>
      )}
    </div>
  )
}
