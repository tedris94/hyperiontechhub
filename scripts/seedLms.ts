import type { Payload } from 'payload'

export async function seedLmsDemo(payload: Payload) {
  console.log('Seeding LMS demo data…')

  let instructor = await payload.find({
    collection: 'users',
    where: { email: { equals: 'instructor@hyperiontechhub.com' } },
    limit: 1,
    overrideAccess: true,
  })

  if (instructor.totalDocs === 0) {
    instructor = {
      docs: [
        await payload.create({
          collection: 'users',
          data: {
            email: 'instructor@hyperiontechhub.com',
            password: 'demo1234',
            fullName: 'Demo Instructor',
            role: 'instructor',
          },
          overrideAccess: true,
        }),
      ],
      totalDocs: 1,
    } as typeof instructor
  }

  const instructorId = instructor.docs[0]!.id

  let category = await payload.find({
    collection: 'course-categories',
    where: { slug: { equals: 'web-development' } },
    limit: 1,
    overrideAccess: true,
  })

  if (category.totalDocs === 0) {
    category = {
      docs: [
        await payload.create({
          collection: 'course-categories',
          data: {
            name: 'Web Development',
            slug: 'web-development',
            description: 'Frontend, backend, and full-stack courses',
            icon: 'Code2',
          },
          overrideAccess: true,
        }),
      ],
      totalDocs: 1,
    } as typeof category
  }

  const categoryId = category.docs[0]!.id

  async function ensureCourse(slug: string, data: Record<string, unknown>) {
    const existing = await payload.find({
      collection: 'courses',
      where: { slug: { equals: slug } },
      limit: 1,
      overrideAccess: true,
    })
    if (existing.docs[0]) return existing.docs[0]
    return payload.create({
      collection: 'courses',
      data: { slug, ...data },
      overrideAccess: true,
    })
  }

  const freeCourse = await ensureCourse('web-development-fundamentals', {
    title: 'Web Development Fundamentals — Abuja Cohort',
    subtitle: '6-week hub + LMS cohort: HTML, CSS, JavaScript, WordPress intro',
    instructor: instructorId,
    category: categoryId,
    level: 'beginner',
    isFree: false,
    price: 85000,
    currency: 'NGN',
    status: 'published',
    whatYouWillLearn: [
      { item: 'Build responsive layouts with HTML and CSS' },
      { item: 'Write interactive JavaScript' },
      { item: 'Publish a simple WordPress site' },
      { item: 'Deploy a basic site confidently' },
    ],
    requirements: [{ item: 'A computer and internet connection' }],
    targetAudience: [{ item: 'Beginners starting a tech career in Abuja' }],
    tags: [{ tag: 'javascript' }, { tag: 'html' }, { tag: 'css' }, { tag: 'cohort' }],
  })

  const paidCourse = await ensureCourse('advanced-react-patterns', {
    title: 'Advanced React Patterns',
    subtitle: 'Hooks, performance, and production-ready React',
    instructor: instructorId,
    category: categoryId,
    level: 'advanced',
    isFree: false,
    price: 2500000,
    currency: 'NGN',
    status: 'published',
    whatYouWillLearn: [
      { item: 'Master advanced React hooks patterns' },
      { item: 'Optimize rendering performance' },
      { item: 'Architect scalable component libraries' },
    ],
    requirements: [{ item: 'Solid JavaScript and basic React knowledge' }],
    targetAudience: [{ item: 'Mid-level frontend developers' }],
    tags: [{ tag: 'react' }, { tag: 'frontend' }],
  })

  async function ensureSection(courseId: number, title: string, order: number) {
    const existing = await payload.find({
      collection: 'course-sections',
      where: {
        and: [{ course: { equals: courseId } }, { title: { equals: title } }],
      },
      limit: 1,
      overrideAccess: true,
    })
    if (existing.docs[0]) return existing.docs[0]
    return payload.create({
      collection: 'course-sections',
      data: { course: courseId, title, order },
      overrideAccess: true,
    })
  }

  async function ensureLesson(
    courseId: number,
    sectionId: number,
    slug: string,
    data: Record<string, unknown>,
  ) {
    const existing = await payload.find({
      collection: 'lessons',
      where: {
        and: [{ course: { equals: courseId } }, { slug: { equals: slug } }],
      },
      limit: 1,
      overrideAccess: true,
    })
    if (existing.docs[0]) return existing.docs[0]
    return payload.create({
      collection: 'lessons',
      data: { course: courseId, section: sectionId, slug, ...data },
      overrideAccess: true,
    })
  }

  const freeSection1 = await ensureSection(freeCourse.id, 'Getting Started', 0)
  await ensureLesson(freeCourse.id, freeSection1.id, 'welcome', {
    title: 'Welcome to the course',
    order: 0,
    type: 'article',
    isPreview: true,
    durationSeconds: 300,
    content: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Welcome to Web Development Fundamentals. In this course you will learn the building blocks of the modern web.',
              },
            ],
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
  })

  await ensureLesson(freeCourse.id, freeSection1.id, 'setup-your-environment', {
    title: 'Set up your development environment',
    order: 1,
    type: 'video',
    durationSeconds: 900,
    isPreview: false,
  })

  const freeSection2 = await ensureSection(freeCourse.id, 'HTML & CSS', 1)
  await ensureLesson(freeCourse.id, freeSection2.id, 'html-basics', {
    title: 'HTML basics',
    order: 0,
    type: 'video',
    durationSeconds: 1200,
  })

  const quizSection = await ensureSection(freeCourse.id, 'Assessment', 2)
  const quizLesson = await ensureLesson(freeCourse.id, quizSection.id, 'module-quiz', {
    title: 'Module 1 Quiz',
    order: 0,
    type: 'quiz',
    durationSeconds: 600,
  })

  let quiz = await payload.find({
    collection: 'quizzes',
    where: { title: { equals: 'Web Dev Fundamentals Quiz' } },
    limit: 1,
    overrideAccess: true,
  })

  if (quiz.totalDocs === 0) {
    const createdQuiz = await payload.create({
      collection: 'quizzes',
      data: {
        title: 'Web Dev Fundamentals Quiz',
        course: freeCourse.id,
        lesson: quizLesson.id,
        passingScore: 70,
        questions: [
          {
            prompt: 'What does HTML stand for?',
            type: 'single',
            options: [
              { text: 'HyperText Markup Language' },
              { text: 'High Tech Modern Language' },
              { text: 'Home Tool Markup Language' },
            ],
            correctAnswers: [{ value: '0' }],
            points: 1,
            explanation: 'HTML stands for HyperText Markup Language.',
          },
          {
            prompt: 'CSS is used for styling web pages.',
            type: 'boolean',
            correctAnswers: [{ value: 'true' }],
            points: 1,
          },
        ],
      },
      overrideAccess: true,
    })

    await payload.update({
      collection: 'lessons',
      id: quizLesson.id,
      data: { quiz: createdQuiz.id },
      overrideAccess: true,
    })
  }

  const paidSection = await ensureSection(paidCourse.id, 'React Deep Dive', 0)
  await ensureLesson(paidCourse.id, paidSection.id, 'intro-advanced-react', {
    title: 'Introduction to Advanced React',
    order: 0,
    type: 'video',
    isPreview: true,
    durationSeconds: 800,
  })

  console.log('LMS demo seed complete.')
}
