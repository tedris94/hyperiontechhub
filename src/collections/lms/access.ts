import type { Access, PayloadRequest } from 'payload'

type AuthUser = { id?: number | string; role?: string }

export function getAuthUser(req: PayloadRequest): AuthUser | null {
  return (req.user as AuthUser | null) ?? null
}

export function isStaffRole(role: string | undefined): boolean {
  return role === 'super_admin' || role === 'admin' || role === 'instructor'
}

export function isAdminRole(role: string | undefined): boolean {
  return role === 'super_admin' || role === 'admin'
}

export const publicRead: Access = () => true

export const staffWrite: Access = ({ req }) => {
  const user = getAuthUser(req)
  return Boolean(user && isStaffRole(user.role))
}

export const adminWrite: Access = ({ req }) => {
  const user = getAuthUser(req)
  return Boolean(user && isAdminRole(user.role))
}

export const authenticatedRead: Access = ({ req }) => Boolean(req.user)

export const ownOrStaffRead: Access = ({ req }) => {
  const user = getAuthUser(req)
  if (!user) return false
  if (isStaffRole(user.role)) return true
  return { student: { equals: user.id } }
}

export const publishedCourseRead: Access = ({ req }) => {
  const user = getAuthUser(req)
  if (user && isStaffRole(user.role)) return true
  return { status: { equals: 'published' } }
}

export const publishedLessonRead: Access = ({ req }) => {
  const user = getAuthUser(req)
  if (user && isStaffRole(user.role)) return true
  if (user) return true
  return { isPreview: { equals: true } }
}

export const approvedReviewRead: Access = ({ req }) => {
  const user = getAuthUser(req)
  if (user && isStaffRole(user.role)) return true
  return { status: { equals: 'approved' } }
}
