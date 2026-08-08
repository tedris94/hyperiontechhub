export type ContactSubmission = {
  id: string | number
  name: string
  email: string
  phone?: string | null
  service: string
  message: string
  status: string
  read: boolean
  replies?: Array<{ message: string; sentAt?: string; sentBy?: string }>
  createdAt: string
}

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  const res = await fetch('/api/admin/contacts', { credentials: 'include' })
  if (!res.ok) return []
  const data = await res.json()
  return (data.docs || []).map(mapContact)
}

function mapContact(doc: Record<string, unknown>): ContactSubmission {
  return {
    id: doc.id as string | number,
    name: doc.name as string,
    email: doc.email as string,
    phone: doc.phone as string | undefined,
    service: doc.service as string,
    message: doc.message as string,
    status: (doc.status as string) || 'new',
    read: Boolean(doc.read),
    replies: doc.replies as ContactSubmission['replies'],
    createdAt: (doc.createdAt as string) || new Date().toISOString(),
  }
}

export async function markAsRead(id: string | number) {
  await fetch('/api/admin/contacts', {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, read: true }),
  })
}

export async function updateSubmissionStatus(id: string | number, status: string) {
  await fetch('/api/admin/contacts', {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, status }),
  })
}

export async function deleteSubmission(id: string | number) {
  // Soft-delete via status for now
  await updateSubmissionStatus(id, 'resolved')
}

export async function addReply(id: string | number, message: string, sentBy: string) {
  await fetch('/api/contact/reply', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, message, sentBy }),
  })
}
