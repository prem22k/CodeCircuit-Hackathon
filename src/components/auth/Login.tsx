'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

const Login = () => {
  const router = useRouter();
  const { user, loading, signInWithGoogle } = useAuth();

  useEffect(() => {
    if (user && !loading) {
      // Add a slight delay before redirecting for smoother exit animation
      const timer = setTimeout(() => {
        router.push('/decks');
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [user, loading, router]);

  const handleGoogleSignIn = async () => {
    if (loading) return; // Prevent multiple clicks while loading
    try {
      await signInWithGoogle();
      // Toast is now handled in AuthContext
    } catch (error) {
      console.error('Login error:', error);
      // Toast is now handled in AuthContext
    }
  };

  // Show a loading spinner while checking auth status or after successful login before redirect
  if (loading || user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
        <LoadingSpinner className="w-16 h-16 text-indigo-500 dark:text-indigo-400" />
        <p className="mt-4 text-lg font-medium">
          {loading ? 'Checking session...' : 'Redirecting...'}
        </p>
      </div>
    );
  }

  // Show the login form if not authenticated and not loading
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="login-page"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4"
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="text-center space-y-8 max-w-md mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700"
        >
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl font-bold text-gray-900 dark:text-white"
          >
            Welcome to <span className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">BrainBoost</span>
          </motion.h1>
          <motion.p
             initial={{ opacity: 0, y: -10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.3, duration: 0.5 }}
            className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed"
          >
            Unlock your potential by signing in to sync your flashcards across devices and never lose your progress.
          </motion.p>

          <motion.button
            onClick={handleGoogleSignIn}
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full px-6 py-3 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 rounded-xl 
                     flex items-center justify-center gap-3 transition-all duration-300 shadow-sm hover:shadow-md
                     dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Image
              src="/google-icon.svg"
              alt="Google logo"
              width={20}
              height={20}
            />
            Continue with Google
            <motion.span
               initial={{ x: -5, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               transition={{ delay: 0.5, duration: 0.3 }}
            >
               <ArrowRight className="w-5 h-5 ml-2" />
            </motion.span>
          </motion.button>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-sm text-gray-500 dark:text-gray-400 mt-8"
          >
            By signing in, you agree to our <a href="#" className="underline hover:no-underline">Terms of Service</a> and <a href="#" className="underline hover:no-underline">Privacy Policy</a>.
          </motion.p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Login;
