'use client'

import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Coins,
  Loader2,
  Zap,
  Package,
  Clock,
  RefreshCw,
} from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useCurrentUser } from '@/hooks/use-current-user'
import { useRazorpay } from '@/hooks/use-razorpay'
import { cn } from '@/lib/utils'
import { CREDIT_COSTS, CREDIT_PACKS, CURRENCY } from '@/constants/credit-costs'

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
  AI_LINKEDIN_IMPORT: 'LinkedIn Import',
  AI_RESUME_IMPORT: 'Resume Import',
  PDF_EXPORT: 'PDF Export',
  DOCX_EXPORT: 'DOCX Export',
  SIGNUP_BONUS: 'Signup Bonus',
  PURCHASE: 'Credit Purchase',
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
  const { openCheckout } = useRazorpay()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [purchasing, setPurchasing] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  // Show success/cancel toast on return from any edge-case redirects
  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      toast.success('Payment successful!')
      update()
      router.replace('/credits')
    }
    if (searchParams.get('canceled') === 'true') {
      toast.info('Payment canceled.')
      router.replace('/credits')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
    if (purchasing) return // Prevent double-click
    setPurchasing(packId)
    try {
      // 1. Create Razorpay order
      const res = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packId }),
      })
      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error || 'Failed to create order')
        return
      }
      const { orderId, amount, currency, credits } = await res.json()

      // 2. Open Razorpay modal
      const pack = CREDIT_PACKS.find((p) => p.id === packId)
      const response = await openCheckout({
        order_id: orderId,
        amount,
        currency,
        name: 'TheResumeCompany',
        description: `${pack?.label ?? 'Credit Pack'} — ${credits} Credits`,
        prefill: {
          name: user?.name ?? undefined,
          email: user?.email ?? undefined,
        },
        theme: { color: '#6366f1' },
      })

      // 3. Verify payment (with timeout)
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 20000)
      try {
        const verifyRes = await fetch('/api/razorpay/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'credit_pack',
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            packId,
          }),
          signal: controller.signal,
        })

        if (verifyRes.ok) {
          toast.success(`${credits} credits added to your account!`)
          update()
          fetchCredits()
        } else {
          const data = await verifyRes.json()
          toast.error(data.error || 'Payment verification failed. Credits will be added shortly.')
        }
      } finally {
        clearTimeout(timeout)
      }
    } catch (err) {
      if (err instanceof Error && err.message === 'Payment cancelled') {
        toast.info('Payment cancelled')
      } else if (err instanceof Error && err.name === 'AbortError') {
        toast.info('Verification timed out. Your credits will be added shortly via webhook.')
      } else {
        toast.error('Something went wrong. If you were charged, credits will be added automatically.')
      }
    } finally {
      setPurchasing(null)
    }
  }

  const credits = user?.credits ?? 0

  return (
    <div className="mx-auto max-w-5xl space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="animate-fade-in-up">
        <h1 className="text-2xl font-bold tracking-tight">Credits</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Buy credits and track your usage
        </p>
      </div>

      {/* Balance Card */}
      <Card
        className="animate-fade-in-up bg-gradient-to-br from-amber-500/8 via-transparent to-orange-500/5 border-amber-500/15"
        style={{ animationDelay: '50ms' }}
      >
        <CardContent className="p-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex h-12 w-12 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-xl shadow-md bg-gradient-to-br from-amber-400/20 to-orange-400/20">
              <Coins className="h-7 w-7 text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Current Balance</p>
              <p className={cn('text-3xl sm:text-4xl font-bold tabular-nums', credits < 20 && 'text-destructive')}>
                {credits}
                <span className="ml-1.5 text-lg sm:text-xl font-medium text-muted-foreground">credits</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Credit Packs */}
      <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <h2 className="mb-1 text-lg font-semibold flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          Buy Credits
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">Credits never expire. Use them anytime.</p>
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-3">
          {CREDIT_PACKS.map((pack) => (
            <Card
              key={pack.id}
              className={cn(
                'relative overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200',
                pack.popular && 'border-primary/50 ring-2 ring-primary/20 shadow-md',
              )}
            >
              <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary to-primary/50" />
              {pack.popular && (
                <div className="absolute right-3 top-3">
                  <Badge variant="default" className="text-xs">Most Popular</Badge>
                </div>
              )}
              <CardContent className="p-5 space-y-4">
                <div>
                  <p className="font-semibold text-lg truncate">{pack.label}</p>
                  <p className="text-sm text-muted-foreground">{pack.credits} credits</p>
                </div>
                <div>
                  <span className="text-2xl font-bold">{CURRENCY.symbol}{(pack.price / 100).toFixed(0)}</span>
                  <span className="text-sm text-muted-foreground ml-1">
                    ({CURRENCY.symbol}{(pack.price / pack.credits).toFixed(1)}/credit)
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
      <div className="animate-fade-in-up" style={{ animationDelay: '150ms' }}>
        <h2 className="mb-4 text-lg font-semibold">Credit Costs</h2>
        <Card>
          <CardContent className="p-0">
            <div className="grid grid-cols-2 gap-0 sm:grid-cols-4">
              {Object.entries(CREDIT_COSTS).map(([key, cost]) => (
                <div
                  key={key}
                  className="border-b border-r p-3 sm:p-4 [&:nth-child(2n)]:border-r-0 sm:[&:nth-child(2n)]:border-r sm:[&:nth-child(4n)]:border-r-0"
                >
                  <p className="text-xs font-medium text-muted-foreground">
                    {COST_LABELS[key] ?? key}
                  </p>
                  <p className="mt-1 text-lg font-semibold">{cost} credits</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Transaction History */}
      <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          Transaction History
        </h2>

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
                <div
                  key={tx.id}
                  className="flex items-center justify-between px-4 sm:px-5 py-3.5 hover:bg-muted/30 transition-colors duration-150"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {COST_LABELS[tx.type] ?? tx.type}
                    </p>
                    {tx.description && (
                      <p className="text-xs text-muted-foreground truncate max-w-[160px] sm:max-w-[300px]">
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
                  {tx.amount > 0 ? (
                    <span className="bg-green-500/10 rounded-full px-2 py-0.5">
                      <span
                        className="font-semibold text-sm tabular-nums text-green-600"
                        aria-label={`Added ${Math.abs(tx.amount)} credits`}
                      >
                        +{tx.amount}
                      </span>
                    </span>
                  ) : tx.amount < 0 ? (
                    <span className="bg-red-500/10 rounded-full px-2 py-0.5">
                      <span
                        className="font-semibold text-sm tabular-nums text-red-500"
                        aria-label={`Used ${Math.abs(tx.amount)} credits`}
                      >
                        {tx.amount}
                      </span>
                    </span>
                  ) : (
                    <span
                      className="font-semibold text-sm tabular-nums text-muted-foreground"
                      aria-label={`${Math.abs(tx.amount)} credits`}
                    >
                      {tx.amount}
                    </span>
                  )}
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
