'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import RequireAuth from '@/components/RequireAuth'
import { useAuth } from '@/contexts/AuthContext'
import { ICMS_ROLE_META } from '@/lib/icms/roles'

type TenantRow = {
  id: string | number
  name: string
  slug: string
  status?: string
  planTier?: string
  shortName?: string
}

type MembershipRow = {
  id: string | number
  role: string
  status?: string
  user?: { id?: string | number; email?: string } | number | string
  tenant?: { id?: string | number; slug?: string } | number | string
}

export default function IcmsPlatformPage() {
  return (
    <RequireAuth message="Sign in as a platform admin to manage ICMS tenants.">
      <IcmsPlatformInner />
    </RequireAuth>
  )
}

function IcmsPlatformInner() {
  const { user, logout } = useAuth()
  const canManage = user?.role === 'super_admin' || user?.role === 'admin'
  const [tenants, setTenants] = useState<TenantRow[]>([])
  const [memberships, setMemberships] = useState<MembershipRow[]>([])
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({
    name: '',
    slug: '',
    shortName: '',
    email: '',
    planTier: 'community',
    status: 'trial',
    uiVariant: 'classic',
  })
  const [memForm, setMemForm] = useState({
    tenantId: '',
    userEmail: '',
    role: 'owner',
  })
  const [saving, setSaving] = useState(false)

  async function load() {
    try {
      const [tRes, mRes] = await Promise.all([
        fetch('/api/icms/records?collection=icms-tenants'),
        fetch('/api/icms/records?collection=icms-memberships'),
      ])
      const tData = await tRes.json()
      const mData = await mRes.json()
      if (!tRes.ok) throw new Error(tData.error || 'Failed to load tenants')
      if (!mRes.ok) throw new Error(mData.error || 'Failed to load memberships')
      setTenants(tData.docs || [])
      setMemberships(mData.docs || [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    }
  }

  useEffect(() => {
    if (!canManage) return
    void load()
  }, [canManage])

  async function createTenant(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')
    try {
      const res = await fetch('/api/icms/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collection: 'icms-tenants',
          data: {
            ...form,
            shortName: form.shortName || form.name,
            colors: {
              emerald: '#0F5A43',
              forest: '#07382B',
              gold: '#C79A2C',
              ivory: '#FAF8F2',
              charcoal: '#1E1E1E',
              warmGray: '#6F6F6F',
            },
            domainLabel: `${form.slug}.hyperiontechhub.com`,
            uiVariant: form.uiVariant || 'classic',
            customDomainStatus: 'none',
          },
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Create failed')
      setForm({
        name: '',
        slug: '',
        shortName: '',
        email: '',
        planTier: 'community',
        status: 'trial',
        uiVariant: 'classic',
      })
      setMessage(`Created tenant ${data.doc.slug}`)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Create failed')
    } finally {
      setSaving(false)
    }
  }

  async function seedTenant(slug: string) {
    setError('')
    setMessage('')
    try {
      const res = await fetch('/api/icms/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'seed', tenantSlug: slug }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Seed failed')
      setMessage(`Seeded demo content for ${slug}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Seed failed')
    }
  }

  async function assignMembership(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')
    try {
      const res = await fetch('/api/icms/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'assign-membership',
          data: {
            email: memForm.userEmail,
            tenant: isNaN(Number(memForm.tenantId)) ? memForm.tenantId : Number(memForm.tenantId),
            role: memForm.role,
          },
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Membership failed')
      setMessage('Membership assigned')
      setMemForm((s) => ({ ...s, userEmail: '' }))
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Membership failed')
    } finally {
      setSaving(false)
    }
  }

  if (!canManage) {
    return (
      <div className="icms-root min-h-screen px-6 py-16">
        <div className="mx-auto max-w-lg">
          <p className="text-[color:var(--icms-warm-gray)]">Platform admin access required.</p>
          <Link href="/icms" className="mt-4 inline-block text-sm text-[color:var(--icms-emerald)]">
            ← Back to ICMS
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="icms-root min-h-screen bg-[color:var(--icms-ivory)] px-6 py-12">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--icms-gold)]">
              Hyperion ICMS
            </p>
            <h1 className="icms-display mt-2 text-3xl text-[color:var(--icms-forest)]">
              Platform Super Admin
            </h1>
            <p className="mt-1 text-sm text-[color:var(--icms-warm-gray)]">
              {tenants.length} tenant(s) · sales-led onboarding
            </p>
          </div>
          <div className="flex gap-3 text-sm">
            <Link href="/admin" className="icms-btn-secondary">
              Payload admin
            </Link>
            <Link href="/icms" className="icms-btn-secondary">
              Tenant list
            </Link>
            <button type="button" onClick={() => logout('/icms/platform')} className="icms-btn-secondary">
              Log out
            </button>
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-[color:var(--icms-emerald)]">{message}</p>}

        <form
          onSubmit={createTenant}
          className="space-y-4 border border-black/10 bg-white p-6"
        >
          <h2 className="font-semibold text-[color:var(--icms-forest)]">Create tenant</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm">
              Name
              <input
                required
                className="icms-input mt-1"
                value={form.name}
                onChange={(e) =>
                  setForm((s) => ({
                    ...s,
                    name: e.target.value,
                    slug:
                      s.slug ||
                      e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/^-|-$/g, ''),
                    shortName: s.shortName || e.target.value,
                  }))
                }
              />
            </label>
            <label className="text-sm">
              Slug
              <input
                required
                className="icms-input mt-1"
                value={form.slug}
                onChange={(e) => setForm((s) => ({ ...s, slug: e.target.value }))}
              />
            </label>
            <label className="text-sm">
              Short name
              <input
                className="icms-input mt-1"
                value={form.shortName}
                onChange={(e) => setForm((s) => ({ ...s, shortName: e.target.value }))}
              />
            </label>
            <label className="text-sm">
              Email
              <input
                type="email"
                className="icms-input mt-1"
                value={form.email}
                onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
              />
            </label>
            <label className="text-sm">
              Plan tier
              <select
                className="icms-input mt-1"
                value={form.planTier}
                onChange={(e) => setForm((s) => ({ ...s, planTier: e.target.value }))}
              >
                <option value="community">Community</option>
                <option value="standard">Standard</option>
                <option value="professional">Professional</option>
              </select>
            </label>
            <label className="text-sm">
              Status
              <select
                className="icms-input mt-1"
                value={form.status}
                onChange={(e) => setForm((s) => ({ ...s, status: e.target.value }))}
              >
                <option value="trial">Trial</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </label>
            <label className="text-sm md:col-span-2">
              UI variant
              <select
                className="icms-input mt-1"
                value={form.uiVariant}
                onChange={(e) => setForm((s) => ({ ...s, uiVariant: e.target.value }))}
              >
                <option value="classic">Classic</option>
                <option value="modern">Modern</option>
                <option value="community">Community</option>
                <option value="scholarly">Scholarly</option>
                <option value="compact">Compact</option>
              </select>
            </label>
          </div>
          <button type="submit" className="icms-btn-primary" disabled={saving}>
            {saving ? 'Creating…' : 'Create tenant'}
          </button>
        </form>

        <div className="overflow-x-auto border border-black/10 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[color:var(--icms-ivory)] text-xs uppercase tracking-wider text-[color:var(--icms-warm-gray)]">
              <tr>
                <th className="px-4 py-3">Tenant</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map((t) => (
                <tr key={String(t.id)} className="border-t border-black/5">
                  <td className="px-4 py-3 font-medium">{t.name}</td>
                  <td className="px-4 py-3 font-mono text-xs">{t.slug}</td>
                  <td className="px-4 py-3 capitalize">{t.planTier || '—'}</td>
                  <td className="px-4 py-3 capitalize">{t.status || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={`/icms/${t.slug}`}
                        className="text-[color:var(--icms-emerald)] hover:underline"
                      >
                        Public
                      </Link>
                      <Link
                        href={`/icms/admin/${t.slug}`}
                        className="text-[color:var(--icms-emerald)] hover:underline"
                      >
                        Admin
                      </Link>
                      <button
                        type="button"
                        className="text-[color:var(--icms-gold)] hover:underline"
                        onClick={() => void seedTenant(t.slug)}
                      >
                        Seed sample
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <form
          onSubmit={assignMembership}
          className="space-y-4 border border-black/10 bg-white p-6"
        >
          <h2 className="font-semibold text-[color:var(--icms-forest)]">Assign membership</h2>
          <p className="text-xs text-[color:var(--icms-warm-gray)]">
            Prefer Payload admin for user picker if email lookup is unavailable. Deep edits:{' '}
            <Link href="/admin/collections/icms-memberships" className="underline">
              /admin
            </Link>
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <label className="text-sm">
              Tenant
              <select
                required
                className="icms-input mt-1"
                value={memForm.tenantId}
                onChange={(e) => setMemForm((s) => ({ ...s, tenantId: e.target.value }))}
              >
                <option value="">Select…</option>
                {tenants.map((t) => (
                  <option key={String(t.id)} value={String(t.id)}>
                    {t.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              User email
              <input
                required
                type="email"
                className="icms-input mt-1"
                value={memForm.userEmail}
                onChange={(e) => setMemForm((s) => ({ ...s, userEmail: e.target.value }))}
              />
            </label>
            <label className="text-sm">
              Role
              <select
                className="icms-input mt-1"
                value={memForm.role}
                onChange={(e) => setMemForm((s) => ({ ...s, role: e.target.value }))}
              >
                {ICMS_ROLE_META.map((r) => (
                  <option key={r.value} value={r.value} title={r.description}>
                    {r.label}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-[color:var(--icms-warm-gray)]">
                {ICMS_ROLE_META.find((r) => r.value === memForm.role)?.description}
              </p>
            </label>
          </div>
          <button type="submit" className="icms-btn-primary" disabled={saving}>
            Assign membership
          </button>
        </form>

        <div className="overflow-x-auto border border-black/10 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[color:var(--icms-ivory)] text-xs uppercase tracking-wider text-[color:var(--icms-warm-gray)]">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Tenant</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {memberships.map((m) => {
                const email =
                  typeof m.user === 'object' && m.user
                    ? m.user.email || String(m.user.id)
                    : String(m.user)
                const tenantLabel =
                  typeof m.tenant === 'object' && m.tenant
                    ? m.tenant.slug || String(m.tenant.id)
                    : String(m.tenant)
                return (
                  <tr key={String(m.id)} className="border-t border-black/5">
                    <td className="px-4 py-3">{email}</td>
                    <td className="px-4 py-3">{tenantLabel}</td>
                    <td className="px-4 py-3 capitalize">{m.role.replace(/_/g, ' ')}</td>
                    <td className="px-4 py-3">{m.status || 'active'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
