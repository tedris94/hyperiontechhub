'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

type Student = {
  id: string | number
  title?: string
  className?: string
  year?: string
  groupName?: string
  rollNo?: string
}

export default function PromotePage() {
  const params = useParams()
  const schoolSlug = String(params.schoolSlug || '')
  const [schoolId, setSchoolId] = useState<string | number | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [fromClass, setFromClass] = useState('')
  const [toClass, setToClass] = useState('')
  const [toYear, setToYear] = useState('')
  const [toGroup, setToGroup] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    void (async () => {
      const sRes = await fetch(`/api/edusuite/schools/${encodeURIComponent(schoolSlug)}`)
      const sData = await sRes.json()
      if (!sRes.ok) return
      setSchoolId(sData.school.id)
      setToYear(sData.school.currentSession || '')
      const stRes = await fetch(
        `/api/edusuite/records?collection=edu-students&schoolId=${sData.school.id}&schoolSlug=${schoolSlug}`,
      )
      const stData = await stRes.json()
      setStudents(stData.docs || [])
    })()
  }, [schoolSlug])

  const visible = fromClass
    ? students.filter((s) => s.className === fromClass)
    : students

  function toggle(id: string | number) {
    const key = String(id)
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  async function promote() {
    setError('')
    setMessage('')
    if (!toClass && !toYear && !toGroup) {
      setError('Set at least one of: new class, year, or group')
      return
    }
    let n = 0
    for (const s of visible) {
      if (!selected.has(String(s.id))) continue
      const data: Record<string, string> = {}
      if (toClass) data.className = toClass
      if (toYear) data.year = toYear
      if (toGroup) data.groupName = toGroup
      const res = await fetch('/api/edusuite/records', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collection: 'edu-students', id: s.id, data, schoolSlug }),
      })
      if (!res.ok) {
        const json = await res.json()
        setError(json.error || 'Promote failed')
        return
      }
      n += 1
    }
    setMessage(`Promoted ${n} student(s).`)
    setSelected(new Set())
    const stRes = await fetch(
      `/api/edusuite/records?collection=edu-students&schoolId=${schoolId}&schoolSlug=${schoolSlug}`,
    )
    const stData = await stRes.json()
    setStudents(stData.docs || [])
  }

  const classOptions = Array.from(new Set(students.map((s) => s.className).filter(Boolean))) as string[]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-[#1B1C1E]">Promote students</h2>
        <p className="text-gray-600 mt-1">Bulk update class, year, and group (Educare Performance).</p>
      </div>
      {error && <div className="rounded-lg bg-red-50 text-red-700 px-4 py-3 text-sm">{error}</div>}
      {message && <div className="rounded-lg bg-green-50 text-green-700 px-4 py-3 text-sm">{message}</div>}

      <div className="bg-white border rounded-xl p-4 grid md:grid-cols-4 gap-3">
        <label className="text-sm">
          From class
          <select
            className="mt-1 w-full border rounded-lg px-3 py-2"
            value={fromClass}
            onChange={(e) => setFromClass(e.target.value)}
          >
            <option value="">All</option>
            {classOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          New class
          <input className="mt-1 w-full border rounded-lg px-3 py-2" value={toClass} onChange={(e) => setToClass(e.target.value)} />
        </label>
        <label className="text-sm">
          New year
          <input className="mt-1 w-full border rounded-lg px-3 py-2" value={toYear} onChange={(e) => setToYear(e.target.value)} />
        </label>
        <label className="text-sm">
          New group
          <input className="mt-1 w-full border rounded-lg px-3 py-2" value={toGroup} onChange={(e) => setToGroup(e.target.value)} />
        </label>
        <div className="md:col-span-4">
          <button type="button" onClick={() => void promote()} className="bg-[#1A2BC2] text-white px-4 py-2 rounded-lg">
            Promote selected
          </button>
        </div>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3 w-10"></th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Class</th>
              <th className="px-4 py-3">Year</th>
              <th className="px-4 py-3">Group</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((s) => (
              <tr key={String(s.id)} className="border-t">
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selected.has(String(s.id))}
                    onChange={() => toggle(s.id)}
                  />
                </td>
                <td className="px-4 py-2 font-medium">{s.title}</td>
                <td className="px-4 py-2">{s.className}</td>
                <td className="px-4 py-2">{s.year}</td>
                <td className="px-4 py-2">{s.groupName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
