'use client';

import RequireRole from '@/components/RequireRole';
import { DashboardLayout } from '@/components/DashboardLayout';

export default function ContentManagementPage() {
  return (
    <RequireRole allowedRoles={['admin', 'super_admin']} message="Access denied. Admin roles only.">
      <DashboardLayout title="Content Management">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-[#1B1C1E]">Content Management</h1>
          <p className="text-gray-600">
            This section is not configured yet. We can connect it to the CMS workflows you need.
          </p>
        </div>
      </DashboardLayout>
    </RequireRole>
  );
}
