export type GradeBand = {
  grade: string
  minScore: number
  maxScore: number
  points?: number
}

export const DEFAULT_GRADING_SCALE: GradeBand[] = [
  { grade: 'A', minScore: 80, maxScore: 100, points: 5 },
  { grade: 'B', minScore: 70, maxScore: 79, points: 4 },
  { grade: 'C', minScore: 60, maxScore: 69, points: 3.5 },
  { grade: 'D', minScore: 50, maxScore: 59, points: 3 },
  { grade: 'E', minScore: 40, maxScore: 49, points: 2 },
  { grade: 'F', minScore: 0, maxScore: 39, points: 1 },
]

const DEFAULT_POINTS: Record<string, number> = {
  A: 5,
  B: 4,
  C: 3.5,
  D: 3,
  E: 2,
  F: 1,
}

/** Parse mark cell: number or ABS → 0 for calc, null if empty. */
export function parseMarkScore(raw: unknown): { numeric: number | null; display: string; absent: boolean } {
  if (raw == null || raw === '') return { numeric: null, display: '', absent: false }
  const s = String(raw).trim().toUpperCase()
  if (s === 'ABS' || s === 'AB' || s === 'ABSENT') {
    return { numeric: 0, display: 'ABS', absent: true }
  }
  const n = Number(s)
  if (Number.isNaN(n)) return { numeric: null, display: String(raw), absent: false }
  return { numeric: n, display: String(n), absent: false }
}

export function letterGrade(score: number, scale: GradeBand[] = DEFAULT_GRADING_SCALE): string {
  const bands = [...scale].sort((a, b) => b.minScore - a.minScore)
  for (const b of bands) {
    if (score >= b.minScore && score <= b.maxScore) return b.grade
  }
  if (score > 100) return bands[0]?.grade || 'A'
  return bands[bands.length - 1]?.grade || 'F'
}

export function gradePoints(grade: string, scale: GradeBand[] = DEFAULT_GRADING_SCALE): number {
  const band = scale.find((b) => b.grade.toUpperCase() === grade.toUpperCase())
  if (band?.points != null) return band.points
  return DEFAULT_POINTS[grade.toUpperCase()] ?? 0
}

export type SubjectMarkInput = { name: string; score: unknown; remark?: string }

export type ComputedSubject = {
  name: string
  score: number | null
  grade: string
  points: number
  remark?: string
  absent?: boolean
}

export type ComputedResult = {
  subjects: ComputedSubject[]
  totalScore: number
  average: number
  gpa: number
  resultStatus: 'Passed' | 'Failed'
}

export function computeResult(
  subjectInputs: SubjectMarkInput[],
  scale: GradeBand[] = DEFAULT_GRADING_SCALE,
  passMark = 40,
): ComputedResult {
  const subjects: ComputedSubject[] = []
  let total = 0
  let counted = 0
  let pointsSum = 0
  let failed = false

  for (const s of subjectInputs) {
    const parsed = parseMarkScore(s.score)
    if (parsed.numeric == null && !parsed.absent) {
      subjects.push({
        name: s.name,
        score: null,
        grade: '',
        points: 0,
        remark: s.remark,
      })
      continue
    }
    const score = parsed.numeric ?? 0
    const grade = letterGrade(score, scale)
    const points = gradePoints(grade, scale)
    subjects.push({
      name: s.name,
      score: parsed.absent ? 0 : score,
      grade: parsed.absent ? 'ABS' : grade,
      points: parsed.absent ? 0 : points,
      remark: s.remark,
      absent: parsed.absent,
    })
    total += score
    counted += 1
    pointsSum += parsed.absent ? 0 : points
    if (!parsed.absent && score < passMark) failed = true
    if (parsed.absent) failed = true
  }

  const average = counted > 0 ? Math.round((total / counted) * 100) / 100 : 0
  const gpa = counted > 0 ? Math.round((pointsSum / counted) * 100) / 100 : 0

  return {
    subjects,
    totalScore: Math.round(total * 100) / 100,
    average,
    gpa,
    resultStatus: failed || counted === 0 ? 'Failed' : 'Passed',
  }
}

export function autoRemark(average: number, resultStatus: string): string {
  if (resultStatus === 'Failed') return 'Needs improvement. Please work harder next term.'
  if (average >= 80) return 'Excellent performance. Keep it up!'
  if (average >= 70) return 'Very good result. Continue to excel.'
  if (average >= 60) return 'Good effort. Aim higher next term.'
  if (average >= 50) return 'Fair result. More dedication required.'
  return 'Passed. Greater effort will yield better grades.'
}
