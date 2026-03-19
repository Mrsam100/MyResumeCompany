import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || 'https://fc86450f22ca1995d3ed2692880901c4@o4511071811207168.ingest.us.sentry.io/4511071825166336',

  // Only enable in production
  enabled: process.env.NODE_ENV === 'production',

  // Performance monitoring — sample 10% of transactions
  tracesSampleRate: 0.1,

  // Session replay — capture 1% of sessions, 100% of error sessions
  replaysSessionSampleRate: 0.01,
  replaysOnErrorSampleRate: 1.0,

  // Don't send PII (emails, passwords, resume content)
  sendDefaultPii: false,

  // Filter out noisy errors
  ignoreErrors: [
    'ResizeObserver loop',
    'Non-Error promise rejection',
    'AbortError',
    'Network request failed',
  ],
})
