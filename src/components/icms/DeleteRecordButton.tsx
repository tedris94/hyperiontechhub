'use client'

import { useState } from 'react'
import { useIcmsToast } from '@/components/icms/toast'

export default function DeleteRecordButton({
  collection,
  id,
  tenantSlug,
  onSuccess,
  label = 'Delete',
}: {
  collection: string
  id: string | number
  tenantSlug: string
  onSuccess?: () => void
  label?: string
}) {
  const toast = useIcmsToast()
  const [busy, setBusy] = useState(false)

  async function onDelete() {
    if (!confirm('Delete this record?')) return
    setBusy(true)
    try {
      const res = await fetch(
        `/api/icms/records?collection=${encodeURIComponent(collection)}&id=${encodeURIComponent(String(id))}&tenantSlug=${encodeURIComponent(tenantSlug)}`,
        { method: 'DELETE' },
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Delete failed')
      toast.success('Record deleted')
      onSuccess?.()
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Delete failed'
      toast.error(message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      type="button"
      onClick={() => void onDelete()}
      disabled={busy}
      className="text-xs font-medium text-red-700 hover:underline disabled:opacity-50"
    >
      {busy ? '…' : label}
    </button>
  )
}
