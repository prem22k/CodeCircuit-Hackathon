'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Removed Header to avoid duplication on pages with their own headers */}
      {/* <Header /> */}
      <main className="flex-1 container py-8">
        {children}
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Built with ❤️ for CodeCircuit Hackathon
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © 2024 BrainBoost. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
} 