'use client';

import { useEffect, useState } from 'react';
import SkillValidator from '@/components/SkillValidator';
import SplineViewer from '@/components/SplineViewer';

interface Stats {
  totalSkills: number;
  validatedSkills: number;
  syncSources: number;
  quizzesTaken: number;
  avgLintScore: number;
  categories: { name: string; count: number }[];
  topSkills: { name: string; slug: string; lintScore: number; category: string }[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(setStats).catch(() => {});
  }, []);

  async function handleSync() {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await fetch('/api/skills/sync', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setSyncResult(`Synced ${data.synced} skills, generated ${data.quizzesGenerated} quizzes`);
        // Refresh stats
        const newStats = await fetch('/api/stats').then(r => r.json());
        setStats(newStats);
      } else {
        setSyncResult(`Sync error: ${data.error}`);
      }
    } catch {
      setSyncResult('Sync failed — check your connection');
    }
    setSyncing(false);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage, validate, and sync your skills</p>
        </div>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="inline-flex items-center px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-50"
        >
          {syncing ? 'Syncing...' : 'Sync Skills'}
        </button>
      </div>

      {syncResult && (
        <div className="mb-6 p-3 rounded-lg bg-brand-50 dark:bg-brand-950 border border-brand-200 dark:border-brand-800 text-sm text-brand-700 dark:text-brand-300">
          {syncResult}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard label="Total Skills" value={stats?.totalSkills || 0} />
        <StatCard label="Validated" value={stats?.validatedSkills || 0} />
        <StatCard label="Sync Sources" value={stats?.syncSources || 0} />
        <StatCard label="Quizzes Taken" value={stats?.quizzesTaken || 0} />
        <StatCard label="Avg Lint Score" value={stats?.avgLintScore || 0} suffix="/100" />
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Categories */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Skills by Category</h3>
          {stats?.categories && stats.categories.length > 0 ? (
            <div className="space-y-3">
              {stats.categories.map((c) => (
                <div key={c.name} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{c.name}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-brand-500 h-2 rounded-full"
                        style={{ width: `${Math.min(100, (c.count / (stats?.totalSkills || 1)) * 100)}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 w-8 text-right">{c.count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No skills synced yet. Click &quot;Sync Skills&quot; above.</p>
          )}
        </div>

        {/* Top Skills */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Scoring Skills</h3>
          {stats?.topSkills && stats.topSkills.length > 0 ? (
            <div className="space-y-3">
              {stats.topSkills.map((s, i) => (
                <a key={s.slug} href={`/skills/${s.slug}`} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-400 w-5">{i + 1}.</span>
                    <div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{s.name}</span>
                      <span className="text-xs text-gray-500 ml-2 capitalize">{s.category}</span>
                    </div>
                  </div>
                  <span className={`score-badge ${s.lintScore >= 80 ? 'score-high' : s.lintScore >= 50 ? 'score-medium' : 'score-low'}`}>
                    {s.lintScore}/100
                  </span>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Sync skills to see rankings.</p>
          )}
        </div>
      </div>

      {/* Validator */}
      <div className="mb-8">
        <SkillValidator />
      </div>

      {/* Spline 3D Viewer */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">3D Skill Visualizer</h3>
        <SplineViewer />
      </div>
    </div>
  );
}

function StatCard({ label, value, suffix }: { label: string; value: number; suffix?: string }) {
  return (
    <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">
        {value}{suffix || ''}
      </p>
    </div>
  );
}
