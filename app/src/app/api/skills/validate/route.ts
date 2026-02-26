import { NextRequest, NextResponse } from 'next/server';
import { validateSkillMd } from '@/lib/skill-validator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content } = body;

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid "content" field' },
        { status: 400 }
      );
    }

    const result = validateSkillMd(content);

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: 'Failed to validate skill' },
      { status: 500 }
    );
  }
}
