'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { User } from '@/payload-types'
import { hasAnyCapability, hasCapability } from '@/lib/capabilities'

export type UserRole =
  | 'super_admin'
  | 'admin'
  | 'subscriber'
  | 'student'
  | 'consultant'
  | 'instructor'
  | 'client'
  | 'tenant_member'

export const DEMO_USERS = [
  { email: 'superadmin@hyperiontechhub.com', password: 'demo1234', name: 'Super Admin', role: 'super_admin' as UserRole },
  { email: 'admin@hyperiontechhub.com', password: 'demo1234', name: 'Admin User', role: 'admin' as UserRole },
  { email: 'consultant@hyperiontechhub.com', password: 'demo1234', name: 'Consultant', role: 'consultant' as UserRole },
  { email: 'student@hyperiontechhub.com', password: 'demo1234', name: 'Student', role: 'student' as UserRole },
]

type AuthContextType = {
  user: User | null
  capabilities: string[]
  roleName: string | null
  loading: boolean
  refresh: () => Promise<void>
  signOut: (returnTo?: string) => Promise<void>
  logout: (returnTo?: string) => void
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string, role: UserRole) => Promise<void>
  isAuthenticated: boolean
  demoUsers: typeof DEMO_USERS
  hasCap: (capability: string) => boolean
  hasAnyCap: (capabilityList: string[]) => boolean
  impersonating: boolean
  impersonator: { id: string | number; email: string; fullName?: string | null; role?: string | null } | null
  stopImpersonating: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [capabilities, setCapabilities] = useState<string[]>([])
  const [roleName, setRoleName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [impersonating, setImpersonating] = useState(false)
  const [impersonator, setImpersonator] = useState<AuthContextType['impersonator']>(null)

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/dashboard/session', { credentials: 'include' })
      if (res.ok) {
        const data = (await res.json()) as {
          user?: User | null
          capabilities?: string[]
          roleName?: string | null
          impersonating?: boolean
          impersonator?: AuthContextType['impersonator']
        }
        setUser(data.user ?? null)
        setCapabilities(data.capabilities ?? [])
        setRoleName(data.roleName ?? null)
        setImpersonating(Boolean(data.impersonating))
        setImpersonator(data.impersonator ?? null)
      } else {
        setUser(null)
        setCapabilities([])
        setRoleName(null)
        setImpersonating(false)
        setImpersonator(null)
      }
    } catch {
      setUser(null)
      setCapabilities([])
      setRoleName(null)
      setImpersonating(false)
      setImpersonator(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.errors?.[0]?.message || 'Invalid credentials')
      }
      await refresh()
    },
    [refresh],
  )

  const register = useCallback(
    async (email: string, password: string, name: string, role: UserRole) => {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, fullName: name, role }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.errors?.[0]?.message || 'Registration failed')
      }
      await login(email, password)
    },
    [login],
  )

  const signOut = useCallback(async (returnTo?: string) => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    } catch {
      // continue
    }
    setUser(null)
    setCapabilities([])
    setRoleName(null)
    setImpersonating(false)
    setImpersonator(null)
    const params = new URLSearchParams({ signedOut: '1' })
    if (returnTo && returnTo.startsWith('/') && !returnTo.startsWith('//')) {
      params.set('returnTo', returnTo)
    }
    window.location.assign(`/login?${params.toString()}`)
  }, [])

  const stopImpersonating = useCallback(async () => {
    const res = await fetch('/api/auth/stop-impersonating', {
      method: 'POST',
      credentials: 'include',
    })
    const data = (await res.json().catch(() => ({}))) as { error?: string; path?: string }
    if (!res.ok) throw new Error(data.error || 'Could not stop impersonating')
    window.location.assign(data.path || '/dashboard/users')
  }, [])

  const logout = useCallback(
    (returnTo?: string) => {
      void signOut(returnTo)
    },
    [signOut],
  )

  const hasCap = useCallback(
    (capability: string) => hasCapability(capabilities, capability),
    [capabilities],
  )

  const hasAnyCap = useCallback(
    (capabilityList: string[]) => hasAnyCapability(capabilities, capabilityList),
    [capabilities],
  )

  const value = useMemo(
    () => ({
      user,
      capabilities,
      roleName,
      loading,
      refresh,
      signOut,
      logout,
      login,
      register,
      isAuthenticated: !!user,
      demoUsers: DEMO_USERS,
      hasCap,
      hasAnyCap,
      impersonating,
      impersonator,
      stopImpersonating,
    }),
    [
      user,
      capabilities,
      roleName,
      loading,
      refresh,
      signOut,
      logout,
      login,
      register,
      hasCap,
      hasAnyCap,
      impersonating,
      impersonator,
      stopImpersonating,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function useProfile() {
  const { user } = useAuth()
  if (!user) return null
  return {
    id: String(user.id),
    email: user.email,
    full_name: user.fullName,
    name: user.fullName,
    role: user.role,
  }
}
