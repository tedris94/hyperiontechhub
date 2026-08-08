import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import sharp from 'sharp'

import { migrations } from './migrations'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Services } from './collections/Services'
import { TeamMembers } from './collections/TeamMembers'
import { PortfolioItems } from './collections/PortfolioItems'
import { Jobs } from './collections/Jobs'
import { Applications } from './collections/Applications'
import { ContactSubmissions } from './collections/ContactSubmissions'
import { Consultations } from './collections/Consultations'
import { DashboardRoles } from './collections/DashboardRoles'
import { AnalyticsEvents } from './collections/AnalyticsEvents'
import { AuditLogs } from './collections/AuditLogs'
import { CourseCategories } from './collections/CourseCategories'
import { Courses } from './collections/Courses'
import { CourseSections } from './collections/CourseSections'
import { Lessons } from './collections/Lessons'
import { Quizzes } from './collections/Quizzes'
import { Enrollments } from './collections/Enrollments'
import { LessonProgress } from './collections/LessonProgress'
import { QuizAttempts } from './collections/QuizAttempts'
import { Reviews } from './collections/Reviews'
import { Certificates } from './collections/Certificates'
import { Orders } from './collections/Orders'
import { SiteSettings } from './globals/SiteSettings'
import { HomePage } from './globals/HomePage'
import { Header } from './globals/Header'
import { Footer } from './globals/Footer'
import { GetStartedPage } from './globals/GetStartedPage'
import { CareersPage } from './globals/CareersPage'
import { ConsultationPage } from './globals/ConsultationPage'
import { withAudit, withGlobalAudit } from './lib/audit'
import { edusuiteCollections } from './collections/edusuite'
import { icmsCollections } from './collections/icms'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const serverURL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_SITE_URL || 'https://www.hyperiontechhub.com'
    : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

const localDevCsrfOrigins =
  process.env.NODE_ENV !== 'production'
    ? ['http://localhost:3000', 'http://127.0.0.1:3000']
    : []

const s3Endpoint = process.env.S3_ENDPOINT
const s3Bucket = process.env.S3_BUCKET
const s3AccessKey = process.env.S3_ACCESS_KEY_ID
const s3SecretKey = process.env.S3_SECRET_ACCESS_KEY

const plugins = []

if (s3Endpoint && s3Bucket && s3AccessKey && s3SecretKey) {
  plugins.push(
    s3Storage({
      collections: {
        media: {
          prefix: 'media',
        },
      },
      bucket: s3Bucket,
      config: {
        credentials: {
          accessKeyId: s3AccessKey,
          secretAccessKey: s3SecretKey,
        },
        region: process.env.S3_REGION || 'us-east-1',
        endpoint: s3Endpoint,
        forcePathStyle: true,
      },
    }),
  )
}

const dbUri = process.env.DATABASE_URI ?? ''
const supabaseDb = dbUri.includes('supabase')

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || 'CHANGE_ME_DEV_ONLY',
  serverURL,
  csrf: localDevCsrfOrigins,
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '— Hyperion CMS',
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    withAudit(Users),
    withAudit(Media),
    withAudit(Pages),
    withAudit(Services),
    withAudit(TeamMembers),
    withAudit(PortfolioItems),
    withAudit(Jobs),
    withAudit(Applications),
    withAudit(ContactSubmissions),
    withAudit(Consultations),
    withAudit(DashboardRoles),
    AnalyticsEvents,
    AuditLogs,
    withAudit(CourseCategories),
    withAudit(Courses),
    withAudit(CourseSections),
    withAudit(Lessons),
    withAudit(Quizzes),
    withAudit(Enrollments),
    withAudit(LessonProgress),
    withAudit(QuizAttempts),
    withAudit(Reviews),
    withAudit(Certificates),
    withAudit(Orders),
    ...edusuiteCollections,
    ...icmsCollections,
  ],
  globals: [
    withGlobalAudit(SiteSettings),
    withGlobalAudit(HomePage),
    withGlobalAudit(Header),
    withGlobalAudit(Footer),
    withGlobalAudit(GetStartedPage),
    withGlobalAudit(CareersPage),
    withGlobalAudit(ConsultationPage),
  ],
  editor: lexicalEditor({}),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
      ...(supabaseDb ? { ssl: { rejectUnauthorized: false } } : {}),
    },
    migrationDir: path.resolve(dirname, 'migrations'),
    prodMigrations: migrations,
    // Sync new EduSuite collections in non-production; set PAYLOAD_DB_PUSH=0 to disable.
    push: process.env.PAYLOAD_DB_PUSH === '0' ? false : process.env.NODE_ENV !== 'production',
  }),
  sharp,
  plugins,
})
