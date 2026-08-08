import type { CollectionConfig } from 'payload'
import { makeSchoolScopedCollection } from './shared'

export const EduStudents: CollectionConfig = makeSchoolScopedCollection(
  'edu-students',
  'Student',
  [
    { name: 'title', type: 'text', required: true, admin: { description: 'Full name' } },
    { name: 'admissionNo', type: 'text', index: true },
    { name: 'rollNo', type: 'text', index: true },
    { name: 'regiNo', type: 'text', index: true },
    { name: 'gender', type: 'select', options: ['male', 'female', 'other'] },
    { name: 'dateOfBirth', type: 'date' },
    { name: 'className', type: 'text', index: true },
    { name: 'section', type: 'text' },
    { name: 'groupName', type: 'text', index: true },
    { name: 'year', type: 'text', index: true },
    { name: 'guardianName', type: 'text' },
    { name: 'guardianPhone', type: 'text' },
    { name: 'guardianEmail', type: 'email' },
    { name: 'parentUser', type: 'relationship', relationTo: 'users' },
    { name: 'pin', type: 'text' },
    {
      name: 'details',
      type: 'json',
      admin: { description: 'Extra Educare-style fields (DOB extras, address, etc.)' },
    },
    {
      name: 'subjectList',
      type: 'array',
      fields: [{ name: 'name', type: 'text', required: true }],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: ['active', 'graduated', 'withdrawn', 'transferred'],
    },
    { name: 'user', type: 'relationship', relationTo: 'users' },
    { name: 'notes', type: 'textarea' },
  ],
  { useAsTitle: 'title', defaultColumns: ['title', 'rollNo', 'className', 'year', 'school'] },
)

export const EduClasses: CollectionConfig = makeSchoolScopedCollection(
  'edu-classes',
  'Class',
  [
    { name: 'title', type: 'text', required: true },
    { name: 'section', type: 'text' },
    { name: 'level', type: 'text' },
    { name: 'classTeacher', type: 'relationship', relationTo: 'users' },
    { name: 'capacity', type: 'number' },
    {
      name: 'subjects',
      type: 'array',
      fields: [{ name: 'name', type: 'text', required: true }],
    },
    {
      name: 'timetableNotes',
      type: 'textarea',
      admin: { description: 'Period / timetable notes for this class' },
    },
  ],
)

export const EduSubjects: CollectionConfig = makeSchoolScopedCollection(
  'edu-subjects',
  'Subject',
  [
    { name: 'title', type: 'text', required: true },
    { name: 'code', type: 'text' },
    { name: 'className', type: 'text', index: true },
    { name: 'groupName', type: 'text' },
    { name: 'teacher', type: 'relationship', relationTo: 'users' },
    { name: 'teacherName', type: 'text' },
  ],
)

export const EduStaff: CollectionConfig = makeSchoolScopedCollection(
  'edu-staff',
  'Staff member',
  [
    { name: 'title', type: 'text', required: true },
    { name: 'staffId', type: 'text' },
    { name: 'department', type: 'text' },
    { name: 'jobTitle', type: 'text' },
    { name: 'designation', type: 'text' },
    { name: 'phone', type: 'text' },
    { name: 'email', type: 'email' },
    { name: 'user', type: 'relationship', relationTo: 'users' },
    {
      name: 'subjects',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'className', type: 'text' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: ['active', 'on_leave', 'exited'],
    },
    { name: 'leaveNotes', type: 'textarea', admin: { description: 'Leave / HR notes (payroll lite)' } },
    { name: 'details', type: 'json' },
  ],
)

export const EduAttendance: CollectionConfig = makeSchoolScopedCollection(
  'edu-attendance',
  'Attendance record',
  [
    { name: 'title', type: 'text', required: true },
    { name: 'date', type: 'date', required: true, index: true },
    { name: 'className', type: 'text', index: true },
    { name: 'subject', type: 'text' },
    { name: 'student', type: 'relationship', relationTo: 'edu-students' },
    { name: 'studentName', type: 'text' },
    { name: 'staff', type: 'relationship', relationTo: 'edu-staff' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'present',
      options: ['present', 'absent', 'late', 'excused'],
    },
    { name: 'period', type: 'text' },
    { name: 'notes', type: 'textarea' },
  ],
  { defaultColumns: ['title', 'date', 'className', 'status', 'school'] },
)

export const EduExams: CollectionConfig = makeSchoolScopedCollection(
  'edu-exams',
  'Exam',
  [
    { name: 'title', type: 'text', required: true },
    { name: 'term', type: 'text', index: true },
    { name: 'session', type: 'text', index: true },
    { name: 'className', type: 'text' },
    { name: 'subject', type: 'text' },
    { name: 'maxScore', type: 'number', defaultValue: 100 },
    { name: 'examDate', type: 'date' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: ['draft', 'published', 'closed'],
    },
  ],
)

/** Simple single-score result row (legacy CRUD). Prefer edu-results for cards. */
export const EduExamResults: CollectionConfig = makeSchoolScopedCollection(
  'edu-exam-results',
  'Exam result',
  [
    { name: 'title', type: 'text', required: true },
    { name: 'exam', type: 'relationship', relationTo: 'edu-exams' },
    { name: 'student', type: 'relationship', relationTo: 'edu-students' },
    { name: 'score', type: 'number', required: true },
    { name: 'grade', type: 'text' },
    { name: 'remark', type: 'text' },
    { name: 'published', type: 'checkbox', defaultValue: false },
  ],
)

export const EduFeeStructures: CollectionConfig = makeSchoolScopedCollection(
  'edu-fee-structures',
  'Fee structure',
  [
    { name: 'title', type: 'text', required: true },
    { name: 'term', type: 'text' },
    { name: 'session', type: 'text' },
    { name: 'className', type: 'text' },
    { name: 'amount', type: 'number', required: true },
    { name: 'currency', type: 'text', defaultValue: 'NGN' },
  ],
)

export const EduInvoices: CollectionConfig = makeSchoolScopedCollection(
  'edu-invoices',
  'Invoice',
  [
    { name: 'title', type: 'text', required: true },
    { name: 'student', type: 'relationship', relationTo: 'edu-students' },
    { name: 'feeStructure', type: 'relationship', relationTo: 'edu-fee-structures' },
    { name: 'amount', type: 'number', required: true },
    { name: 'amountPaid', type: 'number', defaultValue: 0 },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: ['pending', 'partial', 'paid', 'waived', 'cancelled'],
    },
    { name: 'dueDate', type: 'date' },
    { name: 'paystackReference', type: 'text' },
  ],
  { defaultColumns: ['title', 'amount', 'status', 'school'] },
)

export const EduNotices: CollectionConfig = makeSchoolScopedCollection(
  'edu-notices',
  'Notice',
  [
    { name: 'title', type: 'text', required: true },
    { name: 'body', type: 'textarea', required: true },
    {
      name: 'audience',
      type: 'select',
      defaultValue: 'all',
      options: ['all', 'staff', 'parents', 'students'],
    },
    { name: 'publishedAt', type: 'date' },
    { name: 'sendEmail', type: 'checkbox', defaultValue: false },
    { name: 'sendSms', type: 'checkbox', defaultValue: false },
  ],
)
