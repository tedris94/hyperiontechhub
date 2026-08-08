import { hasCapability, capabilitiesForRoleSlug } from '@/lib/capabilities'
import { relId } from '@/lib/lms/enrollment'

export function canLearnCourses(role: string | undefined, capabilities?: string[]): boolean {
  if (capabilities) return hasCapability(capabilities, 'courses.learn')
  return hasCapability(capabilitiesForRoleSlug(role), 'courses.learn')
}

export function canAuthorCourses(role: string | undefined, capabilities?: string[]): boolean {
  if (capabilities) return hasCapability(capabilities, 'courses.author')
  return hasCapability(capabilitiesForRoleSlug(role), 'courses.author')
}

export function canManageLms(role: string | undefined, capabilities?: string[]): boolean {
  if (capabilities) return hasCapability(capabilities, 'lms.manage')
  return hasCapability(capabilitiesForRoleSlug(role), 'lms.manage')
}

export function canViewOrders(role: string | undefined, capabilities?: string[]): boolean {
  if (capabilities) return hasCapability(capabilities, 'orders.view')
  return hasCapability(capabilitiesForRoleSlug(role), 'orders.view')
}

export function canModerateReviews(role: string | undefined, capabilities?: string[]): boolean {
  if (capabilities) return hasCapability(capabilities, 'reviews.moderate')
  return hasCapability(capabilitiesForRoleSlug(role), 'reviews.moderate')
}

export function canManageCategories(role: string | undefined, capabilities?: string[]): boolean {
  if (capabilities) return hasCapability(capabilities, 'categories.manage')
  return hasCapability(capabilitiesForRoleSlug(role), 'categories.manage')
}

export function stringItems(
  items: Array<{ item?: string | null; tag?: string | null } | string> | null | undefined,
  key: 'item' | 'tag' = 'item',
): string[] {
  if (!Array.isArray(items)) return []
  return items
    .map((entry) => (typeof entry === 'string' ? entry : (entry[key] ?? '')))
    .filter(Boolean)
}

export function mediaUrl(value: unknown): string | null {
  if (!value || typeof value !== 'object') return null
  if ('url' in value && typeof (value as { url?: unknown }).url === 'string') {
    return (value as { url: string }).url
  }
  return null
}

export function userSummary(value: unknown) {
  if (!value || typeof value !== 'object') return null
  const u = value as { id?: number; fullName?: string; email?: string }
  return {
    id: u.id ?? null,
    fullName: u.fullName ?? '',
    email: u.email ?? '',
  }
}

export function categorySummary(value: unknown) {
  if (!value || typeof value !== 'object') return null
  const c = value as { id?: number; name?: string; slug?: string }
  return { id: c.id ?? null, name: c.name ?? '', slug: c.slug ?? '' }
}

export function toCourseListItem(doc: Record<string, unknown>) {
  return {
    id: doc.id,
    title: doc.title,
    slug: doc.slug,
    subtitle: doc.subtitle ?? '',
    level: doc.level ?? 'all',
    language: doc.language ?? 'English',
    price: doc.price ?? 0,
    currency: doc.currency ?? 'NGN',
    isFree: Boolean(doc.isFree),
    status: doc.status,
    ratingAvg: doc.ratingAvg ?? 0,
    ratingCount: doc.ratingCount ?? 0,
    enrollmentCount: doc.enrollmentCount ?? 0,
    thumbnailUrl: mediaUrl(doc.thumbnail),
    category: categorySummary(doc.category),
    instructor: userSummary(doc.instructor),
  }
}

export function toCourseDetail(doc: Record<string, unknown>) {
  return {
    ...toCourseListItem(doc),
    description: doc.description ?? null,
    whatYouWillLearn: stringItems(doc.whatYouWillLearn as never),
    requirements: stringItems(doc.requirements as never),
    targetAudience: stringItems(doc.targetAudience as never),
    tags: stringItems(doc.tags as never, 'tag'),
    promoVideoUrl: mediaUrl(doc.promoVideo),
  }
}

export function toSectionResponse(doc: Record<string, unknown>, lessons: Record<string, unknown>[] = []) {
  return {
    id: doc.id,
    title: doc.title,
    order: doc.order ?? 0,
    courseId: relId(doc.course),
    lessons: lessons.map(toLessonSummary),
  }
}

export function toLessonSummary(doc: Record<string, unknown>) {
  return {
    id: doc.id,
    title: doc.title,
    slug: doc.slug,
    order: doc.order ?? 0,
    type: doc.type,
    durationSeconds: doc.durationSeconds ?? 0,
    isPreview: Boolean(doc.isPreview),
    courseId: relId(doc.course),
    sectionId: relId(doc.section),
    quizId: relId(doc.quiz),
  }
}

export function toEnrollmentResponse(doc: Record<string, unknown>, course?: Record<string, unknown> | null) {
  return {
    id: doc.id,
    status: doc.status,
    enrolledAt: doc.enrolledAt ?? null,
    completedAt: doc.completedAt ?? null,
    progressPercent: doc.progressPercent ?? 0,
    source: doc.source,
    courseId: relId(doc.course),
    course: course ? toCourseListItem(course) : null,
  }
}

export function formatPrice(amount: number, currency = 'NGN'): string {
  if (amount <= 0) return 'Free'
  const major = amount / 100
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency }).format(major)
}

export function slugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}
