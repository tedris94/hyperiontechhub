import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getSchoolBySlug } from '@/lib/edusuite/tenant'
import { getPayloadSingleton, isPayloadEnabled } from '@/lib/payload'

type Props = { params: Promise<{ schoolSlug: string }> }

export default async function ResultsListPage({ params }: Props) {
  const { schoolSlug } = await params
  const school = await getSchoolBySlug(schoolSlug)
  if (!school) notFound()

  let docs: Array<{
    id: unknown
    title?: string
    studentName?: string
    className?: string
    exam?: string
    year?: string
    average?: number
    gpa?: number
    resultStatus?: string
    published?: boolean
  }> = []

  if (isPayloadEnabled()) {
    const payload = await getPayloadSingleton()
    const found = await payload.find({
      collection: 'edu-results',
      where: { school: { equals: school.id } },
      limit: 100,
      sort: '-updatedAt',
      overrideAccess: true,
    })
    docs = found.docs as typeof docs
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-[#1B1C1E]">All Results</h2>
          <p className="text-gray-600 mt-1">Published and draft result cards. Print from the card page.</p>
        </div>
        <Link
          href={`/edusuite/${schoolSlug}/marks`}
          className="text-sm bg-[#1A2BC2] text-white px-4 py-2 rounded-lg"
        >
          Mark sheet
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {docs.length === 0 ? (
          <p className="p-6 text-gray-500">No result cards yet. Enter marks and publish.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Class</th>
                <th className="px-4 py-3">Exam</th>
                <th className="px-4 py-3">Avg / GPA</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {docs.map((r) => (
                <tr key={String(r.id)} className="border-t">
                  <td className="px-4 py-3 font-medium">{r.studentName || r.title}</td>
                  <td className="px-4 py-3">{r.className}</td>
                  <td className="px-4 py-3">
                    {r.exam} · {r.year}
                  </td>
                  <td className="px-4 py-3">
                    {r.average ?? '—'} / {r.gpa ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    {r.resultStatus || '—'}
                    {r.published ? ' · published' : ' · draft'}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/edusuite/${schoolSlug}/results/${r.id}/card`}
                      className="text-[#1A2BC2] hover:underline"
                    >
                      Report card
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
