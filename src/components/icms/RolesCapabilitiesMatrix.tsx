'use client'

import { useMemo, useState } from 'react'
import { useIcmsToast } from '@/components/icms/toast'
import {
  ALL_ICMS_CAPABILITIES,
  CAPABILITY_LABELS,
  ICMS_ROLE_META,
  defaultCapabilitiesForRole,
  type IcmsCapability,
  type IcmsRole,
  type RoleCapabilityOverride,
} from '@/lib/icms/roles'

function buildOverrideMap(
  overrides: RoleCapabilityOverride[] | null | undefined,
): Record<IcmsRole, IcmsCapability[] | null> {
  const map = {} as Record<IcmsRole, IcmsCapability[] | null>
  for (const meta of ICMS_ROLE_META) {
    map[meta.value] = null
  }
  for (const row of overrides || []) {
    if (!row.role) continue
    map[row.role] = [...(row.capabilities || [])]
  }
  return map
}

export default function RolesCapabilitiesMatrix({
  tenantId,
  tenantSlug,
  initialOverrides = [],
  canEdit = false,
}: {
  tenantId?: string | number
  tenantSlug?: string
  initialOverrides?: RoleCapabilityOverride[]
  canEdit?: boolean
}) {
  const toast = useIcmsToast()
  const [draft, setDraft] = useState(() => buildOverrideMap(initialOverrides))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [ok, setOk] = useState('')

  const dirty = useMemo(() => {
    const initial = buildOverrideMap(initialOverrides)
    return ICMS_ROLE_META.some((meta) => {
      const a = draft[meta.value]
      const b = initial[meta.value]
      if (a === null && b === null) return false
      if (a === null || b === null) return true
      if (a.length !== b.length) return true
      const setB = new Set(b)
      return a.some((c) => !setB.has(c))
    })
  }, [draft, initialOverrides])

  function capsForRole(role: IcmsRole): IcmsCapability[] {
    const override = draft[role]
    if (override) return override
    return defaultCapabilitiesForRole(role)
  }

  function isCustom(role: IcmsRole) {
    return draft[role] !== null
  }

  function toggle(role: IcmsRole, cap: IcmsCapability) {
    if (!canEdit) return
    setOk('')
    setError('')
    setDraft((prev) => {
      const current = prev[role] ?? defaultCapabilitiesForRole(role)
      const next = current.includes(cap)
        ? current.filter((c) => c !== cap)
        : [...current, cap]
      return { ...prev, [role]: next }
    })
  }

  function resetRole(role: IcmsRole) {
    if (!canEdit) return
    setOk('')
    setError('')
    setDraft((prev) => ({ ...prev, [role]: null }))
  }

  function customizeRole(role: IcmsRole) {
    if (!canEdit) return
    setOk('')
    setError('')
    setDraft((prev) => ({
      ...prev,
      [role]: prev[role] ?? defaultCapabilitiesForRole(role),
    }))
  }

  async function save() {
    if (!canEdit || !tenantId || !tenantSlug) return
    setBusy(true)
    setError('')
    setOk('')
    try {
      const roleCapabilityOverrides: RoleCapabilityOverride[] = ICMS_ROLE_META.filter(
        (meta) => draft[meta.value] !== null,
      ).map((meta) => ({
        role: meta.value,
        capabilities: draft[meta.value] || [],
      }))

      const res = await fetch('/api/icms/records', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collection: 'icms-tenants',
          id: tenantId,
          tenantSlug,
          data: { roleCapabilityOverrides },
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Save failed')
      setOk('Visibility grants saved. Staff will see updated menus on next page load.')
      toast.success('Visibility grants saved')
      setDraft(buildOverrideMap(roleCapabilityOverrides))
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Save failed'
      setError(message)
      toast.error(message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-3">
      {canEdit ? (
        <p className="text-sm text-[color:var(--icms-warm-gray)]">
          Toggle caps to customize what each centre role can open in the admin sidebar. Leave a role
          on defaults, or customize then save. <strong>Custom domains</strong> is off by default for
          all centre roles — grant it only when needed.
        </p>
      ) : (
        <p className="text-sm text-[color:var(--icms-warm-gray)]">
          Default presets below. Super admin can edit grants for this centre under Visibility
          grants.
        </p>
      )}

      <div className="overflow-x-auto border border-black/10 bg-white">
        <table className="min-w-full text-left text-xs">
          <thead className="border-b border-black/10 bg-[color:var(--icms-ivory)] uppercase tracking-wider text-[color:var(--icms-warm-gray)]">
            <tr>
              <th className="sticky left-0 z-10 bg-[color:var(--icms-ivory)] px-4 py-3">Role</th>
              {ALL_ICMS_CAPABILITIES.map((cap) => (
                <th key={cap} className="px-3 py-3 text-center whitespace-nowrap">
                  {CAPABILITY_LABELS[cap]}
                </th>
              ))}
              {canEdit ? <th className="px-3 py-3">Grant</th> : null}
            </tr>
          </thead>
          <tbody>
            {ICMS_ROLE_META.map((role) => {
              const caps = capsForRole(role.value)
              const custom = isCustom(role.value)
              return (
                <tr key={role.value} className="border-t border-black/5">
                  <td className="sticky left-0 z-10 bg-white px-4 py-3">
                    <p className="font-semibold text-[color:var(--icms-forest)]">{role.label}</p>
                    <p className="mt-0.5 max-w-xs text-[0.68rem] font-normal normal-case text-[color:var(--icms-warm-gray)]">
                      {role.description}
                    </p>
                    {custom ? (
                      <p className="mt-1 text-[0.65rem] font-semibold uppercase tracking-wider text-[color:var(--icms-gold)]">
                        Custom grant
                      </p>
                    ) : null}
                  </td>
                  {ALL_ICMS_CAPABILITIES.map((cap) => {
                    const on = caps.includes(cap)
                    if (!canEdit) {
                      return (
                        <td key={cap} className="px-3 py-3 text-center">
                          {on ? (
                            <span className="inline-block h-2 w-2 rounded-full bg-[color:var(--icms-emerald)]" />
                          ) : (
                            <span className="text-[color:var(--icms-warm-gray)]/30">—</span>
                          )}
                        </td>
                      )
                    }
                    return (
                      <td key={cap} className="px-3 py-3 text-center">
                        <button
                          type="button"
                          title={`${CAPABILITY_LABELS[cap]} for ${role.label}`}
                          onClick={() => toggle(role.value, cap)}
                          className={`inline-flex h-6 w-6 items-center justify-center border text-[0.65rem] transition-colors ${
                            on
                              ? 'border-[color:var(--icms-emerald)] bg-[color:var(--icms-emerald)] text-white'
                              : 'border-black/15 text-[color:var(--icms-warm-gray)] hover:border-[color:var(--icms-forest)]'
                          }`}
                        >
                          {on ? '✓' : ''}
                        </button>
                      </td>
                    )
                  })}
                  {canEdit ? (
                    <td className="px-3 py-3 whitespace-nowrap">
                      {custom ? (
                        <button
                          type="button"
                          className="text-[0.65rem] font-semibold uppercase tracking-wider text-[color:var(--icms-emerald)] hover:underline"
                          onClick={() => resetRole(role.value)}
                        >
                          Reset default
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="text-[0.65rem] font-semibold uppercase tracking-wider text-[color:var(--icms-warm-gray)] hover:text-[color:var(--icms-forest)] hover:underline"
                          onClick={() => customizeRole(role.value)}
                        >
                          Customize
                        </button>
                      )}
                    </td>
                  ) : null}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {canEdit ? (
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="icms-btn-primary"
            disabled={busy || !dirty}
            onClick={() => void save()}
          >
            {busy ? 'Saving…' : 'Save visibility grants'}
          </button>
          {ok ? <p className="text-sm text-[color:var(--icms-emerald)]">{ok}</p> : null}
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
        </div>
      ) : null}
    </div>
  )
}
