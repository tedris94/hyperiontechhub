import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getPayloadSingleton } from '@/lib/payload'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

type Props = { params: Promise<{ enrollmentId: string }> }

export async function GET(request: Request, { params }: Props) {
  const user = await getCurrentUser(request)
  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { enrollmentId } = await params
    const id = Number(enrollmentId)
    const payload = await getPayloadSingleton()

    const certs = await payload.find({
      collection: 'certificates',
      where: { enrollment: { equals: id } },
      limit: 1,
      depth: 2,
      overrideAccess: true,
    })

    const cert = certs.docs[0]
    if (!cert) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 })
    }

    const studentId = typeof cert.student === 'number' ? cert.student : cert.student?.id
    const isStaff = user.role === 'super_admin' || user.role === 'admin' || user.role === 'instructor'
    if (studentId !== user.id && !isStaff) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const course =
      typeof cert.course === 'object' && cert.course
        ? { title: cert.course.title, slug: cert.course.slug }
        : null
    const student =
      typeof cert.student === 'object' && cert.student
        ? { fullName: cert.student.fullName }
        : null

    return NextResponse.json({
      serial: cert.serial,
      issuedAt: cert.issuedAt,
      course,
      student,
    })
  } catch (e) {
    console.error('[lms/certificate GET]', e)
    return NextResponse.json({ error: 'Failed to load certificate' }, { status: 500 })
  }
}
