'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import QuizPlayer from '@/components/QuizPlayer';
import VideoPlayer from '@/components/VideoPlayer';
import WeavyChat from '@/components/WeavyChat';

interface SkillDetail {
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
  frontmatter: Record<string, unknown>;
  videoUrl?: string;
  validated: boolean;
  lintScore: number;
  quizzes: {
    id: string;
    title: string;
    questions: { id: string; question: string; options: string[]; correctIndex: number; explanation?: string }[];
  }[];
  testResults: {
    id: string;
    agent: string;
    passed: boolean;
    duration?: number;
    createdAt: string;
  }[];
}

export default function SkillDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [skill, setSkill] = useState<SkillDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'content' | 'quiz' | 'tests' | 'collaborate'>('content');

  useEffect(() => {
    fetch(`/api/skills/${slug}`)
      .then(r => r.json())
      .then(data => {
        if (!data.error) setSkill(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-12 text-center text-gray-500">Loading...</div>;
  if (!skill) return <div className="max-w-4xl mx-auto px-4 py-12 text-center text-gray-500">Skill not found</div>;

  const scoreClass = skill.lintScore >= 80 ? 'score-high' : skill.lintScore >= 50 ? 'score-medium' : 'score-low';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <a href="/skills" className="text-sm text-brand-600 hover:underline">&larr; All Skills</a>
        </div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{skill.name}</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{skill.description}</p>
          </div>
          <span className={`score-badge text-base ${scoreClass}`}>{skill.lintScore}/100</span>
        </div>
        <div className="flex flex-wrap items-center gap-3 mt-4">
          <span className="text-xs px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 font-medium capitalize">
            {skill.category}
          </span>
          {skill.validated && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">Validated</span>
          )}
          <span className="text-xs text-gray-500">v{skill.version}</span>
          {skill.author && <span className="text-xs text-gray-500">by {skill.author}</span>}
          {skill.license && <span className="text-xs text-gray-500">{skill.license}</span>}
          <span className="text-xs text-gray-500 capitalize">Source: {skill.source}</span>
          {skill.tags.map(tag => (
            <span key={tag} className="text-xs px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Demo Video */}
      {skill.videoUrl && (
        <div className="mb-8">
          <VideoPlayer url={skill.videoUrl} title={`${skill.name} Demo`} />
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-800 mb-6">
        <div className="flex gap-6">
          {(['content', 'quiz', 'tests', 'collaborate'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-brand-500 text-brand-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'content' ? 'SKILL.md' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'content' && (
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
          <div className="p-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <span className="text-sm font-mono text-gray-600 dark:text-gray-300">SKILL.md</span>
            <button
              onClick={() => navigator.clipboard.writeText(skill.content)}
              className="text-xs text-brand-600 hover:underline"
            >
              Copy
            </button>
          </div>
          <pre className="p-4 text-sm font-mono text-gray-800 dark:text-gray-200 overflow-x-auto whitespace-pre-wrap">
            {skill.content}
          </pre>
        </div>
      )}

      {activeTab === 'quiz' && (
        <div>
          {skill.quizzes.length > 0 ? (
            skill.quizzes.map(quiz => (
              <QuizPlayer key={quiz.id} quizId={quiz.id} title={quiz.title} questions={quiz.questions} />
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <div className="text-3xl mb-2">&#x1F3AF;</div>
              <p>No quizzes available for this skill yet.</p>
              <p className="text-xs mt-1">Sync skills from the dashboard to auto-generate quizzes.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'tests' && (
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Test Results</h3>
          {skill.testResults.length > 0 ? (
            <div className="space-y-3">
              {skill.testResults.map(t => (
                <div key={t.id} className={`p-3 rounded-lg flex items-center justify-between ${t.passed ? 'bg-green-50 dark:bg-green-950/50' : 'bg-red-50 dark:bg-red-950/50'}`}>
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{t.agent}</span>
                    <span className="text-xs text-gray-500 ml-2">{new Date(t.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {t.duration && <span className="text-xs text-gray-500">{t.duration}ms</span>}
                    <span className={`text-xs font-medium ${t.passed ? 'text-green-700' : 'text-red-700'}`}>
                      {t.passed ? 'PASS' : 'FAIL'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-3xl mb-2">&#x1F9EA;</div>
              <p>No test results yet.</p>
              <p className="text-xs mt-1">
                Test this skill with Codex CLI, Copilot, Cursor, or Claude to see results here.
              </p>
              <div className="mt-4 p-3 rounded bg-gray-50 dark:bg-gray-800 text-left max-w-md mx-auto">
                <p className="text-xs font-mono text-gray-600 dark:text-gray-300">
                  # Test with Codex CLI<br />
                  cp -r .agents/skills/{skill.slug} ~/.codex/skills/<br />
                  codex --enable skills &quot;Use the {skill.name} skill&quot;
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'collaborate' && (
        <WeavyChat spaceKey={`skill-${skill.slug}`} />
      )}
    </div>
  );
}
