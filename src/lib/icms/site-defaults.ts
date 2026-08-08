import type { PageContent, DonateFund, FacilityItem } from './types'
import { ICMS_MEDIA } from './media-assets'

export const DEFAULT_PAGES: Record<string, PageContent> = {
  home: {
    pageKey: 'home',
    heroTitle: 'A home for worship, knowledge, and sincere service',
    heroSubtitle:
      "Mosque life, Da'wah, Waqf, donations, and Islamiyyah — unified under one dignified digital presence.",
    ctaPrimaryLabel: 'Donate Now',
    ctaSecondaryLabel: 'Prayer Times',
    prayerHeading: "Today's Prayer Times",
    eventsEyebrow: 'Upcoming Events',
    eventsHeading: "What's Happening at the Centre",
    eventsCtaLabel: 'View All Events →',
    waqfEyebrow: 'Waqf & Endowments',
    waqfHeading: 'Leave a legacy that outlasts your lifetime',
    arabicText:
      "إِذَا مَاتَ الْإِنْسَانُ انْقَطَعَ عَنْهُ عَمَلُهُ إِلَّا مِنْ ثَلَاثَةٍ: إِلَّا مِنْ صَدَقَةٍ جَارِيَةٍ…",
    arabicCaption:
      '“When a person dies, all his deeds end except three: except from ongoing charity…” — Sahih Muslim',
    waqfBody:
      'Our Waqf programme channels endowments into the permanent infrastructure of Islamic education, community welfare, and sacred space maintenance.',
    waqfCtaLabel: 'Support the Waqf',
    waqfGoalAmount: 50_000_000,
    articlesEyebrow: 'Knowledge & Reflection',
    articlesHeading: 'Latest from the Centre',
    articlesCtaLabel: 'All Articles →',
    findUsEyebrow: 'Find Us',
    findUsHeading: 'Our Location',
    contactEyebrow: 'Contact',
    contactHeading: 'Reach the Centre',
    supportEyebrow: 'Support the Centre',
    supportHeading: 'Donate Today',
    supportBlurb:
      'Your generosity sustains our mosque, education programmes, and community welfare initiatives.',
    supportCtaLabel: 'Give Now',
    blocks: [],
  },
  about: {
    pageKey: 'about',
    heroTitle: 'About the Centre',
    heroSubtitle:
      'Established to serve, educate, and uplift the Muslim community of Abuja in the tradition of the Companions of the Prophet ﷺ.',
    introHeading: 'Rooted in the tradition of a Companion',
    introBody: '',
    imageUrl: ICMS_MEDIA.aboutCentre,
    arabicText: 'خادم رسول الله ﷺ',
    arabicCaption: '“Servant of the Messenger of Allah ﷺ” — said of Anas ibn Malik (RA)',
    blocks: [
      {
        title: 'A name that carries weight',
        body: 'Named after the noble Companion Anas ibn Malik (RA) — known for lifelong service to the Messenger of Allah ﷺ — the Center holds itself to a standard of sincerity, knowledge, and humble service.',
      },
      {
        title: 'Founded on service',
        body: 'From daily congregational prayer to community outreach, the Center exists to welcome worshippers, support families, and strengthen faith across Galadimawa and greater Abuja.',
      },
      {
        title: 'The four pillars',
        body: 'Worship, knowledge, charity, and community stewardship guide every program — mosque life, Islamiyyah learning, Waqf projects, and transparent giving.',
      },
      {
        title: 'Looking forward',
        body: 'We continue building dignified facilities, clear communication, and lasting endowment work so the next generation inherits both a place of prayer and a culture of trust.',
      },
    ],
    missionHeading: 'Mission & Vision',
    missionItems: [
      'Provide a dignified house of worship for the five daily prayers and Jum’uah',
      'Offer grounded Islamic learning for children, youth, and adults',
      'Steward Waqf and charitable giving with clarity and care',
      'Serve the neighborhood through outreach, hospitality, and volunteerism',
    ],
    visionItems: [
      'Become a model Islamic center known for sincerity and professionalism',
      'Sustain transparent reporting on projects and community funds',
      'Nurture scholars, volunteers, and families rooted in sound knowledge',
      'Extend compassionate service beyond the estate into wider Abuja',
    ],
    officeHours: [
      { label: 'Weekdays', value: 'After Fajr — Maghrib (office by appointment)' },
      { label: 'Friday', value: 'Jum’uah programmes; office after prayer' },
      { label: 'Weekend', value: 'Community programmes as announced' },
    ],
    storyEyebrow: 'Our Story',
    purposeEyebrow: 'Purpose',
    findUsEyebrow: 'Find us',
    findUsHeading: 'Visit the Center',
    mapCtaLabel: 'Open in Google Maps',
    ctaPrimaryLabel: 'Contact',
    ctaSecondaryLabel: 'Leadership',
  },
  mosque: {
    pageKey: 'mosque',
    heroTitle: 'The Mosque',
    heroSubtitle: 'A calm space for the five daily prayers, Jum’uah, and community gathering.',
    introHeading: 'House of Allah',
    introBody:
      'The prayer hall welcomes worshippers for the five daily prayers. Facilities support wudhu’, women’s prayer space, and quiet reflection.',
    jumuahNote: 'Jum’uah: first sermon typically begins shortly after Dhuhr on Fridays.',
  },
  leadership: {
    pageKey: 'leadership',
    heroTitle: 'Leadership',
    heroSubtitle: 'Scholars and stewards serving the community with sincerity.',
  },
  committee: {
    pageKey: 'committee',
    heroTitle: 'Shurah & Committees',
    heroSubtitle:
      'Shurah, HR, and standing committees entrusted with counsel, accountability, and service.',
  },
  events: {
    pageKey: 'events',
    heroTitle: 'Events',
    heroSubtitle: 'Lectures, programmes, and gatherings at the Centre.',
  },
  articles: {
    pageKey: 'articles',
    heroTitle: 'Articles',
    heroSubtitle: 'Reflections, guidance, and community updates.',
  },
  waqf: {
    pageKey: 'waqf',
    heroTitle: 'Waqf',
    heroSubtitle: 'Enduring charity that continues to benefit long after the gift is given.',
    introHeading: 'What is Waqf?',
    introBody:
      'Waqf is a perpetual charitable endowment. Assets or funds are dedicated for ongoing benefit — a mosque, education, welfare — while the principal is preserved as far as possible.',
    arabicText: 'إِذَا مَاتَ الْإِنْسَانُ انْقَطَعَ عَمَلُهُ إِلَّا مِنْ ثَلَاثٍ...',
    arabicCaption: 'When a person dies, their deeds end except three: ongoing charity…',
    waqfGoalAmount: 50_000_000,
    blocks: [
      {
        title: '1. Intention',
        body: 'Decide the cause — mosque, education, welfare — and give for Allah’s sake.',
      },
      {
        title: '2. Contribute',
        body: 'Donate to an active Waqf project via transfer or Paystack.',
      },
      {
        title: '3. Stewardship',
        body: 'The centre accounts for funds and reports progress publicly.',
      },
      {
        title: '4. Ongoing benefit',
        body: 'The project continues to serve people; reward is hoped for as long as benefit remains.',
      },
    ],
  },
  donate: {
    pageKey: 'donate',
    heroTitle: 'Donate',
    heroSubtitle: 'Every act of giving, however small, is recorded with Allah. Give with sincerity.',
    supportBlurb: 'Choose a fund, amount, and payment method — bank transfer or Paystack.',
  },
  contact: {
    pageKey: 'contact',
    heroTitle: 'Contact',
    heroSubtitle: 'Reach the centre office — we welcome questions, visits, and collaboration.',
    formSubjects: [
      'General enquiry',
      'Prayer / mosque',
      'Waqf & donations',
      'Education',
      'Events',
      'Other',
    ],
    officeHours: [
      { label: 'Weekdays', value: 'After Fajr — Maghrib (by appointment)' },
      { label: 'Friday', value: 'After Jum’uah' },
    ],
    findUsEyebrow: 'Location',
    mapCtaLabel: 'Open in Google Maps →',
  },
}

export const DEFAULT_FACILITIES: FacilityItem[] = [
  {
    id: 'f1',
    title: 'Main prayer hall',
    description: 'Spacious hall for the five daily prayers and Jum’uah congregation.',
  },
  {
    id: 'f2',
    title: 'Wudhu’ area',
    description: 'Clean ablution facilities for brothers and sisters.',
  },
  {
    id: 'f3',
    title: 'Women’s prayer space',
    description: 'Dedicated, dignified space for sisters.',
  },
  {
    id: 'f4',
    title: 'Islamiyyah classrooms',
    description: 'Rooms for Qur’an and Islamic studies for children and adults.',
  },
]

export const DEFAULT_DONATE_FUNDS: DonateFund[] = [
  {
    id: 'd1',
    key: 'Sadaqah',
    label: 'Sadaqah Jariyah',
    description:
      'General charity — continuous reward for deeds that benefit others after your passing.',
    impactLines: [
      { amountLabel: '₦5,000', effect: 'feeds a family of six for one day during a welfare distribution' },
      { amountLabel: '₦25,000', effect: 'covers a month of utilities for the mosque common areas' },
    ],
  },
  {
    id: 'd2',
    key: 'Zakat',
    label: 'Zakat',
    description:
      "Obligatory annual purification of wealth. Distributed to eligible recipients according to Shari'ah.",
    impactLines: [
      { amountLabel: '₦10,000', effect: "contributes to a widow's monthly support allowance" },
      { amountLabel: '₦50,000', effect: "funds an orphan's school year including books and uniform" },
    ],
  },
  {
    id: 'd3',
    key: 'Mosque Fund',
    label: 'Mosque Fund',
    description: 'Maintenance, expansion, and running costs of the prayer hall and mosque facilities.',
    impactLines: [
      { amountLabel: '₦5,000', effect: "replaces a damaged wudhu' tap fitting" },
      { amountLabel: '₦25,000', effect: 'covers a month of electricity for the prayer hall' },
    ],
  },
  {
    id: 'd4',
    key: 'Education',
    label: 'Education',
    description:
      'Islamiyyah school operations, teacher salaries, student scholarships, and learning materials.',
    impactLines: [
      {
        amountLabel: '₦5,000',
        effect: 'provides one month of learning materials for a Islamiyyah student',
      },
      {
        amountLabel: '₦25,000',
        effect: "subsidises a term's tuition for a student from a low-income household",
      },
    ],
  },
]
