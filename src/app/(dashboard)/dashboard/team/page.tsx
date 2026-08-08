'use client'

import { TeamView } from '@/components/dashboard/TeamView'
import { DashboardPageGuard } from '@/components/dashboard/DashboardPageGuard'
import { useAuth } from '@/contexts/AuthContext'

export default function TeamPage() {
  const { user } = useAuth()

  return (
    <DashboardPageGuard capability="team.view">
      <TeamView role={user?.role ?? 'user'} />
    </DashboardPageGuard>
  )
}
