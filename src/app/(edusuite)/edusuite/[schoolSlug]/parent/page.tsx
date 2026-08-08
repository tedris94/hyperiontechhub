import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getSchoolBySlug } from '@/lib/edusuite/tenant'
import { getPayloadSingleton, isPayloadEnabled } from '@/lib/payload'
import { getCurrentUser } from '@/lib/auth'
import InvoicePayButton from '@/components/edusuite/InvoicePayButton'

type Props = { params: Promise<{ schoolSlug: string }> }

export default async function ParentPortalPage({ params }: Props) {
  const { schoolSlug } = await params
  const school = await getSchoolBySlug(schoolSlug)
  if (!school) notFound()

  const user = await getCurrentUser()
  const userId = user?.id
  const email = user?.email

  let children: Array<{
    id: unknown
    title?: string
    className?: string
    admissionNo?: string
    rollNo?: string
  }> = []
  let invoices: Array<{
    id: unknown
    title?: string
    amount?: number
    status?: string
    student?: unknown
  }> = []
  let results: Array<{
    id: unknown
    title?: string
    studentName?: string
    average?: number
    gpa?: number
    grade?: string
    score?: number
    exam?: string
    year?: string
  }> = []
  let notices: Array<{ id: unknown; title?: string; body?: string }> = []

  if (isPayloadEnabled()) {
    const payload = await getPayloadSingleton()
    const schoolFilter = { school: { equals: school.id } }

    const studentWhere =
      userId || email
        ? {
            and: [
              schoolFilter,
              {
                or: [
                  ...(userId
                    ? [
                        { parentUser: { equals: userId } },
                        { user: { equals: userId } },
                      ]
                    : []),
                  ...(email ? [{ guardianEmail: { equals: email } }] : []),
                ],
              },
            ],
          }
        : schoolFilter

    const studs = await payload.find({
      collection: 'edu-students',
      where: studentWhere,
      limit: 50,
      sort: 'title',
      overrideAccess: true,
    })
    children = studs.docs as typeof children
    const childIds = children.map((c) => c.id)

    const [inv, resCards, note, legacyRes] = await Promise.all([
      payload.find({
        collection: 'edu-invoices',
        where:
          childIds.length > 0
            ? {
                and: [schoolFilter, { student: { in: childIds } }],
              }
            : schoolFilter,
        limit: 20,
        sort: '-updatedAt',
        overrideAccess: true,
      }),
      payload.find({
        collection: 'edu-results',
        where:
          childIds.length > 0
            ? {
                and: [
                  schoolFilter,
                  { published: { equals: true } },
                  { student: { in: childIds } },
                ],
              }
            : { and: [schoolFilter, { published: { equals: true } }] },
        limit: 20,
        sort: '-updatedAt',
        overrideAccess: true,
      }),
      payload.find({
        collection: 'edu-notices',
        where: schoolFilter,
        limit: 5,
        sort: '-updatedAt',
        overrideAccess: true,
      }),
      payload.find({
        collection: 'edu-exam-results',
        where: { and: [schoolFilter, { published: { equals: true } }] },
        limit: 10,
        sort: '-updatedAt',
        overrideAccess: true,
      }),
    ])

    invoices = inv.docs as typeof invoices
    results = (resCards.docs.length ? resCards.docs : legacyRes.docs) as typeof results
    notices = note.docs as typeof notices

    // If no linked children, show empty lists for fees/results (privacy) but still show notices
    if (childIds.length === 0 && (userId || email)) {
      invoices = []
      results = []
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-[#1B1C1E]">Parent portal</h2>
        <p className="text-gray-600 mt-1">
          Children linked to your account, fees, published results, and notices for {school.name}.
        </p>
      </div>

      <section className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold mb-3">Children / students</h3>
        {children.length === 0 ? (
          <p className="text-sm text-gray-500">
            No students linked to your email or parent account yet. Ask the school to set guardian email /
            parent user on the student profile.
          </p>
        ) : (
          <ul className="space-y-2 text-sm">
            {children.map((c) => (
              <li key={String(c.id)} className="flex justify-between border-b border-gray-100 py-2">
                <span className="font-medium">{c.title}</span>
                <span className="text-gray-500">
                  {c.className || '—'}
                  {c.rollNo ? ` · Roll ${c.rollNo}` : ''}
                  {c.admissionNo ? ` · ${c.admissionNo}` : ''}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold mb-3">Fee invoices</h3>
        {invoices.length === 0 ? (
          <p className="text-sm text-gray-500">No invoices for your children.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {invoices.map((i) => (
              <li
                key={String(i.id)}
                className="flex justify-between items-center gap-4 border-b border-gray-100 py-2"
              >
                <span>
                  {i.title}
                  <span className="text-gray-500 ml-2">
                    ₦{Number(i.amount || 0).toLocaleString()} · {i.status || 'pending'}
                  </span>
                </span>
                <InvoicePayButton
                  schoolSlug={schoolSlug}
                  invoiceId={i.id as string | number}
                  status={i.status}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold mb-3">Published results</h3>
        {results.length === 0 ? (
          <p className="text-sm text-gray-500">No published results yet.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {results.map((r) => (
              <li key={String(r.id)} className="flex justify-between border-b border-gray-100 py-2">
                <span>
                  {r.studentName || r.title}
                  {r.exam ? ` · ${r.exam}` : ''}
                  {r.year ? ` ${r.year}` : ''}
                </span>
                <span className="flex items-center gap-3">
                  {r.average != null ? `Avg ${r.average}` : r.score != null ? r.score : ''}
                  {r.gpa != null ? ` · GPA ${r.gpa}` : ''}
                  {r.grade ? ` (${r.grade})` : ''}
                  {'studentName' in r || r.exam ? (
                    <Link
                      href={`/edusuite/${schoolSlug}/results/${r.id}/card`}
                      className="text-[#1A2BC2] hover:underline"
                    >
                      Card
                    </Link>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold mb-3">Notices</h3>
        {notices.length === 0 ? (
          <p className="text-sm text-gray-500">No notices yet.</p>
        ) : (
          <ul className="space-y-3 text-sm">
            {notices.map((n) => (
              <li key={String(n.id)}>
                <p className="font-medium">{n.title}</p>
                <p className="text-gray-600">{n.body}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
