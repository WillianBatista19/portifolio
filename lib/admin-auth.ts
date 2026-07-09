import { cookies } from 'next/headers'

// On login: compare submitted password with ADMIN_PASSWORD env var
// If match: set a signed httpOnly cookie "admin_session" = "authenticated"
// Middleware checks for this cookie on /admin/dashboard routes
// No JWT, no NextAuth, no database — just a cookie

export const ADMIN_COOKIE_NAME = 'admin_session'
export const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

const SESSION_VALUE = 'authenticated'

export async function verifyAdminPassword(password: string): Promise<boolean> {
  return password === process.env.ADMIN_PASSWORD
}

function getCookieSecret(): string {
  const secret = process.env.ADMIN_COOKIE_SECRET
  if (!secret) throw new Error('ADMIN_COOKIE_SECRET is not set')
  return secret
}

function toBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

async function hmac(value: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(getCookieSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value))
  return toBase64Url(signature)
}

// Produces the signed value to store in the "admin_session" cookie
export async function createSessionCookieValue(): Promise<string> {
  const signature = await hmac(SESSION_VALUE)
  return `${SESSION_VALUE}.${signature}`
}

// Verifies a cookie value read from the request (e.g. in middleware)
export async function isValidSessionCookie(cookieValue: string | undefined): Promise<boolean> {
  if (!cookieValue) return false

  const [value, signature] = cookieValue.split('.')
  if (value !== SESSION_VALUE || !signature) return false

  const expectedSignature = await hmac(value)
  return signature === expectedSignature
}

// Admin routes always verify the session cookie before doing anything
export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  return isValidSessionCookie(cookieStore.get(ADMIN_COOKIE_NAME)?.value)
}
