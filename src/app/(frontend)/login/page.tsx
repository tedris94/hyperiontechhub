'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Mail, Eye, EyeOff, Users, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'

function normalizeReturnTo(value: string | null | undefined, fallback = '/dashboard'): string {
  const raw = typeof value === 'string' ? value.trim() : ''
  if (!raw) return fallback

  const target = raw.startsWith('/') ? raw : `/${raw}`
  const pathOnly = target.split('?')[0]

  if (target.startsWith('//') || target.includes('://') || pathOnly === '/login') {
    return fallback
  }

  return target
}

async function resolveDestination(returnTo: string): Promise<string> {
  const safeReturnTo = normalizeReturnTo(returnTo)

  try {
    const res = await fetch(
      `/api/auth/post-login-redirect?returnTo=${encodeURIComponent(safeReturnTo)}`,
      { credentials: 'include' },
    )
    if (!res.ok) return safeReturnTo
    const data = (await res.json()) as { path?: string }
    return data.path || safeReturnTo
  } catch {
    return safeReturnTo
  }
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showDemoUsers, setShowDemoUsers] = useState(false)
  const [showDemoAccounts, setShowDemoAccounts] = useState(false)
  const [demoFlagLoaded, setDemoFlagLoaded] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { login, demoUsers, isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()
  const [redirectMessage, setRedirectMessage] = useState('')
  const [returnTo, setReturnTo] = useState('/dashboard')

  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    setRedirectMessage(params.get('message') || '')
    setReturnTo(normalizeReturnTo(params.get('returnTo'), '/dashboard'))
  }, [])

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const res = await fetch('/api/public/site-flags', { cache: 'no-store' })
        if (!res.ok) throw new Error('flags unavailable')
        const data = (await res.json()) as { showDemoAccounts?: boolean }
        if (!cancelled) setShowDemoAccounts(data.showDemoAccounts !== false)
      } catch {
        // Keep hidden until we know the flag; safer for production if the flags API fails.
        if (!cancelled) setShowDemoAccounts(false)
      } finally {
        if (!cancelled) setDemoFlagLoaded(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    // Already signed-in visitors only (form submit navigates itself).
    if (authLoading || !isAuthenticated || loading) return
    let cancelled = false
    void (async () => {
      const path = await resolveDestination(returnTo)
      if (!cancelled) router.replace(path)
    })()
    return () => {
      cancelled = true
    }
  }, [authLoading, isAuthenticated, loading, returnTo, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      const path = await resolveDestination(returnTo)
      router.push(path)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login')
      setLoading(false)
    }
  }

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setError('')
    setLoading(true)

    try {
      await login(demoEmail, demoPassword)
      const path = await resolveDestination(returnTo)
      router.push(path)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login')
      setLoading(false)
    }
  }

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      super_admin: 'bg-purple-500',
      admin: 'bg-blue-500',
      student: 'bg-green-500',
      instructor: 'bg-orange-500',
      consultant: 'bg-cyan-500',
      client: 'bg-pink-500',
      subscriber: 'bg-gray-500',
    }
    return colors[role] || 'bg-gray-500'
  }

  const getRoleLabel = (role: string) => {
    return role.split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1A2BC2]/5 via-white to-[#0D0D52]/5 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-[#1A2BC2] rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">
            Sign in to your Hyperion Tech Hub account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {!error && redirectMessage && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{redirectMessage}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#1A2BC2] hover:bg-[#0D0D52]"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </div>

            {demoFlagLoaded && showDemoAccounts && (
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Demo Accounts
                  </Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDemoUsers(!showDemoUsers)}
                  >
                    {showDemoUsers ? 'Hide' : 'Show'}
                  </Button>
                </div>

                {showDemoUsers && (
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {demoUsers.map((demo, index) => (
                      <div key={index}>
                        {demo.group && (index === 0 || demoUsers[index - 1]?.group !== demo.group) ? (
                          <p className="pb-2 pt-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                            {demo.group} accounts
                          </p>
                        ) : null}
                        <Card className="p-3 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm">{demo.name}</span>
                                <Badge className={`${getRoleBadgeColor(demo.role)} text-white text-xs`}>
                                  {getRoleLabel(demo.role)}
                                </Badge>
                              </div>
                              <div className="text-xs text-gray-500">{demo.email}</div>
                              <div className="text-xs text-gray-400">Password: {demo.password}</div>
                            </div>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => handleDemoLogin(demo.email, demo.password)}
                              disabled={loading}
                              className="ml-2"
                            >
                              Login
                            </Button>
                          </div>
                        </Card>
                      </div>
                    ))}
                  </div>
                )}

                {!showDemoUsers && (
                  <div className="text-sm text-gray-500 text-center py-4">
                    Click &quot;Show&quot; to see demo accounts
                  </div>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-gray-600">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-[#1A2BC2] hover:underline">
                Register here
              </Link>
            </div>

            <div className="text-sm text-center text-gray-600">
              <Link href="/" className="text-[#1A2BC2] hover:underline">
                Back to Home
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
