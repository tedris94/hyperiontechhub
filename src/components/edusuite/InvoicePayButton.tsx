'use client'

import { useState } from 'react'

export default function InvoicePayButton({
  schoolSlug,
  invoiceId,
  status,
}: {
  schoolSlug: string
  invoiceId: string | number
  status?: string
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (status === 'paid' || status === 'waived' || status === 'cancelled') {
    return <span className="text-xs text-gray-400">{status}</span>
  }

  async function pay() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/edusuite/fees/paystack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schoolSlug, invoiceId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Payment init failed')
      if (data.authorization_url) {
        window.location.href = data.authorization_url
        return
      }
      throw new Error('No payment URL returned')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Payment failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <span className="inline-flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={() => void pay()}
        disabled={loading}
        className="text-xs bg-[#1A2BC2] text-white px-3 py-1.5 rounded-lg hover:bg-[#0D0D52] disabled:opacity-60"
      >
        {loading ? 'Redirecting…' : 'Pay with Paystack'}
      </button>
      {error && <span className="text-xs text-red-600 max-w-[12rem] text-right">{error}</span>}
    </span>
  )
}
