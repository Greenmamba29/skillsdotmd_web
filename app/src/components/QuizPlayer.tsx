'use client';

import { useState } from 'react';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

interface QuizPlayerProps {
  quizId: string;
  title: string;
  questions: Question[];
}

export default function QuizPlayer({ quizId, title, questions }: QuizPlayerProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<{ score: number; correct: number; total: number; results: { correct: boolean; correctAnswer: number; explanation?: string }[] } | null>(null);

  function selectAnswer(idx: number) {
    if (submitted) return;
    const newAnswers = [...answers];
    newAnswers[currentQ] = idx;
    setAnswers(newAnswers);
  }

  async function submit() {
    try {
      const res = await fetch(`/api/quizzes/${quizId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      setResults(data);
      setSubmitted(true);
    } catch {
      // Handle error silently
    }
  }

  function reset() {
    setCurrentQ(0);
    setAnswers(new Array(questions.length).fill(null));
    setSubmitted(false);
    setResults(null);
  }

  if (questions.length === 0) {
    return <p className="text-sm text-gray-500">No quiz available for this skill yet.</p>;
  }

  const q = questions[currentQ];
  const answered = answers[currentQ] !== null;
  const allAnswered = answers.every(a => a !== null);

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        <span className="text-sm text-gray-500">
          {currentQ + 1} / {questions.length}
        </span>
      </div>

      {submitted && results ? (
        <div className="p-6">
          <div className={`text-center p-6 rounded-xl ${results.score >= 70 ? 'bg-green-50 dark:bg-green-950' : 'bg-yellow-50 dark:bg-yellow-950'}`}>
            <div className="text-4xl font-bold mb-2">{results.score}%</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {results.correct} of {results.total} correct
            </p>
          </div>
          <div className="mt-4 space-y-3">
            {questions.map((question, i) => (
              <div key={i} className={`p-3 rounded-lg ${results.results[i].correct ? 'bg-green-50 dark:bg-green-950/50' : 'bg-red-50 dark:bg-red-950/50'}`}>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{question.question}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Your answer: {question.options[answers[i] || 0]} {results.results[i].correct ? '(Correct)' : `(Correct: ${question.options[results.results[i].correctAnswer]})`}
                </p>
                {results.results[i].explanation && (
                  <p className="text-xs text-gray-400 mt-1">{results.results[i].explanation}</p>
                )}
              </div>
            ))}
          </div>
          <button onClick={reset} className="mt-4 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700">
            Try Again
          </button>
        </div>
      ) : (
        <div className="p-6">
          <p className="text-base font-medium text-gray-900 dark:text-white mb-4">{q.question}</p>
          <div className="space-y-2">
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => selectAnswer(i)}
                className={`quiz-option w-full text-left text-sm ${answers[currentQ] === i ? 'selected' : 'border-gray-200 dark:border-gray-700'}`}
              >
                <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span>
                {opt}
              </button>
            ))}
          </div>
          <div className="flex justify-between mt-6">
            <button
              onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
              disabled={currentQ === 0}
              className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 disabled:opacity-30"
            >
              Previous
            </button>
            <div className="flex gap-2">
              {currentQ < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQ(currentQ + 1)}
                  disabled={!answered}
                  className="px-4 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-30"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={submit}
                  disabled={!allAnswered}
                  className="px-4 py-1.5 text-sm bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 disabled:opacity-30"
                >
                  Submit Quiz
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
