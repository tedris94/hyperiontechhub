'use client'

import { useState } from 'react'
import { useIcmsToast } from '@/components/icms/toast'
import type { IcmsUiVariant } from '@/lib/icms/types'
import { UI_VARIANT_LIST } from '@/lib/icms/ui-variants'

export default function UiVariantPicker({
  tenantId,
  tenantSlug,
  initial,
}: {
  tenantId: string
  tenantSlug: string
  initial: IcmsUiVariant
}) {
  const toast = useIcmsToast()
  const [selected, setSelected] = useState<IcmsUiVariant>(initial)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [ok, setOk] = useState(false)

  async function save(next: IcmsUiVariant) {
    setSelected(next)
    setSaving(true)
    setError('')
    setOk(false)
    try {
      const res = await fetch('/api/icms/records', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collection: 'icms-tenants',
          id: isNaN(Number(tenantId)) ? tenantId : Number(tenantId),
          tenantSlug,
          data: { uiVariant: next },
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Save failed')
      setOk(true)
      toast.success(`Layout pack: ${next}`)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Save failed'
      setError(message)
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4 border border-black/10 bg-white p-6">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[color:var(--icms-gold)]">
          Site appearance
        </h2>
        <p className="mt-1 text-sm text-[color:var(--icms-warm-gray)]">
          Choose a public layout pack. Brand colors still apply on every variant.
        </p>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {ok ? (
        <p className="text-sm text-[color:var(--icms-emerald)]">Appearance saved.</p>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {UI_VARIANT_LIST.map((v) => {
          const active = selected === v.id
          return (
            <button
              key={v.id}
              type="button"
              disabled={saving}
              onClick={() => void save(v.id)}
              className={`rounded-lg border p-4 text-left transition-colors ${
                active
                  ? 'border-[color:var(--icms-emerald)] bg-[color:var(--icms-emerald)]/5'
                  : 'border-black/10 hover:border-[color:var(--icms-gold)]/50'
              }`}
            >
              <p className="icms-display text-lg text-[color:var(--icms-forest)]">{v.label}</p>
              <p className="mt-2 text-xs leading-relaxed text-[color:var(--icms-warm-gray)]">
                {v.description}
              </p>
              <p className="mt-3 text-[10px] font-semibold uppercase tracking-wider text-[color:var(--icms-gold)]">
                {active ? 'Active' : 'Select'}
              </p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
