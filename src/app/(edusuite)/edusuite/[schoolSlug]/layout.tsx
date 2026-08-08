import { notFound } from 'next/navigation'
import EduSuiteShell from '@/components/edusuite/EduSuiteShell'
import { getCurrentUser } from '@/lib/auth'
import { getSchoolBySlug, resolveTenantAccess } from '@/lib/edusuite/tenant'
import type { SchoolRole } from '@/lib/edusuite/nav'

type Props = { children: React.ReactNode; params: Promise<{ schoolSlug: string }> }

/**
 * Auth is enforced client-side via RequireAuth (AuthContext session).
 * Avoid server redirect→login here: RSC cookie auth can lag the client session
 * and causes a login↔returnTo loop with the login page's auto-redirect.
 */
export default async function SchoolLayout({ children, params }: Props) {
  const { schoolSlug } = await params
  const school = await getSchoolBySlug(schoolSlug)
  if (!school) notFound()

  const user = await getCurrentUser()
  let role: SchoolRole | null = null
  let isAdmin = false

  if (user) {
    const access = await resolveTenantAccess(user, schoolSlug)
    if (!access) notFound()
    role = (access.membership?.schoolRole as SchoolRole | undefined) || null
    isAdmin = access.isAdmin
  }

  return (
    <EduSuiteShell
      schoolSlug={school.slug}
      schoolName={school.name}
      schoolRole={role}
      isAdmin={isAdmin}
    >
      {children}
    </EduSuiteShell>
  )
}
