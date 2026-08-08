'use client'

import { MediaLibraryView } from '@/components/dashboard/MediaLibraryView'
import { DashboardPageGuard } from '@/components/dashboard/DashboardPageGuard'
import { useAuth } from '@/contexts/AuthContext'

export default function CmsMediaPage() {
  const { user } = useAuth()

  return (
    <DashboardPageGuard capability="cms.media.manage">
      <MediaLibraryView role={user?.role ?? 'user'} />
    </DashboardPageGuard>
  )
}
