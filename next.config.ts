import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  serverExternalPackages: ['pdf-parse', 'pdfjs-dist'],

  async redirects() {
    return [
      // Common typos and alternate paths
      { source: '/login', destination: '/signup', permanent: false },
      { source: '/signin', destination: '/signup', permanent: false },
      { source: '/sign-up', destination: '/signup', permanent: false },
      { source: '/sign-in', destination: '/signup', permanent: false },
      { source: '/register', destination: '/signup', permanent: false },
      { source: '/price', destination: '/pricing', permanent: true },
      { source: '/plans', destination: '/pricing', permanent: true },
      { source: '/blog/resume-tips', destination: '/blog', permanent: false },
      { source: '/privacy-policy', destination: '/privacy', permanent: true },
      { source: '/terms-of-service', destination: '/terms', permanent: true },
      { source: '/tos', destination: '/terms', permanent: true },
      { source: '/support', destination: '/contact', permanent: true },
      { source: '/help', destination: '/contact', permanent: true },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' https: data: blob:",
              "connect-src 'self' https://*.supabase.co https://api.stripe.com https://*.google.com https://*.posthog.com https://*.sentry.io wss://*.supabase.co",
              "frame-src https://js.stripe.com https://hooks.stripe.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

// Sentry build-time config (source maps upload) — only enable when SENTRY_AUTH_TOKEN is set.
// On Cloudflare Workers, Sentry server SDK is incompatible so we skip it entirely.
let config = nextConfig
try {
  if (process.env.SENTRY_AUTH_TOKEN) {
    const { withSentryConfig } = require('@sentry/nextjs')
    config = withSentryConfig(nextConfig, {
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      silent: true,
      tunnelRoute: '/monitoring',
      sourcemaps: { deleteSourcemapsAfterUpload: true },
    })
  }
} catch {}

export default config
