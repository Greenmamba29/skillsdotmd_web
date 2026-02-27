import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [
      totalSkills,
      validatedSkills,
      syncSources,
      quizzesTaken,
      avgResult,
      categories,
      topSkills,
    ] = await Promise.all([
      prisma.skill.count(),
      prisma.skill.count({ where: { validated: true } }),
      prisma.syncSource.count(),
      prisma.quizAttempt.count(),
      prisma.skill.aggregate({ _avg: { lintScore: true } }),
      prisma.skill.groupBy({
        by: ['category'],
        _count: true,
        orderBy: { _count: { category: 'desc' } },
      }),
      prisma.skill.findMany({
        orderBy: { lintScore: 'desc' },
        take: 5,
        select: { name: true, slug: true, lintScore: true, category: true },
      }),
    ]);

    return NextResponse.json({
      totalSkills,
      validatedSkills,
      syncSources,
      quizzesTaken,
      avgLintScore: Math.round(avgResult._avg.lintScore || 0),
      categories: categories.map(c => ({ name: c.category, count: c._count })),
      topSkills,
    });
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json({
      totalSkills: 0,
      validatedSkills: 0,
      syncSources: 0,
      quizzesTaken: 0,
      avgLintScore: 0,
      categories: [],
      topSkills: [],
      error: 'Database connection failed',
    });
  }
}
