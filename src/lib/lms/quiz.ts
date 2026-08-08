type QuizQuestion = {
  prompt?: string | null
  type?: 'single' | 'multiple' | 'boolean' | null
  options?: Array<{ text?: string | null; id?: string | null }> | null
  correctAnswers?: Array<{ value?: string | null; id?: string | null }> | null
  points?: number | null
  explanation?: string | null
}

export type QuizAnswerInput = Record<string, string | string[]>

export function gradeQuiz(
  questions: QuizQuestion[],
  answers: QuizAnswerInput,
): { score: number; passed: boolean; results: Array<{ index: number; correct: boolean; explanation?: string }> } {
  let earned = 0
  let totalPoints = 0
  const results: Array<{ index: number; correct: boolean; explanation?: string }> = []

  questions.forEach((question, index) => {
    const points = question.points ?? 1
    totalPoints += points
    const key = String(index)
    const userAnswer = answers[key]
    const correctValues = (question.correctAnswers ?? [])
      .map((a) => a.value?.trim())
      .filter(Boolean) as string[]

    let correct = false

    if (question.type === 'boolean') {
      const expected = correctValues[0]?.toLowerCase()
      const given = String(Array.isArray(userAnswer) ? userAnswer[0] : userAnswer ?? '').toLowerCase()
      correct = expected === given
    } else if (question.type === 'multiple') {
      const given = new Set(
        (Array.isArray(userAnswer) ? userAnswer : [userAnswer])
          .filter(Boolean)
          .map((v) => String(v).trim()),
      )
      const expected = new Set(correctValues)
      correct = given.size === expected.size && [...expected].every((v) => given.has(v))
    } else {
      const given = String(Array.isArray(userAnswer) ? userAnswer[0] : userAnswer ?? '').trim()
      correct = correctValues.includes(given)
    }

    if (correct) earned += points
    results.push({
      index,
      correct,
      explanation: question.explanation ?? undefined,
    })
  })

  const score = totalPoints > 0 ? Math.round((earned / totalPoints) * 100) : 0
  return { score, passed: false, results }
}

export function gradeQuizWithPassing(
  questions: QuizQuestion[],
  answers: QuizAnswerInput,
  passingScore: number,
) {
  const result = gradeQuiz(questions, answers)
  return { ...result, passed: result.score >= passingScore }
}
