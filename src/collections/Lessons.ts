import type { CollectionConfig } from 'payload'
import { getAuthUser, isStaffRole, publishedLessonRead, staffWrite } from './lms/access'
import { lessonTypeOptions, lmsRichTextEditor, slugify } from './lms/shared'

export const Lessons: CollectionConfig = {
  slug: 'lessons',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'course', 'type', 'order'],
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data && (!data.slug || !String(data.slug).trim()) && typeof data.title === 'string') {
          data.slug = slugify(data.title) || `lesson-${Date.now()}`
        }
        return data
      },
    ],
  },
  access: {
    read: publishedLessonRead,
    create: staffWrite,
    update: staffWrite,
    delete: staffWrite,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, index: true },
    {
      name: 'course',
      type: 'relationship',
      relationTo: 'courses',
      required: true,
      index: true,
    },
    {
      name: 'section',
      type: 'relationship',
      relationTo: 'course-sections',
      required: true,
      index: true,
    },
    { name: 'order', type: 'number', defaultValue: 0, required: true },
    {
      name: 'type',
      type: 'select',
      defaultValue: 'video',
      options: [...lessonTypeOptions],
      required: true,
    },
    {
      name: 'bunnyVideoId',
      type: 'text',
      admin: { condition: (_, siblingData) => siblingData?.type === 'video' },
    },
    {
      name: 'durationSeconds',
      type: 'number',
      defaultValue: 0,
      min: 0,
    },
    {
      name: 'content',
      type: 'richText',
      editor: lmsRichTextEditor,
      admin: {
        condition: (_, siblingData) =>
          siblingData?.type === 'article' || siblingData?.type === 'resource',
      },
    },
    {
      name: 'attachments',
      type: 'array',
      fields: [
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        { name: 'label', type: 'text' },
      ],
    },
    {
      name: 'quiz',
      type: 'relationship',
      relationTo: 'quizzes',
      admin: { condition: (_, siblingData) => siblingData?.type === 'quiz' },
    },
    {
      name: 'isPreview',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Allow public preview without enrollment' },
    },
  ],
}
