import type { Metadata } from 'next';
import './globals.css';
import NeonAuthProvider from '@/components/NeonAuthProvider';
import NavBar from '@/components/NavBar';

export const metadata: Metadata = {
  title: 'skillsdotmd — The Skills.md Platform',
  description: 'Aggregate, validate, test, and learn AI agent skills from every source. The unified Skills.md ecosystem.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <NeonAuthProvider>
          <NavBar />
          <main>{children}</main>
          <footer className="border-t border-gray-200 dark:border-gray-800 mt-16 py-8">
            <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
              skillsdotmd — Built on the Skills.md open standard. Powered by Skills.sh ecosystem.
            </div>
          </footer>
        </NeonAuthProvider>
      </body>
    </html>
  );
}
