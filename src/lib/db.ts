import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '@/lib/db/schema'
import { isCloudflareWorkers, getCfEnv } from '@/lib/cloudflare/context'

// ─── Connection management ───

const globalForDb = globalThis as unknown as {
  client: postgres.Sql | undefined
}

function createNodeClient(): postgres.Sql {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set')
  }
  return postgres(connectionString, {
    max: process.env.NODE_ENV === 'production' ? 15 : 10,
    idle_timeout: 20,
    connect_timeout: 10,
  })
}

function createHyperdriveClient(): postgres.Sql {
  const env = getCfEnv()
  return postgres(env.HYPERDRIVE.connectionString, {
    prepare: false, // Required for Hyperdrive (pooled connections)
    max: 1, // Workers should use 1 connection per request
  })
}

// ─── Database factory ───

/**
 * Returns a Drizzle ORM database instance.
 *
 * - On Cloudflare Workers: creates a per-request client via Hyperdrive
 * - On Node.js (Vercel/local): reuses a global singleton client
 */
export function getDb(): PostgresJsDatabase<typeof schema> {
  if (isCloudflareWorkers()) {
    const client = createHyperdriveClient()
    return drizzle(client, { schema })
  }

  // Node.js: reuse global client (dev hot-reload safe)
  const client = (globalForDb.client ??= createNodeClient())
  return drizzle(client, { schema })
}

// ─── Backward-compatible singleton export ───
// On Node.js (Vercel/local), this creates the DB instance immediately.
// On Cloudflare Workers, this uses a lazy proxy (Workers create per-request).

let _dbInstance: PostgresJsDatabase<typeof schema> | null = null

function getOrCreateDb(): PostgresJsDatabase<typeof schema> {
  if (_dbInstance) return _dbInstance
  _dbInstance = getDb()
  return _dbInstance
}

// For Node.js: eagerly initialize so DrizzleAdapter gets a real instance
export const db: PostgresJsDatabase<typeof schema> = isCloudflareWorkers()
  ? new Proxy({} as PostgresJsDatabase<typeof schema>, {
      get(_, prop) {
        return Reflect.get(getDb(), prop)
      },
    })
  : getOrCreateDb()
