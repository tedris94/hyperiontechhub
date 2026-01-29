'use client';

import RequireAuth from '@/components/RequireAuth';
import { DashboardLayout } from '@/components/DashboardLayout';

export default function DashboardSettingsPage() {
  return (
    <RequireAuth message="Please sign in to access dashboard settings.">
      <DashboardLayout title="Dashboard Settings">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-[#1B1C1E]">Dashboard Settings</h1>
          <p className="text-gray-600">
            This section is not configured yet. We can add preferences and notifications here.
          </p>
        </div>
      </DashboardLayout>
    </RequireAuth>
  );
}
