'use client';

import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/components/common/Toast';
import { DashboardHeader } from '@/components/layout/DashboardHeader';

const inter = Inter({ subsets: ['latin'] });

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={inter.className}>
      <AuthProvider>
        <ToastProvider>
          <div className="min-h-screen flex flex-col">
            <DashboardHeader />
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
    </div>
  );
} 