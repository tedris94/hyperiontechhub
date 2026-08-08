'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  CAPABILITY_LABELS,
  ICMS_ROLE_META,
  listCapabilities,
  type IcmsCapability,
  type IcmsRole,
  type RoleCapabilityOverride,
} from '@/lib/icms/roles'
import RolesCapabilitiesMatrix from '@/components/icms/RolesCapabilitiesMatrix'
import DeleteRecordButton from '@/components/icms/DeleteRecordButton'
import { useIcmsToast } from '@/components/icms/toast'

type MembershipRow = {
  id: string | number
  role: string
  status?: string
  user?:
    | { id?: string | number; email?: string; fullName?: string }
    | number
    | string
}

type RegisteredUser = {
  id: string | number
  email: string
  fullName: string
}

function userEmail(row: MembershipRow): string {
  if (typeof row.user === 'object' && row.user && 'email' in row.user) {
    return String(row.user.email || '')
  }
  return String(row.user || '')
}

function userLabel(row: MembershipRow): string {
  if (typeof row.user === 'object' && row.user) {
    const name = row.user.fullName
    const email = row.user.email
    if (name && email) return `${name} (${email})`
    return String(email || name || row.user.id || '')
  }
  return String(row.user || '')
}

export default function TeamManager({
  tenantId,
  tenantSlug,
  initialOverrides = [],
  canEditGrants = false,
}: {
  tenantId: string | number
  tenantSlug: string
  initialOverrides?: RoleCapabilityOverride[]
  canEditGrants?: boolean
}) {
  const toast = useIcmsToast()
  const [rows, setRows] = useState<MembershipRow[]>([])
  const [users, setUsers] = useState<RegisteredUser[]>([])
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<IcmsRole>('content_editor')
  const [error, setError] = useState('')
  const [ok, setOk] = useState('')
  const [busy, setBusy] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regRole, setRegRole] = useState<IcmsRole>('content_editor')
  const [regBusy, setRegBusy] = useState(false)

  const assignedEmails = useMemo(
    () => new Set(rows.map((r) => userEmail(r).toLowerCase()).filter(Boolean)),
    [rows],
  )

  const availableUsers = useMemo(
    () => users.filter((u) => !assignedEmails.has(u.email.toLowerCase())),
    [users, assignedEmails],
  )

  async function loadMemberships() {
    const res = await fetch(
      `/api/icms/records?collection=icms-memberships&tenantId=${encodeURIComponent(String(tenantId))}&tenantSlug=${encodeURIComponent(tenantSlug)}`,
    )
    const data = await res.json()
    if (res.ok) setRows(data.docs || [])
  }

  async function loadUsers() {
    const res = await fetch(
      `/api/icms/users?tenantSlug=${encodeURIComponent(tenantSlug)}`,
    )
    const data = await res.json()
    if (res.ok) setUsers(data.users || [])
  }

  async function reload() {
    await Promise.all([loadMemberships(), loadUsers()])
  }

  useEffect(() => {
    void reload()
  }, [tenantId, tenantSlug])

  async function assign(e: React.FormEvent) {
    e.preventDefault()
    if (!email) {
      setError('Select a registered user')
      return
    }
    setBusy(true)
    setError('')
    setOk('')
    try {
      const res = await fetch('/api/icms/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'assign-membership',
          tenantSlug,
          data: {
            email,
            tenant: isNaN(Number(tenantId)) ? tenantId : Number(tenantId),
            role,
          },
        }),
      })
      const raw = await res.text()
      let data: { error?: string; message?: string; ok?: boolean } = {}
      try {
        data = raw ? JSON.parse(raw) : {}
      } catch {
        throw new Error(
          raw?.trim()
            ? `Assign failed (${res.status}): ${raw.slice(0, 160)}`
            : `Assign failed with empty response (${res.status})`,
        )
      }
      if (!res.ok) throw new Error(data.error || 'Assign failed')
      const msg =
        data.message || `Assigned ${role.replace(/_/g, ' ')} to ${email} on ${tenantSlug}`
      setOk(msg)
      toast.success(msg)
      setEmail('')
      await reload()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Assign failed'
      setError(message)
      toast.error(message)
    } finally {
      setBusy(false)
    }
  }

  async function register(e: React.FormEvent) {
    e.preventDefault()
    setRegBusy(true)
    setError('')
    setOk('')
    try {
      const res = await fetch('/api/icms/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantSlug,
          tenantId,
          fullName: regName,
          email: regEmail,
          password: regPassword,
          role: regRole,
          assign: true,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Registration failed')
      setOk(`Registered ${regEmail} as ${regRole.replace(/_/g, ' ')}. They can sign in now.`)
      toast.success(`Registered ${regEmail}`)
      setRegName('')
      setRegEmail('')
      setRegPassword('')
      setRegRole('content_editor')
      await reload()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed'
      setError(message)
      toast.error(message)
    } finally {
      setRegBusy(false)
    }
  }

  async function changeRole(membershipId: string | number, newRole: string) {
    setUpdatingId(String(membershipId))
    setError('')
    try {
      const res = await fetch('/api/icms/records', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collection: 'icms-memberships',
          tenantSlug,
          id: membershipId,
          data: { role: newRole, status: 'active' },
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Role update failed')
      toast.success('Role updated')
      await loadMemberships()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Role update failed'
      setError(message)
      toast.error(message)
    } finally {
      setUpdatingId(null)
    }
  }

  const roleOptions = ICMS_ROLE_META.filter((r) => r.value !== 'owner')

  return (
    <div className="space-y-8">
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {ok ? <p className="text-sm text-[color:var(--icms-emerald)]">{ok}</p> : null}

      <div className="overflow-x-auto border border-black/10 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-black/10 bg-[color:var(--icms-ivory)] text-xs uppercase tracking-wider text-[color:var(--icms-warm-gray)]">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Capabilities</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-sm text-[color:var(--icms-warm-gray)]">
                  No team members yet. Register a user below or assign an existing one.
                </td>
              </tr>
            ) : null}
            {rows.map((r) => {
              const roleValue = r.role as IcmsRole
              const caps = listCapabilities(roleValue, initialOverrides)
              return (
                <tr key={String(r.id)} className="border-t border-black/5">
                  <td className="px-4 py-3">{userLabel(r)}</td>
                  <td className="px-4 py-3">
                    {roleValue === 'owner' ? (
                      <span className="capitalize">{roleValue}</span>
                    ) : (
                      <select
                        className="icms-input text-sm"
                        value={roleValue}
                        disabled={updatingId === String(r.id)}
                        onChange={(e) => void changeRole(r.id, e.target.value)}
                      >
                        {roleOptions.map((meta) => (
                          <option key={meta.value} value={meta.value}>
                            {meta.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex max-w-xs flex-wrap gap-1">
                      {caps.length === 0 ? (
                        <span className="text-xs text-[color:var(--icms-warm-gray)]">Read-only</span>
                      ) : (
                        caps.map((cap) => (
                          <span
                            key={cap}
                            className="rounded bg-[color:var(--icms-emerald)]/10 px-1.5 py-0.5 text-[0.65rem] text-[color:var(--icms-emerald)]"
                          >
                            {CAPABILITY_LABELS[cap]}
                          </span>
                        ))
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 capitalize">{r.status || 'active'}</td>
                  <td className="px-4 py-3 text-right">
                    {roleValue !== 'owner' ? (
                      <DeleteRecordButton
                        collection="icms-memberships"
                        id={r.id}
                        tenantSlug={tenantSlug}
                        onSuccess={() => void reload()}
                      />
                    ) : null}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={register} className="space-y-3 border border-black/10 bg-white p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[color:var(--icms-gold)]">
            Register new user
          </h2>
          <p className="text-sm text-[color:var(--icms-warm-gray)]">
            Creates a login for centre staff and adds them to this team. They sign in at the same
            login page, then land in this tenant admin.
          </p>
          <label className="block text-sm font-medium">
            Full name
            <input
              className="icms-input mt-1.5"
              required
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              placeholder="Ustadh Musa Ibrahim"
            />
          </label>
          <label className="block text-sm font-medium">
            Email
            <input
              className="icms-input mt-1.5"
              type="email"
              required
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              placeholder="staff@example.com"
            />
          </label>
          <label className="block text-sm font-medium">
            Temporary password
            <input
              className="icms-input mt-1.5"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              placeholder="At least 8 characters"
            />
          </label>
          <label className="block text-sm font-medium">
            ICMS role
            <select
              className="icms-input mt-1.5"
              value={regRole}
              onChange={(e) => setRegRole(e.target.value as IcmsRole)}
            >
              {roleOptions.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label} — {r.description}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" className="icms-btn-primary" disabled={regBusy}>
            {regBusy ? 'Registering…' : 'Register & add to team'}
          </button>
        </form>

        <form onSubmit={assign} className="space-y-3 border border-black/10 bg-white p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[color:var(--icms-gold)]">
            Assign existing user
          </h2>
          <p className="text-sm text-[color:var(--icms-warm-gray)]">
            Pick someone already registered who is not yet on{' '}
            <strong>this</strong> centre (
            <span className="font-mono text-xs">{tenantSlug}</span>). After Assign succeeds, they
            must appear in the team table above before they can open{' '}
            <span className="font-mono text-xs">/icms/admin/{tenantSlug}</span>.
          </p>
          <label className="block text-sm font-medium">
            Registered user
            <select
              className="icms-input mt-1.5"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            >
              <option value="">
                {availableUsers.length === 0
                  ? 'No unassigned users — register one first'
                  : 'Select a user…'}
              </option>
              {availableUsers.map((u) => (
                <option key={String(u.id)} value={u.email}>
                  {u.fullName} ({u.email})
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium">
            Role
            <select
              className="icms-input mt-1.5"
              value={role}
              onChange={(e) => setRole(e.target.value as IcmsRole)}
            >
              {roleOptions.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label} — {r.description}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            className="icms-btn-primary"
            disabled={busy || availableUsers.length === 0}
          >
            {busy ? 'Saving…' : 'Assign role'}
          </button>
        </form>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[color:var(--icms-gold)]">
          Visibility grants
        </h3>
        <p className="text-sm text-[color:var(--icms-warm-gray)]">
          Admin sidebar items follow these capabilities. Hyperion platform Admins only see a centre
          after membership is granted; menu items still follow the assigned centre role (and any
          custom grants below).
        </p>
        <RolesCapabilitiesMatrix
          tenantId={tenantId}
          tenantSlug={tenantSlug}
          canEdit={canEditGrants}
          initialOverrides={initialOverrides}
        />
      </div>
    </div>
  )
}
