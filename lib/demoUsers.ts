import type { UserRole } from '@/contexts/AuthContext';

export interface DemoUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export const DEMO_USERS: DemoUser[] = [
  { id: '1', email: 'superadmin@hyperion.tech', password: 'demo123', name: 'Alex Morgan', role: 'super_admin' },
  { id: '2', email: 'admin@hyperion.tech', password: 'demo123', name: 'Sarah Johnson', role: 'admin' },
  { id: '3', email: 'student@hyperion.tech', password: 'demo123', name: 'Michael Chen', role: 'student' },
  { id: '4', email: 'instructor@hyperion.tech', password: 'demo123', name: 'Dr. Emily Parker', role: 'instructor' },
  { id: '5', email: 'consultant@hyperion.tech', password: 'demo123', name: 'David Williams', role: 'consultant' },
  { id: '6', email: 'client@hyperion.tech', password: 'demo123', name: 'Jessica Martinez', role: 'client' },
  { id: '7', email: 'subscriber@hyperion.tech', password: 'demo123', name: 'Robert Taylor', role: 'subscriber' },
];
