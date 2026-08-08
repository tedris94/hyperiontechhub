export type ModuleField = {
  name: string
  label: string
  type?: 'text' | 'number' | 'date' | 'textarea'
}

export type ModuleConfig = {
  collection: string
  title: string
  fields: ModuleField[]
}

export const MODULE_CONFIG: Record<string, ModuleConfig> = {
  students: {
    collection: 'edu-students',
    title: 'All Students',
    fields: [
      { name: 'title', label: 'Full name' },
      { name: 'rollNo', label: 'Roll no' },
      { name: 'regiNo', label: 'Regi no' },
      { name: 'admissionNo', label: 'Admission no' },
      { name: 'className', label: 'Class' },
      { name: 'groupName', label: 'Group' },
      { name: 'year', label: 'Year / session' },
      { name: 'section', label: 'Section' },
      { name: 'guardianName', label: 'Guardian name' },
      { name: 'guardianPhone', label: 'Guardian phone' },
      { name: 'guardianEmail', label: 'Guardian email' },
    ],
  },
  classes: {
    collection: 'edu-classes',
    title: 'Classes',
    fields: [
      { name: 'title', label: 'Class name' },
      { name: 'section', label: 'Section' },
      { name: 'level', label: 'Level' },
      { name: 'capacity', label: 'Capacity', type: 'number' },
      { name: 'timetableNotes', label: 'Timetable notes', type: 'textarea' },
    ],
  },
  subjects: {
    collection: 'edu-subjects',
    title: 'Subjects',
    fields: [
      { name: 'title', label: 'Subject' },
      { name: 'code', label: 'Code' },
      { name: 'className', label: 'Class' },
      { name: 'groupName', label: 'Group' },
      { name: 'teacherName', label: 'Teacher' },
    ],
  },
  staff: {
    collection: 'edu-staff',
    title: 'All Teachers',
    fields: [
      { name: 'title', label: 'Full name' },
      { name: 'staffId', label: 'Staff ID' },
      { name: 'designation', label: 'Designation' },
      { name: 'department', label: 'Department' },
      { name: 'jobTitle', label: 'Job title' },
      { name: 'phone', label: 'Phone' },
      { name: 'email', label: 'Email' },
      { name: 'leaveNotes', label: 'Leave / HR notes', type: 'textarea' },
    ],
  },
  exams: {
    collection: 'edu-exams',
    title: 'Exams',
    fields: [
      { name: 'title', label: 'Exam title' },
      { name: 'term', label: 'Term' },
      { name: 'session', label: 'Session' },
      { name: 'className', label: 'Class' },
      { name: 'subject', label: 'Subject' },
      { name: 'maxScore', label: 'Max score', type: 'number' },
      { name: 'examDate', label: 'Exam date', type: 'date' },
    ],
  },
  fees: {
    collection: 'edu-fee-structures',
    title: 'Fee structures',
    fields: [
      { name: 'title', label: 'Fee name' },
      { name: 'term', label: 'Term' },
      { name: 'session', label: 'Session' },
      { name: 'className', label: 'Class' },
      { name: 'amount', label: 'Amount (NGN)', type: 'number' },
    ],
  },
  invoices: {
    collection: 'edu-invoices',
    title: 'Invoices',
    fields: [
      { name: 'title', label: 'Invoice title' },
      { name: 'amount', label: 'Amount', type: 'number' },
      { name: 'amountPaid', label: 'Amount paid', type: 'number' },
      { name: 'dueDate', label: 'Due date', type: 'date' },
    ],
  },
  waivers: {
    collection: 'edu-fee-waivers',
    title: 'Fee waivers',
    fields: [
      { name: 'title', label: 'Title' },
      { name: 'amount', label: 'Amount', type: 'number' },
      { name: 'term', label: 'Term' },
      { name: 'session', label: 'Session' },
      { name: 'reason', label: 'Reason', type: 'textarea' },
    ],
  },
  notices: {
    collection: 'edu-notices',
    title: 'Notices',
    fields: [
      { name: 'title', label: 'Title' },
      { name: 'body', label: 'Message', type: 'textarea' },
      { name: 'publishedAt', label: 'Publish date', type: 'date' },
    ],
  },
  library: {
    collection: 'edu-library-books',
    title: 'Library books',
    fields: [
      { name: 'title', label: 'Book title' },
      { name: 'author', label: 'Author' },
      { name: 'isbn', label: 'ISBN' },
      { name: 'copies', label: 'Copies', type: 'number' },
      { name: 'available', label: 'Available', type: 'number' },
    ],
  },
  transport: {
    collection: 'edu-transport-routes',
    title: 'Transport routes',
    fields: [
      { name: 'title', label: 'Route name' },
      { name: 'vehicle', label: 'Vehicle' },
      { name: 'driverName', label: 'Driver' },
      { name: 'driverPhone', label: 'Driver phone' },
      { name: 'stops', label: 'Stops', type: 'textarea' },
      { name: 'feeAmount', label: 'Fee', type: 'number' },
    ],
  },
  hostel: {
    collection: 'edu-hostel-rooms',
    title: 'Hostel rooms',
    fields: [
      { name: 'title', label: 'Room' },
      { name: 'block', label: 'Block' },
      { name: 'capacity', label: 'Capacity', type: 'number' },
      { name: 'occupied', label: 'Occupied', type: 'number' },
    ],
  },
  inventory: {
    collection: 'edu-inventory-items',
    title: 'Inventory',
    fields: [
      { name: 'title', label: 'Item' },
      { name: 'category', label: 'Category' },
      { name: 'quantity', label: 'Quantity', type: 'number' },
      { name: 'location', label: 'Location' },
    ],
  },
  documents: {
    collection: 'edu-documents',
    title: 'Documents',
    fields: [
      { name: 'title', label: 'Document title' },
      { name: 'notes', label: 'Notes', type: 'textarea' },
    ],
  },
  events: {
    collection: 'edu-events',
    title: 'Events & calendar',
    fields: [
      { name: 'title', label: 'Event' },
      { name: 'startsAt', label: 'Starts', type: 'date' },
      { name: 'endsAt', label: 'Ends', type: 'date' },
      { name: 'location', label: 'Location' },
      { name: 'description', label: 'Description', type: 'textarea' },
    ],
  },
  lms: {
    collection: 'edu-learning-materials',
    title: 'LMS lite materials',
    fields: [
      { name: 'title', label: 'Title' },
      { name: 'className', label: 'Class' },
      { name: 'subject', label: 'Subject' },
      { name: 'courseLink', label: 'Course link (/courses/…)' },
      { name: 'description', label: 'Description', type: 'textarea' },
    ],
  },
  alumni: {
    collection: 'edu-alumni',
    title: 'Alumni',
    fields: [
      { name: 'title', label: 'Name' },
      { name: 'graduationYear', label: 'Graduation year' },
      { name: 'lastClass', label: 'Last class' },
      { name: 'email', label: 'Email' },
      { name: 'phone', label: 'Phone' },
    ],
  },
}
