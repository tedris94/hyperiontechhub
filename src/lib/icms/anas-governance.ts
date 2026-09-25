/**
 * Anas bn Malik Centre — governance & About copy from client Word docs
 * (Website Information.docx + MANAGEMENT COMMITTEE … 2.docx).
 * Used when slug is anas-bn-malik.
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

export type CoreValue = {
  arabic: string
  title: string
  body: string
}

/** About Us — history, mission, vision, core values (doc 2). */
export const ANAS_ABOUT = {
  heroTitle: 'About the Centre',
  heroSubtitle:
    'A centre for the worship of Allah, Da’awah, and service to the Muslim Ummah — established 2012.',
  storyEyebrow: 'Our History',
  introHeading: 'Anas Bn Malik Islamic Centre',
  history: [
    'Anas Bn Malik Islamic Centre (ABMIC), located at AMSSCO Platinum City, Galadimawa, Abuja, was established in the year 2012 as a centre for the worship of Allah (SWT), propagation of the Deen (Da’awah), and service to the Muslim Ummah.',
    'Over the years, the Centre has developed beyond being a place of five daily prayers and Jumu’ah congregation into a vibrant Islamic community where Muslims come together for worship, Qur’anic and Islamic education, spiritual development, and charitable activities.',
  ],
  /** Namesake and narration — complements the Centre history; does not repeat it. */
  companion: [
    {
      title: 'A name that carries weight',
      body: 'The Centre is named after the noble Companion Anas ibn Malik (RA), remembered as Khadim Rasulillah — the servant of the Messenger of Allah ﷺ. His long companionship and humble service remain the measure of sincerity the Centre seeks in worship, knowledge, and care for the Ummah.',
    },
  ],
  hadith: {
    text: '“I served the Messenger of Allah ﷺ for ten years. By Allah, he never said to me ‘Uff’, and he never said about something I had done, ‘Why did you do that?’ nor about something I had left undone, ‘Why did you not do that?’”',
    source: 'Anas ibn Malik (RA) — Sahih al-Bukhari and Sahih Muslim',
  },
  vision:
    'To be a leading Islamic Centre dedicated to the worship of Allah, the advancement of authentic Islamic knowledge, and service to humanity.',
  mission:
    'To provide a spiritually enriching and organised Islamic institution that promotes worship, authentic Islamic knowledge, Da’awah, unity, charitable service, and the moral development of the Muslim Ummah.',
  coreValuesIntro:
    'The activities and administration of ABMIC are guided by the following fundamental Islamic values that define how we worship, serve, and relate with one another (brotherhood).',
  coreValues: [
    {
      arabic: 'Taqwa',
      title: 'Consciousness of Allah',
      body: 'We strive to make the consciousness and fear of Allah the foundation of our actions, decisions, and service to the Ummah.',
    },
    {
      arabic: 'Ilm',
      title: 'Knowledge',
      body: 'We promote the acquisition, teaching, and application of authentic Islamic knowledge based on the Qur’an and Sunnah.',
    },
    {
      arabic: 'Amanah',
      title: 'Trust',
      body: 'We regard every responsibility, position, and resource entrusted to us as an Amanah that must be managed faithfully, responsibly, and transparently.',
    },
    {
      arabic: 'Shura',
      title: 'Consultation',
      body: 'We encourage consultation, collective responsibility, and constructive engagement in matters concerning the administration and development of the Centre.',
    },
    {
      arabic: 'Ukhuwwah',
      title: 'Unity',
      body: 'We promote Islamic brotherhood, mutual respect, tolerance, and cooperation, recognising the importance of unity within the Muslim Ummah.',
    },
    {
      arabic: 'Rahmah',
      title: 'Compassion',
      body: 'We seek to demonstrate mercy, kindness, and concern for others, particularly the poor, vulnerable, and those experiencing hardship.',
    },
    {
      arabic: 'Khidmah',
      title: 'Service',
      body: 'We believe that serving the Ummah and humanity is a noble responsibility and an important expression of our Islamic values.',
    },
  ] satisfies CoreValue[],
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
    'The Management Committee of Anas Bn Malik Islamic Centre (ABMIC) is responsible for the effective administration, coordination, and day-to-day management of the Centre in accordance with the Constitution of the Centre and under the overall guidance of the Board of Trustees (BoT).\n\nThe Committee seeks to ensure that the Centre remains a well-organized and vibrant institution for worship, Da’awah, and charitable activities.',
  functionsHeading: 'Functions of the Management Committee',
  /** Flat function list from client Management Committee doc 2. */
  functions: [
    'Overseeing the day-to-day administration and smooth operation of the Centre and its facilities.',
    'Implementing policies, programmes, and guidelines approved by the BoT.',
    'Coordinating religious programmes and activities of the Masjid in consultation with the Chief Imam.',
    'Promoting Islamic education, Da’awah, community service, and programmes that strengthen unity among members of the Ummah.',
    'Managing and supervising the Centre’s personnel, assets, and other resources.',
    'Preparing and overseeing the Centre’s programmes, budgets, income and expenditure, while ensuring transparency and prudent financial management.',
    'Establishing and supervising sub-committees or ad-hoc committees such as Ramadan Sub-Committee, Finance/Waqf Sub-Committee, Islamiya Governing Board, and Da’awah Sub-Committee that manage specific programmes and responsibilities.',
    'Mobilising resources and supporting charitable, welfare, and community development initiatives undertaken by the Centre.',
    'Reporting periodically to the Board of Trustees on the activities, finances, achievements, and challenges of the Centre.',
  ],
  /** Kept for older layout helpers; derived grouping is unused when `functions` is shown. */
  functionGroups: [] as FunctionGroup[],
  compositionHeading: 'Membership',
  compositionIntro:
    'The Management Committee is composed of responsible and committed members of the Ummah appointed in accordance with the Constitution of the Centre. The Committee is constituted to provide the range of experience, competence, and dedication required for effective management of the Centre.',
  compositionRoles: [
    'Chairman',
    'Secretary',
    'Financial Secretary',
    'Chief Imam',
    'Internal Auditor',
    'Other members assigned responsibilities in key areas of the Centre’s activities',
  ],
  qualities: [] as string[],
  closing:
    'Through collective responsibility and cooperation with the BoT, the Management Committee strives to advance the mission of Anas Bn Malik Islamic Centre as a Centre of worship, knowledge, Da’awah, and service to humanity.',
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
