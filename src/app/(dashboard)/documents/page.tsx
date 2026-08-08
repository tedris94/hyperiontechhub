'use client';

import RequireRole from '@/components/RequireRole';
import { DashboardLayout } from '@/components/DashboardLayout';

export default function DocumentsPage() {
  return (
    <RequireRole allowedRoles={['admin', 'super_admin']} message="Access denied. Admin roles only.">
      <DashboardLayout title="Documents">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-[#1B1C1E]">Documents</h1>
          <p className="text-gray-600">
            This section is not configured yet. We can add document storage and approvals here.
          </p>
        </div>
      </DashboardLayout>
    </RequireRole>
  );
}
