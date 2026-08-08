'use client'

import { useState } from 'react'

export default function NoticePublishButton({
  schoolSlug,
  noticeId,
}: {
  schoolSlug: string
  noticeId: string | number
}) {
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  async function publish(channel: 'email' | 'sms' | 'both') {
    setLoading(true)
    setMsg('')
    try {
      const res = await fetch('/api/edusuite/notices/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schoolSlug, noticeId, channel }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      setMsg(data.note || 'Published')
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <span className="inline-flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={loading}
        onClick={() => void publish('email')}
        className="text-xs border border-[#1A2BC2] text-[#1A2BC2] px-2 py-1 rounded-lg hover:bg-[#1A2BC2]/5 disabled:opacity-60"
      >
        {loading ? '…' : 'Publish / email'}
      </button>
      {msg && <span className="text-[10px] text-gray-500 max-w-[10rem] text-right">{msg}</span>}
    </span>
  )
}
