'use client'

import { useState } from 'react'
import type { IcmsNavItem } from '@/lib/icms/types'

type Props = {
  tenantId: string
  tenantSlug: string
  initial: IcmsNavItem[]
}

const emptyItem: IcmsNavItem = { label: '', href: '', placement: 'primary' }

export default function NavigationEditor({ tenantId, tenantSlug, initial }: Props) {
  const [items, setItems] = useState<IcmsNavItem[]>(initial)
  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)

  function updateItem(index: number, patch: Partial<IcmsNavItem>) {
    setItems((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)))
  }

  function moveItem(index: number, direction: -1 | 1) {
    const nextIndex = index + direction
    if (nextIndex < 0 || nextIndex >= items.length) return
    setItems((current) => {
      const next = [...current]
      ;[next[index], next[nextIndex]] = [next[nextIndex], next[index]]
      return next
    })
  }

  function addItem() {
    setItems((current) => [...current, { ...emptyItem }])
  }

  function removeItem(index: number) {
    setItems((current) => current.filter((_, itemIndex) => itemIndex !== index))
  }

  async function save() {
    const navigation = items.map((item) => ({
      label: item.label.trim(),
      href: item.href.trim().replace(/^\/+|\/+$/g, ''),
      placement: item.placement,
    }))
    if (navigation.some((item) => !item.label || !item.href)) {
      setStatus('Every item needs a label and path.')
      return
    }

    setSaving(true)
    setStatus('')
    try {
      const response = await fetch('/api/icms/records', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          collection: 'icms-tenants',
          id: tenantId,
          tenantSlug,
          data: { navigation },
        }),
      })
      const result = (await response.json()) as { error?: string }
      if (!response.ok) throw new Error(result.error || 'Unable to save navigation')
      setItems(navigation)
      setStatus('Navigation saved.')
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to save navigation')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[color:var(--icms-warm-gray)]">
          Items are shown in order. Choose More to place an item in the hover dropdown.
        </p>
        <button type="button" onClick={addItem} className="border border-black/15 px-4 py-2 text-sm font-medium hover:bg-black/5">
          Add item
        </button>
      </div>

      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={`${item.href}-${index}`} className="grid gap-2 border border-black/10 bg-white p-3 sm:grid-cols-[1fr_1fr_9rem_auto] sm:items-center">
            <input
              value={item.label}
              onChange={(event) => updateItem(index, { label: event.target.value })}
              placeholder="Label"
              aria-label="Navigation label"
              className="border border-black/15 px-3 py-2 text-sm"
            />
            <input
              value={item.href}
              onChange={(event) => updateItem(index, { href: event.target.value })}
              placeholder="path, e.g. dawah"
              aria-label="Navigation path"
              className="border border-black/15 px-3 py-2 text-sm"
            />
            <select
              value={item.placement}
              onChange={(event) => updateItem(index, { placement: event.target.value as IcmsNavItem['placement'] })}
              aria-label="Navigation placement"
              className="border border-black/15 px-3 py-2 text-sm"
            >
              <option value="primary">Primary</option>
              <option value="more">More</option>
            </select>
            <div className="flex items-center justify-end gap-1">
              <button type="button" onClick={() => moveItem(index, -1)} disabled={index === 0} aria-label="Move item up" className="border border-black/15 px-2 py-2 text-sm disabled:opacity-30">↑</button>
              <button type="button" onClick={() => moveItem(index, 1)} disabled={index === items.length - 1} aria-label="Move item down" className="border border-black/15 px-2 py-2 text-sm disabled:opacity-30">↓</button>
              <button type="button" onClick={() => removeItem(index)} aria-label={`Remove ${item.label || 'navigation item'}`} className="border border-red-200 px-2 py-2 text-sm text-red-700 hover:bg-red-50">×</button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button type="button" onClick={save} disabled={saving} className="bg-[color:var(--icms-forest)] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
          {saving ? 'Saving...' : 'Save navigation'}
        </button>
        {status ? <p className="text-sm text-[color:var(--icms-warm-gray)]" role="status">{status}</p> : null}
      </div>
    </div>
  )
}
