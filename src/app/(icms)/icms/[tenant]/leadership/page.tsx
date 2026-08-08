import { notFound } from 'next/navigation'
import { getTenantBySlug, mapTenantDoc } from '@/lib/icms/tenants'
import { getLeaders, getPageContent } from '@/lib/icms/content'
import PageHero from '@/components/icms/PageHero'
import LeaderPhoto from './LeaderPhoto'

type Props = { params: Promise<{ tenant: string }> }

const labels = {
  imam: 'Imams',
  director: 'Directors',
  committee: 'Committee',
} as const

export default async function LeadershipPage({ params }: Props) {
  const { tenant: slug } = await params
  const doc = await getTenantBySlug(slug)
  if (!doc) notFound()
  const tenant = mapTenantDoc(doc)
  const [leaders, page] = await Promise.all([getLeaders(doc.id), getPageContent(doc.id, 'leadership')])

  const groups = (['imam', 'director', 'committee'] as const).map((category) => ({
    category,
    title: labels[category],
    people: leaders.filter((l) => l.category === category),
  }))

  return (
    <>
      <PageHero
        tenant={tenant}
        title={page.heroTitle || 'Leadership'}
        subtitle={
          page.heroSubtitle ||
          'Imams, directors, and committee members serving the community with trust and sincerity.'
        }
      />
      <section className="icms-section">
        <div className="icms-container space-y-14">
          {groups.map((group) => (
            <div key={group.category}>
              <h2 className="icms-display text-2xl text-[color:var(--icms-forest)]">
                {group.title}
              </h2>
              <div className="mt-6 divide-y divide-black/10 border-y border-black/10">
                {group.people.map((person) => (
                  <div key={person.id} className="grid gap-4 py-6 md:grid-cols-[180px_1fr]">
                    <LeaderPhoto name={person.name} photoUrl={person.photoUrl} />
                    <div>
                      <h3 className="icms-display text-xl text-[color:var(--icms-forest)]">
                        {person.name}
                      </h3>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--icms-gold)]">
                        {person.role}
                      </p>
                      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[color:var(--icms-warm-gray)]">
                        {person.bio}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
