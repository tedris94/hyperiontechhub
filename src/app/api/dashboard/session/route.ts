import { NextResponse } from 'next/server'
import { createPayloadRequest } from 'payload'
import config from '@payload-config'
import { ALL_CAPABILITIES } from '@/lib/capabilities'
import { getCurrentUser } from '@/lib/auth'
import { getCapabilitiesForUser, getDashboardRoleBySlug } from '@/lib/resolveCapabilities'
import { PAYLOAD_TOKEN_COOKIE } from '@/constants/payload'
import { IMPERSONATOR_COOKIE, readCookie } from '@/lib/impersonation'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: Request) {
  const user = await getCurrentUser(request)
  if (!user) {
    return NextResponse.json({
      user: null,
      capabilities: [],
      roleName: null,
      impersonating: false,
      impersonator: null,
    })
  }

  const capabilities = await getCapabilitiesForUser(user)
  const roleDoc = user.role ? await getDashboardRoleBySlug(user.role) : null

  let impersonating = false
  let impersonator: {
    id: string | number
    email: string
    fullName?: string | null
    role?: string | null
  } | null = null

  const impersonatorToken = await readCookie(IMPERSONATOR_COOKIE)
  if (impersonatorToken) {
    try {
      const host = request.headers.get('host') || 'localhost:3000'
      const proto = request.headers.get('x-forwarded-proto') || 'http'
      const headers = new Headers()
      headers.set('cookie', `${PAYLOAD_TOKEN_COOKIE}=${impersonatorToken}`)
      headers.set('Authorization', `JWT ${impersonatorToken}`)
      const probe = new Request(`${proto}://${host}/`, { headers })
      const payloadReq = await createPayloadRequest({
        config,
        request: probe,
        canSetHeaders: false,
      })
      const actor = payloadReq.user as {
        id?: string | number
        email?: string
        fullName?: string | null
        role?: string | null
      } | null
      if (actor?.id != null && actor.email) {
        impersonating = true
        impersonator = {
          id: actor.id,
          email: actor.email,
          fullName: actor.fullName,
          role: actor.role,
        }
      }
    } catch {
      // ignore invalid impersonator cookie
    }
  }

  return NextResponse.json(
    {
      user,
      capabilities,
      roleName: roleDoc?.name ?? user.role,
      capabilityCatalog: ALL_CAPABILITIES,
      impersonating,
      impersonator,
    },
    { headers: { 'Cache-Control': 'private, no-store' } },
  )
}
