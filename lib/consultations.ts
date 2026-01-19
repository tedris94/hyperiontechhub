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

const STORAGE_KEY = 'hyperion_consultations';

export function getConsultations(): Consultation[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading consultations:', error);
    return [];
  }
}

export function saveConsultations(consultations: Consultation[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(consultations));
}

export function addConsultation(newConsultation: Consultation): void {
  if (typeof window === 'undefined') return;
  const consultations = getConsultations();
  consultations.push(newConsultation);
  saveConsultations(consultations);
}

export function getUnreadConsultationsCount(): number {
  const consultations = getConsultations();
  return consultations.filter((c) => !c.read).length;
}

export function getPendingConsultationsCount(): number {
  const consultations = getConsultations();
  return consultations.filter((c) => c.status === 'pending').length;
}

export function markAsRead(id: string): void {
  if (typeof window === 'undefined') return;
  
  const consultations = getConsultations();
  const updated = consultations.map((c) =>
    c.id === id ? { ...c, read: true } : c
  );
  saveConsultations(updated);
}

export function updateConsultationStatus(
  id: string,
  status: Consultation['status']
): void {
  if (typeof window === 'undefined') return;
  
  const consultations = getConsultations();
  const updated = consultations.map((c) =>
    c.id === id ? { ...c, status } : c
  );
  saveConsultations(updated);
}

export function assignConsultation(
  id: string,
  consultantId: string,
  consultantName: string
): void {
  if (typeof window === 'undefined') return;
  
  const consultations = getConsultations();
  const updated = consultations.map((c) =>
    c.id === id
      ? {
          ...c,
          assignedTo: consultantId,
          assignedToName: consultantName,
          status: 'assigned' as const,
        }
      : c
  );
  saveConsultations(updated);
}

export function updateConsultation(
  id: string,
  updates: Partial<Consultation>
): void {
  if (typeof window === 'undefined') return;
  
  const consultations = getConsultations();
  const updated = consultations.map((c) =>
    c.id === id ? { ...c, ...updates } : c
  );
  saveConsultations(updated);
}

export function deleteConsultation(id: string): void {
  if (typeof window === 'undefined') return;
  
  const consultations = getConsultations();
  const updated = consultations.filter((c) => c.id !== id);
  saveConsultations(updated);
}

export function getConsultationsByConsultant(consultantId: string): Consultation[] {
  const consultations = getConsultations();
  return consultations.filter((c) => c.assignedTo === consultantId);
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

