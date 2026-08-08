export { Schools, SchoolMemberships } from './Schools'
export {
  EduStudents,
  EduClasses,
  EduSubjects,
  EduStaff,
  EduAttendance,
  EduExams,
  EduExamResults,
  EduFeeStructures,
  EduInvoices,
  EduNotices,
} from './Academic'
export {
  EduGroups,
  EduMarks,
  EduResults,
  EduClassTeachers,
  EduFeeWaivers,
} from './Educare'
export {
  EduLibraryBooks,
  EduLibraryIssues,
  EduTransportRoutes,
  EduHostelRooms,
  EduInventoryItems,
  EduDocuments,
  EduEvents,
  EduAlumni,
  EduLearningMaterials,
} from './Campus'

import { Schools, SchoolMemberships } from './Schools'
import {
  EduStudents,
  EduClasses,
  EduSubjects,
  EduStaff,
  EduAttendance,
  EduExams,
  EduExamResults,
  EduFeeStructures,
  EduInvoices,
  EduNotices,
} from './Academic'
import {
  EduGroups,
  EduMarks,
  EduResults,
  EduClassTeachers,
  EduFeeWaivers,
} from './Educare'
import {
  EduLibraryBooks,
  EduLibraryIssues,
  EduTransportRoutes,
  EduHostelRooms,
  EduInventoryItems,
  EduDocuments,
  EduEvents,
  EduAlumni,
  EduLearningMaterials,
} from './Campus'
import type { CollectionConfig } from 'payload'
import { withAudit } from '@/lib/audit'

export const edusuiteCollections: CollectionConfig[] = [
  Schools,
  SchoolMemberships,
  EduStudents,
  EduClasses,
  EduSubjects,
  EduGroups,
  EduStaff,
  EduAttendance,
  EduExams,
  EduMarks,
  EduResults,
  EduExamResults,
  EduClassTeachers,
  EduFeeStructures,
  EduInvoices,
  EduFeeWaivers,
  EduNotices,
  EduLibraryBooks,
  EduLibraryIssues,
  EduTransportRoutes,
  EduHostelRooms,
  EduInventoryItems,
  EduDocuments,
  EduEvents,
  EduAlumni,
  EduLearningMaterials,
].map((c) => withAudit(c))
