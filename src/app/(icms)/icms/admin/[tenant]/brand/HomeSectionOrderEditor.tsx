'use client'

import { useState } from 'react'
import { useIcmsToast } from '@/components/icms/toast'
import type { IcmsUiVariant } from '@/lib/icms/types'
import {
  HOME_SECTION_LABELS,
  getUiVariant,
  normalizeHomeSectionOrder,
  type HomeSectionId,
} from '@/lib/icms/ui-variants'

function sameOrder(a: HomeSectionId[], b: HomeSectionId[]) {
  return a.length === b.length && a.every((id, i) => id === b[i])
}

export default function HomeSectionOrderEditor({
  tenantId,
  tenantSlug,
  uiVariant,
  initial,
}: {
  tenantId: string
  tenantSlug: string
  uiVariant: IcmsUiVariant
  initial?: string[] | null
}) {
  const toast = useIcmsToast()
  const packOrder = getUiVariant(uiVariant).homeSectionOrder
  const [order, setOrder] = useState<HomeSectionId[]>(() =>
    normalizeHomeSectionOrder(initial, packOrder),
  )
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const packDefault = sameOrder(order, packOrder)

  function move(from: number, to: number) {
    if (to < 0 || to >= order.length || from === to) return
    setOrder((prev) => {
      const next = [...prev]
      const [item] = next.splice(from, 1)
      next.splice(to, 0, item)
      return next
    })
  }

  async function persist(next: HomeSectionId[], asCustom: boolean) {
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/icms/records', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collection: 'icms-tenants',
          id: isNaN(Number(tenantId)) ? tenantId : Number(tenantId),
          tenantSlug,
          data: { homeSectionOrder: asCustom ? next : null },
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Save failed')
      toast.success(asCustom ? 'Homepage section order saved' : 'Reset to layout pack default')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Save failed'
      setError(message)
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  async function save() {
    await persist(order, true)
  }

  async function resetToPack() {
    setOrder([...packOrder])
    await persist(packOrder, false)
  }

  return (
    <div className="space-y-4 border border-black/10 bg-white p-6">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[color:var(--icms-gold)]">
          Homepage section order
        </h2>
        <p className="mt-1 text-sm text-[color:var(--icms-warm-gray)]">
          Drag a row, or use the arrows, then save. This only changes{' '}
          <span className="font-medium text-[color:var(--icms-charcoal)]">this centre</span>
          — no code edit needed. Public homepage: /icms/{tenantSlug}
        </p>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <ol className="space-y-2">
        {order.map((id, index) => {
          const meta = HOME_SECTION_LABELS[id]
          return (
            <li
              key={id}
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragOver={(e) => {
                e.preventDefault()
                if (dragIndex === null || dragIndex === index) return
                move(dragIndex, index)
                setDragIndex(index)
              }}
              onDragEnd={() => setDragIndex(null)}
              className={`flex cursor-grab items-center gap-3 rounded-lg border bg-[color:var(--icms-ivory)] px-3 py-3 active:cursor-grabbing ${
                dragIndex === index
                  ? 'border-[color:var(--icms-emerald)] shadow-sm'
                  : 'border-black/10'
              }`}
            >
              <span
                className="select-none text-lg leading-none text-[color:var(--icms-warm-gray)]"
                aria-hidden
              >
                ⋮⋮
              </span>
              <span className="w-6 text-xs font-semibold text-[color:var(--icms-gold)]">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-[color:var(--icms-charcoal)]">{meta.title}</p>
                <p className="text-xs text-[color:var(--icms-warm-gray)]">{meta.hint}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  disabled={index === 0 || saving}
                  onClick={() => move(index, index - 1)}
                  className="rounded border border-black/10 px-2 py-1 text-xs disabled:opacity-30"
                  aria-label={`Move ${meta.title} up`}
                >
                  ↑
                </button>
                <button
                  type="button"
                  disabled={index === order.length - 1 || saving}
                  onClick={() => move(index, index + 1)}
                  className="rounded border border-black/10 px-2 py-1 text-xs disabled:opacity-30"
                  aria-label={`Move ${meta.title} down`}
                >
                  ↓
                </button>
              </div>
            </li>
          )
        })}
      </ol>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={saving}
          onClick={() => void save()}
          className="icms-btn-primary"
        >
          {saving ? 'Saving…' : 'Save order'}
        </button>
        <button
          type="button"
          disabled={saving || packDefault}
          onClick={() => void resetToPack()}
          className="icms-btn-secondary"
        >
          Reset to layout pack
        </button>
      </div>
    </div>
  )
}
