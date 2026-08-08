import type { CollectionConfig } from 'payload'
import { makeSchoolScopedCollection } from './shared'

export const EduLibraryBooks: CollectionConfig = makeSchoolScopedCollection(
  'edu-library-books',
  'Library book',
  [
    { name: 'title', type: 'text', required: true },
    { name: 'author', type: 'text' },
    { name: 'isbn', type: 'text' },
    { name: 'copies', type: 'number', defaultValue: 1 },
    { name: 'available', type: 'number', defaultValue: 1 },
  ],
)

export const EduLibraryIssues: CollectionConfig = makeSchoolScopedCollection(
  'edu-library-issues',
  'Library issue',
  [
    { name: 'title', type: 'text', required: true },
    { name: 'book', type: 'relationship', relationTo: 'edu-library-books', required: true },
    { name: 'student', type: 'relationship', relationTo: 'edu-students' },
    { name: 'issuedAt', type: 'date' },
    { name: 'dueAt', type: 'date' },
    { name: 'returnedAt', type: 'date' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'issued',
      options: ['issued', 'returned', 'overdue'],
    },
  ],
)

export const EduTransportRoutes: CollectionConfig = makeSchoolScopedCollection(
  'edu-transport-routes',
  'Transport route',
  [
    { name: 'title', type: 'text', required: true },
    { name: 'vehicle', type: 'text' },
    { name: 'driverName', type: 'text' },
    { name: 'driverPhone', type: 'text' },
    { name: 'stops', type: 'textarea' },
    { name: 'feeAmount', type: 'number' },
  ],
)

export const EduHostelRooms: CollectionConfig = makeSchoolScopedCollection(
  'edu-hostel-rooms',
  'Hostel room',
  [
    { name: 'title', type: 'text', required: true },
    { name: 'block', type: 'text' },
    { name: 'capacity', type: 'number', defaultValue: 4 },
    { name: 'occupied', type: 'number', defaultValue: 0 },
    { name: 'gender', type: 'select', options: ['male', 'female', 'any'] },
  ],
)

export const EduInventoryItems: CollectionConfig = makeSchoolScopedCollection(
  'edu-inventory-items',
  'Inventory item',
  [
    { name: 'title', type: 'text', required: true },
    { name: 'category', type: 'text' },
    { name: 'quantity', type: 'number', defaultValue: 0 },
    { name: 'location', type: 'text' },
    { name: 'condition', type: 'select', options: ['good', 'fair', 'poor', 'disposed'] },
  ],
)

export const EduDocuments: CollectionConfig = makeSchoolScopedCollection(
  'edu-documents',
  'Document',
  [
    { name: 'title', type: 'text', required: true },
    {
      name: 'docType',
      type: 'select',
      defaultValue: 'other',
      options: ['certificate', 'letter', 'policy', 'report', 'other'],
    },
    { name: 'student', type: 'relationship', relationTo: 'edu-students' },
    { name: 'file', type: 'upload', relationTo: 'media' },
    { name: 'notes', type: 'textarea' },
  ],
)

export const EduEvents: CollectionConfig = makeSchoolScopedCollection(
  'edu-events',
  'Event',
  [
    { name: 'title', type: 'text', required: true },
    { name: 'startsAt', type: 'date', required: true },
    { name: 'endsAt', type: 'date' },
    { name: 'location', type: 'text' },
    { name: 'description', type: 'textarea' },
  ],
  { defaultColumns: ['title', 'startsAt', 'school'] },
)

export const EduAlumni: CollectionConfig = makeSchoolScopedCollection(
  'edu-alumni',
  'Alumni',
  [
    { name: 'title', type: 'text', required: true },
    { name: 'graduationYear', type: 'text' },
    { name: 'lastClass', type: 'text' },
    { name: 'email', type: 'email' },
    { name: 'phone', type: 'text' },
    { name: 'notes', type: 'textarea' },
  ],
)

export const EduLearningMaterials: CollectionConfig = makeSchoolScopedCollection(
  'edu-learning-materials',
  'Learning material',
  [
    { name: 'title', type: 'text', required: true },
    { name: 'className', type: 'text' },
    { name: 'subject', type: 'text' },
    { name: 'courseLink', type: 'text', admin: { description: 'Optional link to /courses/…' } },
    { name: 'file', type: 'upload', relationTo: 'media' },
    { name: 'description', type: 'textarea' },
  ],
)
