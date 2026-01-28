'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface RequireAuthProps {
  children: ReactNode;
  message?: string;
}

export default function RequireAuth({ children, message }: RequireAuthProps) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
      const search = typeof window !== 'undefined' ? window.location.search : '';
      const returnTo = `${pathname}${search || ''}`;
      const redirectMessage = message || 'Please sign in to access this page.';
      const loginUrl = `/login?returnTo=${encodeURIComponent(returnTo)}&message=${encodeURIComponent(redirectMessage)}`;
      router.replace(loginUrl);
    }
  }, [isAuthenticated, user, router, message]);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A2BC2] mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
