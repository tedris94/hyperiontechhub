import {
  ALL_CAPABILITY_KEYS,
  capabilitiesForRoleSlug,
  toCapabilityPayload,
  DEFAULT_ROLE_CAPABILITIES,
} from '@/lib/capabilities'
import { getPayloadSingleton } from '@/lib/payload'

export type DashboardRoleRecord = {
  id: number | string
  slug: string
  name: string
  description: string
  capabilities: string[]
  isSystem: boolean
}

const ROLE_SLUGS = Object.keys(DEFAULT_ROLE_CAPABILITIES)

let rolesSeedPromise: Promise<void> | null = null

function toRoleRecord(doc: {
  id: number | string
  slug: string
  name: string
  description?: string | null
  capabilities?: { key?: string | null }[] | null
  isSystem?: boolean | null
}): DashboardRoleRecord {
  const caps =
    doc.capabilities
      ?.map((c) => c.key?.trim())
      .filter((k): k is string => Boolean(k)) ?? []

  return {
    id: doc.id,
    slug: doc.slug,
    name: doc.name,
    description: doc.description ?? '',
    capabilities: caps.length > 0 ? caps : capabilitiesForRoleSlug(doc.slug),
    isSystem: doc.isSystem !== false,
  }
}

export async function ensureDashboardRolesSeeded() {
  if (!rolesSeedPromise) {
    rolesSeedPromise = (async () => {
      const payload = await getPayloadSingleton()

      for (const slug of ROLE_SLUGS) {
        const existing = await payload.find({
          collection: 'dashboard-roles',
          where: { slug: { equals: slug } },
          limit: 1,
          overrideAccess: true,
        })
        if (existing.docs.length > 0) continue

        const defaults = Object.prototype.hasOwnProperty.call(DEFAULT_ROLE_CAPABILITIES, slug)
          ? DEFAULT_ROLE_CAPABILITIES[slug]
          : []
        const name =
          slug === 'super_admin'
            ? 'Super Admin'
            : slug === 'tenant_member'
              ? 'Tenant Member'
              : slug
                  .split('_')
                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(' ')

        await payload.create({
          collection: 'dashboard-roles',
          data: {
            slug,
            name,
            description:
              slug === 'tenant_member'
                ? 'No Hyperion dashboard. Access is via ICMS / EduSuite memberships.'
                : `Default ${name} role`,
            capabilities: toCapabilityPayload(defaults),
            isSystem: true,
          },
          overrideAccess: true,
        })
      }
    })().catch((error) => {
      rolesSeedPromise = null
      throw error
    })
  }

  await rolesSeedPromise
}

export async function getDashboardRoleBySlug(slug: string): Promise<DashboardRoleRecord | null> {
  try {
    await ensureDashboardRolesSeeded()
    const payload = await getPayloadSingleton()
    const result = await payload.find({
      collection: 'dashboard-roles',
      where: { slug: { equals: slug } },
      limit: 1,
      overrideAccess: true,
    })
    const doc = result.docs[0]
    if (!doc) return null
    return toRoleRecord(doc as Parameters<typeof toRoleRecord>[0])
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[getDashboardRoleBySlug]', error)
    }
    return {
      id: slug,
      slug,
      name: slug
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      description: '',
      capabilities: capabilitiesForRoleSlug(slug),
      isSystem: true,
    }
  }
}

export async function getCapabilitiesForRoleSlug(roleSlug: string | undefined | null): Promise<string[]> {
  if (!roleSlug) return []
  if (roleSlug === 'super_admin') return [...ALL_CAPABILITY_KEYS]

  const role = await getDashboardRoleBySlug(roleSlug)
  if (role) return role.capabilities

  return capabilitiesForRoleSlug(roleSlug)
}

export async function getCapabilitiesForUser(user: { role?: string | null } | null): Promise<string[]> {
  if (!user?.role) return []
  const caps = await getCapabilitiesForRoleSlug(user.role)
  const defaults = DEFAULT_ROLE_CAPABILITIES[user.role]
  if (defaults?.length) {
    // Merge code defaults so role capability updates apply without re-seeding dashboard-roles
    return [...new Set([...caps, ...defaults])]
  }
  return caps
}

export { toRoleRecord }
