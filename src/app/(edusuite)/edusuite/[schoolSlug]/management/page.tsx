'use client'

import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

type Named = { id?: string | number; title?: string; name?: string }
type SchoolDoc = {
  id: string | number
  examTerms?: Array<{ id?: string; name: string }>
  academicYears?: Array<{ id?: string; name: string }>
  gradingScale?: Array<{ grade: string; minScore: number; maxScore: number; points?: number }>
  extraFields?: Array<{ name: string; fieldType?: string; forRole?: string }>
  ratingScales?: Array<{ category: string; item: string }>
  principalName?: string
  principalSignatureUrl?: string
  principalAutoRemark?: string
  passMark?: number
  currentTerm?: string
  currentSession?: string
}

export default function ManagementPage() {
  const params = useParams()
  const schoolSlug = String(params.schoolSlug || '')
  const [tab, setTab] = useState<'class' | 'group' | 'exam' | 'year' | 'grading' | 'ratings' | 'principal'>('class')
  const [school, setSchool] = useState<SchoolDoc | null>(null)
  const [classes, setClasses] = useState<Named[]>([])
  const [groups, setGroups] = useState<Named[]>([])
  const [classTeachers, setClassTeachers] = useState<Named[]>([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [newName, setNewName] = useState('')
  const [classSubjects, setClassSubjects] = useState('')
  const [gradingText, setGradingText] = useState('')
  const [principal, setPrincipal] = useState({ name: '', signatureUrl: '', autoRemark: '', passMark: '40' })

  const load = useCallback(async () => {
    setError('')
    const sRes = await fetch(`/api/edusuite/schools/${encodeURIComponent(schoolSlug)}`)
    const sData = await sRes.json()
    if (!sRes.ok) {
      setError(sData.error || 'Failed to load school')
      return
    }
    setSchool(sData.school)
    setPrincipal({
      name: sData.school.principalName || '',
      signatureUrl: sData.school.principalSignatureUrl || '',
      autoRemark: sData.school.principalAutoRemark || '',
      passMark: String(sData.school.passMark ?? 40),
    })
    const scale = sData.school.gradingScale || []
    setGradingText(
      scale.map((g: { grade: string; minScore: number; maxScore: number; points?: number }) =>
        `${g.minScore}-${g.maxScore}=${g.grade}${g.points != null ? `:${g.points}` : ''}`,
      ).join('\n') || '80-100=A:5\n70-79=B:4\n60-69=C:3.5\n50-59=D:3\n40-49=E:2\n0-39=F:1',
    )

    const schoolId = sData.school.id
    const [cRes, gRes, ctRes] = await Promise.all([
      fetch(`/api/edusuite/records?collection=edu-classes&schoolId=${schoolId}&schoolSlug=${schoolSlug}`),
      fetch(`/api/edusuite/records?collection=edu-groups&schoolId=${schoolId}&schoolSlug=${schoolSlug}`),
      fetch(`/api/edusuite/records?collection=edu-class-teachers&schoolId=${schoolId}&schoolSlug=${schoolSlug}`),
    ])
    const cData = await cRes.json()
    const gData = await gRes.json()
    const ctData = await ctRes.json()
    setClasses(cData.docs || [])
    setGroups(gData.docs || [])
    setClassTeachers(ctData.docs || [])
  }, [schoolSlug])

  useEffect(() => {
    void load()
  }, [load])

  async function patchSchool(data: Record<string, unknown>) {
    setMessage('')
    setError('')
    const res = await fetch(`/api/edusuite/schools/${encodeURIComponent(schoolSlug)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const json = await res.json()
    if (!res.ok) {
      setError(json.error || 'Save failed')
      return
    }
    setSchool(json.school)
    setMessage('Saved.')
  }

  async function addNamed(collection: string, title: string, extra?: Record<string, unknown>) {
    if (!school || !title.trim()) return
    setError('')
    const res = await fetch('/api/edusuite/records', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        collection,
        schoolSlug,
        data: { title: title.trim(), school: school.id, ...extra },
      }),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'Create failed')
      return
    }
    setNewName('')
    setClassSubjects('')
    setMessage('Added.')
    await load()
  }

  async function removeNamed(collection: string, id: string | number) {
    if (!confirm('Delete?')) return
    await fetch('/api/edusuite/records', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ collection, id, schoolSlug }),
    })
    await load()
  }

  function parseGrading() {
    return gradingText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const m = line.match(/^(\d+)\s*-\s*(\d+)\s*=\s*([A-Za-z]+)(?::(\d+(?:\.\d+)?))?$/)
        if (!m) return null
        return {
          grade: m[3].toUpperCase(),
          minScore: Number(m[1]),
          maxScore: Number(m[2]),
          points: m[4] != null ? Number(m[4]) : undefined,
        }
      })
      .filter(Boolean)
  }

  const tabs = [
    ['class', 'Class'],
    ['group', 'Group'],
    ['exam', 'Exam / Term'],
    ['year', 'Year'],
    ['grading', 'Grading'],
    ['ratings', 'Ratings'],
    ['principal', 'Principal / MM'],
  ] as const

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-[#1B1C1E]">Management</h2>
        <p className="text-gray-600 mt-1">Class, group, exam, year, grading, ratings — Educare-style setup.</p>
      </div>
      {error && <div className="rounded-lg bg-red-50 text-red-700 px-4 py-3 text-sm">{error}</div>}
      {message && <div className="rounded-lg bg-green-50 text-green-700 px-4 py-3 text-sm">{message}</div>}

      <div className="flex flex-wrap gap-2">
        {tabs.map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`px-3 py-1.5 rounded-lg text-sm ${
              tab === id ? 'bg-[#1A2BC2] text-white' : 'bg-white border border-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        {tab === 'class' && (
          <>
            <div className="grid md:grid-cols-2 gap-3">
              <input
                className="border rounded-lg px-3 py-2"
                placeholder="Class name e.g. JSS 1A"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <input
                className="border rounded-lg px-3 py-2"
                placeholder="Subjects (comma-separated)"
                value={classSubjects}
                onChange={(e) => setClassSubjects(e.target.value)}
              />
            </div>
            <button
              type="button"
              className="bg-[#1A2BC2] text-white px-4 py-2 rounded-lg"
              onClick={() =>
                void addNamed('edu-classes', newName, {
                  subjects: classSubjects
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .map((name) => ({ name })),
                })
              }
            >
              Add class
            </button>
            <ul className="divide-y text-sm">
              {classes.map((c) => (
                <li key={String(c.id)} className="py-2 flex justify-between">
                  <span>{c.title}</span>
                  <button type="button" className="text-red-600" onClick={() => void removeNamed('edu-classes', c.id!)}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}

        {tab === 'group' && (
          <>
            <input
              className="border rounded-lg px-3 py-2 w-full max-w-md"
              placeholder="Group e.g. Science"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <button
              type="button"
              className="bg-[#1A2BC2] text-white px-4 py-2 rounded-lg"
              onClick={() => void addNamed('edu-groups', newName)}
            >
              Add group
            </button>
            <ul className="divide-y text-sm">
              {groups.map((g) => (
                <li key={String(g.id)} className="py-2 flex justify-between">
                  <span>{g.title}</span>
                  <button type="button" className="text-red-600" onClick={() => void removeNamed('edu-groups', g.id!)}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}

        {tab === 'exam' && (
          <>
            <input
              className="border rounded-lg px-3 py-2 w-full max-w-md"
              placeholder="Exam / term e.g. First Term"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <button
              type="button"
              className="bg-[#1A2BC2] text-white px-4 py-2 rounded-lg"
              onClick={() => {
                const list = [...(school?.examTerms || []), { name: newName.trim() }]
                void patchSchool({ examTerms: list })
                setNewName('')
              }}
            >
              Add exam/term
            </button>
            <ul className="divide-y text-sm">
              {(school?.examTerms || []).map((t, i) => (
                <li key={t.id || i} className="py-2 flex justify-between">
                  <span>{t.name}</span>
                  <button
                    type="button"
                    className="text-red-600"
                    onClick={() =>
                      void patchSchool({
                        examTerms: (school?.examTerms || []).filter((_, idx) => idx !== i),
                      })
                    }
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}

        {tab === 'year' && (
          <>
            <input
              className="border rounded-lg px-3 py-2 w-full max-w-md"
              placeholder="Year e.g. 2025/2026"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <button
              type="button"
              className="bg-[#1A2BC2] text-white px-4 py-2 rounded-lg"
              onClick={() => {
                const list = [...(school?.academicYears || []), { name: newName.trim() }]
                void patchSchool({ academicYears: list })
                setNewName('')
              }}
            >
              Add year
            </button>
            <ul className="divide-y text-sm">
              {(school?.academicYears || []).map((t, i) => (
                <li key={t.id || i} className="py-2 flex justify-between">
                  <span>{t.name}</span>
                  <button
                    type="button"
                    className="text-red-600"
                    onClick={() =>
                      void patchSchool({
                        academicYears: (school?.academicYears || []).filter((_, idx) => idx !== i),
                      })
                    }
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}

        {tab === 'grading' && (
          <>
            <p className="text-sm text-gray-600">One band per line: min-max=Grade:points</p>
            <textarea
              className="w-full border rounded-lg px-3 py-2 font-mono text-sm"
              rows={8}
              value={gradingText}
              onChange={(e) => setGradingText(e.target.value)}
            />
            <button
              type="button"
              className="bg-[#1A2BC2] text-white px-4 py-2 rounded-lg"
              onClick={() => void patchSchool({ gradingScale: parseGrading() })}
            >
              Save grading scale
            </button>
          </>
        )}

        {tab === 'ratings' && (
          <>
            <input
              className="border rounded-lg px-3 py-2 w-full max-w-md"
              placeholder="Category:Item e.g. Development:Punctuality"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <button
              type="button"
              className="bg-[#1A2BC2] text-white px-4 py-2 rounded-lg"
              onClick={() => {
                const [category, item] = newName.split(':').map((s) => s.trim())
                if (!category || !item) {
                  setError('Use Category:Item format')
                  return
                }
                void patchSchool({
                  ratingScales: [...(school?.ratingScales || []), { category, item }],
                })
                setNewName('')
              }}
            >
              Add rating item
            </button>
            <ul className="divide-y text-sm">
              {(school?.ratingScales || []).map((r, i) => (
                <li key={i} className="py-2 flex justify-between">
                  <span>
                    {r.category} — {r.item}
                  </span>
                  <button
                    type="button"
                    className="text-red-600"
                    onClick={() =>
                      void patchSchool({
                        ratingScales: (school?.ratingScales || []).filter((_, idx) => idx !== i),
                      })
                    }
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}

        {tab === 'principal' && (
          <>
            <div className="grid md:grid-cols-2 gap-3">
              <label className="text-sm block">
                Principal name
                <input
                  className="mt-1 w-full border rounded-lg px-3 py-2"
                  value={principal.name}
                  onChange={(e) => setPrincipal((s) => ({ ...s, name: e.target.value }))}
                />
              </label>
              <label className="text-sm block">
                Signature URL
                <input
                  className="mt-1 w-full border rounded-lg px-3 py-2"
                  value={principal.signatureUrl}
                  onChange={(e) => setPrincipal((s) => ({ ...s, signatureUrl: e.target.value }))}
                />
              </label>
              <label className="text-sm block md:col-span-2">
                Auto remark
                <textarea
                  className="mt-1 w-full border rounded-lg px-3 py-2"
                  rows={3}
                  value={principal.autoRemark}
                  onChange={(e) => setPrincipal((s) => ({ ...s, autoRemark: e.target.value }))}
                />
              </label>
              <label className="text-sm block">
                Pass mark
                <input
                  type="number"
                  className="mt-1 w-full border rounded-lg px-3 py-2"
                  value={principal.passMark}
                  onChange={(e) => setPrincipal((s) => ({ ...s, passMark: e.target.value }))}
                />
              </label>
            </div>
            <button
              type="button"
              className="bg-[#1A2BC2] text-white px-4 py-2 rounded-lg"
              onClick={() =>
                void patchSchool({
                  principalName: principal.name,
                  principalSignatureUrl: principal.signatureUrl,
                  principalAutoRemark: principal.autoRemark,
                  passMark: Number(principal.passMark) || 40,
                })
              }
            >
              Save principal settings
            </button>
            <div className="pt-4 border-t">
              <h3 className="font-medium mb-2">Class teachers (master/mistress)</h3>
              <div className="flex gap-2 mb-3">
                <input
                  className="border rounded-lg px-3 py-2 flex-1"
                  placeholder="Name — Class e.g. Mr Okonkwo — JSS 1A"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
                <button
                  type="button"
                  className="bg-[#1A2BC2] text-white px-4 py-2 rounded-lg"
                  onClick={() => {
                    const [title, className] = newName.split('—').map((s) => s.trim())
                    void addNamed('edu-class-teachers', title || newName, {
                      className: className || '',
                    })
                  }}
                >
                  Add
                </button>
              </div>
              <ul className="divide-y text-sm">
                {classTeachers.map((ct) => (
                  <li key={String(ct.id)} className="py-2 flex justify-between">
                    <span>{ct.title}</span>
                    <button
                      type="button"
                      className="text-red-600"
                      onClick={() => void removeNamed('edu-class-teachers', ct.id!)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
