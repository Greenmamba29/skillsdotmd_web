import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  _request: NextRequest,
  { params }: { params: { quizId: string } }
) {
  const quiz = await prisma.quiz.findUnique({
    where: { id: params.quizId },
    include: { skill: { select: { name: true, slug: true } } },
  });

  if (!quiz) {
    return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
  }

  return NextResponse.json({
    ...quiz,
    questions: JSON.parse(quiz.questions),
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { quizId: string } }
) {
  try {
    const body = await request.json();
    const { answers, userId } = body;

    const quiz = await prisma.quiz.findUnique({
      where: { id: params.quizId },
    });

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    const questions = JSON.parse(quiz.questions);
    let correct = 0;
    for (let i = 0; i < questions.length; i++) {
      if (answers[i] === questions[i].correctIndex) {
        correct++;
      }
    }
    const score = Math.round((correct / questions.length) * 100);

    if (userId) {
      await prisma.quizAttempt.create({
        data: {
          userId,
          quizId: params.quizId,
          score,
          answers: JSON.stringify(answers),
        },
      });
    }

    return NextResponse.json({
      score,
      correct,
      total: questions.length,
      results: questions.map((q: { correctIndex: number; explanation?: string }, i: number) => ({
        correct: answers[i] === q.correctIndex,
        correctAnswer: q.correctIndex,
        userAnswer: answers[i],
        explanation: q.explanation,
      })),
    });
  } catch {
    return NextResponse.json({ error: 'Failed to submit quiz' }, { status: 500 });
  }
}
