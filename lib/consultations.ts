// Utility functions for managing consultation requests

export interface Consultation {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  service: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
  status: 'pending' | 'assigned' | 'scheduled' | 'completed' | 'cancelled';
  createdAt: string;
  read: boolean;
  assignedTo?: string; // Consultant user ID
  assignedToName?: string; // Consultant name
  googleMeetLink?: string;
  scheduledDateTime?: string;
  notes?: string;
}

export async function getConsultations(): Promise<Consultation[]> {
  const response = await fetch('/api/admin/consultations');
  if (!response.ok) {
    console.error('Failed to fetch consultations');
    return [];
  }
  const data = await response.json();
  return data.consultations || [];
}

export async function markAsRead(id: string): Promise<void> {
  await fetch('/api/admin/consultations', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, updates: { read: true } }),
  });
}

export async function updateConsultationStatus(
  id: string,
  status: Consultation['status']
): Promise<void> {
  await fetch('/api/admin/consultations', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, updates: { status } }),
  });
}

export async function assignConsultation(
  id: string,
  consultantId: string,
  consultantName: string
): Promise<void> {
  await fetch('/api/admin/consultations', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id,
      updates: {
        assigned_to: consultantId,
        assigned_to_name: consultantName,
        status: 'assigned',
      },
    }),
  });
}

export async function updateConsultation(
  id: string,
  updates: Partial<Consultation>
): Promise<void> {
  const mappedUpdates: Record<string, unknown> = { ...updates };
  if (updates.assignedTo !== undefined) mappedUpdates.assigned_to = updates.assignedTo;
  if (updates.assignedToName !== undefined) mappedUpdates.assigned_to_name = updates.assignedToName;
  if (updates.googleMeetLink !== undefined) mappedUpdates.google_meet_link = updates.googleMeetLink;
  if (updates.preferredDate !== undefined) mappedUpdates.preferred_date = updates.preferredDate;
  if (updates.preferredTime !== undefined) mappedUpdates.preferred_time = updates.preferredTime;
  delete mappedUpdates.assignedTo;
  delete mappedUpdates.assignedToName;
  delete mappedUpdates.googleMeetLink;
  delete mappedUpdates.preferredDate;
  delete mappedUpdates.preferredTime;

  await fetch('/api/admin/consultations', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, updates: mappedUpdates }),
  });
}

export async function deleteConsultation(id: string): Promise<void> {
  await fetch('/api/admin/consultations', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });
}

// Generate Google Meet link
export function generateGoogleMeetLink(consultationId: string, title: string): string {
  // For now, we'll generate a simple Google Meet link
  // In production, you'd use Google Calendar API to create actual meetings
  const baseUrl = 'https://meet.google.com';
  // Generate a random meeting code (in production, use Google Calendar API)
  const meetingCode = Math.random().toString(36).substring(2, 15);
  return `${baseUrl}/${meetingCode}`;
}

