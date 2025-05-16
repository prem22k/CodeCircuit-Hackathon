'use client';

import Link from 'next/link';
import { Brain } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';

export function Header() {
  const { user, signInWithGoogle, signOut } = useAuthContext();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Brain className="h-6 w-6" />
          <span className="font-bold">BrainBoost</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {user ? (
            <>
              <Link href="/decks" className="transition-colors hover:text-foreground/80">
                My Decks
              </Link>
              <Link href="/explore" className="transition-colors hover:text-foreground/80">
                Explore
              </Link>
              <Link href="/stats" className="transition-colors hover:text-foreground/80">
                Stats
              </Link>
            </>
          ) : null}
        </nav>

        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <img
                src={user.photoURL || 'https://github.com/shadcn.png'}
                alt={user.displayName || 'User'}
                className="h-8 w-8 rounded-full"
              />
              <button
                onClick={() => signOut()}
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => signInWithGoogle()}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Sign In with Google
            </button>
          )}
        </div>
      </div>
    </header>
  );
} 