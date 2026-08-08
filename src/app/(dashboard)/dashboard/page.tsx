'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ClientDashboard } from '@/components/dashboards/ClientDashboard';
import { StudentDashboard } from '@/components/dashboards/StudentDashboard';
import { InstructorDashboard } from '@/components/dashboards/InstructorDashboard';
import { ConsultantDashboard } from '@/components/dashboards/ConsultantDashboard';
import { AdminDashboard } from '@/components/dashboards/AdminDashboard';
import { SuperAdminDashboard } from '@/components/dashboards/SuperAdminDashboard';
import { SubscriberDashboard } from '@/components/dashboards/SubscriberDashboard';
import RequireAuth from '@/components/RequireAuth';
import { hasCapability } from '@/lib/capabilities';

export default function DashboardPage() {
  const { user, isAuthenticated, capabilities, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading || !user) return
    // Tenant-only staff: no Hyperion dashboard — send to ICMS hub / post-login resolver
    if (user.role === 'tenant_member' || !hasCapability(capabilities, 'dashboard.home')) {
      void (async () => {
        try {
          const res = await fetch('/api/auth/post-login-redirect?returnTo=/dashboard', {
            credentials: 'include',
          })
          const data = await res.json()
          router.replace(data.path && data.path !== '/dashboard' ? data.path : '/icms')
        } catch {
          router.replace('/icms')
        }
      })()
    }
  }, [loading, user, capabilities, router])

  if (user?.role === 'tenant_member' || (user && !hasCapability(capabilities, 'dashboard.home'))) {
    return (
      <RequireAuth message="Please sign in to access your dashboard.">
        <p className="p-8 text-sm text-gray-600">Redirecting to your tenant workspace…</p>
      </RequireAuth>
    )
  }

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
