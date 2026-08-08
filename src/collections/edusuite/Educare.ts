import type { CollectionConfig } from 'payload'
import { makeSchoolScopedCollection } from './shared'

/** Academic group (Science / Commerce / Arts) with optional subjects list. */
export const EduGroups: CollectionConfig = makeSchoolScopedCollection(
  'edu-groups',
  'Group',
  [
    { name: 'title', type: 'text', required: true },
    {
      name: 'subjects',
      type: 'array',
      fields: [{ name: 'name', type: 'text', required: true }],
    },
  ],
)

/** Pre-publish mark sheet: one row per class + exam + year + subject. */
export const EduMarks: CollectionConfig = makeSchoolScopedCollection(
  'edu-marks',
  'Mark sheet',
  [
    { name: 'title', type: 'text', required: true },
    { name: 'className', type: 'text', required: true, index: true },
    { name: 'exam', type: 'text', required: true, index: true },
    { name: 'year', type: 'text', required: true, index: true },
    { name: 'subject', type: 'text', required: true, index: true },
    { name: 'maxScore', type: 'number', defaultValue: 100 },
    {
      name: 'scores',
      type: 'array',
      fields: [
        { name: 'student', type: 'relationship', relationTo: 'edu-students', required: true },
        { name: 'studentName', type: 'text' },
        { name: 'rollNo', type: 'text' },
        { name: 'score', type: 'text', admin: { description: 'Number or ABS' } },
        { name: 'grade', type: 'text' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: ['draft', 'ready', 'published'],
    },
  ],
  { defaultColumns: ['title', 'className', 'exam', 'subject', 'status'] },
)

/**
 * Published term result card (Educare-style): all subjects for one student/exam/year.
 * Keeps edu-exam-results for simple single-score rows; this is the full card.
 */
export const EduResults: CollectionConfig = makeSchoolScopedCollection(
  'edu-results',
  'Result card',
  [
    { name: 'title', type: 'text', required: true },
    { name: 'student', type: 'relationship', relationTo: 'edu-students', required: true, index: true },
    { name: 'studentName', type: 'text' },
    { name: 'rollNo', type: 'text' },
    { name: 'regiNo', type: 'text' },
    { name: 'className', type: 'text', required: true, index: true },
    { name: 'groupName', type: 'text' },
    { name: 'exam', type: 'text', required: true, index: true },
    { name: 'year', type: 'text', required: true, index: true },
    {
      name: 'subjects',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'score', type: 'number' },
        { name: 'grade', type: 'text' },
        { name: 'points', type: 'number' },
        { name: 'remark', type: 'text' },
      ],
    },
    { name: 'totalScore', type: 'number' },
    { name: 'average', type: 'number' },
    { name: 'gpa', type: 'number' },
    { name: 'resultStatus', type: 'text', admin: { description: 'Passed / Failed' } },
    { name: 'position', type: 'text' },
    { name: 'teacherRemark', type: 'textarea' },
    { name: 'principalRemark', type: 'textarea' },
    { name: 'published', type: 'checkbox', defaultValue: false },
    {
      name: 'ratings',
      type: 'array',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'value', type: 'text' },
      ],
    },
  ],
  { defaultColumns: ['title', 'className', 'exam', 'year', 'published'] },
)

/** Class teacher (master/mistress) assignment + signature URL/text. */
export const EduClassTeachers: CollectionConfig = makeSchoolScopedCollection(
  'edu-class-teachers',
  'Class teacher',
  [
    { name: 'title', type: 'text', required: true },
    { name: 'className', type: 'text', required: true },
    { name: 'user', type: 'relationship', relationTo: 'users' },
    { name: 'staff', type: 'relationship', relationTo: 'edu-staff' },
    { name: 'signatureUrl', type: 'text' },
    { name: 'autoRemark', type: 'textarea' },
  ],
)

export const EduFeeWaivers: CollectionConfig = makeSchoolScopedCollection(
  'edu-fee-waivers',
  'Fee waiver',
  [
    { name: 'title', type: 'text', required: true },
    { name: 'student', type: 'relationship', relationTo: 'edu-students' },
    { name: 'amount', type: 'number', required: true },
    { name: 'reason', type: 'textarea' },
    { name: 'term', type: 'text' },
    { name: 'session', type: 'text' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'approved',
      options: ['pending', 'approved', 'rejected'],
    },
  ],
)
