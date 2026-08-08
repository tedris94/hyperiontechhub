import Link from 'next/link'
import Image from 'next/image'
import type { TenantConfig } from '@/lib/icms/types'
import type { FooterStyle } from '@/lib/icms/ui-variants'

function hrefJoin(base: string, path: string) {
  if (!path) return base || '/'
  if (!base) return `/${path}`
  return `${base}/${path}`
}

export default function IcmsFooter({
  tenant,
  basePath,
  footerStyle = 'classic',
}: {
  tenant: TenantConfig
  basePath?: string
  footerStyle?: FooterStyle
}) {
  const base = basePath ?? `/icms/${tenant.slug}`
  const year = new Date().getFullYear()

  const explore = [
    ['About', 'about'],
    ['Mosque', 'mosque'],
    ['Events', 'events'],
    ['Donate', 'donate'],
    ['Waqf', 'waqf'],
    ['Articles', 'articles'],
    ['Leadership', 'leadership'],
    ['Shurah', 'committee'],
    ['Contact', 'contact'],
  ] as const

  if (footerStyle === 'centered') {
    return (
      <footer className="bg-[color:var(--icms-forest)] text-white">
        <div className="icms-container px-4 py-16 text-center md:px-8">
          <Image
            src={tenant.logo}
            alt={tenant.name}
            width={48}
            height={48}
            className="mx-auto h-12 w-12 rounded-full bg-white object-contain p-1"
          />
          <p className="icms-display mt-4 text-xl">{tenant.shortName}</p>
          <p className="mt-2 text-sm text-white/70">{tenant.motto}</p>
          <div className="mx-auto mt-8 flex max-w-xl flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-white/80">
            {explore.map(([label, href]) => (
              <Link key={href} href={hrefJoin(base, href)} className="hover:text-white">
                {label}
              </Link>
            ))}
          </div>
          <p className="mt-10 text-xs text-white/50">
            © {year} {tenant.name}. All rights reserved.
          </p>
        </div>
      </footer>
    )
  }

  const pad = footerStyle === 'compact' ? 'py-10' : 'py-14'

  return (
    <footer className="bg-[color:var(--icms-forest)] text-white">
      <div className={`icms-container px-4 ${pad} md:px-8`}>
        <div className={`grid gap-10 ${footerStyle === 'compact' ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
          <div>
            <div className="mb-4 flex items-center gap-3">
              <Image
                src={tenant.logo}
                alt={tenant.name}
                width={44}
                height={44}
                className="h-11 w-11 rounded-full bg-white object-contain p-1"
              />
              <div>
                <p className="icms-display text-lg">{tenant.shortName}</p>
                <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--icms-gold)]">
                  Islamic Center
                </p>
              </div>
            </div>
            <p className="text-sm text-white/75">{tenant.motto}</p>
          </div>

          {footerStyle !== 'compact' ? (
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[color:var(--icms-gold)]">
                Visit
              </p>
              <p className="text-sm leading-relaxed text-white/80">{tenant.address}</p>
              <div className="mt-3 space-y-1 text-sm text-white/80">
                {tenant.phones.map((phone) => (
                  <p key={phone}>
                    <a href={`tel:${phone}`} className="hover:text-white">
                      {phone}
                    </a>
                  </p>
                ))}
                <p>
                  <a href={`mailto:${tenant.email}`} className="hover:text-white">
                    {tenant.email}
                  </a>
                </p>
              </div>
            </div>
          ) : null}

          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[color:var(--icms-gold)]">
              Explore
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm text-white/80">
              {explore.map(([label, href]) => (
                <Link key={href} href={hrefJoin(base, href)} className="hover:text-white">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="icms-hairline mt-10 opacity-40" />
        <div className="mt-6 flex flex-col gap-2 text-xs text-white/55 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {tenant.name}. All rights reserved.
          </p>
          <p className="text-white/40">{tenant.domainLabel}</p>
        </div>
      </div>
    </footer>
  )
}
