import { NextRequest, NextResponse } from 'next/server'
import { createPayloadRequest, getFieldsToSign, jwtSign } from 'payload'
import config from '@payload-config'
import { getCurrentUser } from '@/lib/auth'
import { getPayloadSingleton, isPayloadEnabled } from '@/lib/payload'
import { PAYLOAD_TOKEN_COOKIE } from '@/constants/payload'
import {
  IMPERSONATOR_COOKIE,
  authCookieOptions,
  clearAuthCookieOptions,
  readCookie,
} from '@/lib/impersonation'
import { recordStandaloneAudit } from '@/lib/audit'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/** Restore the original Super Admin / Admin session. */
export async function POST(req: NextRequest) {
  if (!isPayloadEnabled()) {
    return NextResponse.json({ error: 'Payload disabled' }, { status: 503 })
  }

  const impersonatorToken = await readCookie(IMPERSONATOR_COOKIE)
  if (!impersonatorToken) {
    return NextResponse.json({ error: 'Not currently impersonating' }, { status: 400 })
  }

  const target = await getCurrentUser(req)

  // Validate impersonator token by building a request that carries it
  const host = req.headers.get('host') || 'localhost:3000'
  const proto = req.headers.get('x-forwarded-proto') || 'http'
  const headers = new Headers()
  headers.set('cookie', `${PAYLOAD_TOKEN_COOKIE}=${impersonatorToken}`)
  headers.set('Authorization', `JWT ${impersonatorToken}`)
  const probe = new Request(`${proto}://${host}/`, { headers })

  let impersonator
  try {
    const payloadReq = await createPayloadRequest({
      config,
      request: probe,
      canSetHeaders: false,
    })
    impersonator = payloadReq.user
  } catch {
    impersonator = null
  }

  if (!impersonator) {
    const res = NextResponse.json(
      { error: 'Impersonator session expired. Please sign in again.' },
      { status: 401 },
    )
    res.cookies.set(IMPERSONATOR_COOKIE, '', clearAuthCookieOptions())
    return res
  }

  await recordStandaloneAudit({
    action: 'logout',
    collectionSlug: 'users',
    documentId: target ? String(target.id) : '',
    title: `Stop impersonating ${target?.email || 'user'}`,
    userId: impersonator.id,
    userEmail: String((impersonator as { email?: string }).email || ''),
    userRole: String((impersonator as { role?: string }).role || ''),
    ip: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip'),
    userAgent: req.headers.get('user-agent'),
    changes: {
      type: 'impersonate_stop',
      actorId: impersonator.id,
      actorEmail: (impersonator as { email?: string }).email,
      targetId: target?.id,
      targetEmail: target?.email,
    },
  })

  // Re-sign a fresh token for the impersonator so expiry is healthy
  let restoreToken = impersonatorToken
  let maxAge = 7200
  try {
    const payload = await getPayloadSingleton()
    const collection = payload.collections.users
    if (collection?.config) {
      const fieldsToSign = getFieldsToSign({
        collectionConfig: collection.config,
        email: String((impersonator as { email?: string }).email || ''),
        user: impersonator as never,
      })
      const tokenExpiration = collection.config.auth?.tokenExpiration || 7200
      const signed = await jwtSign({
        fieldsToSign,
        secret: payload.secret,
        tokenExpiration,
      })
      restoreToken = signed.token
      maxAge = Math.max(60, signed.exp - Math.floor(Date.now() / 1000))
    }
  } catch {
    // keep original impersonator token
  }

  const res = NextResponse.json({
    ok: true,
    path: '/dashboard/users',
    user: {
      id: impersonator.id,
      email: (impersonator as { email?: string }).email,
      fullName: (impersonator as { fullName?: string }).fullName,
      role: (impersonator as { role?: string }).role,
    },
  })

  res.cookies.set(PAYLOAD_TOKEN_COOKIE, restoreToken, authCookieOptions(maxAge))
  res.cookies.set(IMPERSONATOR_COOKIE, '', clearAuthCookieOptions())
  return res
}
