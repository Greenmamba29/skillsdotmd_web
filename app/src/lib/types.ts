export interface SkillData {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  source: string;
  sourceUrl?: string;
  author?: string;
  license?: string;
  version: string;
  content: string;
  videoUrl?: string;
  status: string;
  validated: boolean;
  lintScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface QuizData {
  id: string;
  skillId: string;
  title: string;
  questions: QuizQuestion[];
}

export interface SyncSourceData {
  id: string;
  type: 'github' | 'skillssh' | 'youtube' | 'url';
  url: string;
  name: string;
  enabled: boolean;
  lastSync?: string;
  status: string;
  skillCount: number;
}

export interface DashboardStats {
  totalSkills: number;
  validatedSkills: number;
  syncSources: number;
  quizzesTaken: number;
  avgLintScore: number;
}
