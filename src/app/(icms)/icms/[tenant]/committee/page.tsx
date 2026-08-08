import { notFound } from 'next/navigation'
import { getTenantBySlug, mapTenantDoc } from '@/lib/icms/tenants'
import { getPageContent, getPublicCommitteeMembers } from '@/lib/icms/content'
import type { CommitteeType } from '@/lib/icms/types'
import PageHero from '@/components/icms/PageHero'
import LeaderPhoto from '../leadership/LeaderPhoto'

type Props = { params: Promise<{ tenant: string }> }

const COMMITTEE_ORDER: CommitteeType[] = [
  'shurah',
  'hr',
  'waqf',
  'education',
  'outreach',
  'finance',
  'other',
]

const labels: Record<CommitteeType, string> = {
  shurah: 'Shurah Council',
  hr: 'HR Committee',
  waqf: 'Waqf & Projects',
  education: 'Education',
  outreach: 'Outreach',
  finance: 'Finance',
  other: 'Other committees',
}

function formatTerm(start?: string, end?: string) {
  if (!start && !end) return null
  if (start && end) return `Term: ${start} – ${end}`
  if (start) return `Serving since ${start}`
  return `Until ${end}`
}

export default async function CommitteePage({ params }: Props) {
  const { tenant: slug } = await params
  const doc = await getTenantBySlug(slug)
  if (!doc) notFound()
  const tenant = mapTenantDoc(doc)
  const [members, page] = await Promise.all([
    getPublicCommitteeMembers(doc.id),
    getPageContent(doc.id, 'committee'),
  ])

  const groups = COMMITTEE_ORDER.map((committeeType) => ({
    committeeType,
    title: labels[committeeType],
    people: members.filter((m) => m.committeeType === committeeType),
  })).filter((g) => g.people.length > 0)

  return (
    <>
      <PageHero
        tenant={tenant}
        title={page.heroTitle || 'Shurah & Committees'}
        subtitle={
          page.heroSubtitle ||
          'Shurah, HR, and standing committees entrusted with counsel, accountability, and service.'
        }
      />
      <section className="icms-section">
        <div className="icms-container space-y-14">
          {groups.length === 0 ? (
            <p className="text-sm text-[color:var(--icms-warm-gray)]">
              Committee members will appear here once the centre publishes its roster.
            </p>
          ) : (
            groups.map((group) => (
              <div key={group.committeeType}>
                <h2 className="icms-display text-2xl text-[color:var(--icms-forest)]">
                  {group.title}
                </h2>
                <div className="mt-6 divide-y divide-black/10 border-y border-black/10">
                  {group.people.map((person) => {
                    const term = formatTerm(person.termStart, person.termEnd)
                    return (
                      <div key={person.id} className="grid gap-4 py-6 md:grid-cols-[180px_1fr]">
                        <LeaderPhoto name={person.name} photoUrl={person.photoUrl} />
                        <div>
                          <h3 className="icms-display text-xl text-[color:var(--icms-forest)]">
                            {person.name}
                          </h3>
                          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--icms-gold)]">
                            {person.roleTitle}
                          </p>
                          {term ? (
                            <p className="mt-2 text-xs text-[color:var(--icms-warm-gray)]">{term}</p>
                          ) : null}
                          {person.bio ? (
                            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[color:var(--icms-warm-gray)]">
                              {person.bio}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  )
}
