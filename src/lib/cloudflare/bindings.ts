/**
 * TypeScript definitions for Cloudflare Workers bindings.
 * These are available via getRequestContext().env in Workers runtime.
 */

export interface CloudflareEnv {
  // Hyperdrive — PostgreSQL connection pooling
  HYPERDRIVE: {
    connectionString: string
  }

  // KV Namespaces
  SESSION_CACHE: KVNamespace
  RATE_LIMIT_KV: KVNamespace

  // R2 Bucket
  R2_BUCKET: R2Bucket

  // Environment variables (non-secret)
  NEXT_PUBLIC_APP_URL: string
  NEXTAUTH_URL: string
  PDF_SERVICE_URL: string
  ENVIRONMENT: string

  // Secrets
  DATABASE_URL: string
  NEXTAUTH_SECRET: string
  GOOGLE_CLIENT_ID: string
  GOOGLE_CLIENT_SECRET: string
  GEMINI_API_KEY: string
  STRIPE_SECRET_KEY: string
  STRIPE_WEBHOOK_SECRET: string
  STRIPE_PRO_MONTHLY_PRICE_ID: string
  STRIPE_PRO_YEARLY_PRICE_ID: string
  UPSTASH_REDIS_REST_URL: string
  UPSTASH_REDIS_REST_TOKEN: string
  PDF_SERVICE_SECRET: string
}

/**
 * KVNamespace interface — matches Cloudflare Workers runtime.
 * Only used for type-checking; the actual implementation is provided by Workers.
 */
interface KVNamespace {
  get(key: string, options?: { type?: 'text' }): Promise<string | null>
  get<T>(key: string, options: { type: 'json' }): Promise<T | null>
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>
  delete(key: string): Promise<void>
}

/**
 * R2Bucket interface — matches Cloudflare Workers runtime.
 */
interface R2Bucket {
  get(key: string): Promise<R2ObjectBody | null>
  put(key: string, value: ArrayBuffer | ReadableStream | string, options?: R2PutOptions): Promise<R2Object>
  delete(key: string): Promise<void>
}

interface R2Object {
  key: string
  size: number
  etag: string
}

interface R2ObjectBody extends R2Object {
  arrayBuffer(): Promise<ArrayBuffer>
  text(): Promise<string>
}

interface R2PutOptions {
  httpMetadata?: {
    contentType?: string
    contentDisposition?: string
  }
}
