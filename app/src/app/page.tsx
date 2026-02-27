import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-sm font-medium mb-6">
              The Unified Skills.md Platform
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white tracking-tight">
              Every AI Agent Skill.
              <br />
              <span className="text-brand-600">One Place.</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Aggregate skills from GitHub, Skills.sh, YouTube, and the web.
              Validate, test, sort, and learn them all — with interactive quizzes,
              demo videos, and real-time collaboration.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Link
                href="/skills"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-brand-600 hover:bg-brand-700 shadow-lg shadow-brand-500/25"
              >
                Browse Skills
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Open Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Spline 3D Scene Placeholder */}
        <div className="max-w-5xl mx-auto px-4 pb-16">
          <div className="rounded-2xl bg-gradient-to-br from-brand-500/10 to-purple-500/10 border border-brand-200 dark:border-brand-800 p-1">
            <div className="rounded-xl bg-white dark:bg-gray-900 p-8 min-h-[300px] flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-3">&#x2728;</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Spline 3D Scene — Interactive skill visualization loads here
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Connect your Spline scene URL in the environment config
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-16">
          The Complete Skills.md Ecosystem
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f) => (
            <div key={f.title} className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{f.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sources */}
      <section className="bg-gray-100 dark:bg-gray-900 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
            Aggregated From Every Source
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Skills.md files from GitHub repositories, Skills.sh marketplace, Google Antigravity,
            YouTube tutorials, and the open web — automatically synced and validated.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {sources.map((s) => (
              <div key={s.name} className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center">
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className="font-semibold text-gray-900 dark:text-white">{s.name}</div>
                <div className="text-xs text-gray-500">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Ready to upgrade your AI agent skills?
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Start for free. One-click deploy to Netlify. Cross-platform.
        </p>
        <Link
          href="/pricing"
          className="inline-flex items-center px-8 py-3 text-base font-medium rounded-lg text-white bg-brand-600 hover:bg-brand-700 shadow-lg shadow-brand-500/25"
        >
          View Pricing
        </Link>
      </section>
    </div>
  );
}

const features = [
  { icon: '&#x1F50D;', title: 'Skill Discovery', description: 'Browse 12,000+ skills from Skills.sh, GitHub, and community repos. Search, filter, and sort by category, agent compatibility, and lint score.' },
  { icon: '&#x2705;', title: 'Validation & Linting', description: 'Built-in validator checks YAML frontmatter, required fields, body structure, and activation hints. Compatible with Skilo, skillc, and Tessl specs.' },
  { icon: '&#x1F9EA;', title: 'Skill Testing', description: 'Test skills against Codex CLI, Copilot, Cursor, and Claude. See execution results, pass/fail status, and agent compatibility scores.' },
  { icon: '&#x1F3AF;', title: 'Interactive Quizzes', description: 'Auto-generated quizzes from skill content. Test your understanding with multiple-choice questions, explanations, and progress tracking.' },
  { icon: '&#x1F3AC;', title: 'Demo Videos', description: 'Embedded demo videos for each skill. See skills in action before installing. Supports YouTube, MP4, and Remotion-generated clips.' },
  { icon: '&#x1F4AC;', title: 'Weavy Collaboration', description: 'Real-time chat, comments, and file sharing per skill. Discuss results, share configurations, and collaborate with your team via Weavy.' },
  { icon: '&#x1F300;', title: 'Spline 3D Editor', description: 'Interactive 3D skill visualization and prompt editor powered by Spline.design. Visual drag-and-drop YAML field editing.' },
  { icon: '&#x1F504;', title: 'Auto-Sync', description: 'Connect GitHub repos, Skills.sh feeds, and YouTube playlists. New skills are automatically discovered, validated, and indexed.' },
  { icon: '&#x1F680;', title: 'One-Click Deploy', description: 'Deploy to Netlify in one click. PWA-ready for mobile. Electron/Tauri packaging for desktop. True cross-platform.' },
];

const sources = [
  { icon: '&#x1F4BB;', name: 'GitHub', desc: 'Repos & orgs' },
  { icon: '&#x1F4E6;', name: 'Skills.sh', desc: '12K+ skills' },
  { icon: '&#x1F4FA;', name: 'YouTube', desc: 'Tutorials & demos' },
  { icon: '&#x1F310;', name: 'Open Web', desc: 'Antigravity & more' },
];
