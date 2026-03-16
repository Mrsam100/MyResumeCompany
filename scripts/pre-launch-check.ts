/**
 * Pre-launch checklist — run before deploying to production.
 * Usage: npx tsx scripts/pre-launch-check.ts
 */

const checks: { name: string; check: () => boolean; required: boolean }[] = [
  // Environment variables
  { name: 'DATABASE_URL set', check: () => !!process.env.DATABASE_URL, required: true },
  { name: 'NEXTAUTH_SECRET set', check: () => !!process.env.NEXTAUTH_SECRET, required: true },
  { name: 'NEXTAUTH_URL set', check: () => !!process.env.NEXTAUTH_URL, required: true },
  { name: 'GEMINI_API_KEY set', check: () => !!process.env.GEMINI_API_KEY, required: true },
  { name: 'STRIPE_SECRET_KEY set', check: () => !!process.env.STRIPE_SECRET_KEY, required: true },
  { name: 'STRIPE_WEBHOOK_SECRET set', check: () => !!process.env.STRIPE_WEBHOOK_SECRET, required: true },
  { name: 'STRIPE_PRO_MONTHLY_PRICE_ID set', check: () => !!process.env.STRIPE_PRO_MONTHLY_PRICE_ID, required: true },
  { name: 'STRIPE_PRO_YEARLY_PRICE_ID set', check: () => !!process.env.STRIPE_PRO_YEARLY_PRICE_ID, required: true },
  { name: 'GOOGLE_CLIENT_ID set', check: () => !!process.env.GOOGLE_CLIENT_ID, required: true },
  { name: 'GITHUB_CLIENT_ID set', check: () => !!process.env.GITHUB_CLIENT_ID, required: true },
  { name: 'NEXT_PUBLIC_APP_URL set', check: () => !!process.env.NEXT_PUBLIC_APP_URL, required: true },
  { name: 'NEXT_PUBLIC_APP_URL is not localhost', check: () => !process.env.NEXT_PUBLIC_APP_URL?.includes('localhost'), required: true },

  // Optional but recommended
  { name: 'RESEND_API_KEY set (email)', check: () => !!process.env.RESEND_API_KEY, required: false },
  { name: 'NEXT_PUBLIC_SUPABASE_URL set', check: () => !!process.env.NEXT_PUBLIC_SUPABASE_URL, required: false },
]

function run() {
  console.log('\n  Pre-Launch Checklist\n  ====================\n')

  let passed = 0
  let failed = 0
  let warnings = 0

  for (const { name, check, required } of checks) {
    try {
      const ok = check()
      if (ok) {
        console.log(`  [PASS] ${name}`)
        passed++
      } else if (required) {
        console.log(`  [FAIL] ${name}`)
        failed++
      } else {
        console.log(`  [WARN] ${name}`)
        warnings++
      }
    } catch {
      console.log(`  [ERR]  ${name}`)
      failed++
    }
  }

  console.log(`\n  Results: ${passed} passed, ${failed} failed, ${warnings} warnings\n`)

  if (failed > 0) {
    console.log('  BLOCKED: Fix required env vars before deploying.\n')
    process.exit(1)
  } else {
    console.log('  READY: All required checks passed.\n')
  }
}

run()
