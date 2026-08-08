import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayloadSingleton, isPayloadEnabled } from '@/lib/payload'
import { getSchoolBySlug } from '@/lib/edusuite/tenant'
import { getCurrentUser } from '@/lib/auth'
import { resolveTenantAccess } from '@/lib/edusuite/tenant'
import type { SchoolRole } from '@/lib/edusuite/nav'

type Props = { params: Promise<{ schoolSlug: string }> }

function roleHeadline(role: SchoolRole | null, isAdmin: boolean): string {
  if (isAdmin) return 'Platform overview — all modules available.'
  switch (role) {
    case 'teacher':
      return 'Teacher home — classes, attendance, exams, and LMS materials.'
    case 'accountant':
      return 'Finance home — fee structures, invoices, and arrears.'
    case 'parent':
      return 'Parent home — fees, results, and school notices.'
    case 'student':
      return 'Student home — results, notices, and learning materials.'
    case 'principal':
    case 'owner':
    case 'vice_principal':
      return 'Leadership home — enrolment, staff, fees, and term progress.'
    default:
      return 'School operations dashboard.'
  }
}

export default async function SchoolDashboardPage({ params }: Props) {
  const { schoolSlug } = await params
  const school = await getSchoolBySlug(schoolSlug)
  if (!school) notFound()

  const user = await getCurrentUser()
  const access = user ? await resolveTenantAccess(user, schoolSlug) : null
  const role = (access?.membership?.schoolRole as SchoolRole | undefined) || null
  const isAdmin = Boolean(access?.isAdmin)

  let counts = {
    students: 0,
    staff: 0,
    invoices: 0,
    notices: 0,
    attendance: 0,
    exams: 0,
  }

  if (isPayloadEnabled()) {
    const payload = await getPayloadSingleton()
    const schoolFilter = { school: { equals: school.id } }
    const [students, staff, invoices, notices, attendance, exams] = await Promise.all([
      payload.count({ collection: 'edu-students', where: schoolFilter }),
      payload.count({ collection: 'edu-staff', where: schoolFilter }),
      payload.count({ collection: 'edu-invoices', where: schoolFilter }),
      payload.count({ collection: 'edu-notices', where: schoolFilter }),
      payload.count({ collection: 'edu-attendance', where: schoolFilter }),
      payload.count({ collection: 'edu-exams', where: schoolFilter }),
    ])
    counts = {
      students: students.totalDocs,
      staff: staff.totalDocs,
      invoices: invoices.totalDocs,
      notices: notices.totalDocs,
      attendance: attendance.totalDocs,
      exams: exams.totalDocs,
    }
  }

  const cards = [
    { label: 'Students', value: counts.students, href: `/edusuite/${schoolSlug}/students` },
    { label: 'Staff', value: counts.staff, href: `/edusuite/${schoolSlug}/staff` },
    { label: 'Invoices', value: counts.invoices, href: `/edusuite/${schoolSlug}/invoices` },
    { label: 'Attendance', value: counts.attendance, href: `/edusuite/${schoolSlug}/attendance` },
    { label: 'Exams', value: counts.exams, href: `/edusuite/${schoolSlug}/exams` },
    { label: 'Notices', value: counts.notices, href: `/edusuite/${schoolSlug}/notices` },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-[#1B1C1E]">Dashboard</h2>
        <p className="text-gray-600 mt-1">{roleHeadline(role, isAdmin)}</p>
        <p className="text-sm text-gray-500 mt-2">
          {school.currentTerm || 'Current term'} · {school.currentSession || 'Session'} ·{' '}
          {(school.schoolType || 'private').replace(/^\w/, (c) => c.toUpperCase())} school
          {school.city ? ` · ${school.city}` : ''}
          {school.state ? `, ${school.state}` : ''}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="bg-white border border-gray-200 rounded-xl p-5 hover:border-[#1A2BC2] transition-colors"
          >
            <p className="text-sm text-gray-500">{c.label}</p>
            <p className="text-3xl font-semibold text-[#1A2BC2] mt-2">{c.value}</p>
          </Link>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold text-[#1B1C1E] mb-2">Quick links</h3>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link className="text-[#1A2BC2] hover:underline" href={`/edusuite/${schoolSlug}/attendance`}>
            Mark attendance
          </Link>
          <Link className="text-[#1A2BC2] hover:underline" href={`/edusuite/${schoolSlug}/fees`}>
            Fee structures
          </Link>
          <Link className="text-[#1A2BC2] hover:underline" href={`/edusuite/${schoolSlug}/results`}>
            Publish results
          </Link>
          <Link className="text-[#1A2BC2] hover:underline" href={`/edusuite/${schoolSlug}/parent`}>
            Parent portal
          </Link>
          <Link className="text-[#1A2BC2] hover:underline" href={`/edusuite/${schoolSlug}/reports`}>
            Reports
          </Link>
          <Link className="text-[#1A2BC2] hover:underline" href={`/edusuite/${schoolSlug}/settings`}>
            School settings
          </Link>
          <Link className="text-[#1A2BC2] hover:underline" href={`/edusuite/${schoolSlug}/lms`}>
            LMS lite
          </Link>
        </div>
      </div>
    </div>
  )
}
