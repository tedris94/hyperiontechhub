export async function getStoredUsersCount(): Promise<number> {
  const response = await fetch('/api/admin/users/count');
  if (!response.ok) {
    return 0;
  }
  const data = await response.json();
  return data.count || 0;
}

export async function getActiveSessionCount(): Promise<number> {
  const response = await fetch('/api/admin/sessions/count');
  if (!response.ok) {
    return 0;
  }
  const data = await response.json();
  return data.count || 0;
}

export function getStoredRevenueTotal(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const stored = localStorage.getItem('hyperion_revenue_total');
    const parsed = stored ? Number(stored) : 0;
    return Number.isFinite(parsed) ? parsed : 0;
  } catch (error) {
    console.error('Error reading revenue:', error);
    return 0;
  }
}
