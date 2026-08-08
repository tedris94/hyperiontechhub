import { notFound } from 'next/navigation'
import { getSchoolBySlug } from '@/lib/edusuite/tenant'
import { getPayloadSingleton, isPayloadEnabled } from '@/lib/payload'

type Props = { params: Promise<{ schoolSlug: string }> }

export default async function ReportsPage({ params }: Props) {
  const { schoolSlug } = await params
  const school = await getSchoolBySlug(schoolSlug)
  if (!school) notFound()

  const stats: Array<{ label: string; value: number }> = []
  if (isPayloadEnabled()) {
    const payload = await getPayloadSingleton()
    const f = { school: { equals: school.id } }
    const keys = [
      ['Students', 'edu-students'],
      ['Staff', 'edu-staff'],
      ['Classes', 'edu-classes'],
      ['Attendance rows', 'edu-attendance'],
      ['Exams', 'edu-exams'],
      ['Results', 'edu-exam-results'],
      ['Fee structures', 'edu-fee-structures'],
      ['Invoices', 'edu-invoices'],
      ['Library books', 'edu-library-books'],
      ['Transport routes', 'edu-transport-routes'],
      ['Hostel rooms', 'edu-hostel-rooms'],
      ['Inventory items', 'edu-inventory-items'],
      ['Documents', 'edu-documents'],
      ['Events', 'edu-events'],
      ['Alumni', 'edu-alumni'],
      ['Learning materials', 'edu-learning-materials'],
      ['Notices', 'edu-notices'],
    ] as const

    for (const [label, collection] of keys) {
      const r = await payload.count({ collection: collection as 'edu-students', where: f })
      stats.push({ label, value: r.totalDocs })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-[#1B1C1E]">Reports & analytics</h2>
        <p className="text-gray-600 mt-1">Cross-module counts for {school.name}.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className="text-2xl font-semibold text-[#1A2BC2] mt-1">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
