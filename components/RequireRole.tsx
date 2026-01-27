'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import RequireAuth from '@/components/RequireAuth';
import { useAuth, type UserRole } from '@/contexts/AuthContext';

interface RequireRoleProps {
  allowedRoles: UserRole[];
  children: ReactNode;
  message?: string;
}

export default function RequireRole({
  allowedRoles,
  children,
  message,
}: RequireRoleProps) {
  const { user } = useAuth();
  const deniedMessage =
    message || 'Access denied. You do not have permission to view this page.';

  return (
    <RequireAuth message="Please sign in to access admin tools.">
      {user && !allowedRoles.includes(user.role) ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md bg-white border border-gray-200 rounded-lg shadow p-6 text-center">
            <h1 className="text-2xl text-[#1B1C1E] mb-3">Access Denied</h1>
            <p className="text-gray-600">{deniedMessage}</p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-[#1A2BC2] text-white hover:bg-[#0D0D52]"
              >
                Go to Dashboard
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      ) : (
        children
      )}
    </RequireAuth>
  );
}
