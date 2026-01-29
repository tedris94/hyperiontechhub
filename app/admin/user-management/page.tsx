'use client';

import RequireRole from '@/components/RequireRole';
import { DashboardLayout } from '@/components/DashboardLayout';

export default function UserManagementPage() {
  return (
    <RequireRole allowedRoles={['admin', 'super_admin']} message="Access denied. Admin roles only.">
      <DashboardLayout title="User Management">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-[#1B1C1E]">User Management</h1>
          <p className="text-gray-600">
            This section is not configured yet. We can wire user CRUD to Supabase when you're ready.
          </p>
        </div>
      </DashboardLayout>
    </RequireRole>
  );
}
