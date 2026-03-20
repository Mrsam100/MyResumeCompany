import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Only enable in production
  enabled: process.env.NODE_ENV === 'production',

  // Performance monitoring — sample 10% of transactions
  tracesSampleRate: 0.1,

  // Don't send PII
  sendDefaultPii: false,

  // Filter out expected errors
  ignoreErrors: [
    'Insufficient credits',
    'Rate limit exceeded',
    'AbortError',
  ],
})
