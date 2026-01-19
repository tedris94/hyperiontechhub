'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ClientDashboard } from '@/components/dashboards/ClientDashboard';
import { StudentDashboard } from '@/components/dashboards/StudentDashboard';
import { InstructorDashboard } from '@/components/dashboards/InstructorDashboard';
import { ConsultantDashboard } from '@/components/dashboards/ConsultantDashboard';
import { AdminDashboard } from '@/components/dashboards/AdminDashboard';
import { SuperAdminDashboard } from '@/components/dashboards/SuperAdminDashboard';
import { SubscriberDashboard } from '@/components/dashboards/SubscriberDashboard';

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check authentication status
    if (isAuthenticated && user) {
      // User is authenticated, allow access
      setIsChecking(false);
    } else if (!isAuthenticated && pathname !== '/login') {
      // User is not authenticated, redirect to login
      // Use replace instead of push to avoid adding to history stack
      router.replace('/login');
    }
  }, [isAuthenticated, user, router, pathname]);

  // Show loading while checking authentication or if user is not loaded yet
  if (isChecking || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A2BC2] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  switch (user.role) {
    case 'super_admin':
      return <SuperAdminDashboard />;
    case 'admin':
      return <AdminDashboard />;
    case 'student':
      return <StudentDashboard />;
    case 'instructor':
      return <InstructorDashboard />;
    case 'consultant':
      return <ConsultantDashboard />;
    case 'client':
      return <ClientDashboard />;
    case 'subscriber':
      return <SubscriberDashboard />;
    default:
      return <ClientDashboard />;
  }
}

