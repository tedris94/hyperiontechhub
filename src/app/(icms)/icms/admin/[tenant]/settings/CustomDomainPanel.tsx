'use client'

import { useCallback, useEffect, useState } from 'react'
import { tenantSubdomainHost } from '@/lib/icms/ui-variants'
import { PLATFORM_HOST } from '@/lib/icms/public-base'
import { useIcmsToast } from '@/components/icms/toast'

type DnsRow = { type: string; name: string; value: string; reason?: string }

type DomainState = {
  configured: boolean
  subdomain: string
  customDomain: string | null
  status: string
  error?: string
  dns: DnsRow[]
  pathFallback?: string
}

const STATUS_LABEL: Record<string, string> = {
  none: 'Not connected',
  pending_dns: 'Waiting for DNS',
  pending_ssl: 'Provisioning SSL',
  active: 'Active',
  error: 'Error',
}

export default function CustomDomainPanel({
  tenantSlug,
  initialDomain,
  initialStatus,
}: {
  tenantSlug: string
  initialDomain?: string
  initialStatus?: string
}) {
  const toast = useIcmsToast()
  const subdomain = tenantSubdomainHost(tenantSlug)
  const pathFallback = `https://${PLATFORM_HOST}/icms/${tenantSlug}`
  const [domainInput, setDomainInput] = useState(initialDomain || '')
  const [state, setState] = useState<DomainState>({
    configured: false,
    subdomain,
    customDomain: initialDomain || null,
    status: initialStatus || 'none',
    dns: [],
    pathFallback,
  })
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    setBusy(true)
    setError('')
    try {
      const res = await fetch(
        `/api/icms/custom-domain?tenantSlug=${encodeURIComponent(tenantSlug)}`,
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Refresh failed')
      setState({
        configured: Boolean(data.configured),
        subdomain: data.subdomain || subdomain,
        customDomain: data.customDomain || null,
        status: data.status || 'none',
        error: data.error,
        dns: data.dns || [],
        pathFallback: data.pathFallback || pathFallback,
      })
      if (data.customDomain) setDomainInput(data.customDomain)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Refresh failed')
    } finally {
      setBusy(false)
    }
  }, [tenantSlug, subdomain, pathFallback])

  useEffect(() => {
    void refresh()
  }, [refresh])

  async function connect(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError('')
    setMessage('')
    try {
      const res = await fetch('/api/icms/custom-domain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantSlug, domain: domainInput }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Connect failed')
      setState({
        configured: Boolean(data.configured),
        subdomain: data.subdomain || subdomain,
        customDomain: data.customDomain || null,
        status: data.status || 'pending_dns',
        error: data.error,
        dns: data.dns || [],
        pathFallback: data.pathFallback || pathFallback,
      })
      setMessage(
        data.configured
          ? 'Domain submitted to Vercel. Update DNS using the records below, then Refresh.'
          : 'Domain saved. Add it in the Vercel project dashboard, then update DNS.',
      )
      toast.success('Custom domain submitted')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Connect failed'
      setError(message)
      toast.error(message)
    } finally {
      setBusy(false)
    }
  }

  async function removeDomain() {
    if (!confirm('Remove the custom domain from this centre?')) return
    setBusy(true)
    setError('')
    setMessage('')
    try {
      const res = await fetch('/api/icms/custom-domain', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantSlug }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Remove failed')
      setState((s) => ({
        ...s,
        customDomain: null,
        status: 'none',
        error: undefined,
        dns: [],
      }))
      setDomainInput('')
      setMessage('Custom domain removed.')
      toast.success('Custom domain removed')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Remove failed'
      setError(message)
      toast.error(message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-4 border border-black/10 bg-white p-6">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[color:var(--icms-gold)]">
          Domains
        </h2>
        <p className="mt-1 text-sm text-[color:var(--icms-warm-gray)]">
          Every centre gets a free subdomain on hyperiontechhub.com. Optionally connect your own
          domain via Vercel.
        </p>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {message ? <p className="text-sm text-[color:var(--icms-emerald)]">{message}</p> : null}
      {state.error ? (
        <p className="text-sm text-amber-700">{state.error}</p>
      ) : null}

      <div className="space-y-2 rounded border border-black/5 bg-[color:var(--icms-ivory)] p-4 text-sm">
        <p>
          <span className="font-semibold text-[color:var(--icms-forest)]">Subdomain: </span>
          <a
            className="text-[color:var(--icms-emerald)] hover:underline"
            href={`https://${state.subdomain}`}
            target="_blank"
            rel="noreferrer"
          >
            {state.subdomain}
          </a>
        </p>
        <p>
          <span className="font-semibold text-[color:var(--icms-forest)]">Path URL: </span>
          <a
            className="text-[color:var(--icms-emerald)] hover:underline"
            href={state.pathFallback || pathFallback}
            target="_blank"
            rel="noreferrer"
          >
            {state.pathFallback || pathFallback}
          </a>
        </p>
        <p>
          <span className="font-semibold text-[color:var(--icms-forest)]">Public pages: </span>
          <a
            className="text-[color:var(--icms-emerald)] hover:underline"
            href={`/icms/${tenantSlug}`}
            target="_blank"
            rel="noreferrer"
          >
            Home
          </a>
          <span className="text-[color:var(--icms-warm-gray)]"> · </span>
          <a
            className="text-[color:var(--icms-emerald)] hover:underline"
            href={`/icms/${tenantSlug}/committee`}
            target="_blank"
            rel="noreferrer"
          >
            Shurah / Committee
          </a>
        </p>
        <p className="text-xs text-[color:var(--icms-warm-gray)]">
          Admin and platform stay on www.hyperiontechhub.com. Local preview uses the relative links
          above (e.g. /icms/{tenantSlug}/committee).
        </p>
      </div>

      <form onSubmit={connect} className="space-y-3">
        <label className="block text-sm font-medium">
          Custom domain
          <input
            className="icms-input mt-1.5"
            placeholder="www.yourmosque.org"
            value={domainInput}
            onChange={(e) => setDomainInput(e.target.value)}
          />
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" className="icms-btn-primary" disabled={busy || !domainInput.trim()}>
            {busy ? 'Working…' : state.customDomain ? 'Update / reconnect' : 'Connect domain'}
          </button>
          <button
            type="button"
            className="icms-btn-secondary"
            disabled={busy}
            onClick={() => void refresh()}
          >
            Refresh status
          </button>
          {state.customDomain ? (
            <button
              type="button"
              className="text-sm text-red-700 hover:underline"
              disabled={busy}
              onClick={() => void removeDomain()}
            >
              Remove
            </button>
          ) : null}
        </div>
      </form>

      <p className="text-sm">
        Status:{' '}
        <span className="font-semibold text-[color:var(--icms-forest)]">
          {STATUS_LABEL[state.status] || state.status}
        </span>
        {state.customDomain ? (
          <span className="text-[color:var(--icms-warm-gray)]"> · {state.customDomain}</span>
        ) : null}
      </p>

      {state.dns.length > 0 ? (
        <div className="overflow-x-auto">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[color:var(--icms-gold)]">
            DNS records
          </p>
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-black/10 text-xs uppercase tracking-wider text-[color:var(--icms-warm-gray)]">
              <tr>
                <th className="px-2 py-2">Type</th>
                <th className="px-2 py-2">Name</th>
                <th className="px-2 py-2">Value</th>
              </tr>
            </thead>
            <tbody>
              {state.dns.map((row, i) => (
                <tr key={`${row.type}-${row.name}-${i}`} className="border-t border-black/5">
                  <td className="px-2 py-2 font-mono text-xs">{row.type}</td>
                  <td className="px-2 py-2 font-mono text-xs">{row.name}</td>
                  <td className="px-2 py-2 font-mono text-xs break-all">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  )
}
