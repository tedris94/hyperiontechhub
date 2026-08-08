'use client'

import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

type Student = {
  id: string | number
  title?: string
  rollNo?: string
  className?: string
  year?: string
}

type ScoreRow = {
  student: string | number
  studentName: string
  rollNo: string
  score: string
  grade?: string
}

export default function MarkSheetPage() {
  const params = useParams()
  const schoolSlug = String(params.schoolSlug || '')
  const [className, setClassName] = useState('')
  const [exam, setExam] = useState('First Term')
  const [year, setYear] = useState('2025/2026')
  const [subject, setSubject] = useState('')
  const [classes, setClasses] = useState<Array<{ title?: string; subjects?: Array<{ name: string }> }>>([])
  const [terms, setTerms] = useState<string[]>([])
  const [years, setYears] = useState<string[]>([])
  const [subjectOptions, setSubjectOptions] = useState<string[]>([])
  const [rows, setRows] = useState<ScoreRow[]>([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [schoolId, setSchoolId] = useState<string | number | null>(null)

  useEffect(() => {
    void (async () => {
      const sRes = await fetch(`/api/edusuite/schools/${encodeURIComponent(schoolSlug)}`)
      const sData = await sRes.json()
      if (!sRes.ok) return
      setSchoolId(sData.school.id)
      setExam(sData.school.currentTerm || 'First Term')
      setYear(sData.school.currentSession || '2025/2026')
      setTerms((sData.school.examTerms || []).map((t: { name: string }) => t.name))
      setYears((sData.school.academicYears || []).map((t: { name: string }) => t.name))
      const cRes = await fetch(
        `/api/edusuite/records?collection=edu-classes&schoolId=${sData.school.id}&schoolSlug=${schoolSlug}`,
      )
      const cData = await cRes.json()
      setClasses(cData.docs || [])
    })()
  }, [schoolSlug])

  useEffect(() => {
    const cls = classes.find((c) => c.title === className)
    const fromClass = (cls?.subjects || []).map((s) => s.name)
    if (fromClass.length) {
      setSubjectOptions(fromClass)
      return
    }
    if (!schoolId || !className) return
    void (async () => {
      const res = await fetch(
        `/api/edusuite/records?collection=edu-subjects&schoolId=${schoolId}&schoolSlug=${schoolSlug}`,
      )
      const data = await res.json()
      const names = (data.docs || [])
        .filter((d: { className?: string }) => !d.className || d.className === className)
        .map((d: { title?: string }) => d.title)
        .filter(Boolean)
      setSubjectOptions(names)
    })()
  }, [className, classes, schoolId, schoolSlug])

  const loadSheet = useCallback(async () => {
    if (!className || !exam || !year || !subject) return
    setLoading(true)
    setError('')
    setMessage('')
    try {
      const qs = new URLSearchParams({ schoolSlug, className, exam, year, subject })
      const res = await fetch(`/api/edusuite/marks?${qs}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to load')
      const students = (data.students || []) as Student[]
      const sheet = data.markSheet as { scores?: ScoreRow[] } | null
      const scoreMap = new Map((sheet?.scores || []).map((s) => [String(s.student), s]))
      setRows(
        students.map((st) => {
          const prev = scoreMap.get(String(st.id))
          return {
            student: st.id,
            studentName: st.title || '',
            rollNo: st.rollNo || '',
            score: prev?.score != null ? String(prev.score) : '',
            grade: prev?.grade,
          }
        }),
      )
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed')
    } finally {
      setLoading(false)
    }
  }, [schoolSlug, className, exam, year, subject])

  async function saveSheet() {
    setError('')
    setMessage('')
    const res = await fetch('/api/edusuite/marks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ schoolSlug, className, exam, year, subject, scores: rows }),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'Save failed')
      return
    }
    setMessage('Mark sheet saved.')
    await loadSheet()
  }

  async function publishClass() {
    if (!confirm(`Publish all subjects for ${className} · ${exam} · ${year} to result cards?`)) return
    setError('')
    const res = await fetch('/api/edusuite/marks', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ schoolSlug, className, exam, year, publish: true }),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'Publish failed')
      return
    }
    setMessage(`Published ${data.results} result card(s).`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-[#1B1C1E]">Mark Sheet</h2>
        <p className="text-gray-600 mt-1">Enter subject scores for a class, then publish to result cards.</p>
      </div>
      {error && <div className="rounded-lg bg-red-50 text-red-700 px-4 py-3 text-sm">{error}</div>}
      {message && <div className="rounded-lg bg-green-50 text-green-700 px-4 py-3 text-sm">{message}</div>}

      <div className="bg-white border border-gray-200 rounded-xl p-4 grid md:grid-cols-4 gap-3">
        <label className="text-sm">
          Class
          <select
            className="mt-1 w-full border rounded-lg px-3 py-2"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
          >
            <option value="">Select…</option>
            {classes.map((c) => (
              <option key={c.title} value={c.title}>
                {c.title}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          Exam / Term
          <input
            list="exam-terms"
            className="mt-1 w-full border rounded-lg px-3 py-2"
            value={exam}
            onChange={(e) => setExam(e.target.value)}
          />
          <datalist id="exam-terms">
            {terms.map((t) => (
              <option key={t} value={t} />
            ))}
          </datalist>
        </label>
        <label className="text-sm">
          Year
          <input
            list="years"
            className="mt-1 w-full border rounded-lg px-3 py-2"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
          <datalist id="years">
            {years.map((y) => (
              <option key={y} value={y} />
            ))}
          </datalist>
        </label>
        <label className="text-sm">
          Subject
          <select
            className="mt-1 w-full border rounded-lg px-3 py-2"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            <option value="">Select…</option>
            {subjectOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <div className="md:col-span-4 flex flex-wrap gap-2">
          <button type="button" onClick={() => void loadSheet()} className="bg-[#1A2BC2] text-white px-4 py-2 rounded-lg">
            Load students
          </button>
          <button type="button" onClick={() => void saveSheet()} className="border border-[#1A2BC2] text-[#1A2BC2] px-4 py-2 rounded-lg">
            Save marks
          </button>
          <button type="button" onClick={() => void publishClass()} className="bg-[#0D0D52] text-white px-4 py-2 rounded-lg">
            Publish class results
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {loading ? (
          <p className="p-6 text-gray-500">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="p-6 text-gray-500">Select class/exam/year/subject and load students.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3">Roll</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Score (or ABS)</th>
                <th className="px-4 py-3">Grade</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={String(row.student)} className="border-t">
                  <td className="px-4 py-2">{row.rollNo || '—'}</td>
                  <td className="px-4 py-2 font-medium">{row.studentName}</td>
                  <td className="px-4 py-2">
                    <input
                      className="border rounded px-2 py-1 w-24"
                      value={row.score}
                      onChange={(e) => {
                        const v = e.target.value
                        setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, score: v } : r)))
                      }}
                    />
                  </td>
                  <td className="px-4 py-2 text-gray-500">{row.grade || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
