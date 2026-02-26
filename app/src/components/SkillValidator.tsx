'use client';

import { useState } from 'react';

interface ValidationResult {
  valid: boolean;
  score: number;
  errors: { rule: string; message: string }[];
  warnings: { rule: string; message: string; suggestion?: string }[];
}

export default function SkillValidator() {
  const [content, setContent] = useState(SAMPLE_SKILL);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function validate() {
    setLoading(true);
    try {
      const res = await fetch('/api/skills/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult(null);
    }
    setLoading(false);
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">SKILL.md Validator</h3>
        <p className="text-sm text-gray-500">Paste your SKILL.md content below to validate against the spec</p>
      </div>
      <div className="p-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-64 p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-mono text-gray-900 dark:text-gray-100 resize-y"
          placeholder="Paste your SKILL.md content here..."
        />
        <button
          onClick={validate}
          disabled={loading || !content.trim()}
          className="mt-3 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Validating...' : 'Validate Skill'}
        </button>

        {result && (
          <div className="mt-4 space-y-3">
            <div className={`p-4 rounded-lg ${result.valid ? 'bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800'}`}>
              <div className="flex items-center justify-between">
                <span className={`text-sm font-semibold ${result.valid ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                  {result.valid ? 'Valid SKILL.md' : 'Invalid SKILL.md'}
                </span>
                <span className={`score-badge ${result.score >= 80 ? 'score-high' : result.score >= 50 ? 'score-medium' : 'score-low'}`}>
                  Score: {result.score}/100
                </span>
              </div>
            </div>

            {result.errors.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-red-700 dark:text-red-400 mb-2">Errors ({result.errors.length})</h4>
                {result.errors.map((e, i) => (
                  <div key={i} className="p-2 mb-1 rounded bg-red-50 dark:bg-red-950/50 text-sm">
                    <span className="font-mono text-red-600 dark:text-red-400 mr-2">[{e.rule}]</span>
                    <span className="text-gray-700 dark:text-gray-300">{e.message}</span>
                  </div>
                ))}
              </div>
            )}

            {result.warnings.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-yellow-700 dark:text-yellow-400 mb-2">Warnings ({result.warnings.length})</h4>
                {result.warnings.map((w, i) => (
                  <div key={i} className="p-2 mb-1 rounded bg-yellow-50 dark:bg-yellow-950/50 text-sm">
                    <span className="font-mono text-yellow-600 dark:text-yellow-400 mr-2">[{w.rule}]</span>
                    <span className="text-gray-700 dark:text-gray-300">{w.message}</span>
                    {w.suggestion && <div className="text-xs text-gray-500 mt-1">Suggestion: <code>{w.suggestion}</code></div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const SAMPLE_SKILL = `---
name: example-skill
description: "A sample skill that demonstrates the SKILL.md format"
tags:
  - example
  - demo
license: MIT
version: "1.0.0"
---

## When to Use

Use this skill when you need to demonstrate the Skills.md format.

## Instructions

1. Read the frontmatter metadata
2. Follow the steps in this body
3. Return the result to the user

## Notes

This is a valid SKILL.md file following the open standard.
`;
