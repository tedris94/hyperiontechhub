'use client'

import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

type Student = { id: string | number; title?: string; rollNo?: string }
type Row = { student: string | number; studentName: string; status: string }

export default function AttendanceGridPage() {
  const params = useParams()
  const schoolSlug = String(params.schoolSlug || '')
  const [schoolId, setSchoolId] = useState<string | number | null>(null)
  const [classes, setClasses] = useState<Array<{ title?: string }>>([])
  const [className, setClassName] = useState('')
  const [subject, setSubject] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [rows, setRows] = useState<Row[]>([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    void (async () => {
      const sRes = await fetch(`/api/edusuite/schools/${encodeURIComponent(schoolSlug)}`)
      const sData = await sRes.json()
      if (!sRes.ok) return
      setSchoolId(sData.school.id)
      const cRes = await fetch(
        `/api/edusuite/records?collection=edu-classes&schoolId=${sData.school.id}&schoolSlug=${schoolSlug}`,
      )
      const cData = await cRes.json()
      setClasses(cData.docs || [])
    })()
  }, [schoolSlug])

  const load = useCallback(async () => {
    if (!schoolId || !className || !date) return
    setError('')
    const stRes = await fetch(
      `/api/edusuite/records?collection=edu-students&schoolId=${schoolId}&schoolSlug=${schoolSlug}`,
    )
    const stData = await stRes.json()
    const students = ((stData.docs || []) as Student[]).filter(
      (s) => (s as { className?: string }).className === className,
    )

    const attRes = await fetch(
      `/api/edusuite/records?collection=edu-attendance&schoolId=${schoolId}&schoolSlug=${schoolSlug}`,
    )
    const attData = await attRes.json()
    const existing = ((attData.docs || []) as Array<{
      date?: string
      className?: string
      subject?: string
      student?: string | number
      studentName?: string
      status?: string
    }>).filter((a) => {
      const d = a.date ? String(a.date).slice(0, 10) : ''
      return d === date && a.className === className && (!subject || a.subject === subject)
    })
    const map = new Map(existing.map((a) => [String(a.student), a]))

    setRows(
      students.map((s) => {
        const prev = map.get(String(s.id))
        return {
          student: s.id,
          studentName: s.title || '',
          status: prev?.status || 'present',
        }
      }),
    )
  }, [schoolId, schoolSlug, className, date, subject])

  async function save() {
    if (!schoolId) return
    setError('')
    setMessage('')
    // Delete existing for day/class then recreate (simple replace)
    const attRes = await fetch(
      `/api/edusuite/records?collection=edu-attendance&schoolId=${schoolId}&schoolSlug=${schoolSlug}`,
    )
    const attData = await attRes.json()
    for (const a of attData.docs || []) {
      const d = a.date ? String(a.date).slice(0, 10) : ''
      if (d === date && a.className === className && (!subject || a.subject === subject)) {
        await fetch('/api/edusuite/records', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ collection: 'edu-attendance', id: a.id, schoolSlug }),
        })
      }
    }

    for (const row of rows) {
      const res = await fetch('/api/edusuite/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collection: 'edu-attendance',
          schoolSlug,
          data: {
            school: schoolId,
            title: `${row.studentName} · ${date}`,
            date,
            className,
            subject: subject || undefined,
            student: row.student,
            studentName: row.studentName,
            status: row.status,
          },
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Save failed')
        return
      }
    }
    setMessage('Attendance saved.')
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-[#1B1C1E]">Attendance</h2>
        <p className="text-gray-600 mt-1">Mark present / absent / late / excused for a class day.</p>
      </div>
      {error && <div className="rounded-lg bg-red-50 text-red-700 px-4 py-3 text-sm">{error}</div>}
      {message && <div className="rounded-lg bg-green-50 text-green-700 px-4 py-3 text-sm">{message}</div>}

      <div className="bg-white border rounded-xl p-4 grid md:grid-cols-4 gap-3">
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
          Date
          <input
            type="date"
            className="mt-1 w-full border rounded-lg px-3 py-2"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <label className="text-sm">
          Subject (optional)
          <input
            className="mt-1 w-full border rounded-lg px-3 py-2"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </label>
        <div className="flex items-end gap-2">
          <button type="button" onClick={() => void load()} className="bg-[#1A2BC2] text-white px-4 py-2 rounded-lg">
            Load
          </button>
          <button type="button" onClick={() => void save()} className="border border-[#1A2BC2] text-[#1A2BC2] px-4 py-2 rounded-lg">
            Save
          </button>
        </div>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden">
        {rows.length === 0 ? (
          <p className="p-6 text-gray-500">Load a class to mark attendance.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={String(row.student)} className="border-t">
                  <td className="px-4 py-2 font-medium">{row.studentName}</td>
                  <td className="px-4 py-2">
                    <select
                      className="border rounded px-2 py-1"
                      value={row.status}
                      onChange={(e) =>
                        setRows((prev) =>
                          prev.map((r, idx) => (idx === i ? { ...r, status: e.target.value } : r)),
                        )
                      }
                    >
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                      <option value="late">Late</option>
                      <option value="excused">Excused</option>
                    </select>
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
