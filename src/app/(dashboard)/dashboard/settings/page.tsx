'use client'

import { SiteSettingsView } from '@/components/dashboard/SiteSettingsView'
import { DashboardPageGuard } from '@/components/dashboard/DashboardPageGuard'
import RequireAuth from '@/components/RequireAuth'
import { useAuth } from '@/contexts/AuthContext'

export default function DashboardSettingsPage() {
  const { user } = useAuth()

  return (
    <RequireAuth message="Please sign in to access dashboard settings.">
      <DashboardPageGuard capability="settings.manage">
        <SiteSettingsView role={user?.role ?? 'user'} />
      </DashboardPageGuard>
    </RequireAuth>
  )
}
