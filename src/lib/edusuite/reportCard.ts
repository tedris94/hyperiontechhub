import type { GradeBand } from './grading'
import { DEFAULT_GRADING_SCALE, autoRemark } from './grading'

export type ReportCardSubject = {
  name: string
  score: number | null
  grade: string
  points?: number
  remark?: string
}

export type ReportCardPayload = {
  schoolName: string
  schoolAddress?: string
  primaryColor?: string
  principalName?: string
  principalSignatureUrl?: string
  classTeacherName?: string
  classTeacherSignatureUrl?: string
  studentName: string
  rollNo?: string
  regiNo?: string
  className: string
  groupName?: string
  exam: string
  year: string
  subjects: ReportCardSubject[]
  totalScore?: number
  average?: number
  gpa?: number
  resultStatus?: string
  position?: string
  teacherRemark?: string
  principalRemark?: string
  gradingScale: GradeBand[]
  ratings?: Array<{ label: string; value: string }>
}

export function buildReportCardPayload(input: {
  school: {
    name: string
    address?: string | null
    primaryColor?: string | null
    principalName?: string | null
    principalSignatureUrl?: string | null
    gradingScale?: GradeBand[] | null
  }
  result: {
    studentName?: string | null
    rollNo?: string | null
    regiNo?: string | null
    className: string
    groupName?: string | null
    exam: string
    year: string
    subjects?: ReportCardSubject[] | null
    totalScore?: number | null
    average?: number | null
    gpa?: number | null
    resultStatus?: string | null
    position?: string | null
    teacherRemark?: string | null
    principalRemark?: string | null
    ratings?: Array<{ label?: string | null; value?: string | null }> | null
  }
  classTeacher?: { title?: string; signatureUrl?: string | null; autoRemark?: string | null } | null
}): ReportCardPayload {
  const scale =
    input.school.gradingScale && input.school.gradingScale.length > 0
      ? input.school.gradingScale
      : DEFAULT_GRADING_SCALE
  const average = input.result.average ?? 0
  const status = input.result.resultStatus || 'Passed'
  const teacherRemark =
    input.result.teacherRemark ||
    input.classTeacher?.autoRemark ||
    autoRemark(average, status)
  const principalRemark =
    input.result.principalRemark ||
    (status === 'Passed'
      ? 'Promoted / satisfactory. Keep up the good work.'
      : 'Requires remedial support. Parents please follow up.')

  return {
    schoolName: input.school.name,
    schoolAddress: input.school.address || undefined,
    primaryColor: input.school.primaryColor || '#1A2BC2',
    principalName: input.school.principalName || undefined,
    principalSignatureUrl: input.school.principalSignatureUrl || undefined,
    classTeacherName: input.classTeacher?.title,
    classTeacherSignatureUrl: input.classTeacher?.signatureUrl || undefined,
    studentName: input.result.studentName || 'Student',
    rollNo: input.result.rollNo || undefined,
    regiNo: input.result.regiNo || undefined,
    className: input.result.className,
    groupName: input.result.groupName || undefined,
    exam: input.result.exam,
    year: input.result.year,
    subjects: (input.result.subjects || []).map((s) => ({
      name: s.name,
      score: s.score ?? null,
      grade: s.grade || '',
      points: s.points,
      remark: s.remark,
    })),
    totalScore: input.result.totalScore ?? undefined,
    average: input.result.average ?? undefined,
    gpa: input.result.gpa ?? undefined,
    resultStatus: status,
    position: input.result.position || undefined,
    teacherRemark,
    principalRemark,
    gradingScale: scale,
    ratings: (input.result.ratings || [])
      .filter((r) => r.label)
      .map((r) => ({ label: String(r.label), value: String(r.value || '') })),
  }
}
