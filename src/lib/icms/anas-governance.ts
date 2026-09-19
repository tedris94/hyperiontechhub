/**
 * Anas bn Malik Centre — governance copy from client Attachment 1
 * (Website Information.docx). Used when slug is anas-bn-malik.
 */

export type RosterPerson = {
  name: string
  role: string
  note?: string
}

export type FunctionGroup = {
  title: string
  items: string[]
}

export const ANAS_BOARD = {
  heroTitle: 'Board of Trustees',
  heroSubtitle: 'The highest governing structure of Anas Bn Malik Islamic Centre.',
  introHeading: 'Custodians of the Centre',
  introBody:
    'The Board is the highest governing structure of the Center with oversight responsibility on the activities of the Management Committee. It is the custodian of all assets and legal documents of the Center. The Board also considers and approves the annual budget of the Center as well as audited accounts.',
  membershipNote:
    'Membership of the Board is for life. However, a member can resign or be removed if he is found guilty of an offence by a court of law or is declared insane by a medical doctor.',
  members: [
    { name: 'Alhaji Aliyu Dikko', role: 'Chairman' },
    { name: 'Alhaji Muhammad Sabiu Baba', role: 'Member' },
    { name: 'Ambassador Ibrahim Mai-Sule', role: 'Member' },
    { name: 'Alhaji Mohammed Abbas', role: 'Member' },
    { name: 'Engr. Rabiu Baba', role: 'Member' },
    { name: 'Chief Imam of the Center', role: 'Member' },
    { name: 'Barr. Kabir Ahmed Tijjani', role: 'Member / Secretary' },
  ] satisfies RosterPerson[],
}

export const ANAS_MANAGEMENT = {
  heroTitle: 'Management Committee',
  heroSubtitle:
    'Day-to-day administration of Anas Bn Malik Islamic Centre under the guidance of the Board of Trustees.',
  purposeHeading: 'Purpose and objectives',
  purposeBody:
    'The Management Committee of Anas Bn Malik Islamic Centre (ABMIC) is entrusted with the effective administration, coordination, and day-to-day management of the Centre in accordance with the Constitution of the Centre and under the overall guidance of the Board of Trustees (BoT).\n\nIts primary objective is to ensure that the Centre remains a well-organized, vibrant, and sustainable institution dedicated to worship, Da’awah, Islamic education, and charitable activities. The Committee strives to uphold the values of integrity, transparency, and service to the Ummah, while fostering unity and spiritual growth.',
  functionsHeading: 'Functions of the Management Committee',
  functionGroups: [
    {
      title: 'Administration & operations',
      items: [
        'Overseeing the daily running of the Centre, ensuring smooth operations of facilities and services.',
        'Maintaining cleanliness, safety, and accessibility of the Masjid and its premises.',
      ],
    },
    {
      title: 'Policy implementation',
      items: [
        'Executing policies, programmes, and guidelines approved by the BoT.',
        'Ensuring compliance with constitutional provisions and Islamic principles.',
      ],
    },
    {
      title: 'Religious programmes',
      items: [
        'Coordinating religious activities in consultation with the Chief Imam.',
        'Organizing Jumu’ah prayers, Tafsir sessions, Qur’an classes, and special programmes during Ramadan and other Islamic occasions.',
      ],
    },
    {
      title: 'Education & Da’awah',
      items: [
        'Promoting Islamic education through Islamiya schools, seminars, and workshops.',
        'Supporting Da’awah initiatives that spread the message of Islam and strengthen faith within the community.',
      ],
    },
    {
      title: 'Resource & personnel management',
      items: [
        'Supervising staff, volunteers, and personnel engaged in the Centre’s activities.',
        'Managing assets, equipment, and other resources effectively.',
      ],
    },
    {
      title: 'Financial oversight',
      items: [
        'Preparing annual budgets and monitoring income and expenditure.',
        'Ensuring transparency, accountability, and prudent financial management.',
        'Exploring WAQF and sustainable funding initiatives.',
      ],
    },
    {
      title: 'Sub-committees',
      items: [
        'Ramadan Sub-Committee (for fasting, Iftar, and Taraweeh arrangements)',
        'Finance Sub-Committee (to mobilise financial resources to support the Center’s activities)',
        'Islamiya Governing Board (for education and curriculum oversight)',
        'Da’awah Sub-Committee (for outreach and missionary activities)',
        'Zakah Sub-Committee (for Zakah collection and distribution)',
      ],
    },
    {
      title: 'Community development',
      items: [
        'Mobilising resources for charitable and welfare projects.',
        'Supporting initiatives such as healthcare drives, youth empowerment, and poverty alleviation.',
      ],
    },
    {
      title: 'Reporting & accountability',
      items: [
        'Submitting periodic reports to the BoT on activities, finances, achievements, and challenges.',
        'Maintaining proper documentation and records for institutional memory.',
      ],
    },
  ] satisfies FunctionGroup[],
  compositionHeading: 'Composition',
  compositionIntro:
    'The Management Committee is composed of responsible and committed members of the Ummah appointed in accordance with the Constitution of the Centre.',
  compositionRoles: [
    'Chairman',
    'Chairmen of sub-committees',
    'Chairman of the Islamiya School Board',
    'Amira of the sisters in the Estate',
    'Secretary',
    'Financial Secretary',
    'Chief Imam',
    'Internal Auditor',
    'Other members assigned to key areas of the Centre’s activities',
  ],
  qualities: [
    'Strong Islamic values and moral integrity',
    'Proven competence and dedication to service',
    'Ability to work collectively and harmoniously with others',
  ],
  closing:
    'Through collective responsibility and cooperation with the BoT, the Management Committee advances the mission of Anas Bn Malik Islamic Centre as a hub of worship, knowledge, Da’awah, and service to humanity.',
}

export const ANAS_RAMADAN = {
  heroTitle: 'Ramadan Sub-Committee',
  heroSubtitle: 'Iftar, Tafsir, Taraweeh, and Tahajjud — serving the Ummah through the blessed month.',
  introHeading: 'Organising Ramadan at the Centre',
  introBody:
    'The Ramadan sub-committee is responsible for the organisation of the Ramadan programs and activities of the Center. These include Ramadan feeding (Iftar), Tafsirs, Taraweeh and Tahajjud prayers.',
  profileBlocks: [
    {
      title: 'Mandate',
      body: 'To facilitate its activities, the sub-committee solicits and collects donations in both cash and foodstuffs from the Muslim Ummah mainly in the Estate, but also from outside the estate.',
    },
    {
      title: 'Community feeding',
      body: 'The Center prepares foods in its in-house kitchens and feeds an average of 300 persons each day of the Ramadan.',
    },
    {
      title: 'Worship programmes',
      body: 'Tafsir is conducted separately for men and women, each day, while Taraweeh and Tahajjud prayers are conducted jointly.',
    },
  ],
  activityBlocks: [
    {
      title: 'Iftar feeding',
      body: 'Daily Iftar prepared in the Centre’s kitchens, serving about 300 persons throughout Ramadan with support from cash and foodstuff donations.',
    },
    {
      title: 'Tafsir sessions',
      body: 'Daily Tafsir held separately for men and women, strengthening understanding of the Qur’an during the blessed month.',
    },
    {
      title: 'Taraweeh & Tahajjud',
      body: 'Night prayers organised jointly for the congregation — Taraweeh and Tahajjud as part of the Centre’s Ramadan worship programme.',
    },
  ],
}

export const ANAS_DAWAH_MEMBERS: RosterPerson[] = [
  { name: 'Sheikh Dr. Ibrahim Muhammad Fadul', role: 'Chairman, DSC' },
  { name: 'Mal. Bashir Bello Shagari', role: 'Vice Chairman' },
  { name: 'Mal. Muhammad Bunyaminu Abubakar', role: 'Member' },
  { name: 'Mal. Ibrahim Nasiru Al-kanawy', role: 'Member' },
  { name: 'Mal. Kabiru Abubakar Makera', role: 'Welfare Officer' },
  { name: 'Mal. Abubakar Jibril Hassan', role: 'Member' },
  { name: 'Mal. Nasiru Lawal', role: 'Member' },
  { name: 'Mal. Muhammad Adam', role: 'Member' },
  { name: 'Mal. Husaini Muhammad', role: 'Asst Welfare Officer' },
  { name: 'Ahmad Umar', role: 'Member' },
  { name: 'Musa Muhammad Abdulkadir', role: 'Secretary' },
]

export const ANAS_ADMIN_STRUCTURE_INTRO =
  'The Centre is guided by the Board of Trustees, administered day-to-day by the Management Committee, and served through specialised sub-committees for Da’awah, Ramadan, Zakah, Islamiya education, and finance.'
