import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getPayloadSingleton, isPayloadEnabled } from '@/lib/payload'
import { isPlatformAdmin } from '@/collections/edusuite/shared'
import { resolveTenantAccess } from '@/lib/edusuite/tenant'
import {
  computeResult,
  DEFAULT_GRADING_SCALE,
  letterGrade,
  type GradeBand,
} from '@/lib/edusuite/grading'
import { autoRemark } from '@/lib/edusuite/grading'

/** GET: load mark sheet + students for class/exam/year/subject */
export async function GET(req: NextRequest) {
  if (!isPayloadEnabled()) return NextResponse.json({ error: 'Payload disabled' }, { status: 503 })
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const schoolSlug = req.nextUrl.searchParams.get('schoolSlug') || ''
  const className = req.nextUrl.searchParams.get('className') || ''
  const exam = req.nextUrl.searchParams.get('exam') || ''
  const year = req.nextUrl.searchParams.get('year') || ''
  const subject = req.nextUrl.searchParams.get('subject') || ''

  const access = await resolveTenantAccess(user, schoolSlug)
  if (!access) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const payload = await getPayloadSingleton()
  const schoolId = access.school.id

  const students = await payload.find({
    collection: 'edu-students',
    where: {
      and: [
        { school: { equals: schoolId } },
        { className: { equals: className } },
        ...(year ? [{ year: { equals: year } }] : []),
        { status: { equals: 'active' } },
      ],
    },
    limit: 200,
    sort: 'rollNo',
    overrideAccess: true,
  })

  const existing = await payload.find({
    collection: 'edu-marks',
    where: {
      and: [
        { school: { equals: schoolId } },
        { className: { equals: className } },
        { exam: { equals: exam } },
        { year: { equals: year } },
        { subject: { equals: subject } },
      ],
    },
    limit: 1,
    overrideAccess: true,
  })

  return NextResponse.json({
    students: students.docs,
    markSheet: existing.docs[0] || null,
    school: access.school,
  })
}

/** POST: save mark sheet scores */
export async function POST(req: NextRequest) {
  if (!isPayloadEnabled()) return NextResponse.json({ error: 'Payload disabled' }, { status: 503 })
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const schoolSlug = String(body.schoolSlug || '')
  const className = String(body.className || '')
  const exam = String(body.exam || '')
  const year = String(body.year || '')
  const subject = String(body.subject || '')
  const maxScore = Number(body.maxScore || 100)
  const scores = (body.scores || []) as Array<{
    student: string | number
    studentName?: string
    rollNo?: string
    score?: string
  }>

  const access = await resolveTenantAccess(user, schoolSlug)
  if (!access) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const payload = await getPayloadSingleton()
  const fullSchool = await payload.findByID({
    collection: 'schools',
    id: access.school.id,
    depth: 0,
    overrideAccess: true,
  })
  const scale = ((fullSchool as { gradingScale?: GradeBand[] }).gradingScale ||
    DEFAULT_GRADING_SCALE) as GradeBand[]

  const scored = scores.map((s) => {
    const n = Number(s.score)
    const grade =
      s.score && String(s.score).toUpperCase() === 'ABS'
        ? 'ABS'
        : !Number.isNaN(n)
          ? letterGrade(n, scale)
          : ''
    return { ...s, grade }
  })

  const title = `${className} · ${subject} · ${exam} · ${year}`
  const existing = await payload.find({
    collection: 'edu-marks',
    where: {
      and: [
        { school: { equals: access.school.id } },
        { className: { equals: className } },
        { exam: { equals: exam } },
        { year: { equals: year } },
        { subject: { equals: subject } },
      ],
    },
    limit: 1,
    overrideAccess: true,
  })

  const data = {
    school: access.school.id,
    title,
    className,
    exam,
    year,
    subject,
    maxScore,
    scores: scored,
    status: 'ready' as const,
  }

  let doc
  if (existing.totalDocs > 0) {
    doc = await payload.update({
      collection: 'edu-marks',
      id: existing.docs[0].id,
      data,
      user,
      overrideAccess: isPlatformAdmin(user),
    })
  } else {
    doc = await payload.create({
      collection: 'edu-marks',
      data,
      user,
      overrideAccess: isPlatformAdmin(user),
    })
  }

  return NextResponse.json({ markSheet: doc })
}

/** PUT: publish all subjects for class+exam+year into edu-results cards */
export async function PUT(req: NextRequest) {
  if (!isPayloadEnabled()) return NextResponse.json({ error: 'Payload disabled' }, { status: 503 })
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const schoolSlug = String(body.schoolSlug || '')
  const className = String(body.className || '')
  const exam = String(body.exam || '')
  const year = String(body.year || '')
  const publish = body.publish !== false

  const access = await resolveTenantAccess(user, schoolSlug)
  if (!access) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const payload = await getPayloadSingleton()
  const fullSchool = await payload.findByID({
    collection: 'schools',
    id: access.school.id,
    depth: 0,
    overrideAccess: true,
  })
  const scale = ((fullSchool as { gradingScale?: GradeBand[] }).gradingScale ||
    DEFAULT_GRADING_SCALE) as GradeBand[]
  const passMark = Number((fullSchool as { passMark?: number }).passMark ?? 40)
  const principalRemark = (fullSchool as { principalAutoRemark?: string }).principalAutoRemark

  const markSheets = await payload.find({
    collection: 'edu-marks',
    where: {
      and: [
        { school: { equals: access.school.id } },
        { className: { equals: className } },
        { exam: { equals: exam } },
        { year: { equals: year } },
      ],
    },
    limit: 100,
    overrideAccess: true,
  })

  type ScoreRow = {
    student: string | number | { id: string | number }
    studentName?: string
    rollNo?: string
    score?: string
  }

  const byStudent = new Map<
    string,
    { studentId: string | number; studentName: string; rollNo: string; subjects: Array<{ name: string; score: unknown }> }
  >()

  for (const sheet of markSheets.docs) {
    const subject = String((sheet as { subject?: string }).subject || '')
    const scores = ((sheet as { scores?: ScoreRow[] }).scores || []) as ScoreRow[]
    for (const row of scores) {
      const sid = typeof row.student === 'object' ? row.student.id : row.student
      const key = String(sid)
      if (!byStudent.has(key)) {
        byStudent.set(key, {
          studentId: sid,
          studentName: row.studentName || '',
          rollNo: row.rollNo || '',
          subjects: [],
        })
      }
      byStudent.get(key)!.subjects.push({ name: subject, score: row.score })
    }
  }

  const students = await payload.find({
    collection: 'edu-students',
    where: {
      and: [{ school: { equals: access.school.id } }, { className: { equals: className } }],
    },
    limit: 200,
    overrideAccess: true,
  })
  const studentMap = new Map(students.docs.map((s) => [String(s.id), s]))

  let created = 0
  for (const [, entry] of byStudent) {
    const computed = computeResult(entry.subjects, scale, passMark)
    const stud = studentMap.get(String(entry.studentId)) as
      | { title?: string; rollNo?: string; regiNo?: string; groupName?: string }
      | undefined
    const title = `${entry.studentName || stud?.title || 'Student'} · ${exam} · ${year}`
    const teacherRemark = autoRemark(computed.average, computed.resultStatus)

    const existing = await payload.find({
      collection: 'edu-results',
      where: {
        and: [
          { school: { equals: access.school.id } },
          { student: { equals: entry.studentId } },
          { exam: { equals: exam } },
          { year: { equals: year } },
        ],
      },
      limit: 1,
      overrideAccess: true,
    })

    const data = {
      school: access.school.id,
      title,
      student: entry.studentId,
      studentName: entry.studentName || stud?.title || '',
      rollNo: entry.rollNo || stud?.rollNo || '',
      regiNo: stud?.regiNo || '',
      className,
      groupName: stud?.groupName || '',
      exam,
      year,
      subjects: computed.subjects.map((s) => ({
        name: s.name,
        score: s.score ?? undefined,
        grade: s.grade,
        points: s.points,
        remark: s.remark,
      })),
      totalScore: computed.totalScore,
      average: computed.average,
      gpa: computed.gpa,
      resultStatus: computed.resultStatus,
      teacherRemark,
      principalRemark: principalRemark || undefined,
      published: publish,
    }

    if (existing.totalDocs > 0) {
      await payload.update({
        collection: 'edu-results',
        id: existing.docs[0].id,
        data,
        user,
        overrideAccess: isPlatformAdmin(user),
      })
    } else {
      await payload.create({
        collection: 'edu-results',
        data,
        user,
        overrideAccess: isPlatformAdmin(user),
      })
    }
    created += 1
  }

  for (const sheet of markSheets.docs) {
    await payload.update({
      collection: 'edu-marks',
      id: sheet.id,
      data: { status: 'published' },
      overrideAccess: true,
    })
  }

  return NextResponse.json({ ok: true, results: created })
}
