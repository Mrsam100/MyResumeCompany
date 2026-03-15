'use client'

import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Coins,
  Crown,
  Loader2,
  Sparkles,
  Zap,
  Package,
  Check,
  Clock,
  CreditCard,
  RefreshCw,
} from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useCurrentUser } from '@/hooks/use-current-user'
import { cn } from '@/lib/utils'
import { CREDIT_COSTS, CREDIT_PACKS, SUBSCRIPTION_PLANS } from '@/constants/credit-costs'

interface Transaction {
  id: string
  amount: number
  type: string
  description: string | null
  createdAt: string
}

const COST_LABELS: Record<string, string> = {
  AI_BULLET_POINTS: 'AI Bullet Points',
  AI_SUMMARY: 'AI Summary',
  AI_FULL_RESUME: 'AI Full Resume',
  AI_ATS_SCAN: 'ATS Scan',
  AI_ATS_OPTIMIZE: 'ATS Optimize',
  AI_COVER_LETTER: 'Cover Letter',
  PDF_EXPORT: 'PDF Export',
  SIGNUP_BONUS: 'Signup Bonus',
  PURCHASE: 'Credit Purchase',
  SUBSCRIPTION_MONTHLY: 'Pro Credits',
  REFUND: 'Refund',
  ADMIN_ADJUSTMENT: 'Admin Adjustment',
}

export default function CreditsPage() {
  return (
    <Suspense fallback={<CreditsPageSkeleton />}>
      <CreditsPageInner />
    </Suspense>
  )
}

function CreditsPageSkeleton() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-2 h-4 w-72" />
      </div>
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  )
}

function CreditsPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, update } = useCurrentUser()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null) // (#10)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [purchasing, setPurchasing] = useState<string | null>(null)
  const [subscribing, setSubscribing] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null) // (#8)

  const isPro = user?.subscriptionTier === 'PRO'

  // (#7) Show success toast on return from Stripe + verify credits
  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      toast.success('Payment successful! Verifying your credits...')

      // Poll /api/credits to verify webhook processed
      let attempts = 0
      const prevCredits = user?.credits ?? 0
      const interval = setInterval(async () => {
        attempts++
        try {
          const res = await fetch('/api/credits?page=1&limit=1')
          if (res.ok) {
            const data = await res.json()
            if (data.credits > prevCredits || attempts >= 10) {
              clearInterval(interval)
              update() // Refresh session
              if (data.credits > prevCredits) {
                toast.success(`Credits updated! New balance: ${data.credits}`)
              } else {
                toast.info('Payment processed. Credits may take a moment to appear.')
              }
              router.replace('/credits')
            }
          }
        } catch {
          // Retry silently
        }
        if (attempts >= 10) clearInterval(interval)
      }, 2000)

      return () => clearInterval(interval)
    }
    if (searchParams.get('canceled') === 'true') {
      toast.info('Payment canceled.')
      router.replace('/credits')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // (#8) Cancel in-flight fetch on page change
  const fetchCredits = useCallback(async () => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setFetchError(null)
    try {
      const res = await fetch(`/api/credits?page=${page}&limit=10`, {
        signal: controller.signal,
      })
      if (controller.signal.aborted) return
      if (!res.ok) {
        if (res.status === 401) { router.push('/login'); return }
        setFetchError('Failed to load credit data')
        return
      }
      const data = await res.json()
      if (!controller.signal.aborted) {
        setTransactions(data.transactions)
        setTotalPages(data.totalPages)
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
      setFetchError('Failed to load credit data')
    } finally {
      if (!controller.signal.aborted) setLoading(false)
    }
  }, [page, router])

  useEffect(() => {
    fetchCredits()
  }, [fetchCredits])

  async function handleBuyCredits(packId: string) {
    setPurchasing(packId)
    try {
      const res = await fetch('/api/stripe/checkout/credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packId }),
      })
      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error || 'Failed to start checkout')
        return
      }
      const { url } = await res.json()
      if (url) window.location.href = url
    } catch {
      toast.error('Something went wrong')
    } finally {
      setPurchasing(null)
    }
  }

  async function handleSubscribe(plan: 'monthly' | 'yearly') {
    setSubscribing(plan)
    try {
      const res = await fetch('/api/stripe/checkout/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error || 'Failed to start checkout')
        return
      }
      const { url } = await res.json()
      if (url) window.location.href = url
    } catch {
      toast.error('Something went wrong')
    } finally {
      setSubscribing(null)
    }
  }

  async function handleManageBilling() {
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      if (!res.ok) {
        toast.error('Failed to open billing portal')
        return
      }
      const { url } = await res.json()
      if (url) window.location.href = url
    } catch {
      toast.error('Something went wrong')
    }
  }

  const credits = user?.credits ?? 0

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Credits & Billing</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your credits, subscription, and billing
        </p>
      </div>

      {/* Balance Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-amber-500/10">
                <Coins className="h-7 w-7 text-amber-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Balance</p>
                <p className={cn('text-3xl font-bold', credits < 20 && !isPro && 'text-destructive')}>
                  {isPro ? (
                    <span className="flex items-center gap-2">
                      {credits} <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white"><Crown className="mr-1 h-3 w-3" />PRO</Badge>
                    </span>
                  ) : (
                    <>{credits} credits</>
                  )}
                </p>
                {isPro && (
                  <p className="text-sm text-muted-foreground">
                    Unlimited AI usage + 500 credits/month
                  </p>
                )}
              </div>
            </div>
            {isPro && (
              <Button
                variant="outline"
                onClick={handleManageBilling}
                className="gap-2"
                aria-label="Open Stripe billing portal to manage your subscription"
              >
                <CreditCard className="h-4 w-4" />
                Manage Billing
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pro Plan Section — only show for non-Pro users */}
      {!isPro && (
        <>
          <div>
            <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-500" />
              Upgrade to Pro
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Monthly */}
              <Card className="relative overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Pro Monthly</CardTitle>
                  <CardDescription>Unlimited AI, billed monthly</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <span className="text-3xl font-bold">${(SUBSCRIPTION_PLANS.PRO_MONTHLY.price / 100).toFixed(0)}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" />Unlimited AI features</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" />500 credits/month</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" />Unlimited PDF exports</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" />Priority support</li>
                  </ul>
                  <Button
                    onClick={() => handleSubscribe('monthly')}
                    disabled={subscribing === 'monthly'}
                    className="w-full gap-2"
                  >
                    {subscribing === 'monthly' ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                    Subscribe Monthly
                  </Button>
                </CardContent>
              </Card>

              {/* Yearly */}
              <Card className="relative overflow-hidden border-amber-500/50">
                <div className="absolute right-3 top-3">
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                    Save 31%
                  </Badge>
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Pro Yearly</CardTitle>
                  <CardDescription>Unlimited AI, billed annually</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <span className="text-3xl font-bold">${(SUBSCRIPTION_PLANS.PRO_YEARLY.price / 100).toFixed(0)}</span>
                    <span className="text-muted-foreground">/year</span>
                    {/* (#12) Dynamic per-month calculation */}
                    <span className="ml-2 text-sm text-muted-foreground">
                      (${(SUBSCRIPTION_PLANS.PRO_YEARLY.price / 100 / 12).toFixed(2)}/mo)
                    </span>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" />Everything in Monthly</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" />500 credits/month</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" />2 months free</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" />Best value</li>
                  </ul>
                  <Button
                    onClick={() => handleSubscribe('yearly')}
                    disabled={subscribing === 'yearly'}
                    className="w-full gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                  >
                    {subscribing === 'yearly' ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Crown className="h-4 w-4" />
                    )}
                    Subscribe Yearly
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />
        </>
      )}

      {/* Credit Packs */}
      <div>
        <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          Buy Credit Packs
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {CREDIT_PACKS.map((pack) => (
            <Card key={pack.id} className={cn('relative', pack.popular && 'border-primary/50')}>
              {pack.popular && (
                <div className="absolute right-3 top-3">
                  <Badge variant="default" className="text-xs">Most Popular</Badge>
                </div>
              )}
              <CardContent className="p-5 space-y-4">
                <div>
                  <p className="font-semibold text-lg">{pack.label}</p>
                  <p className="text-sm text-muted-foreground">{pack.credits} credits</p>
                </div>
                <div>
                  <span className="text-2xl font-bold">${(pack.price / 100).toFixed(2)}</span>
                  <span className="text-sm text-muted-foreground ml-1">
                    (${(pack.price / pack.credits).toFixed(1)}¢/credit)
                  </span>
                </div>
                <Button
                  onClick={() => handleBuyCredits(pack.id)}
                  disabled={purchasing === pack.id}
                  variant={pack.popular ? 'default' : 'outline'}
                  className="w-full gap-2"
                >
                  {purchasing === pack.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Zap className="h-4 w-4" />
                  )}
                  Buy {pack.credits} Credits
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator />

      {/* Credit Costs Reference */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Credit Costs</h2>
        <Card>
          <CardContent className="p-0">
            {/* (#18) Fix grid borders for both 2-col and 4-col layouts */}
            <div className="grid grid-cols-2 gap-0 sm:grid-cols-4">
              {Object.entries(CREDIT_COSTS).map(([key, cost]) => (
                <div
                  key={key}
                  className="border-b border-r p-4 [&:nth-child(2n)]:border-r-0 sm:[&:nth-child(2n)]:border-r sm:[&:nth-child(4n)]:border-r-0"
                >
                  <p className="text-xs font-medium text-muted-foreground">
                    {COST_LABELS[key] ?? key}
                  </p>
                  <p className="mt-1 text-lg font-semibold">
                    {isPro ? (
                      <span className="text-green-500">Free</span>
                    ) : (
                      <>{cost} credits</>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Transaction History */}
      <div>
        <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          Transaction History
        </h2>

        {/* (#10) Persistent error state with retry */}
        {fetchError ? (
          <Card className="border-destructive/30">
            <CardContent className="flex flex-col items-center py-12">
              <p className="text-sm text-destructive">{fetchError}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 gap-2"
                onClick={() => { setLoading(true); setFetchError(null); fetchCredits() }}
              >
                <RefreshCw className="h-4 w-4" />
                Retry
              </Button>
            </CardContent>
          </Card>
        ) : loading ? (
          <Card>
            <CardContent className="space-y-3 p-5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-5 w-16" />
                </div>
              ))}
            </CardContent>
          </Card>
        ) : transactions.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center py-12">
              <Clock className="h-10 w-10 text-muted-foreground/40" aria-hidden="true" />
              <p className="mt-3 text-sm text-muted-foreground">No transactions yet</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="divide-y p-0">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between px-5 py-3.5">
                  <div>
                    <p className="text-sm font-medium">
                      {COST_LABELS[tx.type] ?? tx.type}
                    </p>
                    {tx.description && (
                      <p className="text-xs text-muted-foreground truncate max-w-[300px]">
                        {tx.description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {new Date(tx.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  {/* (#16) Screen reader context for transaction amounts */}
                  <span
                    className={cn(
                      'font-semibold text-sm tabular-nums',
                      tx.amount > 0 ? 'text-green-600' : tx.amount < 0 ? 'text-red-500' : 'text-muted-foreground',
                    )}
                    aria-label={`${tx.amount > 0 ? 'Added' : tx.amount < 0 ? 'Used' : ''} ${Math.abs(tx.amount)} credits`}
                  >
                    {tx.amount > 0 ? '+' : ''}{tx.amount}
                  </span>
                </div>
              ))}
            </CardContent>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t px-5 py-3">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  aria-label="Go to previous page of transactions"
                >
                  Previous
                </Button>
                <span className="text-xs text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  aria-label="Go to next page of transactions"
                >
                  Next
                </Button>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  )
}
