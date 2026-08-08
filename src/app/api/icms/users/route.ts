import { NextRequest, NextResponse } from 'next/server'
import { getPayloadSingleton, isPayloadEnabled } from '@/lib/payload'
import { getCurrentUser } from '@/lib/auth'
import { isPlatformAdmin } from '@/collections/icms/shared'
import { resolveIcmsAccess, accessHasCapability } from '@/lib/icms/access'
import { ICMS_ROLES, type IcmsRole } from '@/lib/icms/roles'
import { recordStandaloneAudit } from '@/lib/audit'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

type UserDoc = {
  id: number | string
  email: string
  fullName?: string | null
  role?: string | null
}

/** List registered users available for team assignment (gated by `members`). */
export async function GET(req: NextRequest) {
  if (!isPayloadEnabled()) {
    return NextResponse.json({ error: 'Payload disabled' }, { status: 503 })
  }
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const tenantSlug = req.nextUrl.searchParams.get('tenantSlug') || ''
  if (!tenantSlug) {
    return NextResponse.json({ error: 'tenantSlug required' }, { status: 400 })
  }

  if (!isPlatformAdmin(user)) {
    const access = await resolveIcmsAccess(user, tenantSlug)
    if (!access || !accessHasCapability(access, 'members')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  }

  try {
    const payload = await getPayloadSingleton()
    const result = await payload.find({
      collection: 'users',
      where: {
        role: { in: ['tenant_member', 'subscriber', 'client'] },
      },
      limit: 500,
      sort: 'fullName',
      overrideAccess: true,
    })

    const users = (result.docs as UserDoc[]).map((d) => ({
      id: d.id,
      email: d.email,
      fullName: d.fullName || d.email,
      platformRole: d.role || 'tenant_member',
    }))

    return NextResponse.json({ users })
  } catch (e) {
    console.error('[icms/users GET]', e)
    return NextResponse.json({ error: 'Failed to load users' }, { status: 500 })
  }
}

/**
 * Register a new centre staff user (platform role: tenant_member)
 * and optionally assign an ICMS membership in one step.
 */
export async function POST(req: NextRequest) {
  if (!isPayloadEnabled()) {
    return NextResponse.json({ error: 'Payload disabled' }, { status: 503 })
  }
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = (await req.json()) as {
      tenantSlug?: string
      tenantId?: string | number
      email?: string
      password?: string
      fullName?: string
      role?: string
      assign?: boolean
    }

    const tenantSlug = String(body.tenantSlug || '').trim()
    const email = String(body.email || '')
      .trim()
      .toLowerCase()
    const password = String(body.password || '').trim()
    const fullName = String(body.fullName || '').trim()
    const icmsRole = (String(body.role || 'viewer').trim() || 'viewer') as IcmsRole
    const assign = body.assign !== false

    if (!tenantSlug) {
      return NextResponse.json({ error: 'tenantSlug required' }, { status: 400 })
    }
    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Full name, email, and password are required.' },
        { status: 400 },
      )
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
    }
    if (!ICMS_ROLES.includes(icmsRole)) {
      return NextResponse.json({ error: 'Invalid ICMS role' }, { status: 400 })
    }
    if (icmsRole === 'owner' && !isPlatformAdmin(user)) {
      return NextResponse.json(
        { error: 'Only platform admins can assign the owner role' },
        { status: 403 },
      )
    }

    let tenantId: string | number | undefined = body.tenantId
    if (!isPlatformAdmin(user)) {
      const access = await resolveIcmsAccess(user, tenantSlug)
      if (!access || !accessHasCapability(access, 'members')) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
      tenantId = access.tenant.id
    } else if (!tenantId) {
      const access = await resolveIcmsAccess(user, tenantSlug)
      if (!access) {
        return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
      }
      tenantId = access.tenant.id
    }

    const payload = await getPayloadSingleton()

    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
      limit: 1,
      overrideAccess: true,
    })
    if (existing.totalDocs > 0) {
      return NextResponse.json(
        {
          error:
            'A user with this email already exists. Choose them from the Assign dropdown instead.',
        },
        { status: 409 },
      )
    }

    const created = await payload.create({
      collection: 'users',
      data: {
        email,
        password,
        fullName,
        role: 'tenant_member',
      },
      overrideAccess: true,
    })

    let membership = null
    if (assign && tenantId != null) {
      membership = await payload.create({
        collection: 'icms-memberships',
        data: {
          user: created.id,
          tenant: isNaN(Number(tenantId)) ? tenantId : Number(tenantId),
          role: icmsRole,
          status: 'active',
        },
        overrideAccess: true,
      })
    }

    await recordStandaloneAudit({
      action: 'create',
      collectionSlug: 'users',
      documentId: String(created.id),
      title: `Register ${email}`,
      userId: user.id,
      userEmail: user.email,
      userRole: user.role,
      ip: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip'),
      userAgent: req.headers.get('user-agent'),
      changes: {
        type: 'register_user',
        email,
        fullName,
        icmsRole,
        tenantSlug,
        tenantId,
        membershipId: membership ? (membership as { id?: unknown }).id : null,
      },
    })

    return NextResponse.json(
      {
        user: {
          id: created.id,
          email: (created as UserDoc).email,
          fullName: (created as UserDoc).fullName || fullName,
        },
        membership,
      },
      { status: 201 },
    )
  } catch (e) {
    console.error('[icms/users POST]', e)
    const message = e instanceof Error ? e.message : 'Failed to register user'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
