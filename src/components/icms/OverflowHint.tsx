'use client'

import { useEffect, useRef, useState } from 'react'

export default function OverflowHint({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [overflows, setOverflows] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const update = () => setOverflows(element.scrollWidth > element.clientWidth + 1)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      {overflows ? <p className="mb-3 text-right text-xs font-semibold uppercase tracking-wider text-[color:var(--icms-gold)]">Scroll right →</p> : null}
      <div ref={ref} className="overflow-x-auto">{children}</div>
    </>
  )
}
