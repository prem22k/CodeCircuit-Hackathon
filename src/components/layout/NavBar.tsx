'use client';

import { Brain } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export function NavBar() {
  const { user, signOut } = useAuth();

  return (
    <nav className="border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <Brain className="h-8 w-8 text-primary-500" />
              <span className="ml-2 text-xl font-bold">BrainBoost</span>
            </Link>
            {user && (
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
            )}
          </div>
          <div className="flex items-center">
            {user ? (
              <button
                onClick={() => signOut()}
                className="btn btn-primary"
              >
                Sign Out
              </button>
            ) : (
              <Link
                href="/login"
                className="btn btn-primary"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 