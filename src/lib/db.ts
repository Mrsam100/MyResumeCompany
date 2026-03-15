import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '@/lib/db/schema'

const globalForDb = globalThis as unknown as {
  client: postgres.Sql | undefined
}

function getClient() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set')
  }

  return postgres(connectionString, {
    max: process.env.NODE_ENV === 'production' ? 5 : 10,
    idle_timeout: 20,
    connect_timeout: 10,
  })
}

const client = globalForDb.client ?? getClient()

if (process.env.NODE_ENV !== 'production') {
  globalForDb.client = client
}

export const db = drizzle(client, { schema })
