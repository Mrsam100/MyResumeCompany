'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider, usePostHog } from 'posthog-js/react'
import { Suspense, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { usePathname, useSearchParams } from 'next/navigation'

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!POSTHOG_KEY) return
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      person_profiles: 'identified_only',
      capture_pageview: false,
      capture_pageleave: true,
      autocapture: true,
    })
  }, [])

  if (!POSTHOG_KEY) return <>{children}</>

  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageview />
      </Suspense>
      {children}
    </PHProvider>
  )
}

/**
 * Identifies the user in PostHog when they log in, resets on logout.
 * Must be rendered inside SessionProvider (i.e. within (app) routes).
 */
export function PostHogIdentifier() {
  const ph = usePostHog()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (!ph) return
    if (status === 'authenticated' && session?.user) {
      ph.identify(session.user.id, {
        email: session.user.email,
        name: session.user.name,
        subscriptionTier: session.user.subscriptionTier,
        credits: session.user.credits,
      })
    } else if (status === 'unauthenticated') {
      ph.reset()
    }
  }, [ph, session, status])

  return null
}

/** Captures pageviews on route changes (SPA-friendly) */
function PostHogPageview() {
  const ph = usePostHog()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!ph || !pathname) return
    const url = searchParams?.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname
    ph.capture('$pageview', { $current_url: url })
  }, [ph, pathname, searchParams])

  return null
}

/** Track custom events from anywhere in the app */
export function trackEvent(event: string, properties?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && posthog.__loaded) {
    posthog.capture(event, properties)
  }
}
