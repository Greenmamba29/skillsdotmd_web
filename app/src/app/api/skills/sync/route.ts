import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { syncLocalSkills, generateQuizForSkill } from '@/lib/skill-sync';
import * as path from 'path';

export async function POST() {
  try {
    // Sync from local .agents/skills directory
    const agentsSkillsDir = path.resolve(process.cwd(), '..', '.agents', 'skills');
    const customerOnboarderDir = path.resolve(process.cwd(), '..');

    let totalSynced = 0;

    // Sync .agents/skills
    const agentsCount = await syncLocalSkills(agentsSkillsDir);
    totalSynced += agentsCount;

    // Generate quizzes for synced skills
    const skills = await prisma.skill.findMany({ select: { id: true } });
    for (const skill of skills) {
      await generateQuizForSkill(skill.id);
    }

    // Update sync source record
    await prisma.syncSource.upsert({
      where: { id: 'local-agents' },
      create: {
        id: 'local-agents',
        type: 'local',
        url: agentsSkillsDir,
        name: 'Local Agent Skills',
        enabled: true,
        lastSync: new Date(),
        status: 'synced',
        skillCount: agentsCount,
      },
      update: {
        lastSync: new Date(),
        status: 'synced',
        skillCount: agentsCount,
      },
    });

    return NextResponse.json({
      success: true,
      synced: totalSynced,
      quizzesGenerated: skills.length,
    });
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json(
      { error: 'Sync failed', details: String(error) },
      { status: 500 }
    );
  }
}
