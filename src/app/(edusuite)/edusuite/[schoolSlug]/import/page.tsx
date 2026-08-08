'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'

export default function ImportExportPage() {
  const params = useParams()
  const schoolSlug = String(params.schoolSlug || '')
  const [csv, setCsv] = useState(
    'Name,Roll_No,Regi_No,Class,Year,Group,GuardianName,GuardianPhone\nAisha Bello,001,REG001,JSS 1A,2025/2026,Science,Mrs Bello,+2348012345678',
  )
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function importStudents() {
    setError('')
    setMessage('')
    const res = await fetch('/api/edusuite/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ schoolSlug, type: 'students', csv }),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'Import failed')
      return
    }
    setMessage(`Imported ${data.created} student(s).`)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-semibold text-[#1B1C1E]">Import / Export</h2>
        <p className="text-gray-600 mt-1">Educare-style CSV for students and results.</p>
      </div>
      {error && <div className="rounded-lg bg-red-50 text-red-700 px-4 py-3 text-sm">{error}</div>}
      {message && <div className="rounded-lg bg-green-50 text-green-700 px-4 py-3 text-sm">{message}</div>}

      <div className="bg-white border rounded-xl p-5 space-y-3">
        <h3 className="font-medium">Import students</h3>
        <textarea
          className="w-full border rounded-lg px-3 py-2 font-mono text-xs"
          rows={8}
          value={csv}
          onChange={(e) => setCsv(e.target.value)}
        />
        <button type="button" onClick={() => void importStudents()} className="bg-[#1A2BC2] text-white px-4 py-2 rounded-lg">
          Import CSV
        </button>
      </div>

      <div className="bg-white border rounded-xl p-5 space-y-3">
        <h3 className="font-medium">Export</h3>
        <div className="flex flex-wrap gap-3">
          <a
            className="text-[#1A2BC2] hover:underline text-sm"
            href={`/api/edusuite/export?schoolSlug=${encodeURIComponent(schoolSlug)}&type=students`}
          >
            Download students CSV
          </a>
          <a
            className="text-[#1A2BC2] hover:underline text-sm"
            href={`/api/edusuite/export?schoolSlug=${encodeURIComponent(schoolSlug)}&type=results`}
          >
            Download results CSV
          </a>
        </div>
      </div>
    </div>
  )
}
