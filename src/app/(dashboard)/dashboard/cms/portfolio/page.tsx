'use client'

import { PortfolioAdminView } from '@/components/dashboard/PortfolioAdminView'
import { DashboardPageGuard } from '@/components/dashboard/DashboardPageGuard'

export default function PortfolioCmsPage() {
  return (
    <DashboardPageGuard capability="cms.portfolio.manage">
      <PortfolioAdminView />
    </DashboardPageGuard>
  )
}
