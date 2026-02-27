import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const skill = await prisma.skill.findUnique({
      where: { slug: params.slug },
      include: {
        quizzes: true,
        testResults: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!skill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    return NextResponse.json({
      ...skill,
      tags: JSON.parse(skill.tags),
      frontmatter: JSON.parse(skill.frontmatter),
      quizzes: skill.quizzes.map(q => ({
        ...q,
        questions: JSON.parse(q.questions),
      })),
    });
  } catch (error) {
    console.error('Skill detail API error:', error);
    return NextResponse.json(
      { error: 'Database connection failed' },
      { status: 503 }
    );
  }
}
