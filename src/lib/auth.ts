import config from '@payload-config'
import { createPayloadRequest } from 'payload'
import { cookies as nextCookies, headers as nextHeaders } from 'next/headers'
import type { User } from '@/payload-types'
import { PAYLOAD_TOKEN_COOKIE } from '@/constants/payload'

export { PAYLOAD_TOKEN_COOKIE }

export function isAdminRole(role: string | undefined): role is 'super_admin' | 'admin' {
  return role === 'super_admin' || role === 'admin'
}

/** Build a Request from the current RSC/headers cookie jar for Payload auth. */
export async function getIncomingRequest(path = '/'): Promise<Request> {
  const h = await nextHeaders()
  const cookieStore = await nextCookies()
  const cookieHeader = h.get('cookie') || ''
  const token = cookieStore.get(PAYLOAD_TOKEN_COOKIE)?.value
  const host = h.get('host') || 'localhost:3000'
  const proto = h.get('x-forwarded-proto') || 'http'

  const headers = new Headers()
  if (cookieHeader) headers.set('cookie', cookieHeader)
  else if (token) headers.set('cookie', `${PAYLOAD_TOKEN_COOKIE}=${token}`)
  if (token) headers.set('Authorization', `JWT ${token}`)

  return new Request(`${proto}://${host}${path}`, { headers })
}

export async function getCurrentUser(request?: Request): Promise<User | null> {
  try {
    const reqIn = request ?? (await getIncomingRequest())
    const req = await createPayloadRequest({
      config,
      request: reqIn,
      canSetHeaders: false,
    })
    return (req.user as User | null) ?? null
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[getCurrentUser]', error)
    }
    return null
  }
}
