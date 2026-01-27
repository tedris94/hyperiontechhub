'use client';

import { useAuth } from '@/contexts/AuthContext';
import { ClientDashboard } from '@/components/dashboards/ClientDashboard';
import { StudentDashboard } from '@/components/dashboards/StudentDashboard';
import { InstructorDashboard } from '@/components/dashboards/InstructorDashboard';
import { ConsultantDashboard } from '@/components/dashboards/ConsultantDashboard';
import { AdminDashboard } from '@/components/dashboards/AdminDashboard';
import { SuperAdminDashboard } from '@/components/dashboards/SuperAdminDashboard';
import { SubscriberDashboard } from '@/components/dashboards/SubscriberDashboard';
import RequireAuth from '@/components/RequireAuth';

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  return (
    <RequireAuth message="Please sign in to access your dashboard.">
      {user?.role === 'super_admin' && <SuperAdminDashboard />}
      {user?.role === 'admin' && <AdminDashboard />}
      {user?.role === 'student' && <StudentDashboard />}
      {user?.role === 'instructor' && <InstructorDashboard />}
      {user?.role === 'consultant' && <ConsultantDashboard />}
      {user?.role === 'client' && <ClientDashboard />}
      {user?.role === 'subscriber' && <SubscriberDashboard />}
      {!user && isAuthenticated === false && null}
      {user && !user.role && <ClientDashboard />}
    </RequireAuth>
  );
}

