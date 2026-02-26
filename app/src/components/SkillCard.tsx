'use client';

import Link from 'next/link';

interface SkillCardProps {
  slug: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  source: string;
  validated: boolean;
  lintScore: number;
  videoUrl?: string | null;
}

export default function SkillCard({
  slug,
  name,
  description,
  category,
  tags,
  source,
  validated,
  lintScore,
  videoUrl,
}: SkillCardProps) {
  const scoreClass = lintScore >= 80 ? 'score-high' : lintScore >= 50 ? 'score-medium' : 'score-low';

  return (
    <Link href={`/skills/${slug}`}>
      <div className="skill-card p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 cursor-pointer">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 font-medium">
              {category}
            </span>
            {validated && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                Validated
              </span>
            )}
          </div>
          <span className={`score-badge ${scoreClass}`}>{lintScore}/100</span>
        </div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">{name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            {videoUrl && <span title="Has demo video">&#x1F3AC;</span>}
            <span className="capitalize">{source}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
