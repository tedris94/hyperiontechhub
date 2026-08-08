'use client'

import Link from 'next/link'
import type { ReportCardPayload } from '@/lib/edusuite/reportCard'

export default function ReportCardPrint({
  card,
  backHref,
}: {
  card: ReportCardPayload
  backHref: string
}) {
  const color = card.primaryColor || '#1A2BC2'

  return (
    <div className="space-y-4">
      <div className="flex gap-3 print:hidden">
        <Link href={backHref} className="text-sm text-[#1A2BC2] hover:underline">
          ← Back to results
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="text-sm bg-[#1A2BC2] text-white px-4 py-1.5 rounded-lg"
        >
          Print report card
        </button>
      </div>

      <article
        className="bg-white border-2 mx-auto max-w-3xl p-8 print:border-0 print:max-w-none"
        style={{ borderColor: color }}
      >
        <header className="text-center border-b pb-4 mb-4" style={{ borderColor: color }}>
          <h1 className="text-2xl font-bold" style={{ color }}>
            {card.schoolName}
          </h1>
          {card.schoolAddress && <p className="text-sm text-gray-600 mt-1">{card.schoolAddress}</p>}
          <p className="mt-2 font-semibold tracking-wide uppercase text-sm">Student Report Card</p>
          <p className="text-sm text-gray-600">
            {card.exam} · {card.year}
          </p>
        </header>

        <section className="grid grid-cols-2 gap-2 text-sm mb-6">
          <p>
            <span className="text-gray-500">Name:</span> <strong>{card.studentName}</strong>
          </p>
          <p>
            <span className="text-gray-500">Class:</span> {card.className}
            {card.groupName ? ` (${card.groupName})` : ''}
          </p>
          <p>
            <span className="text-gray-500">Roll:</span> {card.rollNo || '—'}
          </p>
          <p>
            <span className="text-gray-500">Regi:</span> {card.regiNo || '—'}
          </p>
        </section>

        <table className="w-full text-sm border-collapse mb-6">
          <thead>
            <tr style={{ background: `${color}15` }}>
              <th className="border px-2 py-2 text-left">Subject</th>
              <th className="border px-2 py-2">Marks</th>
              <th className="border px-2 py-2">Grade</th>
              <th className="border px-2 py-2">Points</th>
            </tr>
          </thead>
          <tbody>
            {card.subjects.map((s) => (
              <tr key={s.name}>
                <td className="border px-2 py-1.5">{s.name}</td>
                <td className="border px-2 py-1.5 text-center">{s.score ?? '—'}</td>
                <td className="border px-2 py-1.5 text-center">{s.grade || '—'}</td>
                <td className="border px-2 py-1.5 text-center">{s.points ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-6">
          <div className="border rounded p-3">
            <p className="text-gray-500">Total</p>
            <p className="text-lg font-semibold">{card.totalScore ?? '—'}</p>
          </div>
          <div className="border rounded p-3">
            <p className="text-gray-500">Average</p>
            <p className="text-lg font-semibold">{card.average ?? '—'}</p>
          </div>
          <div className="border rounded p-3">
            <p className="text-gray-500">GPA</p>
            <p className="text-lg font-semibold">{card.gpa ?? '—'}</p>
          </div>
          <div className="border rounded p-3">
            <p className="text-gray-500">Result</p>
            <p className="text-lg font-semibold">{card.resultStatus ?? '—'}</p>
          </div>
        </section>

        {card.position && (
          <p className="text-sm mb-4">
            <span className="text-gray-500">Position:</span> {card.position}
          </p>
        )}

        <section className="grid md:grid-cols-2 gap-4 text-sm mb-6">
          <div>
            <p className="font-medium mb-1">Class teacher remark</p>
            <p className="text-gray-700 border rounded p-3 min-h-[4rem]">{card.teacherRemark}</p>
            {card.classTeacherName && (
              <p className="mt-2 text-xs text-gray-500">{card.classTeacherName}</p>
            )}
            {card.classTeacherSignatureUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={card.classTeacherSignatureUrl} alt="Class teacher signature" className="h-12 mt-1" />
            )}
          </div>
          <div>
            <p className="font-medium mb-1">Principal remark</p>
            <p className="text-gray-700 border rounded p-3 min-h-[4rem]">{card.principalRemark}</p>
            {card.principalName && (
              <p className="mt-2 text-xs text-gray-500">{card.principalName}</p>
            )}
            {card.principalSignatureUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={card.principalSignatureUrl} alt="Principal signature" className="h-12 mt-1" />
            )}
          </div>
        </section>

        {card.ratings && card.ratings.length > 0 && (
          <section className="mb-6">
            <p className="font-medium text-sm mb-2">Ratings</p>
            <ul className="text-sm grid grid-cols-2 gap-1">
              {card.ratings.map((r) => (
                <li key={r.label} className="flex justify-between border-b py-1">
                  <span>{r.label}</span>
                  <span>{r.value}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section>
          <p className="font-medium text-sm mb-2">Grading key</p>
          <div className="flex flex-wrap gap-2 text-xs">
            {card.gradingScale.map((g) => (
              <span key={g.grade} className="border rounded px-2 py-1">
                {g.grade}: {g.minScore}–{g.maxScore}
                {g.points != null ? ` (${g.points})` : ''}
              </span>
            ))}
          </div>
        </section>
      </article>
    </div>
  )
}
