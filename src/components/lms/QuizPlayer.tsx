'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type QuizQuestion = {
  index: number
  prompt?: string
  type?: string
  options?: Array<{ index: number; text?: string }>
  points?: number
}

type QuizPlayerProps = {
  quiz: {
    id: number
    title: string
    passingScore: number
    questions: QuizQuestion[]
  }
  courseId: number
  onComplete?: (passed: boolean) => void
}

export function QuizPlayer({ quiz, courseId, onComplete }: QuizPlayerProps) {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{
    score: number
    passed: boolean
    results: Array<{ index: number; correct: boolean; explanation?: string }>
  } | null>(null)

  function setSingleAnswer(index: number, value: string) {
    setAnswers((prev) => ({ ...prev, [String(index)]: value }))
  }

  function toggleMultiAnswer(index: number, value: string) {
    setAnswers((prev) => {
      const key = String(index)
      const current = Array.isArray(prev[key]) ? (prev[key] as string[]) : []
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
      return { ...prev, [key]: next }
    })
  }

  async function handleSubmit() {
    setSubmitting(true)
    try {
      const res = await fetch('/api/lms/quiz/attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizId: quiz.id, courseId, answers }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Submission failed')
      setResult(data)
      onComplete?.(data.passed)
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to submit quiz')
    } finally {
      setSubmitting(false)
    }
  }

  if (result) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Quiz Results
            <Badge variant={result.passed ? 'default' : 'outline'}>
              {result.passed ? 'Passed' : 'Not passed'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-2xl font-bold text-[#1A2BC2]">{result.score}%</p>
          <p className="text-sm text-gray-600">
            Passing score: {quiz.passingScore}%
          </p>
          <div className="space-y-2">
            {result.results.map((r) => (
              <div
                key={r.index}
                className={`p-3 rounded-lg border ${r.correct ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}
              >
                <p className="text-sm font-medium">
                  Question {r.index + 1}: {r.correct ? 'Correct' : 'Incorrect'}
                </p>
                {r.explanation && (
                  <p className="text-xs text-gray-600 mt-1">{r.explanation}</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{quiz.title}</CardTitle>
        <p className="text-sm text-gray-500">Passing score: {quiz.passingScore}%</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {quiz.questions.map((q) => (
          <div key={q.index} className="space-y-3 pb-4 border-b last:border-0">
            <p className="font-medium">
              {q.index + 1}. {q.prompt}
            </p>
            {q.type === 'boolean' ? (
              <div className="flex gap-2">
                {['true', 'false'].map((val) => (
                  <Button
                    key={val}
                    type="button"
                    variant={answers[String(q.index)] === val ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSingleAnswer(q.index, val)}
                  >
                    {val === 'true' ? 'True' : 'False'}
                  </Button>
                ))}
              </div>
            ) : q.type === 'multiple' ? (
              <div className="space-y-2">
                {(q.options ?? []).map((opt) => {
                  const selected = (answers[String(q.index)] as string[] | undefined)?.includes(
                    String(opt.index),
                  )
                  return (
                    <label
                      key={opt.index}
                      className={`flex items-center gap-2 p-2 rounded border cursor-pointer ${selected ? 'border-[#1A2BC2] bg-[#1A2BC2]/5' : 'border-gray-200'}`}
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(selected)}
                        onChange={() => toggleMultiAnswer(q.index, String(opt.index))}
                      />
                      <span>{opt.text}</span>
                    </label>
                  )
                })}
              </div>
            ) : (
              <div className="space-y-2">
                {(q.options ?? []).map((opt) => (
                  <label
                    key={opt.index}
                    className={`flex items-center gap-2 p-2 rounded border cursor-pointer ${answers[String(q.index)] === String(opt.index) ? 'border-[#1A2BC2] bg-[#1A2BC2]/5' : 'border-gray-200'}`}
                  >
                    <input
                      type="radio"
                      name={`q-${q.index}`}
                      checked={answers[String(q.index)] === String(opt.index)}
                      onChange={() => setSingleAnswer(q.index, String(opt.index))}
                    />
                    <span>{opt.text}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
        <Button onClick={handleSubmit} disabled={submitting} className="bg-[#1A2BC2]">
          {submitting ? 'Submitting…' : 'Submit Quiz'}
        </Button>
      </CardContent>
    </Card>
  )
}
