'use client'

import { useEffect, useState } from 'react'
import type { IslamiyyahClass, IslamiyyahStudent } from '@/lib/icms/types'
import DeleteRecordButton from '@/components/icms/DeleteRecordButton'
import { useIcmsToast } from '@/components/icms/toast'

export default function IslamiyyahAdminForms({
  tenantSlug,
  classes: initialClasses,
  students: initialStudents,
}: {
  tenantSlug: string
  classes: IslamiyyahClass[]
  students: IslamiyyahStudent[]
}) {
  const toast = useIcmsToast()
  const [classes, setClasses] = useState(initialClasses)
  const [students, setStudents] = useState(initialStudents)
  const [editingClass, setEditingClass] = useState<IslamiyyahClass | null>(null)
  const [editingStudent, setEditingStudent] = useState<IslamiyyahStudent | null>(null)
  const [classForm, setClassForm] = useState({
    title: '',
    schedule: '',
    ageGroup: '',
    teacher: '',
    capacity: '30',
    enrolled: '0',
    status: 'Open',
    summary: '',
  })
  const [studentForm, setStudentForm] = useState({
    name: '',
    guardian: '',
    phone: '',
    classRef: '',
    status: 'Active',
  })
  const [error, setError] = useState('')
  const [savingClass, setSavingClass] = useState(false)
  const [savingStudent, setSavingStudent] = useState(false)

  useEffect(() => {
    setClasses(initialClasses)
  }, [initialClasses])

  useEffect(() => {
    setStudents(initialStudents)
  }, [initialStudents])

  useEffect(() => {
    if (!editingClass) {
      setClassForm({
        title: '',
        schedule: '',
        ageGroup: '',
        teacher: '',
        capacity: '30',
        enrolled: '0',
        status: 'Open',
        summary: '',
      })
      return
    }
    setClassForm({
      title: editingClass.title,
      schedule: editingClass.schedule,
      ageGroup: editingClass.ageGroup,
      teacher: editingClass.teacher,
      capacity: String(editingClass.capacity),
      enrolled: String(editingClass.enrolled),
      status: editingClass.status,
      summary: editingClass.summary,
    })
  }, [editingClass])

  useEffect(() => {
    if (!editingStudent) {
      setStudentForm({ name: '', guardian: '', phone: '', classRef: '', status: 'Active' })
      return
    }
    const cls = classes.find((c) => c.title === editingStudent.classTitle)
    setStudentForm({
      name: editingStudent.name,
      guardian: editingStudent.guardian,
      phone: editingStudent.phone,
      classRef: cls ? String(cls.id) : '',
      status: editingStudent.status,
    })
  }, [editingStudent, classes])

  async function saveClass(e: React.FormEvent) {
    e.preventDefault()
    setSavingClass(true)
    setError('')
    try {
      const data = {
        ...classForm,
        capacity: Number(classForm.capacity) || 0,
        enrolled: Number(classForm.enrolled) || 0,
      }
      const res = await fetch('/api/icms/records', {
        method: editingClass ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          editingClass
            ? {
                collection: 'icms-islamiyyah-classes',
                tenantSlug,
                id: editingClass.id,
                data,
              }
            : { collection: 'icms-islamiyyah-classes', tenantSlug, data },
        ),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Save failed')
      const doc = json.doc || {}
      const mapped: IslamiyyahClass = {
        id: String(doc.id ?? editingClass?.id ?? ''),
        title: String(doc.title ?? data.title),
        schedule: String(doc.schedule ?? data.schedule),
        ageGroup: String(doc.ageGroup ?? data.ageGroup),
        teacher: String(doc.teacher ?? data.teacher),
        capacity: Number(doc.capacity ?? data.capacity),
        enrolled: Number(doc.enrolled ?? data.enrolled),
        status: String(doc.status ?? data.status),
        summary: String(doc.summary ?? data.summary),
      }
      setClasses((prev) =>
        editingClass
          ? prev.map((c) => (String(c.id) === String(mapped.id) ? mapped : c))
          : [mapped, ...prev],
      )
      toast.success(editingClass ? 'Class updated' : 'Class created')
      setEditingClass(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Save failed'
      setError(message)
      toast.error(message)
    } finally {
      setSavingClass(false)
    }
  }

  async function saveStudent(e: React.FormEvent) {
    e.preventDefault()
    setSavingStudent(true)
    setError('')
    try {
      const data = {
        name: studentForm.name,
        guardian: studentForm.guardian,
        phone: studentForm.phone,
        status: studentForm.status,
        ...(studentForm.classRef
          ? {
              classRef: isNaN(Number(studentForm.classRef))
                ? studentForm.classRef
                : Number(studentForm.classRef),
            }
          : {}),
      }
      const res = await fetch('/api/icms/records', {
        method: editingStudent ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          editingStudent
            ? {
                collection: 'icms-islamiyyah-students',
                tenantSlug,
                id: editingStudent.id,
                data,
              }
            : { collection: 'icms-islamiyyah-students', tenantSlug, data },
        ),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Save failed')
      const doc = json.doc || {}
      const classTitle =
        classes.find((c) => String(c.id) === String(studentForm.classRef))?.title ||
        editingStudent?.classTitle ||
        ''
      const mapped: IslamiyyahStudent = {
        id: String(doc.id ?? editingStudent?.id ?? ''),
        name: String(doc.name ?? data.name),
        guardian: String(doc.guardian ?? data.guardian),
        phone: String(doc.phone ?? data.phone),
        status: String(doc.status ?? data.status),
        classTitle,
      }
      setStudents((prev) =>
        editingStudent
          ? prev.map((s) => (String(s.id) === String(mapped.id) ? mapped : s))
          : [mapped, ...prev],
      )
      toast.success(editingStudent ? 'Student updated' : 'Student added')
      setEditingStudent(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Save failed'
      setError(message)
      toast.error(message)
    } finally {
      setSavingStudent(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="border border-black/10 bg-white">
          <div className="border-b border-black/5 px-5 py-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[color:var(--icms-gold)]">
              Classes ({classes.length})
            </h2>
          </div>
          <ul className="divide-y divide-black/5">
            {classes.map((c) => (
              <li key={c.id} className="flex items-start justify-between gap-3 px-5 py-4">
                <div>
                  <p className="font-medium text-[color:var(--icms-charcoal)]">{c.title}</p>
                  <p className="text-xs text-[color:var(--icms-warm-gray)]">
                    {c.ageGroup}
                    {c.schedule ? ` · ${c.schedule}` : ''} · {c.enrolled}/{c.capacity} · {c.status}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    className="text-xs font-medium text-[color:var(--icms-emerald)] hover:underline"
                    onClick={() => setEditingClass(c)}
                  >
                    Edit
                  </button>
                  <DeleteRecordButton
                    collection="icms-islamiyyah-classes"
                    id={c.id}
                    tenantSlug={tenantSlug}
                    onSuccess={() =>
                      setClasses((prev) => prev.filter((x) => String(x.id) !== String(c.id)))
                    }
                  />
                </div>
              </li>
            ))}
            {classes.length === 0 ? (
              <li className="px-5 py-6 text-sm text-[color:var(--icms-warm-gray)]">No classes yet.</li>
            ) : null}
          </ul>
        </div>

        <div className="border border-black/10 bg-white">
          <div className="border-b border-black/5 px-5 py-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[color:var(--icms-gold)]">
              Students ({students.length})
            </h2>
          </div>
          <ul className="divide-y divide-black/5">
            {students.map((s) => (
              <li key={s.id} className="flex items-start justify-between gap-3 px-5 py-4">
                <div>
                  <p className="font-medium text-[color:var(--icms-charcoal)]">{s.name}</p>
                  <p className="text-xs text-[color:var(--icms-warm-gray)]">
                    {s.classTitle || 'Unassigned'}
                    {s.guardian ? ` · ${s.guardian}` : ''} · {s.status}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    className="text-xs font-medium text-[color:var(--icms-emerald)] hover:underline"
                    onClick={() => setEditingStudent(s)}
                  >
                    Edit
                  </button>
                  <DeleteRecordButton
                    collection="icms-islamiyyah-students"
                    id={s.id}
                    tenantSlug={tenantSlug}
                    onSuccess={() =>
                      setStudents((prev) => prev.filter((x) => String(x.id) !== String(s.id)))
                    }
                  />
                </div>
              </li>
            ))}
            {students.length === 0 ? (
              <li className="px-5 py-6 text-sm text-[color:var(--icms-warm-gray)]">
                No students yet.
              </li>
            ) : null}
          </ul>
        </div>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="grid gap-8 lg:grid-cols-2">
        <form onSubmit={saveClass} className="space-y-4 border border-black/10 bg-white p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="icms-display text-xl text-[color:var(--icms-forest)]">
              {editingClass ? 'Edit class' : 'Add class'}
            </h2>
            {editingClass ? (
              <button
                type="button"
                className="text-xs text-[color:var(--icms-warm-gray)] hover:underline"
                onClick={() => setEditingClass(null)}
              >
                Cancel
              </button>
            ) : null}
          </div>
          <label className="block text-sm font-medium">
            Title
            <input
              required
              className="icms-input mt-1.5"
              value={classForm.title}
              onChange={(e) => setClassForm((s) => ({ ...s, title: e.target.value }))}
            />
          </label>
          <label className="block text-sm font-medium">
            Schedule
            <input
              className="icms-input mt-1.5"
              value={classForm.schedule}
              onChange={(e) => setClassForm((s) => ({ ...s, schedule: e.target.value }))}
            />
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium">
              Age group
              <input
                className="icms-input mt-1.5"
                value={classForm.ageGroup}
                onChange={(e) => setClassForm((s) => ({ ...s, ageGroup: e.target.value }))}
              />
            </label>
            <label className="text-sm font-medium">
              Teacher
              <input
                className="icms-input mt-1.5"
                value={classForm.teacher}
                onChange={(e) => setClassForm((s) => ({ ...s, teacher: e.target.value }))}
              />
            </label>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <label className="text-sm font-medium">
              Capacity
              <input
                type="number"
                className="icms-input mt-1.5"
                value={classForm.capacity}
                onChange={(e) => setClassForm((s) => ({ ...s, capacity: e.target.value }))}
              />
            </label>
            <label className="text-sm font-medium">
              Enrolled
              <input
                type="number"
                className="icms-input mt-1.5"
                value={classForm.enrolled}
                onChange={(e) => setClassForm((s) => ({ ...s, enrolled: e.target.value }))}
              />
            </label>
            <label className="text-sm font-medium">
              Status
              <select
                className="icms-input mt-1.5"
                value={classForm.status}
                onChange={(e) => setClassForm((s) => ({ ...s, status: e.target.value }))}
              >
                <option value="Open">Open</option>
                <option value="Full">Full</option>
                <option value="Closed">Closed</option>
              </select>
            </label>
          </div>
          <label className="block text-sm font-medium">
            Summary
            <textarea
              className="icms-input mt-1.5 min-h-24"
              value={classForm.summary}
              onChange={(e) => setClassForm((s) => ({ ...s, summary: e.target.value }))}
            />
          </label>
          <button type="submit" className="icms-btn-primary" disabled={savingClass}>
            {savingClass ? 'Saving…' : editingClass ? 'Save class' : 'Add class'}
          </button>
        </form>

        <form onSubmit={saveStudent} className="space-y-4 border border-black/10 bg-white p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="icms-display text-xl text-[color:var(--icms-forest)]">
              {editingStudent ? 'Edit student' : 'Add student'}
            </h2>
            {editingStudent ? (
              <button
                type="button"
                className="text-xs text-[color:var(--icms-warm-gray)] hover:underline"
                onClick={() => setEditingStudent(null)}
              >
                Cancel
              </button>
            ) : null}
          </div>
          <label className="block text-sm font-medium">
            Student name
            <input
              required
              className="icms-input mt-1.5"
              value={studentForm.name}
              onChange={(e) => setStudentForm((s) => ({ ...s, name: e.target.value }))}
            />
          </label>
          <label className="block text-sm font-medium">
            Guardian
            <input
              className="icms-input mt-1.5"
              value={studentForm.guardian}
              onChange={(e) => setStudentForm((s) => ({ ...s, guardian: e.target.value }))}
            />
          </label>
          <label className="block text-sm font-medium">
            Phone
            <input
              className="icms-input mt-1.5"
              value={studentForm.phone}
              onChange={(e) => setStudentForm((s) => ({ ...s, phone: e.target.value }))}
            />
          </label>
          <label className="block text-sm font-medium">
            Class
            <select
              className="icms-input mt-1.5"
              value={studentForm.classRef}
              onChange={(e) => setStudentForm((s) => ({ ...s, classRef: e.target.value }))}
            >
              <option value="">Unassigned</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium">
            Status
            <select
              className="icms-input mt-1.5"
              value={studentForm.status}
              onChange={(e) => setStudentForm((s) => ({ ...s, status: e.target.value }))}
            >
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Graduated">Graduated</option>
              <option value="Withdrawn">Withdrawn</option>
            </select>
          </label>
          <button type="submit" className="icms-btn-primary" disabled={savingStudent}>
            {savingStudent ? 'Saving…' : editingStudent ? 'Save student' : 'Add student'}
          </button>
        </form>
      </div>
    </div>
  )
}
