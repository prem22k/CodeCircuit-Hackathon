import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Brain } from 'lucide-react';
import Link from 'next/link';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/components/common/Toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BrainBoost - Smart Flashcards',
  description: 'Learn smarter with AI-powered flashcards',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ToastProvider>
            <div className="min-h-screen flex flex-col">
              <nav className="border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between h-16">
                    <div className="flex">
                      <Link href="/" className="flex items-center">
                        <Brain className="h-8 w-8 text-primary-500" />
                        <span className="ml-2 text-xl font-bold">BrainBoost</span>
                      </Link>
                      <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                        <Link
                          href="/decks"
                          className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          My Decks
                        </Link>
                        <Link
                          href="/review"
                          className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                        >
                          Review
                        </Link>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Link
                        href="/login"
                        className="btn btn-primary"
                      >
                        Sign In
                      </Link>
                    </div>
                  </div>
                </div>
              </nav>

              <main className="flex-grow">
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                  {children}
                </div>
              </main>

              <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Built with ❤️ for CodeCircuit Hackathon
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      © 2024 BrainBoost. All rights reserved.
                    </div>
                  </div>
                </div>
              </footer>
            </div>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
} 