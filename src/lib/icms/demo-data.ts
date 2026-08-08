import type {
  Article,
  CommitteeMember,
  DonationTxn,
  EventItem,
  IslamiyyahClass,
  IslamiyyahStudent,
  Leader,
  PrayerTime,
  WaqfProject,
} from './types'

export const prayerTimesToday: PrayerTime[] = [
  { name: 'Fajr', time: '5:12 AM' },
  { name: 'Sunrise', time: '6:28 AM' },
  { name: 'Dhuhr', time: '12:41 PM' },
  { name: 'Asr', time: '4:08 PM' },
  { name: 'Maghrib', time: '6:54 PM' },
  { name: 'Isha', time: '8:08 PM' },
]

export const leaders: Leader[] = [
  {
    id: '1',
    name: 'Imam Abdullahi Yusuf',
    role: 'Chief Imam',
    bio: 'Leads congregational prayers, Friday khutbah, and community guidance with a focus on authentic knowledge and compassionate service.',
    category: 'imam',
  },
  {
    id: '2',
    name: 'Ustadh Ibrahim Musa',
    role: 'Assistant Imam',
    bio: 'Supports daily prayers, youth circles, and Qur’an memorization programs across the center.',
    category: 'imam',
  },
  {
    id: '3',
    name: 'Alhaji Suleiman Bello',
    role: 'Director',
    bio: 'Oversees institutional strategy, partnerships, and the center’s long-term development agenda.',
    category: 'director',
  },
  {
    id: '4',
    name: 'Hajia Amina Lawal',
    role: 'Director of Education',
    bio: 'Guides Islamiyyah curriculum, teacher development, and family learning initiatives.',
    category: 'director',
  },
  {
    id: '5',
    name: 'Engr. Yusuf Abdulkareem',
    role: 'Committee Chair — Waqf & Projects',
    bio: 'Coordinates endowment projects, facility improvements, and transparent community reporting.',
    category: 'committee',
  },
  {
    id: '6',
    name: 'Mallama Fatima Sani',
    role: 'Committee Member — Outreach',
    bio: 'Leads women’s programs, volunteer coordination, and neighborhood Da’wah activities.',
    category: 'committee',
  },
]

/** Dedicated Shurah / HR committee roster (admin + public committee page). */
export const committeeMembers: CommitteeMember[] = [
  {
    id: 'cm1',
    name: 'Alhaji Musa Abdullahi',
    roleTitle: 'Chairperson',
    committeeType: 'shurah',
    status: 'active',
    phone: '+234 803 111 2201',
    email: 'shurah@anasbnmalik.org',
    termStart: '2024-01-01',
    termEnd: '2026-12-31',
    bio: 'Chairs the Shurah council, guiding strategic decisions and community accountability.',
    sortOrder: 0,
    showOnPublic: true,
  },
  {
    id: 'cm2',
    name: 'Hajia Zainab Ibrahim',
    roleTitle: 'Secretary',
    committeeType: 'shurah',
    status: 'active',
    phone: '+234 802 444 1190',
    email: 'secretary@anasbnmalik.org',
    termStart: '2024-01-01',
    termEnd: '2026-12-31',
    bio: 'Records Shurah deliberations, circulates minutes, and follows up on resolutions.',
    sortOrder: 1,
    showOnPublic: true,
  },
  {
    id: 'cm3',
    name: 'Ustadh Khalid Garba',
    roleTitle: 'Member',
    committeeType: 'shurah',
    status: 'active',
    termStart: '2024-01-01',
    bio: 'Advises on fiqh-sensitive centre policies and community welfare cases.',
    sortOrder: 2,
    showOnPublic: true,
  },
  {
    id: 'cm4',
    name: 'Hajia Maryam Usman',
    roleTitle: 'HR Lead',
    committeeType: 'hr',
    status: 'active',
    phone: '+234 701 555 8832',
    email: 'hr@anasbnmalik.org',
    termStart: '2025-01-01',
    bio: 'Oversees volunteer appointments, staff onboarding, and code-of-conduct matters.',
    sortOrder: 3,
    showOnPublic: true,
  },
  {
    id: 'cm5',
    name: 'Engr. Yusuf Abdulkareem',
    roleTitle: 'Chair',
    committeeType: 'waqf',
    status: 'active',
    termStart: '2023-06-01',
    bio: 'Coordinates endowment projects, facility improvements, and transparent reporting.',
    sortOrder: 4,
    showOnPublic: true,
  },
  {
    id: 'cm6',
    name: 'Mallama Fatima Sani',
    roleTitle: 'Coordinator',
    committeeType: 'outreach',
    status: 'active',
    termStart: '2024-03-01',
    bio: 'Leads women’s programs, volunteer coordination, and neighborhood Da’wah.',
    sortOrder: 5,
    showOnPublic: true,
  },
  {
    id: 'cm7',
    name: 'Mallam Sani Bello',
    roleTitle: 'Member',
    committeeType: 'education',
    status: 'active',
    termStart: '2024-09-01',
    bio: 'Supports Islamiyyah quality assurance and teacher development reviews.',
    sortOrder: 6,
    showOnPublic: true,
  },
  {
    id: 'cm8',
    name: 'Alhaji Ibrahim Dantata',
    roleTitle: 'Treasurer (past)',
    committeeType: 'finance',
    status: 'past',
    termStart: '2022-01-01',
    termEnd: '2023-12-31',
    bio: 'Served two terms overseeing donation reconciliation and audit readiness.',
    notes: 'Succeeded by current finance lead — retain for historical roster.',
    sortOrder: 7,
    showOnPublic: false,
  },
]

export const events: EventItem[] = [
  {
    id: '1',
    title: 'Jum’uah Khutbah: Sincerity in Worship',
    date: '2026-08-07',
    time: '1:00 PM',
    venue: 'Main Prayer Hall',
    blurb: 'Weekly Friday sermon with community reminders and post-prayer announcements.',
    featured: true,
  },
  {
    id: '2',
    title: 'Qur’an Circle for Youth',
    date: '2026-08-09',
    time: '4:30 PM',
    venue: 'Islamiyyah Hall',
    blurb: 'Tajweed practice, memorization support, and character lessons for ages 10–17.',
  },
  {
    id: '3',
    title: 'Waqf Awareness Evening',
    date: '2026-08-12',
    time: '7:30 PM',
    venue: 'Conference Room',
    blurb: 'An open briefing on endowment projects, stewardship, and how families can contribute.',
  },
  {
    id: '4',
    title: 'Sisters’ Study Circle',
    date: '2026-08-14',
    time: '11:00 AM',
    venue: 'Women’s Wing',
    blurb: 'A guided study on patience, gratitude, and community service in daily life.',
  },
  {
    id: '5',
    title: 'Community Clean-Up & Outreach',
    date: '2026-08-16',
    time: '9:00 AM',
    venue: 'Galadimawa Estate Gate',
    blurb: 'Volunteer service around the estate followed by light refreshments at the center.',
  },
]

export const articles: Article[] = [
  {
    id: '1',
    slug: 'striving-in-the-cause-of-allah',
    title: 'Striving in the Cause of Allah: Our Institutional Motto',
    category: 'Reflection',
    date: '2026-07-28',
    author: 'Imam Abdullahi Yusuf',
    excerpt:
      'What our motto means for worship, learning, charity, and everyday service in Galadimawa.',
    body: [
      'Anas bn Malik Islamic Center exists to serve Allah through sincere worship, sound knowledge, and compassionate community work.',
      'Our motto — Striving in the Cause of Allah — is not a slogan. It is a daily standard for how we pray, teach, give, and welcome every visitor.',
      'In the coming months we will continue expanding Islamiyyah support, transparent Waqf reporting, and programs that strengthen families across Abuja.',
    ],
    status: 'published',
  },
  {
    id: '2',
    slug: 'welcome-to-galadimawa',
    title: 'Welcome to Our Home in Galadimawa',
    category: 'Announcements',
    date: '2026-07-20',
    author: 'Alhaji Suleiman Bello',
    excerpt:
      'A brief introduction to the center’s location, prayer schedule, and how to get involved.',
    body: [
      'We are located at AMSSCO Platinum City Estate, Plot 312 Galadimawa District, Abuja FCT.',
      'Whether you are joining for Salah, Islamiyyah, volunteering, or supporting a Waqf project, you are welcome.',
      'Call 08062252510 or 08034416661 to speak with the administration office.',
    ],
    status: 'published',
  },
  {
    id: '3',
    slug: 'waqf-as-lasting-charity',
    title: 'Waqf as Lasting Charity for the Next Generation',
    category: 'Waqf',
    date: '2026-07-12',
    author: 'Engr. Yusuf Abdulkareem',
    excerpt:
      'How endowment projects protect worship spaces, education, and community services over time.',
    body: [
      'Waqf is a means of continuous charity — preserving benefit beyond a single donation.',
      'Our current priorities include facility stewardship and Islamiyyah support so knowledge and worship remain accessible.',
      'Transparent updates will be published regularly so donors and members can follow progress with confidence.',
    ],
    status: 'published',
  },
  {
    id: '4',
    slug: 'ramadan-program-outline-draft',
    title: 'Ramadan Program Outline (Draft)',
    category: 'Programs',
    date: '2026-07-05',
    author: 'Content Editor',
    excerpt: 'Internal draft for upcoming Ramadan programming — not yet public.',
    body: ['Draft content for editorial review.'],
    status: 'draft',
  },
]

export const waqfProjects: WaqfProject[] = [
  {
    id: '1',
    title: 'Mosque Facility Endowment',
    summary:
      'Long-term upkeep for the prayer hall, ablution areas, and community spaces so worship remains dignified and continuous.',
    status: 'Active',
    progress: 62,
  },
  {
    id: '2',
    title: 'Islamiyyah Learning Support',
    summary:
      'Books, teaching materials, and classroom support for children and adults seeking grounded Islamic education.',
    status: 'Active',
    progress: 41,
  },
]

export const donations: DonationTxn[] = [
  {
    id: 'DN-1042',
    donor: 'Anonymous',
    amount: 50000,
    fund: 'Zakat',
    status: 'Completed',
    date: '2026-08-02',
  },
  {
    id: 'DN-1041',
    donor: 'Musa Ibrahim',
    amount: 25000,
    fund: 'Mosque',
    status: 'Completed',
    date: '2026-08-01',
  },
  {
    id: 'DN-1040',
    donor: 'Aisha Mohammed',
    amount: 100000,
    fund: 'Waqf',
    status: 'Completed',
    date: '2026-07-30',
  },
  {
    id: 'DN-1039',
    donor: 'Family Circle',
    amount: 15000,
    fund: 'Education',
    status: 'Completed',
    date: '2026-07-28',
  },
]

export const islamiyyahClasses: IslamiyyahClass[] = [
  {
    id: '1',
    title: 'Beginners Qur’an & Tajweed',
    schedule: 'Sat & Sun · 9:00–11:00 AM',
    ageGroup: 'Ages 6–10',
    teacher: 'Ustadh Ibrahim Musa',
    capacity: 28,
    enrolled: 24,
    status: 'Open',
    summary:
      'Letter recognition, short surahs, and foundational tajweed with character lessons for young learners.',
  },
  {
    id: '2',
    title: 'Youth Hifz Circle',
    schedule: 'Weekdays · 4:30–6:00 PM',
    ageGroup: 'Ages 11–17',
    teacher: 'Imam Abdullahi Yusuf',
    capacity: 20,
    enrolled: 18,
    status: 'Open',
    summary:
      'Memorization track with revision partners, weekly testing, and manners coaching for teens.',
  },
  {
    id: '3',
    title: 'Adult Fiqh & Aqeedah',
    schedule: 'Sundays · 5:00–6:30 PM',
    ageGroup: 'Adults',
    teacher: 'Hajia Amina Lawal',
    capacity: 40,
    enrolled: 31,
    status: 'Open',
    summary:
      'Practical rulings for worship and family life, taught in clear English with Arabic references.',
  },
  {
    id: '4',
    title: 'Sisters’ Literacy & Qur’an',
    schedule: 'Tue & Thu · 10:00–12:00 PM',
    ageGroup: 'Women',
    teacher: 'Mallama Fatima Sani',
    capacity: 25,
    enrolled: 25,
    status: 'Full',
    summary:
      'Reading support, short memorization, and study circle for sisters in a private classroom wing.',
  },
]

export const islamiyyahStudents: IslamiyyahStudent[] = [
  {
    id: '1',
    name: 'Abdullahi Musa',
    guardian: 'Musa Ibrahim',
    phone: '0803 111 2200',
    classTitle: 'Beginners Qur’an & Tajweed',
    status: 'Active',
  },
  {
    id: '2',
    name: 'Maryam Bello',
    guardian: 'Aisha Mohammed',
    phone: '0805 444 3300',
    classTitle: 'Youth Hifz Circle',
    status: 'Active',
  },
  {
    id: '3',
    name: 'Yusuf Abdulkareem',
    guardian: 'Engr. Yusuf Abdulkareem',
    phone: '0802 555 6600',
    classTitle: 'Youth Hifz Circle',
    status: 'Active',
  },
  {
    id: '4',
    name: 'Fatima Suleiman',
    guardian: 'Hajia Zainab Suleiman',
    phone: '0809 777 8800',
    classTitle: 'Sisters’ Literacy & Qur’an',
    status: 'Pending',
  },
]

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug && a.status === 'published')
}

export function publishedArticles(): Article[] {
  return articles.filter((a) => a.status === 'published')
}

export function formatNaira(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDisplayDate(iso: string): string {
  return new Date(iso + 'T12:00:00').toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
