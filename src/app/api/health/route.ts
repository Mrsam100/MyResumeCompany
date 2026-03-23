import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { sql } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export async function GET() {
  const checks: Record<string, string> = {}

  checks.DATABASE_URL = process.env.DATABASE_URL ? 'set' : 'MISSING'
  checks.NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET ? 'set' : 'MISSING'
  checks.NEXTAUTH_URL = process.env.NEXTAUTH_URL ?? 'not set'
  checks.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID ? 'set' : 'MISSING'
  checks.UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL ? 'set' : 'MISSING'
  checks.UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN ? 'set' : 'MISSING'
  checks.RESEND_API_KEY = process.env.RESEND_API_KEY ? 'set' : 'MISSING'
  checks.GEMINI_API_KEY = process.env.GEMINI_API_KEY ? 'set' : 'MISSING'
  checks.NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'not set'
  checks.SENTRY_DSN = process.env.SENTRY_DSN ? 'set' : 'MISSING'
  checks.NODE_ENV = process.env.NODE_ENV ?? 'not set'

  // Test DB connection
  try {
    await db.execute(sql`SELECT 1 as ok`)
    checks.db_connection = 'OK'
  } catch (err) {
    checks.db_connection = `FAILED: ${err instanceof Error ? err.message : String(err)}`
  }

  // Test users table
  try {
    const count = await db.select({ count: sql<number>`count(*)` }).from(users)
    checks.users_table = `OK (${count[0]?.count} rows)`
  } catch (err) {
    checks.users_table = `FAILED: ${err instanceof Error ? err.message : String(err)}`
  }

  return NextResponse.json(checks)
}
