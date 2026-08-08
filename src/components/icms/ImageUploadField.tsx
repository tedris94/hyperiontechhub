'use client'

import { useState } from 'react'

const ACCEPT =
  'image/*,.jpg,.jpeg,.png,.webp,.gif,.avif,.svg,.bmp,.tif,.tiff,.heic,.heif,.ico'

/** Choose a local image file (converted server-side) or paste a path/URL. */
export default function ImageUploadField({
  label,
  value,
  onChange,
  tenantSlug,
  hint,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  tenantSlug: string
  hint?: string
}) {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  async function onPick(file: File | null) {
    if (!file) return
    setUploading(true)
    setUploadError('')
    try {
      const body = new FormData()
      body.set('tenantSlug', tenantSlug)
      body.set('file', file)
      const res = await fetch('/api/icms/upload', { method: 'POST', body })
      const data = (await res.json()) as { error?: string; url?: string }
      if (!res.ok || !data.url) throw new Error(data.error || 'Upload failed')
      onChange(data.url)
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      {hint ? <p className="text-xs text-[color:var(--icms-warm-gray)]">{hint}</p> : null}
      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex cursor-pointer items-center rounded border border-[color:var(--icms-emerald)] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[color:var(--icms-emerald)]">
          {uploading ? 'Uploading…' : 'Choose file'}
          <input
            type="file"
            accept={ACCEPT}
            className="hidden"
            disabled={uploading}
            onChange={(e) => void onPick(e.target.files?.[0] || null)}
          />
        </label>
        <span className="text-xs text-[color:var(--icms-warm-gray)]">or paste a path / URL</span>
      </div>
      <input
        className="icms-input"
        value={value}
        placeholder="/icms/uploads/… or /icms/media/….avif"
        onChange={(e) => onChange(e.target.value)}
      />
      {uploadError ? <p className="text-xs text-red-600">{uploadError}</p> : null}
      {value ? (
        <div className="relative mt-2 h-36 w-full max-w-md overflow-hidden border border-black/10 bg-black/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="h-full w-full object-cover" />
        </div>
      ) : null}
    </div>
  )
}
