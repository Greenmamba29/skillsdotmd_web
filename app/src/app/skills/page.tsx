'use client';

import { useEffect, useState, useCallback } from 'react';
import SkillCard from '@/components/SkillCard';

interface Skill {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  source: string;
  validated: boolean;
  lintScore: number;
  videoUrl?: string;
}

const CATEGORIES = [
  'all', 'automation', 'backend', 'data', 'devops', 'documentation',
  'frontend', 'integration', 'marketing', 'testing', 'general',
];

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('name');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const loadSkills = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category !== 'all') params.set('category', category);
    params.set('sort', sort);
    params.set('page', String(page));

    try {
      const res = await fetch(`/api/skills?${params}`);
      const data = await res.json();
      setSkills(data.skills || []);
      setTotal(data.total || 0);
    } catch {
      setSkills([]);
    }
    setLoading(false);
  }, [search, category, sort, page]);

  useEffect(() => {
    loadSkills();
  }, [loadSkills]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Skills Browser</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Browse, search, and discover {total} skills from all sources
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search skills..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
        />
        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
        >
          {CATEGORIES.map(c => (
            <option key={c} value={c}>{c === 'all' ? 'All Categories' : c.charAt(0).toUpperCase() + c.slice(1)}</option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
        >
          <option value="name">Name (A-Z)</option>
          <option value="score">Lint Score</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      {/* Skills Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading skills...</div>
      ) : skills.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">&#x1F50D;</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No skills found</h3>
          <p className="text-sm text-gray-500">
            {total === 0
              ? 'No skills synced yet. Go to Dashboard and click "Sync Skills" to import from your .agents/skills directory.'
              : 'Try adjusting your search or filters.'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((skill) => (
              <SkillCard key={skill.id} {...skill} />
            ))}
          </div>

          {/* Pagination */}
          {total > 20 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-700 disabled:opacity-30"
              >
                Previous
              </button>
              <span className="px-3 py-1.5 text-sm text-gray-500">
                Page {page} of {Math.ceil(total / 20)}
              </span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= Math.ceil(total / 20)}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-700 disabled:opacity-30"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
