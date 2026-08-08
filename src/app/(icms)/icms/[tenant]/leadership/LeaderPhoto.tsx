'use client'

import Image from 'next/image'
import { useState } from 'react'

function Initials({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() || '')
    .join('')
  return (
    <div className="flex h-28 w-28 items-center justify-center rounded-[1.25rem] bg-[color:var(--icms-emerald)] text-2xl font-semibold text-white">
      {initials}
    </div>
  )
}

/** Renders leader portrait; falls back to initials if the URL is missing or broken. */
export default function LeaderPhoto({
  name,
  photoUrl,
}: {
  name: string
  photoUrl?: string
}) {
  const [failed, setFailed] = useState(false)
  const src = photoUrl?.trim()

  if (!src || failed) {
    return <Initials name={name} />
  }

  const isLocal = src.startsWith('/')

  return (
    <div className="relative h-28 w-28 overflow-hidden rounded-[1.25rem] bg-[color:var(--icms-ivory)]">
      {isLocal ? (
        // Local uploads (incl. SVG) — avoid next/image optimizer edge cases
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <Image
          src={src}
          alt={name}
          fill
          className="object-cover"
          sizes="112px"
          unoptimized
          onError={() => setFailed(true)}
        />
      )}
    </div>
  )
}
