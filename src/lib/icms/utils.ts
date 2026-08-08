import type { CSSProperties } from 'react'
import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { TenantConfig } from '@/lib/icms/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function tenantCssVars(tenant: TenantConfig): CSSProperties {
  return {
    ['--icms-emerald' as string]: tenant.colors.emerald,
    ['--icms-forest' as string]: tenant.colors.forest,
    ['--icms-gold' as string]: tenant.colors.gold,
    ['--icms-ivory' as string]: tenant.colors.ivory,
    ['--icms-charcoal' as string]: tenant.colors.charcoal,
    ['--icms-warm-gray' as string]: tenant.colors.warmGray,
  }
}
