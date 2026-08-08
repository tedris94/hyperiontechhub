import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getPayloadSingleton, isPayloadEnabled } from '@/lib/payload'
import { resolveTenantAccess } from '@/lib/edusuite/tenant'

/** Export results as CSV */
export async function GET(req: NextRequest) {
  if (!isPayloadEnabled()) return NextResponse.json({ error: 'Payload disabled' }, { status: 503 })
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const schoolSlug = req.nextUrl.searchParams.get('schoolSlug') || ''
  const type = req.nextUrl.searchParams.get('type') || 'results'
  const access = await resolveTenantAccess(user, schoolSlug)
  if (!access) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const payload = await getPayloadSingleton()

  if (type === 'students') {
    const found = await payload.find({
      collection: 'edu-students',
      where: { school: { equals: access.school.id } },
      limit: 500,
      overrideAccess: true,
    })
    const header = 'Name,Roll_No,Regi_No,Class,Year,Group,GuardianName,GuardianPhone'
    const lines = found.docs.map((d) => {
      const r = d as Record<string, unknown>
      return [
        r.title,
        r.rollNo,
        r.regiNo,
        r.className,
        r.year,
        r.groupName,
        r.guardianName,
        r.guardianPhone,
      ]
        .map(csvEscape)
        .join(',')
    })
    const csv = [header, ...lines].join('\n')
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${schoolSlug}-students.csv"`,
      },
    })
  }

  const found = await payload.find({
    collection: 'edu-results',
    where: { school: { equals: access.school.id } },
    limit: 500,
    overrideAccess: true,
  })
  const header = 'Name,Roll_No,Class,Exam,Year,Average,GPA,Result,Published'
  const lines = found.docs.map((d) => {
    const r = d as Record<string, unknown>
    return [
      r.studentName || r.title,
      r.rollNo,
      r.className,
      r.exam,
      r.year,
      r.average,
      r.gpa,
      r.resultStatus,
      r.published ? 'yes' : 'no',
    ]
      .map(csvEscape)
      .join(',')
  })
  const csv = [header, ...lines].join('\n')
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${schoolSlug}-results.csv"`,
    },
  })
}

function csvEscape(v: unknown): string {
  const s = v == null ? '' : String(v)
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}
