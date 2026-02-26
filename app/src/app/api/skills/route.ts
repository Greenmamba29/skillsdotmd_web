import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const source = searchParams.get('source');
  const validated = searchParams.get('validated');
  const sort = searchParams.get('sort') || 'name';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  const where: Record<string, unknown> = {};
  if (category) where.category = category;
  if (source) where.source = source;
  if (validated === 'true') where.validated = true;
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
      { tags: { contains: search } },
    ];
  }

  const [skills, total] = await Promise.all([
    prisma.skill.findMany({
      where,
      orderBy: sort === 'score' ? { lintScore: 'desc' } : sort === 'newest' ? { createdAt: 'desc' } : { name: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        category: true,
        tags: true,
        source: true,
        author: true,
        validated: true,
        lintScore: true,
        videoUrl: true,
        createdAt: true,
      },
    }),
    prisma.skill.count({ where }),
  ]);

  return NextResponse.json({
    skills: skills.map(s => ({ ...s, tags: JSON.parse(s.tags) })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
