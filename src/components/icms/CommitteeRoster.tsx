export type CommitteeRosterPerson = {
  name: string
  role: string
  note?: string
}

function Initials({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('')
  return (
    <div
      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[color:var(--icms-emerald)] text-sm font-semibold text-white"
      aria-hidden
    >
      {initials}
    </div>
  )
}

/** Compact team tiles for BOT / committee rosters — light borders, no heavy card chrome. */
export default function CommitteeRoster({
  people,
  emptyLabel = 'Members to be published.',
}: {
  people: CommitteeRosterPerson[]
  emptyLabel?: string
}) {
  if (!people.length) {
    return <p className="text-sm text-[color:var(--icms-warm-gray)]">{emptyLabel}</p>
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {people.map((person) => (
        <li
          key={`${person.name}-${person.role}`}
          className="flex gap-4 border border-[color:var(--icms-gold)]/30 bg-white p-4"
        >
          <Initials name={person.name} />
          <div className="min-w-0">
            <p className="icms-display text-base leading-snug text-[color:var(--icms-forest)]">
              {person.name}
            </p>
            <p className="mt-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--icms-gold)]">
              {person.role}
            </p>
            {person.note ? (
              <p className="mt-2 text-xs leading-relaxed text-[color:var(--icms-warm-gray)]">
                {person.note}
              </p>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  )
}
