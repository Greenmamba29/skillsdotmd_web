import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'skillsdotmd — The Skills.md Platform',
  description: 'Aggregate, validate, test, and learn AI agent skills from every source. The unified Skills.md ecosystem.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center gap-2">
                <a href="/" className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">S</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    skillsdotmd
                  </span>
                </a>
              </div>
              <div className="flex items-center gap-6">
                <a href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                  Dashboard
                </a>
                <a href="/skills" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                  Skills
                </a>
                <a href="/pricing" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                  Pricing
                </a>
                <a
                  href="/dashboard"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700"
                >
                  Get Started
                </a>
              </div>
            </div>
          </div>
        </nav>
        <main>{children}</main>
        <footer className="border-t border-gray-200 dark:border-gray-800 mt-16 py-8">
          <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
            skillsdotmd — Built on the Skills.md open standard. Powered by Skills.sh ecosystem.
          </div>
        </footer>
      </body>
    </html>
  );
}
