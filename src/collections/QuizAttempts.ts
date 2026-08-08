import type { CollectionConfig } from 'payload'
import { getAuthUser, isStaffRole } from './lms/access'

export const QuizAttempts: CollectionConfig = {
  slug: 'quiz-attempts',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['student', 'quiz', 'score', 'passed', 'attemptedAt'],
  },
  access: {
    read: ({ req }) => {
      const user = getAuthUser(req)
      if (!user) return false
      if (isStaffRole(user.role)) return true
      return { student: { equals: user.id } }
    },
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => {
      const user = getAuthUser(req)
      return Boolean(user && isStaffRole(user.role))
    },
    delete: ({ req }) => {
      const user = getAuthUser(req)
      return Boolean(user && isStaffRole(user.role))
    },
  },
  fields: [
    {
      name: 'student',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
    },
    {
      name: 'quiz',
      type: 'relationship',
      relationTo: 'quizzes',
      required: true,
      index: true,
    },
    {
      name: 'enrollment',
      type: 'relationship',
      relationTo: 'enrollments',
      index: true,
    },
    {
      name: 'answers',
      type: 'json',
      required: true,
    },
    { name: 'score', type: 'number', defaultValue: 0, min: 0, max: 100 },
    { name: 'passed', type: 'checkbox', defaultValue: false },
    {
      name: 'attemptedAt',
      type: 'date',
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
  ],
}
