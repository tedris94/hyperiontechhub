export async function getStoredUsersCount(): Promise<number> {
  try {
    const res = await fetch('/api/dashboard/stats', { credentials: 'include' })
    if (!res.ok) return 0
    const data = await res.json()
    return data.usersCount ?? 0
  } catch {
    return 0
  }
}

export async function getActiveSessionCount(): Promise<number> {
  try {
    const res = await fetch('/api/dashboard/stats', { credentials: 'include' })
    if (!res.ok) return 0
    const data = await res.json()
    return data.activeSessions ?? 0
  } catch {
    return 0
  }
}

export async function getStoredRevenueTotal(): Promise<number> {
  try {
    const res = await fetch('/api/dashboard/stats', { credentials: 'include' })
    if (!res.ok) return 0
    const data = await res.json()
    return data.revenueTotal ?? 0
  } catch {
    return 0
  }
}

export async function getAnalyticsSummary(): Promise<{
  totalViews: number
  last24hViews: number
  last24hVisitors: number
}> {
  try {
    const res = await fetch('/api/dashboard/analytics', { credentials: 'include' })
    if (!res.ok) return { totalViews: 0, last24hViews: 0, last24hVisitors: 0 }
    return await res.json()
  } catch {
    return { totalViews: 0, last24hViews: 0, last24hVisitors: 0 }
  }
}
