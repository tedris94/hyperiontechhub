export function getStoredUsersCount(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const stored = localStorage.getItem('hyperion_users');
    const users = stored ? JSON.parse(stored) : [];
    return Array.isArray(users) ? users.length : 0;
  } catch (error) {
    console.error('Error reading users:', error);
    return 0;
  }
}

export function getActiveSessionCount(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const stored = localStorage.getItem('hyperion_active_sessions');
    const sessions = stored ? JSON.parse(stored) : [];
    return Array.isArray(sessions) ? sessions.length : 0;
  } catch (error) {
    console.error('Error reading active sessions:', error);
    return 0;
  }
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
