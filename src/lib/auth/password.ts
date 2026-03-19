/**
 * Password hashing module for Cloudflare Workers compatibility.
 *
 * New passwords: PBKDF2 via Web Crypto API (runs in Workers + Node.js)
 * Legacy bcrypt hashes: verified via PDF microservice (runs Node.js with bcryptjs)
 *
 * On successful bcrypt login, the hash is upgraded to PBKDF2 automatically.
 */

// Pinned constants — never stored in the hash to prevent downgrade attacks
const PBKDF2_ITERATIONS = 100_000
const PBKDF2_HASH_LENGTH = 32 // 256 bits
const SALT_LENGTH = 16 // 128 bits
const HASH_VERSION = 'v1' // Bump this when changing iterations or algorithm

// ─── Hash a new password with PBKDF2 ───

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH))
  const hash = await derivePBKDF2(password, salt)

  const saltB64 = uint8ToBase64(salt)
  const hashB64 = uint8ToBase64(new Uint8Array(hash))

  // Format: $pbkdf2$version$salt$hash
  // Iterations are NOT stored — they're pinned to PBKDF2_ITERATIONS per version
  return `$pbkdf2$${HASH_VERSION}$${saltB64}$${hashB64}`
}

// ─── Verify a password against stored hash ───

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  if (storedHash.startsWith('$pbkdf2$')) {
    return verifyPBKDF2(password, storedHash)
  }

  if (storedHash.startsWith('$2a$') || storedHash.startsWith('$2b$')) {
    return verifyBcryptViaService(password, storedHash)
  }

  throw new Error('Unrecognized password hash format')
}

// ─── Check if hash needs upgrade from bcrypt to PBKDF2 ───

export function needsHashUpgrade(storedHash: string): boolean {
  return storedHash.startsWith('$2a$') || storedHash.startsWith('$2b$')
}

// ─── Internal: PBKDF2 verification ───

async function verifyPBKDF2(password: string, stored: string): Promise<boolean> {
  const parts = stored.split('$')
  // Format: ["", "pbkdf2", version, salt, hash]
  if (parts.length !== 5 || parts[1] !== 'pbkdf2') {
    throw new Error('Malformed PBKDF2 hash — possible data corruption')
  }

  const version = parts[2]
  if (version !== HASH_VERSION) {
    throw new Error(`Unsupported PBKDF2 hash version: ${version}`)
  }

  const salt = base64ToUint8(parts[3])
  const expectedHash = base64ToUint8(parts[4])

  if (salt.length === 0 || expectedHash.length === 0) {
    throw new Error('Malformed PBKDF2 hash — empty salt or hash')
  }

  // Iterations are pinned per version — NOT read from the hash
  const derivedHash = await derivePBKDF2(password, salt)
  const derived = new Uint8Array(derivedHash)

  // Constant-time comparison to prevent timing attacks
  if (derived.length !== expectedHash.length) return false
  let diff = 0
  for (let i = 0; i < derived.length; i++) {
    diff |= derived[i] ^ expectedHash[i]
  }
  return diff === 0
}

// ─── Internal: bcrypt verification via PDF microservice ───

async function verifyBcryptViaService(password: string, hash: string): Promise<boolean> {
  const serviceUrl = process.env.PDF_SERVICE_URL
  const serviceSecret = process.env.PDF_SERVICE_SECRET

  if (!serviceUrl || !serviceSecret) {
    console.error('[password] PDF_SERVICE_URL or PDF_SERVICE_SECRET not configured for bcrypt fallback')
    return false
  }

  try {
    // Use Authorization header (not custom header) for better security
    const credentials = Buffer.from(`service:${serviceSecret}`).toString('base64')

    const response = await fetch(`${serviceUrl}/verify-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`,
      },
      body: JSON.stringify({ password, hash }),
      signal: AbortSignal.timeout(10_000), // 10s timeout
    })

    if (!response.ok) {
      console.error('[password] PDF service returned', response.status)
      return false
    }

    const { valid } = (await response.json()) as { valid: boolean }
    return valid
  } catch (err) {
    console.error('[password] bcrypt verification via service failed:', err)
    return false
  }
}

// ─── Internal: Web Crypto PBKDF2 derivation ───

async function derivePBKDF2(
  password: string,
  salt: Uint8Array,
): Promise<ArrayBuffer> {
  const encoder = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  )

  return crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt.buffer as ArrayBuffer,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    PBKDF2_HASH_LENGTH * 8, // bits
  )
}

// ─── Base64 helpers (Workers + Node.js compatible) ───

function uint8ToBase64(bytes: Uint8Array): string {
  // Use Buffer in Node.js for reliability, btoa in Workers
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes).toString('base64')
  }
  return btoa(String.fromCharCode(...bytes))
}

function base64ToUint8(b64: string): Uint8Array {
  if (typeof Buffer !== 'undefined') {
    return new Uint8Array(Buffer.from(b64, 'base64'))
  }
  return new Uint8Array([...atob(b64)].map((c) => c.charCodeAt(0)))
}
