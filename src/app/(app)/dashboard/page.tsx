'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Plus,
  FileText,
  Sparkles,
  Loader2,
  LayoutGrid,
  Target,
  ArrowRight,
  Coins,
  Crown,
  TrendingUp,
  Wand2,
} from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ResumeCard } from '@/components/resume/resume-card'
import { ResumeWizard } from '@/components/ai/resume-wizard'
import { LinkedInImport } from '@/components/ai/linkedin-import'
import { ResumeImport } from '@/components/ai/resume-import'
import { ReferralCard } from '@/components/referral-card'
import { NewResumeDialog } from '@/components/new-resume-dialog'
import { useCurrentUser } from '@/hooks/use-current-user'
import { cn } from '@/lib/utils'

interface ResumeItem {
  id: string
  title: string
  templateId: string
  lastEditedAt: string
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useCurrentUser()
  const [resumes, setResumes] = useState<ResumeItem[]>([])
  const [loading, setLoading] = useState(true)
  const [newResumeOpen, setNewResumeOpen] = useState(false)
  const [wizardOpen, setWizardOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [resumeImportOpen, setResumeImportOpen] = useState(false)

  const fetchResumes = useCallback(async () => {
    try {
      const res = await fetch('/api/resumes')
      if (!res.ok) {
        if (res.status === 401) {
          router.push('/login')
          return
        }
        toast.error('Failed to load resumes')
        return
      }
      const data = await res.json()
      setResumes(data.resumes)
    } catch {
      toast.error('Failed to load resumes')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    fetchResumes()
  }, [fetchResumes])

  async function handleDelete(id: string) {
    const res = await fetch(`/api/resumes/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setResumes((prev) => prev.filter((r) => r.id !== id))
      toast.success('Resume deleted')
    } else {
      throw new Error('Failed to delete')
    }
  }

  async function handleDuplicate(id: string) {
    const res = await fetch(`/api/resumes/${id}/duplicate`, { method: 'POST' })
    if (res.ok) {
      toast.success('Resume duplicated')
      fetchResumes()
    } else {
      toast.error('Failed to duplicate resume')
    }
  }

  const firstName = user?.name?.split(' ')[0] ?? 'there'
  const credits = user?.credits ?? 0
  const isPro = user?.subscriptionTier === 'PRO'

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* ── Hero header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight truncate">
            {getGreeting()}, {firstName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {resumes.length > 0
              ? `You have ${resumes.length} resume${resumes.length === 1 ? '' : 's'}. Keep building.`
              : 'Create your first resume and start landing interviews.'}
          </p>
        </div>
        <Button onClick={() => setNewResumeOpen(true)} size="lg" className="gap-2 bg-gradient-to-r from-primary to-primary/80 shadow-sm hover:shadow-md">
          <Plus className="h-4 w-4" />
          New Resume
        </Button>
      </div>

      {/* ── Stats row ── */}
      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="animate-fade-in-up bg-gradient-to-br from-primary/5 to-transparent border-primary/10" style={{ animationDelay: '0ms' }}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-sm font-medium text-muted-foreground">Resumes</p>
                <p className="mt-1 text-3xl font-bold tabular-nums truncate">{loading ? '-' : resumes.length}</p>
              </div>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 shadow-sm">
                <FileText className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in-up bg-gradient-to-br from-amber-500/5 to-transparent border-amber-500/10" style={{ animationDelay: '75ms' }}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-sm font-medium text-muted-foreground">Credits</p>
                <p
                  className={cn(
                    'mt-1 text-3xl font-bold tabular-nums truncate',
                    credits < 20 && !isPro && 'text-destructive',
                  )}
                >
                  {isPro ? (
                    <span className="text-xl">Unlimited</span>
                  ) : (
                    credits
                  )}
                </p>
              </div>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 shadow-sm">
                <Coins className="h-6 w-6 text-amber-500" />
              </div>
            </div>
            {!isPro && credits < 30 && (
              <Link href="/credits" className="mt-3 block">
                <p className="text-xs font-medium text-primary hover:underline">
                  Buy more credits &rarr;
                </p>
              </Link>
            )}
          </CardContent>
        </Card>

        <Card className="animate-fade-in-up bg-gradient-to-br from-green-500/5 to-transparent border-green-500/10" style={{ animationDelay: '150ms' }}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-sm font-medium text-muted-foreground">Plan</p>
                <div className="mt-1 flex items-center gap-2">
                  <p className="text-3xl font-bold tabular-nums truncate">{isPro ? 'Pro' : 'Free'}</p>
                  {isPro && (
                    <Badge className="shrink-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                      <Crown className="mr-1 h-3 w-3" />
                      PRO
                    </Badge>
                  )}
                </div>
              </div>
              <div
                className={cn(
                  'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-sm',
                  isPro ? 'bg-amber-500/10' : 'bg-green-500/10',
                )}
              >
                <TrendingUp className={cn('h-6 w-6', isPro ? 'text-amber-500' : 'text-green-500')} />
              </div>
            </div>
            {!isPro && (
              <Link href="/credits" className="mt-3 block">
                <p className="text-xs font-medium text-primary hover:underline">
                  Upgrade to Pro &rarr;
                </p>
              </Link>
            )}
          </CardContent>
        </Card>

        <Card className="animate-fade-in-up bg-gradient-to-br from-violet-500/5 to-transparent border-violet-500/10" style={{ animationDelay: '225ms' }}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-sm font-medium text-muted-foreground">ATS Score</p>
                <p className="mt-1 text-3xl font-bold tabular-nums truncate text-muted-foreground/40">--</p>
              </div>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 shadow-sm">
                <Target className="h-6 w-6 text-violet-500" />
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Scan your resume to see</p>
          </CardContent>
        </Card>
      </div>

      {/* ── Quick actions ── */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <button
            onClick={() => setWizardOpen(true)}
            className="animate-fade-in-up group flex flex-col items-center justify-center gap-4 rounded-xl rounded-xl border border-border/60 border-t-4 border-t-primary shadow-sm bg-card p-6 text-center min-h-[160px] sm:min-h-[200px] transition-all hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5 duration-200"
            style={{ animationDelay: '300ms' }}
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-sm group-hover:scale-110 transition-all duration-200">
              <Sparkles className="h-7 w-7" />
            </div>
            <div>
              <p className="text-base font-semibold">Create with AI</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Let AI generate a full resume from your work history
              </p>
              <p className="mt-3 flex items-center justify-center gap-1 text-xs font-medium text-primary sm:opacity-0 transition-opacity group-hover:opacity-100">
                Get started <ArrowRight className="h-3 w-3" />
              </p>
            </div>
          </button>

          <Link
            href="/templates"
            className="animate-fade-in-up group flex flex-col items-center justify-center gap-4 rounded-xl rounded-xl border border-border/60 border-t-4 border-t-violet-500 shadow-sm bg-card p-6 text-center min-h-[160px] sm:min-h-[200px] transition-all hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5 duration-200"
            style={{ animationDelay: '375ms' }}
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 text-white shadow-sm group-hover:scale-110 transition-all duration-200">
              <LayoutGrid className="h-7 w-7" />
            </div>
            <div>
              <p className="text-base font-semibold">Choose a Template</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Pick from 50+ professional, modern, and creative designs
              </p>
              <p className="mt-3 flex items-center justify-center gap-1 text-xs font-medium text-primary sm:opacity-0 transition-opacity group-hover:opacity-100">
                Browse templates <ArrowRight className="h-3 w-3" />
              </p>
            </div>
          </Link>

          <button
            onClick={() => setImportOpen(true)}
            className="animate-fade-in-up group flex flex-col items-center justify-center gap-4 rounded-xl rounded-xl border border-border/60 border-t-4 border-t-emerald-500 shadow-sm bg-card p-6 text-center min-h-[160px] sm:min-h-[200px] transition-all hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5 duration-200"
            style={{ animationDelay: '450ms' }}
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-sm group-hover:scale-110 transition-all duration-200">
              <FileText className="h-7 w-7" />
            </div>
            <div>
              <p className="text-base font-semibold">Import from LinkedIn</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Upload a LinkedIn PDF or paste your profile text
              </p>
              <p className="mt-3 flex items-center justify-center gap-1 text-xs font-medium text-primary sm:opacity-0 transition-opacity group-hover:opacity-100">
                Import now <ArrowRight className="h-3 w-3" />
              </p>
            </div>
          </button>

          <button
            onClick={() => setResumeImportOpen(true)}
            className="animate-fade-in-up group flex flex-col items-center justify-center gap-4 rounded-xl rounded-xl border border-border/60 border-t-4 border-t-amber-500 shadow-sm bg-card p-6 text-center min-h-[160px] sm:min-h-[200px] transition-all hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5 duration-200"
            style={{ animationDelay: '525ms' }}
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-sm group-hover:scale-110 transition-all duration-200">
              <Wand2 className="h-7 w-7" />
            </div>
            <div>
              <p className="text-base font-semibold">Enhance Old Resume</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Upload your old resume and AI will make it 10x better
              </p>
              <p className="mt-3 flex items-center justify-center gap-1 text-xs font-medium text-primary sm:opacity-0 transition-opacity group-hover:opacity-100">
                Upgrade now <ArrowRight className="h-3 w-3" />
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* ── Referral Card ── */}
      <ReferralCard />

      <Separator />

      {/* ── Resumes section ── */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">My Resumes</h2>
          {resumes.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {resumes.length} resume{resumes.length === 1 ? '' : 's'}
            </p>
          )}
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full rounded-none" />
                <CardContent className="space-y-2.5 p-4">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : resumes.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-20">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-primary/5">
                <FileText className="h-10 w-10 text-primary/40" />
              </div>
              <h3 className="mt-6 text-xl font-semibold">No resumes yet</h3>
              <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">
                Create your first resume to get started. Choose a template or let AI build one for
                you in minutes.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button onClick={() => setNewResumeOpen(true)} size="lg" className="w-full sm:w-auto gap-2">
                  <Plus className="h-4 w-4" />
                  Create new resume
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto gap-2"
                  onClick={() => router.push('/templates')}
                >
                  <LayoutGrid className="h-4 w-4" />
                  Browse templates
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Create new — always first card */}
            <button
              onClick={() => setNewResumeOpen(true)}
              className="group flex h-full min-h-[280px] flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed bg-card/50 transition-all duration-300 hover:border-primary/40 hover:bg-card hover:shadow-[0_0_30px_oklch(0.205_0_0/8%)]"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 group-hover:scale-110 transition-transform duration-200">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <div className="text-center">
                <p className="font-medium">Create new resume</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Choose how to start</p>
              </div>
            </button>

            {resumes.map((resume) => (
              <ResumeCard
                key={resume.id}
                id={resume.id}
                title={resume.title}
                templateId={resume.templateId}
                lastEditedAt={resume.lastEditedAt}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
              />
            ))}
          </div>
        )}
      </div>

      <NewResumeDialog
        open={newResumeOpen}
        onOpenChange={setNewResumeOpen}
        onWizardOpen={() => setWizardOpen(true)}
        onLinkedInOpen={() => setImportOpen(true)}
        onResumeImportOpen={() => setResumeImportOpen(true)}
      />
      <ResumeWizard open={wizardOpen} onOpenChange={setWizardOpen} />
      <LinkedInImport open={importOpen} onOpenChange={setImportOpen} />
      <ResumeImport open={resumeImportOpen} onOpenChange={setResumeImportOpen} />
    </div>
  )
}
