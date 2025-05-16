'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

const Login = () => {
  const router = useRouter();
  const { user, loading, signInWithGoogle } = useAuth();

  useEffect(() => {
    if (user && !loading) {
      router.push('/decks');
    }
  }, [user, loading, router]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      // Toast is now handled in AuthContext
    } catch (error) {
      console.error('Login error:', error);
      // Toast is now handled in AuthContext
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <div className="text-center space-y-6 max-w-md mx-auto p-6">
        <h1 className="text-4xl font-bold mb-2">Welcome to BrainBoost</h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
          Sign in to sync your flashcards across devices and never lose your progress.
        </p>
        
        <button
          onClick={handleGoogleSignIn}
          className="w-full btn bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 
                   flex items-center justify-center gap-3 py-3 transition-colors
                   dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white dark:border-gray-600"
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-8">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default Login; 