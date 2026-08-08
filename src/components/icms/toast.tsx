'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

export type ToastTone = 'success' | 'error' | 'info'

type ToastItem = {
  id: string
  message: string
  tone: ToastTone
}

type ToastApi = {
  success: (message: string) => void
  error: (message: string) => void
  info: (message: string) => void
}

const ToastContext = createContext<ToastApi | null>(null)

let toastId = 0

export function IcmsToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])

  const dismiss = useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const push = useCallback((message: string, tone: ToastTone) => {
    const id = `toast-${++toastId}`
    setItems((prev) => [...prev.slice(-4), { id, message, tone }])
    window.setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id))
    }, 4200)
  }, [])

  const api = useMemo<ToastApi>(
    () => ({
      success: (message) => push(message, 'success'),
      error: (message) => push(message, 'error'),
      info: (message) => push(message, 'info'),
    }),
    [push],
  )

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        className="pointer-events-none fixed bottom-4 right-4 z-[200] flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2"
        aria-live="polite"
      >
        {items.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto border px-4 py-3 text-sm shadow-lg ${
              t.tone === 'success'
                ? 'border-[color:var(--icms-emerald)]/30 bg-white text-[color:var(--icms-forest)]'
                : t.tone === 'error'
                  ? 'border-red-200 bg-white text-red-800'
                  : 'border-black/10 bg-white text-[color:var(--icms-charcoal)]'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="leading-snug">{t.message}</p>
              <button
                type="button"
                className="shrink-0 text-xs uppercase tracking-wider text-[color:var(--icms-warm-gray)] hover:underline"
                onClick={() => dismiss(t.id)}
              >
                Close
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useIcmsToast(): ToastApi {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    return {
      success: () => undefined,
      error: () => undefined,
      info: () => undefined,
    }
  }
  return ctx
}

/** Optional: clear toasts on route change when used inside a client shell. */
export function useDismissToastsOnPath(pathname: string) {
  const [, setTick] = useState(0)
  useEffect(() => {
    setTick((n) => n + 1)
  }, [pathname])
}
