import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getPayloadSingleton, isPayloadEnabled } from '@/lib/payload'
import { PAYLOAD_TOKEN_COOKIE } from '@/constants/payload'
import {
  IMPERSONATOR_COOKIE,
  authCookieOptions,
  canStartImpersonation,
  readCookie,
  resolveUserLandingPath,
  signUserToken,
} from '@/lib/impersonation'
import { recordStandaloneAudit } from '@/lib/audit'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

type Params = { params: Promise<{ id: string }> }

export async function POST(req: NextRequest, { params }: Params) {
  if (!isPayloadEnabled()) {
    return NextResponse.json({ error: 'Payload disabled' }, { status: 503 })
  }

  const actor = await getCurrentUser(req)
  if (!actor) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const already = await readCookie(IMPERSONATOR_COOKIE)
  if (already) {
    return NextResponse.json(
      { error: 'Already impersonating. Stop the current session first.' },
      { status: 400 },
    )
  }

  const { id } = await params
  const payload = await getPayloadSingleton()

  let target
  try {
    target = await payload.findByID({
      collection: 'users',
      id: isNaN(Number(id)) ? id : Number(id),
      overrideAccess: true,
    })
  } catch {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const gate = canStartImpersonation(actor, target as { id: string | number; role: string })
  if (!gate.ok) {
    return NextResponse.json({ error: gate.error }, { status: 403 })
  }

  const currentToken = await readCookie(PAYLOAD_TOKEN_COOKIE)
  if (!currentToken) {
    return NextResponse.json({ error: 'Missing session token' }, { status: 401 })
  }

  const { token, exp } = await signUserToken(target as never)
  const maxAge = Math.max(60, exp - Math.floor(Date.now() / 1000))
  const path = await resolveUserLandingPath({
    id: target.id,
    role: (target as { role?: string }).role,
  })

  try {
    await recordStandaloneAudit({
      action: 'login',
      collectionSlug: 'users',
      documentId: String(target.id),
      title: `Impersonate ${(target as { email?: string }).email}`,
      userId: actor.id,
      userEmail: actor.email,
      userRole: actor.role,
      ip: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip'),
      userAgent: req.headers.get('user-agent'),
      changes: {
        type: 'impersonate_start',
        actorId: actor.id,
        actorEmail: actor.email,
        targetId: target.id,
        targetEmail: (target as { email?: string }).email,
        targetRole: (target as { role?: string }).role,
      },
    })
  } catch (e) {
    console.warn('[impersonate] audit write failed', e)
  }

  const res = NextResponse.json({
    ok: true,
    path,
    user: {
      id: target.id,
      email: (target as { email?: string }).email,
      fullName: (target as { fullName?: string }).fullName,
      role: (target as { role?: string }).role,
    },
    impersonator: {
      id: actor.id,
      email: actor.email,
      fullName: actor.fullName,
    },
  })

  res.cookies.set(IMPERSONATOR_COOKIE, currentToken, authCookieOptions(maxAge))
  res.cookies.set(PAYLOAD_TOKEN_COOKIE, token, authCookieOptions(maxAge))
  return res
}

/** Convenience: DELETE also stops if someone hits the same path wrongly — no, stop is separate. */
export async function GET() {
  return NextResponse.json({ error: 'Use POST to start impersonation' }, { status: 405 })
}
