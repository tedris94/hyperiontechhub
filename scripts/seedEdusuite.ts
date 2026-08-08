import { loadProjectEnv } from './loadEnv.js'
import { prepareDatabaseUri } from './resolveDbUri.js'
import { DEFAULT_GRADING_SCALE } from '../src/lib/edusuite/grading.ts'

async function getPayloadForSeed() {
  const root = loadProjectEnv()
  process.chdir(root)
  delete process.env.PAYLOAD_MIGRATING
  process.env.DATABASE_URI = await prepareDatabaseUri(process.env.DATABASE_URI!)
  const { getPayload } = await import('payload')
  const { default: config } = await import('@payload-config')
  return getPayload({ config, key: `seed-edusuite:${Date.now()}` })
}

async function main() {
  const payload = await getPayloadForSeed()
  console.log('Seeding EduSuite Educare-parity demo…')

  const slug = 'demo-academy'
  const existing = await payload.find({
    collection: 'schools',
    where: { slug: { equals: slug } },
    limit: 1,
    overrideAccess: true,
  })

  let schoolId: string | number
  if (existing.totalDocs > 0) {
    schoolId = existing.docs[0].id
    await payload.update({
      collection: 'schools',
      id: schoolId,
      data: {
        gradingScale: DEFAULT_GRADING_SCALE,
        examTerms: [{ name: 'First Term' }, { name: 'Second Term' }, { name: 'Third Term' }],
        academicYears: [{ name: '2025/2026' }],
        principalName: 'Mrs A. Principal',
        passMark: 40,
        ratingScales: [
          { category: 'Development', item: 'Punctuality' },
          { category: 'Skills', item: 'Handwriting' },
        ],
      },
      overrideAccess: true,
    })
    console.log('Updated school:', slug)
  } else {
    const school = await payload.create({
      collection: 'schools',
      data: {
        name: 'Hyperion Demo Academy',
        slug,
        schoolType: 'private',
        city: 'Kubwa',
        state: 'FCT',
        status: 'active',
        currentTerm: 'First Term',
        currentSession: '2025/2026',
        email: 'demo@hyperiontechhub.com',
        phone: '+2349064951938',
        gradingScale: DEFAULT_GRADING_SCALE,
        examTerms: [{ name: 'First Term' }, { name: 'Second Term' }, { name: 'Third Term' }],
        academicYears: [{ name: '2025/2026' }],
        principalName: 'Mrs A. Principal',
        passMark: 40,
      },
      overrideAccess: true,
    })
    schoolId = school.id
    console.log('Created school:', slug)
  }

  const adminEmail = process.env.SEED_SUPER_ADMIN_EMAIL || 'superadmin@hyperiontechhub.com'
  const admin = await payload.find({
    collection: 'users',
    where: { email: { equals: adminEmail } },
    limit: 1,
    overrideAccess: true,
  })
  if (admin.totalDocs > 0) {
    const userId = admin.docs[0].id
    const mem = await payload.find({
      collection: 'school-memberships',
      where: {
        and: [{ user: { equals: userId } }, { school: { equals: schoolId } }],
      },
      limit: 1,
      overrideAccess: true,
    })
    if (mem.totalDocs === 0) {
      await payload.create({
        collection: 'school-memberships',
        data: { user: userId, school: schoolId, schoolRole: 'owner', status: 'active' },
        overrideAccess: true,
      })
    }
  }

  async function ensureOne(
    collection: string,
    whereTitle: string,
    data: Record<string, unknown>,
  ) {
    const found = await payload.find({
      collection: collection as 'edu-students',
      where: {
        and: [{ school: { equals: schoolId } }, { title: { equals: whereTitle } }],
      },
      limit: 1,
      overrideAccess: true,
    })
    if (found.totalDocs === 0) {
      return payload.create({
        collection: collection as 'edu-students',
        data: { school: schoolId, title: whereTitle, ...data } as never,
        overrideAccess: true,
      })
    }
    return found.docs[0]
  }

  await ensureOne('edu-classes', 'JSS 1A', {
    section: 'A',
    level: 'JSS 1',
    capacity: 40,
    subjects: [
      { name: 'Mathematics' },
      { name: 'English' },
      { name: 'Basic Science' },
    ],
  })
  await ensureOne('edu-groups', 'Science', {
    subjects: [{ name: 'Mathematics' }, { name: 'Basic Science' }],
  })
  await ensureOne('edu-subjects', 'Mathematics', { code: 'MTH', className: 'JSS 1A' })
  await ensureOne('edu-subjects', 'English', { code: 'ENG', className: 'JSS 1A' })

  const aisha = await ensureOne('edu-students', 'Aisha Bello', {
    admissionNo: 'HDA/2025/001',
    rollNo: '001',
    regiNo: 'REG001',
    className: 'JSS 1A',
    section: 'A',
    groupName: 'Science',
    year: '2025/2026',
    guardianName: 'Mrs Bello',
    guardianPhone: '+2348012345678',
    guardianEmail: adminEmail,
    status: 'active',
  })
  const chinedu = await ensureOne('edu-students', 'Chinedu Okafor', {
    admissionNo: 'HDA/2025/002',
    rollNo: '002',
    regiNo: 'REG002',
    className: 'JSS 1A',
    year: '2025/2026',
    groupName: 'Science',
    guardianName: 'Mr Okafor',
    status: 'active',
  })

  await ensureOne('edu-staff', 'Mr Okonkwo', {
    staffId: 'STF001',
    department: 'Science',
    jobTitle: 'Teacher',
    designation: 'Class Teacher',
    status: 'active',
    subjects: [{ name: 'Mathematics', className: 'JSS 1A' }],
  })
  await ensureOne('edu-class-teachers', 'Mr Okonkwo — JSS 1A', {
    className: 'JSS 1A',
    autoRemark: 'A promising class. Keep encouraging home study.',
  })

  const fee = await ensureOne('edu-fee-structures', 'Tuition — First Term', {
    term: 'First Term',
    session: '2025/2026',
    className: 'JSS 1A',
    amount: 85000,
    currency: 'NGN',
  })

  await ensureOne('edu-invoices', 'Aisha Bello — Tuition', {
    amount: 85000,
    amountPaid: 0,
    status: 'pending',
    student: aisha.id,
    feeStructure: fee.id,
  })

  await ensureOne('edu-notices', 'Welcome to First Term', {
    body: 'Welcome parents and students. Fees and results are available in EduSuite.',
    audience: 'all',
  })

  // Mark sheets + published results
  const mathMarks = await ensureOne('edu-marks', 'JSS 1A · Mathematics · First Term · 2025/2026', {
    className: 'JSS 1A',
    exam: 'First Term',
    year: '2025/2026',
    subject: 'Mathematics',
    maxScore: 100,
    status: 'published',
    scores: [
      { student: aisha.id, studentName: 'Aisha Bello', rollNo: '001', score: '78', grade: 'B' },
      { student: chinedu.id, studentName: 'Chinedu Okafor', rollNo: '002', score: '65', grade: 'C' },
    ],
  })
  await ensureOne('edu-marks', 'JSS 1A · English · First Term · 2025/2026', {
    className: 'JSS 1A',
    exam: 'First Term',
    year: '2025/2026',
    subject: 'English',
    maxScore: 100,
    status: 'published',
    scores: [
      { student: aisha.id, studentName: 'Aisha Bello', rollNo: '001', score: '82', grade: 'A' },
      { student: chinedu.id, studentName: 'Chinedu Okafor', rollNo: '002', score: '71', grade: 'B' },
    ],
  })
  void mathMarks

  await ensureOne('edu-results', 'Aisha Bello · First Term · 2025/2026', {
    student: aisha.id,
    studentName: 'Aisha Bello',
    rollNo: '001',
    regiNo: 'REG001',
    className: 'JSS 1A',
    groupName: 'Science',
    exam: 'First Term',
    year: '2025/2026',
    subjects: [
      { name: 'Mathematics', score: 78, grade: 'B', points: 4 },
      { name: 'English', score: 82, grade: 'A', points: 5 },
    ],
    totalScore: 160,
    average: 80,
    gpa: 4.5,
    resultStatus: 'Passed',
    teacherRemark: 'Excellent performance. Keep it up!',
    published: true,
  })

  await ensureOne('edu-attendance', 'Aisha Bello · sample day', {
    date: new Date().toISOString(),
    className: 'JSS 1A',
    subject: 'Mathematics',
    student: aisha.id,
    studentName: 'Aisha Bello',
    status: 'present',
  })

  await ensureOne('edu-library-books', 'New General Mathematics', {
    author: 'M.F. Macrae',
    copies: 10,
    available: 10,
  })
  await ensureOne('edu-fee-waivers', 'Sibling discount — Aisha', {
    student: aisha.id,
    amount: 5000,
    term: 'First Term',
    session: '2025/2026',
    reason: 'Sibling discount',
    status: 'approved',
  })

  console.log('EduSuite Educare-parity seed complete. Open /edusuite/demo-academy')
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
