export const MODULE_NAV = [
  { id: 'dashboard', label: 'Dashboard', href: '' },
  { id: 'management', label: 'Management', href: '/management' },
  { id: 'students', label: 'All Students', href: '/students', collection: 'edu-students' },
  { id: 'staff', label: 'All Teachers', href: '/staff', collection: 'edu-staff' },
  { id: 'marks', label: 'Mark Sheet', href: '/marks' },
  { id: 'results', label: 'All Results', href: '/results' },
  { id: 'attendance', label: 'Attendance', href: '/attendance' },
  { id: 'promote', label: 'Promote', href: '/promote' },
  { id: 'classes', label: 'Classes', href: '/classes', collection: 'edu-classes' },
  { id: 'subjects', label: 'Subjects', href: '/subjects', collection: 'edu-subjects' },
  { id: 'exams', label: 'Exams', href: '/exams', collection: 'edu-exams' },
  { id: 'fees', label: 'Fee structures', href: '/fees', collection: 'edu-fee-structures' },
  { id: 'invoices', label: 'Invoices', href: '/invoices', collection: 'edu-invoices' },
  { id: 'waivers', label: 'Fee waivers', href: '/waivers', collection: 'edu-fee-waivers' },
  { id: 'notices', label: 'Notices', href: '/notices', collection: 'edu-notices' },
  { id: 'import', label: 'Import / Export', href: '/import' },
  { id: 'library', label: 'Library', href: '/library', collection: 'edu-library-books' },
  { id: 'transport', label: 'Transport', href: '/transport', collection: 'edu-transport-routes' },
  { id: 'hostel', label: 'Hostel', href: '/hostel', collection: 'edu-hostel-rooms' },
  { id: 'inventory', label: 'Inventory', href: '/inventory', collection: 'edu-inventory-items' },
  { id: 'documents', label: 'Documents', href: '/documents', collection: 'edu-documents' },
  { id: 'events', label: 'Events', href: '/events', collection: 'edu-events' },
  { id: 'lms', label: 'LMS lite', href: '/lms', collection: 'edu-learning-materials' },
  { id: 'alumni', label: 'Alumni', href: '/alumni', collection: 'edu-alumni' },
  { id: 'reports', label: 'Reports', href: '/reports' },
  { id: 'settings', label: 'Settings', href: '/settings' },
  { id: 'parent', label: 'Parent portal', href: '/parent' },
] as const

export type SchoolRole =
  | 'owner'
  | 'principal'
  | 'vice_principal'
  | 'teacher'
  | 'accountant'
  | 'hr'
  | 'librarian'
  | 'transport'
  | 'hostel'
  | 'admission'
  | 'parent'
  | 'student'
  | 'alumni'
  | 'it_support'

export const ROLE_MODULE_ACCESS: Record<SchoolRole, string[] | '*'> = {
  owner: '*',
  principal: '*',
  vice_principal: '*',
  it_support: '*',
  teacher: [
    'dashboard',
    'students',
    'classes',
    'subjects',
    'attendance',
    'marks',
    'exams',
    'results',
    'notices',
    'lms',
    'parent',
  ],
  accountant: ['dashboard', 'fees', 'invoices', 'waivers', 'students', 'reports', 'parent'],
  hr: ['dashboard', 'staff', 'attendance', 'reports'],
  librarian: ['dashboard', 'library', 'students'],
  transport: ['dashboard', 'transport', 'students'],
  hostel: ['dashboard', 'hostel', 'students'],
  admission: ['dashboard', 'students', 'classes', 'documents', 'reports', 'management'],
  parent: ['dashboard', 'parent', 'invoices', 'results', 'notices', 'events'],
  student: ['dashboard', 'lms', 'results', 'notices', 'events', 'parent'],
  alumni: ['dashboard', 'alumni', 'events'],
}

export function roleCanAccessModule(role: SchoolRole | null | undefined, moduleId: string): boolean {
  if (!role) return false
  const access = ROLE_MODULE_ACCESS[role]
  if (!access) return false
  if (access === '*') return true
  return access.includes(moduleId)
}
