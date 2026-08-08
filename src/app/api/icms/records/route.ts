import { NextRequest, NextResponse } from 'next/server'
import { getPayloadSingleton, isPayloadEnabled } from '@/lib/payload'
import { getCurrentUser } from '@/lib/auth'
import { isPlatformAdmin, isSuperAdmin } from '@/collections/icms/shared'
import {
  resolveIcmsAccess,
  accessHasCapability,
  COLLECTION_CAPABILITY,
  type IcmsCapability,
  type IcmsAccess,
} from '@/lib/icms/access'
import { seedTenantDemoContent } from '@/lib/icms/seed'
import { ICMS_ROLES } from '@/lib/icms/roles'

const ALLOWED = new Set(Object.keys(COLLECTION_CAPABILITY))

function writeCapabilityFor(collection: string): IcmsCapability | 'platform' | 'settings' | null {
  return COLLECTION_CAPABILITY[collection] || null
}

function canWriteCollection(access: IcmsAccess, collection: string): boolean {
  if (access.isAdmin) return true
  const cap = writeCapabilityFor(collection)
  if (!cap || cap === 'platform') return false
  if (cap === 'settings') return accessHasCapability(access, 'settings')
  return accessHasCapability(access, cap)
}

function normalizeId(value: unknown): string | number {
  if (typeof value === 'number') return value
  const s = String(value ?? '').trim()
  if (!s) return s
  return Number.isNaN(Number(s)) ? s : Number(s)
}

async function readJsonBody(req: NextRequest): Promise<Record<string, unknown>> {
  try {
    return (await req.json()) as Record<string, unknown>
  } catch {
    throw new Error('Invalid JSON body')
  }
}

export async function GET(req: NextRequest) {
  if (!isPayloadEnabled()) {
    return NextResponse.json({ error: 'Payload disabled' }, { status: 503 })
  }
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const collection = req.nextUrl.searchParams.get('collection') || ''
  const tenantId = req.nextUrl.searchParams.get('tenantId')
  const tenantSlug = req.nextUrl.searchParams.get('tenantSlug') || ''
  if (!ALLOWED.has(collection)) {
    return NextResponse.json({ error: 'Invalid collection' }, { status: 400 })
  }

  if (collection === 'icms-tenants') {
    if (!isPlatformAdmin(user)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  } else if (collection === 'icms-memberships') {
    if (isPlatformAdmin(user)) {
      // ok
    } else if (tenantSlug) {
      const access = await resolveIcmsAccess(user, tenantSlug)
      if (!access || !accessHasCapability(access, 'members')) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    } else {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  } else if (tenantSlug) {
    const access = await resolveIcmsAccess(user, tenantSlug)
    if (!access) return NextResponse.json({ error: 'Forbidden for this tenant' }, { status: 403 })
  } else if (!isPlatformAdmin(user) && !tenantId) {
    return NextResponse.json({ error: 'tenantId or tenantSlug required' }, { status: 400 })
  }

  const payload = await getPayloadSingleton()
  let where: Record<string, unknown> | undefined
  if (collection !== 'icms-tenants' && tenantId) {
    where = { tenant: { equals: isNaN(Number(tenantId)) ? tenantId : Number(tenantId) } }
  }

  const result = await payload.find({
    collection: collection as 'icms-tenants',
    where: where as never,
    limit: 200,
    sort: '-updatedAt',
    depth: collection === 'icms-memberships' ? 1 : 0,
    overrideAccess: isPlatformAdmin(user),
    user,
  })

  return NextResponse.json({ docs: result.docs })
}

export async function POST(req: NextRequest) {
  try {
    if (!isPayloadEnabled()) {
      return NextResponse.json({ error: 'Payload disabled' }, { status: 503 })
    }
    const user = await getCurrentUser(req)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await readJsonBody(req)
    const action = body.action ? String(body.action) : ''
    const collection = String(body.collection || '')
    const tenantSlug = body.tenantSlug ? String(body.tenantSlug) : ''
    const data = { ...((body.data as Record<string, unknown>) || {}) }

    const payload = await getPayloadSingleton()

    if (action === 'seed') {
      if (!isPlatformAdmin(user)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
      const slug = tenantSlug || String(data.slug || '')
      if (!slug) return NextResponse.json({ error: 'tenantSlug required' }, { status: 400 })
      const access = await resolveIcmsAccess(user, slug)
      if (!access) return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
      await seedTenantDemoContent(payload, access.tenant.id, { clear: true })
      return NextResponse.json({ ok: true })
    }

    if (action === 'upsert-page') {
      if (!tenantSlug) {
        return NextResponse.json({ error: 'tenantSlug required' }, { status: 400 })
      }
      const access = await resolveIcmsAccess(user, tenantSlug)
      if (!access || !accessHasCapability(access, 'pages')) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
      const pageKey = String(data.pageKey || '')
      if (!pageKey) {
        return NextResponse.json({ error: 'pageKey required' }, { status: 400 })
      }
      const found = await payload.find({
        collection: 'icms-pages',
        where: {
          and: [
            { tenant: { equals: access.tenant.id } },
            { pageKey: { equals: pageKey } },
          ],
        },
        limit: 1,
        overrideAccess: true,
      })
      const payloadData = { ...data, tenant: access.tenant.id }
      if (found.totalDocs > 0) {
        const doc = await payload.update({
          collection: 'icms-pages',
          id: found.docs[0].id,
          data: payloadData as never,
          overrideAccess: true,
        })
        return NextResponse.json({ doc })
      }
      const doc = await payload.create({
        collection: 'icms-pages',
        data: payloadData as never,
        overrideAccess: true,
      })
      return NextResponse.json({ doc })
    }

    if (action === 'assign-membership') {
      const email = String(data.email || '').trim().toLowerCase()
      const tenantId = normalizeId(data.tenant)
      const role = String(data.role || 'viewer')
      if (!email || tenantId === '') {
        return NextResponse.json({ error: 'email and tenant required' }, { status: 400 })
      }
      if (!ICMS_ROLES.includes(role as (typeof ICMS_ROLES)[number])) {
        return NextResponse.json({ error: 'Invalid ICMS role' }, { status: 400 })
      }

      const isAdmin = isPlatformAdmin(user)
      if (!isAdmin) {
        if (!tenantSlug) {
          return NextResponse.json({ error: 'tenantSlug required' }, { status: 400 })
        }
        const access = await resolveIcmsAccess(user, tenantSlug)
        if (!access || !accessHasCapability(access, 'members')) {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }
        if (String(access.tenant.id) !== String(tenantId)) {
          return NextResponse.json({ error: 'Tenant mismatch' }, { status: 403 })
        }
        if (role === 'owner' && access.role !== 'platform_admin') {
          return NextResponse.json(
            { error: 'Only platform admins can assign the owner role' },
            { status: 403 },
          )
        }
      }

      const found = await payload.find({
        collection: 'users',
        where: { email: { equals: email } },
        limit: 1,
        overrideAccess: true,
      })
      if (found.totalDocs === 0) {
        return NextResponse.json({ error: `No user with email ${email}` }, { status: 404 })
      }

      const userId = found.docs[0].id
      const existing = await payload.find({
        collection: 'icms-memberships',
        where: {
          and: [{ user: { equals: userId } }, { tenant: { equals: tenantId } }],
        },
        limit: 1,
        overrideAccess: true,
      })

      const membershipData = {
        user: userId,
        tenant: tenantId,
        role: role as (typeof ICMS_ROLES)[number],
        status: 'active' as const,
      }

      if (existing.totalDocs > 0) {
        const doc = await payload.update({
          collection: 'icms-memberships',
          id: existing.docs[0].id,
          data: {
            role: membershipData.role,
            status: 'active',
          },
          overrideAccess: true,
          // Avoid filterOptions tied to Hyperion platform role blocking centre owners
          context: { icmsAssignMembership: true },
        })
        return NextResponse.json({
          doc,
          ok: true,
          message: `Updated membership: ${email} → ${role}`,
        })
      }

      const doc = await payload.create({
        collection: 'icms-memberships',
        data: membershipData,
        overrideAccess: true,
        context: { icmsAssignMembership: true },
      })
      return NextResponse.json({
        doc,
        ok: true,
        message: `Assigned ${email} as ${role}`,
      })
    }

    if (!ALLOWED.has(collection)) {
      return NextResponse.json({ error: 'Invalid collection' }, { status: 400 })
    }

    if (collection === 'icms-tenants') {
      if (!isPlatformAdmin(user)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    } else if (collection === 'icms-memberships') {
      if (!isPlatformAdmin(user)) {
        return NextResponse.json({ error: 'Use assign-membership action' }, { status: 403 })
      }
    } else if (tenantSlug) {
      const access = await resolveIcmsAccess(user, tenantSlug)
      if (!access) return NextResponse.json({ error: 'Forbidden for this tenant' }, { status: 403 })
      if (!canWriteCollection(access, collection)) {
        return NextResponse.json({ error: 'Role cannot write this collection' }, { status: 403 })
      }
      data.tenant = access.tenant.id
    } else if (!isPlatformAdmin(user)) {
      return NextResponse.json({ error: 'tenantSlug required' }, { status: 400 })
    }

    const doc = await payload.create({
      collection: collection as 'icms-tenants',
      data: data as never,
      user,
      overrideAccess: isPlatformAdmin(user),
    })
    return NextResponse.json({ doc })
  } catch (e) {
    console.error('[icms/records POST]', e)
    const message = e instanceof Error ? e.message : 'Request failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  if (!isPayloadEnabled()) {
    return NextResponse.json({ error: 'Payload disabled' }, { status: 503 })
  }
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const collection = String(body.collection || '')
  const id = body.id
  const tenantSlug = body.tenantSlug ? String(body.tenantSlug) : ''
  const data = { ...(body.data as Record<string, unknown>) }

  if (!ALLOWED.has(collection) || !id) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  if (collection === 'icms-tenants') {
    if (tenantSlug) {
      const access = await resolveIcmsAccess(user, tenantSlug)
      if (!access) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
      if (String(access.tenant.id) !== String(id)) {
        return NextResponse.json({ error: 'Tenant mismatch' }, { status: 403 })
      }

      // Visibility grants — Hyperion super_admin only
      if ('roleCapabilityOverrides' in data && !isSuperAdmin(user)) {
        return NextResponse.json(
          { error: 'Only Hyperion super admin can edit role capability grants' },
          { status: 403 },
        )
      }

      const canSettings = accessHasCapability(access, 'settings')
      const canBank = accessHasCapability(access, 'bank')
      const canPrayer = accessHasCapability(access, 'prayer')
      const canDomains = accessHasCapability(access, 'domains')
      const editingOverrides = isSuperAdmin(user) && 'roleCapabilityOverrides' in data

      if (!canSettings && !canBank && !canPrayer && !canDomains && !editingOverrides) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }

      const domainKeys = ['customDomain', 'customDomainStatus', 'customDomainError'] as const
      if (!canDomains) {
        for (const k of domainKeys) delete data[k]
      }

      if (!canSettings) {
        const allowed: Record<string, unknown> = {}
        if (canBank && data.bank) allowed.bank = data.bank
        if (canPrayer && data.prayer) allowed.prayer = data.prayer
        if (canBank && data.paystack) allowed.paystack = data.paystack
        if (canDomains) {
          for (const k of domainKeys) {
            if (k in data) allowed[k] = data[k]
          }
        }
        if (editingOverrides) {
          allowed.roleCapabilityOverrides = data.roleCapabilityOverrides
        }
        Object.keys(data).forEach((k) => delete data[k])
        Object.assign(data, allowed)
        if (!Object.keys(data).length) {
          return NextResponse.json({ error: 'No permitted fields to update' }, { status: 403 })
        }
      }
    } else if (!isPlatformAdmin(user)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    } else if ('roleCapabilityOverrides' in data && !isSuperAdmin(user)) {
      return NextResponse.json(
        { error: 'Only Hyperion super admin can edit role capability grants' },
        { status: 403 },
      )
    }
  } else if (collection === 'icms-memberships') {
    if (tenantSlug) {
      const access = await resolveIcmsAccess(user, tenantSlug)
      if (!access || !accessHasCapability(access, 'members')) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    } else if (!isPlatformAdmin(user)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  } else if (tenantSlug) {
    const access = await resolveIcmsAccess(user, tenantSlug)
    if (!access || !canWriteCollection(access, collection)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  } else if (!isPlatformAdmin(user)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const payload = await getPayloadSingleton()

  // Preserve Paystack secret when settings form omits it (blank = keep current)
  if (collection === 'icms-tenants' && data.paystack && typeof data.paystack === 'object') {
    const incoming = data.paystack as { secretKey?: string; publicKey?: string }
    const existing = await payload.findByID({
      collection: 'icms-tenants',
      id,
      overrideAccess: true,
    })
    const prev = (existing as { paystack?: { secretKey?: string; publicKey?: string } }).paystack
    data.paystack = {
      publicKey: incoming.publicKey ?? prev?.publicKey ?? '',
      secretKey: incoming.secretKey?.trim() || prev?.secretKey || '',
    }
  }

  const doc = await payload.update({
    collection: collection as 'icms-tenants',
    id,
    data: data as never,
    user,
    // Access already enforced above via resolveIcmsAccess / capabilities
    overrideAccess: true,
  })
  return NextResponse.json({ doc })
}

export async function DELETE(req: NextRequest) {
  if (!isPayloadEnabled()) {
    return NextResponse.json({ error: 'Payload disabled' }, { status: 503 })
  }
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const collection = req.nextUrl.searchParams.get('collection') || ''
  const id = req.nextUrl.searchParams.get('id')
  const tenantSlug = req.nextUrl.searchParams.get('tenantSlug') || ''

  if (!ALLOWED.has(collection) || !id) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  if (collection === 'icms-tenants') {
    if (!isPlatformAdmin(user)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  } else if (collection === 'icms-memberships') {
    if (tenantSlug) {
      const access = await resolveIcmsAccess(user, tenantSlug)
      if (!access || !accessHasCapability(access, 'members')) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    } else if (!isPlatformAdmin(user)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  } else if (tenantSlug) {
    const access = await resolveIcmsAccess(user, tenantSlug)
    if (!access || !canWriteCollection(access, collection)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  } else if (!isPlatformAdmin(user)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const payload = await getPayloadSingleton()
  await payload.delete({
    collection: collection as 'icms-tenants',
    id,
    user,
    overrideAccess: isPlatformAdmin(user),
  })
  return NextResponse.json({ ok: true })
}
