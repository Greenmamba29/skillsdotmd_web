import { prisma } from './db';
import { syncLocalSkills, generateQuizForSkill } from './skill-sync';
import * as path from 'path';

async function seed() {
  console.log('Seeding database...');

  // Sync local skills from .agents/skills
  const skillsDir = path.resolve(__dirname, '..', '..', '..', '.agents', 'skills');
  console.log(`Scanning: ${skillsDir}`);

  const count = await syncLocalSkills(skillsDir);
  console.log(`Synced ${count} skills`);

  // Generate quizzes
  const skills = await prisma.skill.findMany({ select: { id: true } });
  for (const skill of skills) {
    await generateQuizForSkill(skill.id);
  }
  console.log(`Generated quizzes for ${skills.length} skills`);

  // Add default sync sources
  await prisma.syncSource.upsert({
    where: { id: 'local-agents' },
    create: {
      id: 'local-agents',
      type: 'local',
      url: skillsDir,
      name: 'Local Agent Skills (.agents/skills)',
      enabled: true,
      lastSync: new Date(),
      status: 'synced',
      skillCount: count,
    },
    update: { lastSync: new Date(), skillCount: count },
  });

  await prisma.syncSource.upsert({
    where: { id: 'skillssh' },
    create: {
      id: 'skillssh',
      type: 'skillssh',
      url: 'https://skills.sh',
      name: 'Skills.sh Marketplace',
      enabled: true,
      status: 'pending',
      skillCount: 0,
    },
    update: {},
  });

  await prisma.syncSource.upsert({
    where: { id: 'github-anthropics' },
    create: {
      id: 'github-anthropics',
      type: 'github',
      url: 'https://github.com/anthropics/skills',
      name: 'Anthropic Official Skills',
      enabled: true,
      status: 'pending',
      skillCount: 0,
    },
    update: {},
  });

  await prisma.syncSource.upsert({
    where: { id: 'youtube-skills' },
    create: {
      id: 'youtube-skills',
      type: 'youtube',
      url: 'https://youtube.com/results?search_query=SKILL.md+tutorial',
      name: 'YouTube Skills.md Tutorials',
      enabled: true,
      status: 'pending',
      skillCount: 0,
    },
    update: {},
  });

  console.log('Seed complete!');
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
