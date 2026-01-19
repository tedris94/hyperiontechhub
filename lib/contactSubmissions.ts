// Utility functions for managing contact form submissions

export interface Reply {
  id: string;
  message: string;
  sentAt: string;
  sentBy: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  createdAt: string;
  read: boolean;
  replies?: Reply[];
}

export function getContactSubmissions(): ContactSubmission[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem('hyperion_contact_submissions');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading contact submissions:', error);
    return [];
  }
}

export function getUnreadCount(): number {
  const submissions = getContactSubmissions();
  return submissions.filter((s) => !s.read).length;
}

export function markAsRead(id: string): void {
  if (typeof window === 'undefined') return;
  
  const submissions = getContactSubmissions();
  const updated = submissions.map((s) =>
    s.id === id ? { ...s, read: true, status: 'read' as const } : s
  );
  localStorage.setItem('hyperion_contact_submissions', JSON.stringify(updated));
}

export function updateSubmissionStatus(
  id: string,
  status: ContactSubmission['status']
): void {
  if (typeof window === 'undefined') return;
  
  const submissions = getContactSubmissions();
  const updated = submissions.map((s) =>
    s.id === id ? { ...s, status } : s
  );
  localStorage.setItem('hyperion_contact_submissions', JSON.stringify(updated));
}

export function deleteSubmission(id: string): void {
  if (typeof window === 'undefined') return;
  
  const submissions = getContactSubmissions();
  const updated = submissions.filter((s) => s.id !== id);
  localStorage.setItem('hyperion_contact_submissions', JSON.stringify(updated));
}

export function addReply(id: string, reply: Reply): void {
  if (typeof window === 'undefined') return;
  
  const submissions = getContactSubmissions();
  const updated = submissions.map((s) => {
    if (s.id === id) {
      const replies = s.replies || [];
      return {
        ...s,
        replies: [...replies, reply],
        status: 'replied' as const,
      };
    }
    return s;
  });
  localStorage.setItem('hyperion_contact_submissions', JSON.stringify(updated));
}

