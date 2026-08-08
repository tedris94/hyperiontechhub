'use client';

import RequireAuth from '@/components/RequireAuth';
import { DashboardLayout } from '@/components/DashboardLayout';

export default function DashboardProfilePage() {
  return (
    <RequireAuth message="Please sign in to access your profile.">
      <DashboardLayout title="Profile Settings">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-[#1B1C1E]">Profile Settings</h1>
          <p className="text-gray-600">
            This section is not configured yet. We can add profile updates and security settings here.
          </p>
        </div>
      </DashboardLayout>
    </RequireAuth>
  );
}
