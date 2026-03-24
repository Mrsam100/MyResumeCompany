'use client'

import { Suspense, useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Eye, EyeOff, ArrowRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SocialButtons, Divider } from '@/components/auth/social-buttons'
import { signupSchema, type SignupInput } from '@/lib/validations/auth'

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>}>
      <SignupForm />
    </Suspense>
  )
}

function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState('')
  const [existingAccount, setExistingAccount] = useState<{ email: string; method: string } | null>(null)
  const [socialLoading, setSocialLoading] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  // Store referral code from URL for post-signup claim
  useEffect(() => {
    const ref = searchParams.get('ref')
    if (ref) localStorage.setItem('referralCode', ref)
  }, [searchParams])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  })

  async function onSubmit(data: SignupInput) {
    setError('')
    setExistingAccount(null)

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const body = await res.json()
      if (res.status === 409 && body.method) {
        setExistingAccount({ email: data.email, method: body.method })
        return
      }
      setError(body.error ?? 'Something went wrong')
      return
    }

    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    if (result?.error) {
      setError('Account created but sign-in failed. Please log in manually.')
      router.push('/login')
      return
    }

    // Claim referral bonus if present (fire and forget but only delete on success)
    const refCode = localStorage.getItem('referralCode')
    if (refCode) {
      fetch('/api/referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referralCode: refCode }),
      }).then((res) => { if (res.ok) localStorage.removeItem('referralCode') }).catch(() => {})
    }

    // Full page redirect ensures the auth cookie is sent with the request
    window.location.href = '/dashboard'
  }

  function handleSocialLogin(provider: string) {
    setSocialLoading(provider)
    signIn(provider, { callbackUrl: '/dashboard' })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
        <p className="text-sm text-muted-foreground">
          Start building your resume with 100 free credits
        </p>
      </div>

      <SocialButtons
        onSocialLogin={handleSocialLogin}
        socialLoading={socialLoading}
        disabled={isSubmitting}
      />

      <Divider />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {existingAccount && (
          <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm">
            <p className="font-medium text-amber-900">You already have an account</p>
            <p className="mt-1 text-amber-700">
              {existingAccount.method === 'google'
                ? 'This email is linked to a Google account. Sign in with Google instead.'
                : existingAccount.method === 'github'
                  ? 'This email is linked to a GitHub account. Sign in with GitHub instead.'
                  : 'An account with this email already exists.'}
            </p>
            <Link
              href={`/login?email=${encodeURIComponent(existingAccount.email)}`}
              className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Sign in instead <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
        )}

        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            autoComplete="name"
            autoFocus
            {...register('name')}
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            {...register('email')}
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="8+ characters, mixed case + number"
              autoComplete="new-password"
              className="pr-10"
              {...register('password')}
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting || !!socialLoading}>
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Create account
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
