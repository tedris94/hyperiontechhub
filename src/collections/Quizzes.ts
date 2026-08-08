import type { CollectionConfig } from 'payload'
import { getAuthUser, isStaffRole, staffWrite } from './lms/access'
import { quizQuestionTypeOptions } from './lms/shared'

export const Quizzes: CollectionConfig = {
  slug: 'quizzes',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'course', 'passingScore'],
  },
  access: {
    read: ({ req }) => {
      const user = getAuthUser(req)
      if (user && isStaffRole(user.role)) return true
      return { 'course.status': { equals: 'published' } }
    },
    create: staffWrite,
    update: staffWrite,
    delete: staffWrite,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'course',
      type: 'relationship',
      relationTo: 'courses',
      required: true,
      index: true,
    },
    {
      name: 'lesson',
      type: 'relationship',
      relationTo: 'lessons',
    },
    {
      name: 'passingScore',
      type: 'number',
      defaultValue: 70,
      min: 0,
      max: 100,
      required: true,
    },
    {
      name: 'questions',
      type: 'array',
      required: true,
      fields: [
        { name: 'prompt', type: 'textarea', required: true },
        {
          name: 'type',
          type: 'select',
          defaultValue: 'single',
          options: [...quizQuestionTypeOptions],
          required: true,
        },
        {
          name: 'options',
          type: 'array',
          fields: [{ name: 'text', type: 'text', required: true }],
        },
        {
          name: 'correctAnswers',
          type: 'array',
          fields: [{ name: 'value', type: 'text', required: true }],
          admin: { description: 'Option index (0-based) or "true"/"false" for boolean' },
        },
        { name: 'points', type: 'number', defaultValue: 1, min: 1 },
        { name: 'explanation', type: 'textarea' },
      ],
    },
  ],
}
