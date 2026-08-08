'use client'

import { useEffect, useState } from 'react'
import type { ContactMessage } from '@/lib/icms/types'
import DeleteRecordButton from '@/components/icms/DeleteRecordButton'
import { useIcmsToast } from '@/components/icms/toast'

const STATUSES = ['new', 'read', 'replied', 'archived'] as const

export default function InboxAdmin({
  tenantSlug,
  messages: initialMessages,
}: {
  tenantSlug: string
  messages: ContactMessage[]
}) {
  const toast = useIcmsToast()
  const [messages, setMessages] = useState(initialMessages)
  const [busyId, setBusyId] = useState<string | null>(null)

  useEffect(() => {
    setMessages(initialMessages)
  }, [initialMessages])

  async function setStatus(id: string, status: string) {
    setBusyId(id)
    try {
      const res = await fetch('/api/icms/records', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collection: 'icms-contact-messages',
          tenantSlug,
          id,
          data: { status },
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Update failed')
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)))
      toast.success('Status updated')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Update failed')
    } finally {
      setBusyId(null)
    }
  }

  if (messages.length === 0) {
    return <p className="text-sm text-[color:var(--icms-warm-gray)]">No messages yet.</p>
  }

  return (
    <div className="space-y-4">
      {messages.map((m) => (
        <article key={m.id} className="border border-black/10 bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-[color:var(--icms-forest)]">{m.name}</p>
              <p className="text-sm text-[color:var(--icms-warm-gray)]">
                {m.email}
                {m.phone ? ` · ${m.phone}` : ''}
              </p>
              {m.subject ? <p className="mt-1 text-sm font-medium">{m.subject}</p> : null}
            </div>
            <div className="text-right">
              <label className="block text-xs uppercase tracking-wider text-[color:var(--icms-warm-gray)]">
                Status
                <select
                  className="icms-input mt-1 min-w-[120px] text-xs normal-case"
                  value={m.status || 'new'}
                  disabled={busyId === m.id}
                  onChange={(e) => void setStatus(m.id, e.target.value)}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
              <p className="mt-2 text-xs text-[color:var(--icms-warm-gray)]">
                {m.createdAt ? m.createdAt.slice(0, 16).replace('T', ' ') : ''}
              </p>
              <div className="mt-2">
                <DeleteRecordButton
                  collection="icms-contact-messages"
                  id={m.id}
                  tenantSlug={tenantSlug}
                  onSuccess={() =>
                    setMessages((prev) => prev.filter((x) => String(x.id) !== String(m.id)))
                  }
                />
              </div>
            </div>
          </div>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[color:var(--icms-charcoal)]">
            {m.message}
          </p>
        </article>
      ))}
    </div>
  )
}
