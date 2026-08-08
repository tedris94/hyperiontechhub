import { cookies as nextCookies } from 'next/headers'
import { getFieldsToSign, jwtSign } from 'payload'
import type { User } from '@/payload-types'
import { PAYLOAD_TOKEN_COOKIE } from '@/constants/payload'
import { getPayloadSingleton } from '@/lib/payload'
import { getUserIcmsMemberships } from '@/lib/icms/access'
import { isAdminRole } from '@/lib/auth'
import type { IcmsTenantDoc } from '@/lib/icms/tenants'

export const IMPERSONATOR_COOKIE = 'payload-impersonator'

const COOKIE_BASE = {
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
  secure: process.env.NODE_ENV === 'production',
}

export function authCookieOptions(maxAgeSeconds: number) {
  return { ...COOKIE_BASE, maxAge: maxAgeSeconds }
}

export function clearAuthCookieOptions() {
  return { ...COOKIE_BASE, maxAge: 0 }
}

type SignableUser = {
  id: string | number
  email: string
  fullName?: string | null
  role?: string | null
  [key: string]: unknown
}

/** Mint a Payload JWT for a user (same shape as /api/users/login). */
export async function signUserToken(user: SignableUser): Promise<{ token: string; exp: number }> {
  const payload = await getPayloadSingleton()
  const collection = payload.collections.users
  if (!collection?.config) {
    throw new Error('Users collection not available')
  }

  const fieldsToSign = getFieldsToSign({
    collectionConfig: collection.config,
    email: user.email,
    user: user as never,
  })

  const tokenExpiration = collection.config.auth?.tokenExpiration || 7200
  return jwtSign({
    fieldsToSign,
    secret: payload.secret,
    tokenExpiration,
  })
}

export async function readCookie(name: string): Promise<string | undefined> {
  const jar = await nextCookies()
  return jar.get(name)?.value
}

/** Resolve destination after becoming this user (mirrors post-login-redirect). */
export async function resolveUserLandingPath(user: {
  id: string | number
  role?: string | null
}): Promise<string> {
  const isPlatform = isAdminRole(user.role || undefined)
  const memberships = await getUserIcmsMemberships(user.id)

  const tenantSlugs = memberships
    .map((m) => {
      const t = m.tenant
      if (t && typeof t === 'object' && 'slug' in t) {
        return String((t as IcmsTenantDoc).slug || '') || null
      }
      return null
    })
    .filter(Boolean) as string[]

  if ((!isPlatform || user.role === 'tenant_member') && tenantSlugs.length === 1) {
    return `/icms/admin/${tenantSlugs[0]}`
  }
  if ((!isPlatform || user.role === 'tenant_member') && tenantSlugs.length > 1) {
    return '/icms'
  }
  if (user.role === 'tenant_member') {
    return '/icms'
  }
  return '/dashboard'
}

export function canStartImpersonation(
  actor: Pick<User, 'id' | 'role'>,
  target: Pick<User, 'id' | 'role'>,
): { ok: true } | { ok: false; error: string } {
  if (!isAdminRole(actor.role)) {
    return { ok: false, error: 'Only Super Admin or Admin can impersonate users.' }
  }
  if (String(actor.id) === String(target.id)) {
    return { ok: false, error: 'You cannot impersonate yourself.' }
  }
  if (target.role === 'super_admin') {
    return { ok: false, error: 'Cannot impersonate a Super Admin.' }
  }
  if (actor.role === 'admin' && target.role === 'admin') {
    return { ok: false, error: 'Admins cannot impersonate other Admins.' }
  }
  return { ok: true }
}
