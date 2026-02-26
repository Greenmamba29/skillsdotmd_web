import { prisma } from './db';
import { validateSkillMd, parseFrontmatter } from './skill-validator';
import * as fs from 'fs';
import * as path from 'path';

export async function syncLocalSkills(skillsDir: string): Promise<number> {
  let count = 0;
  if (!fs.existsSync(skillsDir)) return count;

  const dirs = fs.readdirSync(skillsDir, { withFileTypes: true });
  for (const dir of dirs) {
    if (!dir.isDirectory()) continue;
    const skillMdPath = path.join(skillsDir, dir.name, 'SKILL.md');
    if (!fs.existsSync(skillMdPath)) continue;

    const content = fs.readFileSync(skillMdPath, 'utf-8');
    const fm = parseFrontmatter(content);
    const validation = validateSkillMd(content);
    const slug = dir.name;
    const name = fm?.name || slug;
    const description = fm?.description || '';
    const tags = JSON.stringify(fm?.tags || []);
    const category = categorizeSkill(name, description);

    await prisma.skill.upsert({
      where: { slug },
      create: {
        slug,
        name,
        description,
        category,
        tags,
        source: 'local',
        author: fm?.author || undefined,
        license: fm?.license || undefined,
        version: fm?.version || '1.0.0',
        content,
        frontmatter: JSON.stringify(fm || {}),
        videoUrl: fm?.video || undefined,
        validated: validation.valid,
        lintScore: validation.score,
      },
      update: {
        name,
        description,
        category,
        tags,
        content,
        frontmatter: JSON.stringify(fm || {}),
        videoUrl: fm?.video || undefined,
        validated: validation.valid,
        lintScore: validation.score,
        updatedAt: new Date(),
      },
    });
    count++;
  }
  return count;
}

function categorizeSkill(name: string, description: string): string {
  const text = `${name} ${description}`.toLowerCase();
  const categories: Record<string, string[]> = {
    'devops': ['ci-cd', 'docker', 'terraform', 'kubernetes', 'deploy', 'pipeline', 'infrastructure'],
    'frontend': ['react', 'css', 'design', 'ui', 'ux', 'web', 'accessibility', 'frontend'],
    'backend': ['api', 'database', 'server', 'auth', 'backend', 'graphql', 'rest'],
    'data': ['data', 'analytics', 'csv', 'report', 'dashboard', 'visualization'],
    'testing': ['test', 'qa', 'vulnerability', 'scanner', 'lint', 'audit'],
    'marketing': ['seo', 'marketing', 'email', 'campaign', 'content', 'social'],
    'integration': ['slack', 'webhook', 'shopify', 'zapier', 'sync', 'integration'],
    'automation': ['automat', 'workflow', 'orchestrat', 'onboard', 'processor'],
    'documentation': ['doc', 'readme', 'changelog', 'migration', 'guide'],
  };

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(kw => text.includes(kw))) {
      return category;
    }
  }
  return 'general';
}

export async function generateQuizForSkill(skillId: string): Promise<void> {
  const skill = await prisma.skill.findUnique({ where: { id: skillId } });
  if (!skill) return;

  const fm = parseFrontmatter(skill.content);
  const questions = [];

  // Generate basic questions from skill metadata
  if (fm?.description) {
    questions.push({
      id: `q1-${skillId}`,
      question: `What is the primary purpose of the "${skill.name}" skill?`,
      options: [
        fm.description.slice(0, 100),
        'It manages database migrations',
        'It generates documentation',
        'It runs automated tests',
      ],
      correctIndex: 0,
      explanation: `The skill's description states: "${fm.description}"`,
    });
  }

  if (fm?.tags && Array.isArray(fm.tags) && fm.tags.length > 0) {
    questions.push({
      id: `q2-${skillId}`,
      question: `Which category best describes the "${skill.name}" skill?`,
      options: [
        fm.tags[0],
        'video-editing',
        'game-development',
        'hardware-testing',
      ],
      correctIndex: 0,
      explanation: `The skill is tagged with: ${fm.tags.join(', ')}`,
    });
  }

  // Validation question
  questions.push({
    id: `q3-${skillId}`,
    question: 'What is the correct way to validate a SKILL.md file?',
    options: [
      'Run skilo lint . to check against the spec',
      'Open it in a text editor and read it',
      'Upload it to social media',
      'Convert it to PDF first',
    ],
    correctIndex: 0,
    explanation: 'Skilo is the official CLI tool for linting and validating SKILL.md files.',
  });

  if (questions.length > 0) {
    await prisma.quiz.upsert({
      where: { id: `quiz-${skillId}` },
      create: {
        id: `quiz-${skillId}`,
        skillId,
        title: `${skill.name} Knowledge Check`,
        questions: JSON.stringify(questions),
      },
      update: {
        title: `${skill.name} Knowledge Check`,
        questions: JSON.stringify(questions),
      },
    });
  }
}
