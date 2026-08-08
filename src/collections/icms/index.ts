import type { CollectionConfig } from 'payload'
import { withAudit } from '@/lib/audit'
import { IcmsTenants, IcmsMemberships } from './Tenants'
import {
  IcmsArticles,
  IcmsEvents,
  IcmsLeaders,
  IcmsCommitteeMembers,
  IcmsPrayerTimes,
  IcmsDonations,
  IcmsWaqfProjects,
  IcmsIslamiyyahClasses,
  IcmsIslamiyyahStudents,
} from './Modules'
import {
  IcmsPages,
  IcmsFacilities,
  IcmsDonateFunds,
  IcmsContactMessages,
} from './SiteContent'

export { IcmsTenants, IcmsMemberships } from './Tenants'
export {
  IcmsArticles,
  IcmsEvents,
  IcmsLeaders,
  IcmsCommitteeMembers,
  IcmsPrayerTimes,
  IcmsDonations,
  IcmsWaqfProjects,
  IcmsIslamiyyahClasses,
  IcmsIslamiyyahStudents,
} from './Modules'
export {
  IcmsPages,
  IcmsFacilities,
  IcmsDonateFunds,
  IcmsContactMessages,
} from './SiteContent'
export { ICMS_ROLES, isPlatformAdmin, isSuperAdmin } from './shared'
export type { IcmsRole } from './shared'

export const icmsCollections: CollectionConfig[] = [
  IcmsTenants,
  IcmsMemberships,
  IcmsArticles,
  IcmsEvents,
  IcmsLeaders,
  IcmsCommitteeMembers,
  IcmsPrayerTimes,
  IcmsDonations,
  IcmsWaqfProjects,
  IcmsIslamiyyahClasses,
  IcmsIslamiyyahStudents,
  IcmsPages,
  IcmsFacilities,
  IcmsDonateFunds,
  IcmsContactMessages,
].map((c) => withAudit(c))
