export type Consultation = {
  id: string | number
  name: string
  email: string
  phone: string
  company?: string | null
  service: string
  preferredDate: string
  preferredTime: string
  message: string
  status: string
  read: boolean
  assignedTo?: string | number | null
  assignedToName?: string | null
  googleMeetLink?: string | null
  notes?: string | null
  createdAt: string
}

export async function getConsultations(): Promise<Consultation[]> {
  const res = await fetch('/api/admin/consultations', { credentials: 'include' })
  if (!res.ok) return []
  const data = await res.json()
  return (data.docs || []).map(mapConsultation)
}

export async function getConsultationsByConsultant(userId: string | number): Promise<Consultation[]> {
  const all = await getConsultations()
  return all.filter((c) => String(c.assignedTo) === String(userId))
}

function mapConsultation(doc: Record<string, unknown>): Consultation {
  const assigned = doc.assignedTo as Record<string, unknown> | string | number | null
  return {
    id: doc.id as string | number,
    name: doc.name as string,
    email: doc.email as string,
    phone: doc.phone as string,
    company: doc.company as string | undefined,
    service: doc.service as string,
    preferredDate: doc.preferredDate as string,
    preferredTime: doc.preferredTime as string,
    message: doc.message as string,
    status: (doc.status as string) || 'pending',
    read: Boolean(doc.read),
    assignedTo:
      typeof assigned === 'object' && assigned && assigned.id != null
        ? (assigned.id as string | number)
        : (assigned as string | number | null | undefined) ?? null,
    assignedToName: (doc.assignedToName as string) || (typeof assigned === 'object' && assigned ? (assigned.fullName as string) : null),
    googleMeetLink: doc.googleMeetLink as string | undefined,
    notes: doc.notes as string | undefined,
    createdAt: (doc.createdAt as string) || new Date().toISOString(),
  }
}

export async function markAsRead(id: string | number) {
  await fetch('/api/admin/consultations', {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, read: true }),
  })
}

export async function updateConsultationStatus(id: string | number, status: string) {
  await fetch('/api/admin/consultations', {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, status }),
  })
}

export async function assignConsultation(id: string | number, userId: string | number, userName: string) {
  await fetch('/api/admin/consultations', {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, assignedTo: userId, assignedToName: userName, status: 'confirmed' }),
  })
}

export async function generateGoogleMeetLink(id: string | number) {
  const link = `https://meet.google.com/${Math.random().toString(36).slice(2, 6)}-${Math.random().toString(36).slice(2, 6)}-${Math.random().toString(36).slice(2, 6)}`
  await fetch('/api/admin/consultations', {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, googleMeetLink: link }),
  })
  return link
}

export async function updateConsultation(id: string | number, data: Partial<Consultation>) {
  await fetch('/api/admin/consultations', {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...data }),
  })
}

export async function deleteConsultation(id: string | number) {
  await updateConsultationStatus(id, 'cancelled')
}
