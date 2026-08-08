/** Human-readable reference shown to applicants (e.g. HY-APP-2026-00042). */
export function formatApplicationRef(id: number | string): string {
  const year = new Date().getFullYear()
  const num = String(id).padStart(5, '0')
  return `HY-APP-${year}-${num}`
}

export function careersContactEmail(): string {
  return (
    process.env.CAREERS_REPLY_EMAIL?.trim() ||
    process.env.HR_NOTIFY_EMAIL?.trim()?.split(/[,;]/)[0]?.trim() ||
    'careers@hyperiontechhub.com'
  )
}

export function siteBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.PAYLOAD_PUBLIC_SERVER_URL?.trim() ||
    'https://www.hyperiontechhub.com'
  ).replace(/\/$/, '')
}

export type ApplicationStatus = 'pending' | 'shortlisted' | 'approved' | 'rejected'

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  pending: 'Under review',
  shortlisted: 'Shortlisted',
  approved: 'Approved',
  rejected: 'Not successful',
}
