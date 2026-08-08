'use client'

import { Fragment, useCallback, useEffect, useState } from 'react'
import { DashboardLayout } from './DashboardLayout'
import { Shield, RefreshCw, ChevronDown, ChevronRight } from 'lucide-react'

interface AuditLogViewProps {
  role: string
}

type AuditLog = {
  id: number | string
  action: 'create' | 'update' | 'delete' | 'login' | 'logout'
  collectionSlug?: string | null
  documentId?: string | null
  title?: string | null
  userEmail?: string | null
  userRole?: string | null
  ip?: string | null
  userAgent?: string | null
  changes?: unknown
  createdAt: string
}

type ApiResponse = {
  docs: AuditLog[]
  totalDocs: number
  totalPages: number
  page: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

const ACTION_STYLES: Record<string, string> = {
  create: 'bg-green-50 text-green-700',
  update: 'bg-blue-50 text-blue-700',
  delete: 'bg-red-50 text-red-700',
  login: 'bg-purple-50 text-purple-700',
  logout: 'bg-gray-100 text-gray-700',
}

const COLLECTION_OPTIONS = [
  'users',
  'dashboard-roles',
  'media',
  'pages',
  'services',
  'team-members',
  'jobs',
  'applications',
  'consultations',
  'contact-submissions',
  'courses',
  'enrollments',
  'orders',
  'icms-tenants',
  'icms-memberships',
  'icms-pages',
  'icms-articles',
  'icms-events',
  'icms-leaders',
  'icms-waqf-projects',
  'icms-facilities',
  'icms-donate-funds',
  'icms-donations',
  'icms-contact-messages',
  'icms-islamiyyah-classes',
  'icms-islamiyyah-students',
]

function actionLabel(log: AuditLog): string {
  const changes = log.changes as { type?: string } | null
  if (changes?.type === 'impersonate_start') return 'impersonate'
  if (changes?.type === 'impersonate_stop') return 'stop impersonate'
  if (changes?.type === 'register_user') return 'register user'
  return log.action
}

export function AuditLogView({ role }: AuditLogViewProps) {
  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [action, setAction] = useState('')
  const [collection, setCollection] = useState('')
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const [expanded, setExpanded] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (action) params.set('action', action)
      if (collection) params.set('collection', collection)
      if (q) params.set('q', q)
      params.set('page', String(page))
      params.set('limit', '25')
      const res = await fetch(`/api/dashboard/audit?${params.toString()}`, {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to load audit logs')
      setData((await res.json()) as ApiResponse)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load audit logs')
    } finally {
      setLoading(false)
    }
  }, [action, collection, q, page])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    setPage(1)
  }, [action, collection, q])

  return (
    <DashboardLayout title="Audit Trail" role={role}>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100">
            <Shield className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl text-[#1a1f71]">Audit Trail</h2>
            <p className="text-gray-600">
              Full activity log for Super Admin and Admin — CMS, LMS, ICMS, logins, and
              impersonation.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-3 rounded-2xl bg-white p-4 shadow-lg">
          <div>
            <label className="mb-1 block text-xs text-gray-500">Action</label>
            <select
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="rounded-lg border-2 border-gray-200 px-3 py-2 text-sm focus:border-[#2563eb] focus:outline-none"
            >
              <option value="">All actions</option>
              <option value="create">Create</option>
              <option value="update">Update</option>
              <option value="delete">Delete</option>
              <option value="login">Login / impersonate</option>
              <option value="logout">Logout / stop impersonate</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-500">Collection</label>
            <select
              value={collection}
              onChange={(e) => setCollection(e.target.value)}
              className="rounded-lg border-2 border-gray-200 px-3 py-2 text-sm focus:border-[#2563eb] focus:outline-none"
            >
              <option value="">All collections</option>
              {COLLECTION_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-[200px] flex-1">
            <label className="mb-1 block text-xs text-gray-500">
              Search (email, title, doc id, role)
            </label>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="e.g. admin@… or Impersonate"
              className="w-full rounded-lg border-2 border-gray-200 px-3 py-2 text-sm focus:border-[#2563eb] focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={() => void load()}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#1a1f71] to-[#2563eb] px-4 py-2 text-sm text-white transition-all hover:shadow-lg"
          >
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
        </div>

        {error ? (
          <div className="rounded-xl border-2 border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        ) : null}

        <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="w-8 px-4 py-3 text-left text-sm text-gray-600" />
                  <th className="px-4 py-3 text-left text-sm text-gray-600">When</th>
                  <th className="px-4 py-3 text-left text-sm text-gray-600">Action</th>
                  <th className="px-4 py-3 text-left text-sm text-gray-600">Collection</th>
                  <th className="px-4 py-3 text-left text-sm text-gray-600">Document</th>
                  <th className="px-4 py-3 text-left text-sm text-gray-600">Actor</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                      Loading…
                    </td>
                  </tr>
                ) : !data || data.docs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                      No audit entries found.
                    </td>
                  </tr>
                ) : (
                  data.docs.map((log) => {
                    const key = String(log.id)
                    const isOpen = expanded === key
                    const hasChanges = log.changes != null
                    const label = actionLabel(log)
                    return (
                      <Fragment key={key}>
                        <tr className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-4 py-3">
                            {hasChanges ? (
                              <button
                                type="button"
                                onClick={() => setExpanded(isOpen ? null : key)}
                                aria-label={isOpen ? 'Collapse details' : 'Expand details'}
                                className="text-gray-400 hover:text-[#2563eb]"
                              >
                                {isOpen ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </button>
                            ) : null}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                            {new Date(log.createdAt).toLocaleString()}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs ${ACTION_STYLES[log.action] ?? 'bg-gray-100 text-gray-700'}`}
                            >
                              {label}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {log.collectionSlug ?? '—'}
                          </td>
                          <td className="px-4 py-3 text-sm text-[#1a1f71]">
                            {log.title || (log.documentId ? `#${log.documentId}` : '—')}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {log.userEmail || 'system'}
                            {log.userRole ? (
                              <span className="text-gray-400"> ({log.userRole})</span>
                            ) : null}
                          </td>
                        </tr>
                        {isOpen && hasChanges ? (
                          <tr className="bg-gray-50">
                            <td />
                            <td colSpan={5} className="px-4 py-3">
                              <pre className="max-h-72 overflow-x-auto rounded-lg border border-gray-200 bg-white p-3 text-xs">
                                {JSON.stringify(log.changes, null, 2)}
                              </pre>
                              <div className="mt-1 flex flex-wrap gap-3 text-xs text-gray-400">
                                {log.ip ? <span>IP: {log.ip}</span> : null}
                                {log.userAgent ? (
                                  <span className="truncate max-w-xl">UA: {log.userAgent}</span>
                                ) : null}
                              </div>
                            </td>
                          </tr>
                        ) : null}
                      </Fragment>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {data && data.totalPages > 1 ? (
            <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
              <div className="text-sm text-gray-500">
                Page {data.page} of {data.totalPages} · {data.totalDocs} entries
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={!data.hasPrevPage}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={!data.hasNextPage}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </DashboardLayout>
  )
}
