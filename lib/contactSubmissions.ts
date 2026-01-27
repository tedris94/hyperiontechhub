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

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  const response = await fetch('/api/admin/contact-submissions');
  if (!response.ok) {
    console.error('Failed to fetch contact submissions');
    return [];
  }
  const data = await response.json();
  return data.submissions || [];
}

export async function markAsRead(id: string): Promise<void> {
  await fetch('/api/admin/contact-submissions', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, updates: { read: true, status: 'read' } }),
  });
}

export async function updateSubmissionStatus(
  id: string,
  status: ContactSubmission['status']
): Promise<void> {
  await fetch('/api/admin/contact-submissions', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, updates: { status } }),
  });
}

export async function deleteSubmission(id: string): Promise<void> {
  await fetch('/api/admin/contact-submissions', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });
}

export async function addReply(
  id: string,
  reply: Reply,
  existingReplies: Reply[] = []
): Promise<void> {
  const replies = [...existingReplies, reply];
  await fetch('/api/admin/contact-submissions', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, updates: { replies, status: 'replied' } }),
  });
}

