import { getPayloadSingleton, isPayloadEnabled } from '@/lib/payload'
import type { SchoolRole } from '@/collections/edusuite/shared'
import { isPlatformAdmin } from '@/collections/edusuite/shared'

export type SchoolDoc = {
  id: number | string
  name: string
  slug: string
  schoolType?: string
  city?: string
  state?: string
  currentTerm?: string
  currentSession?: string
  status?: string
  primaryColor?: string
}

export type MembershipDoc = {
  id: number | string
  schoolRole: SchoolRole
  status?: string
  school: number | string | SchoolDoc
  user: number | string
}

export async function getSchoolBySlug(slug: string): Promise<SchoolDoc | null> {
  if (!isPayloadEnabled()) return null
  const payload = await getPayloadSingleton()
  const result = await payload.find({
    collection: 'schools',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  })
  return (result.docs[0] as SchoolDoc | undefined) || null
}

export async function getUserMemberships(userId: string | number): Promise<MembershipDoc[]> {
  if (!isPayloadEnabled()) return []
  const payload = await getPayloadSingleton()
  const result = await payload.find({
    collection: 'school-memberships',
    where: {
      and: [{ user: { equals: userId } }, { status: { equals: 'active' } }],
    },
    depth: 1,
    limit: 50,
  })
  return result.docs as unknown as MembershipDoc[]
}

export async function resolveTenantAccess(
  user: { id?: unknown; role?: string } | null | undefined,
  schoolSlug: string,
): Promise<{ school: SchoolDoc; membership: MembershipDoc | null; isAdmin: boolean } | null> {
  const school = await getSchoolBySlug(schoolSlug)
  if (!school) return null
  const isAdmin = isPlatformAdmin(user)
  if (!user?.id) return { school, membership: null, isAdmin: false }
  if (isAdmin) return { school, membership: null, isAdmin: true }

  const memberships = await getUserMemberships(user.id as string | number)
  const membership =
    memberships.find((m) => {
      const sid = typeof m.school === 'object' ? m.school.id : m.school
      return String(sid) === String(school.id)
    }) || null

  if (!membership) return null
  return { school, membership, isAdmin: false }
}
