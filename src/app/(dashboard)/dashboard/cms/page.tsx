'use client'

import { CMSView } from '@/components/dashboard/CMSView'
import { DashboardPageGuard } from '@/components/dashboard/DashboardPageGuard'

export default function CmsOverviewPage() {
  return (
    <DashboardPageGuard capability="cms.view">
      <CMSView />
    </DashboardPageGuard>
  )
}
