'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/common/Toast';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const signupSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be at most 50 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type SignupFormData = z.infer<typeof signupSchema>;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const Signup = () => {
  const router = useRouter();
  const { user, loading, signUpWithEmail } = useAuth();
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  // Redirect if user is already logged in
  useEffect(() => {
    if (user && !loading) {
      // Add a slight delay for smoother transition
      const timer = setTimeout(() => {
        router.push('/decks');
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [user, loading, router]);

  const onSubmit = async (data: SignupFormData) => {
    if (loading) return; // Prevent multiple submissions

    try {
      await signUpWithEmail(data.email, data.password, data.displayName);
      // Toast is now handled in AuthContext
    } catch (error: any) {
      console.error('Signup error:', error);
      // Specific Firebase error handling
      if (error.code === 'auth/email-already-in-use') {
        showToast('error', 'Email address is already in use.');
      } else if (error.code === 'auth/invalid-email') {
         showToast('error', 'Invalid email address format.');
      } else if (error.code === 'auth/weak-password') {
         showToast('error', 'Password is too weak.');
      } else {
        showToast('error', 'Failed to create account. Please try again.');
      }
    }
  };

  // Show loading spinner while checking auth status or after successful signup before redirect
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

  return (
     <AnimatePresence mode="wait">
      <motion.div
        key="signup-page"
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
          className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700"
        >
          <motion.h1
             initial={{ opacity: 0, y: -20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1, duration: 0.5 }}
            className="text-3xl font-bold text-center text-gray-900 dark:text-white"
          >
            Create an Account
          </motion.h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
             <motion.div variants={itemVariants} initial="hidden" animate="visible">
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
              <input
                id="displayName"
                type="text"
                {...register('displayName')}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                placeholder="Enter your name"
                disabled={loading}
              />
              {errors.displayName && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.displayName.message}</p>}
            </motion.div>

            <motion.div variants={itemVariants} initial="hidden" animate="visible">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                placeholder="Enter your email"
                disabled={loading}
              />
               {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>}
            </motion.div>

             <motion.div variants={itemVariants} initial="hidden" animate="visible">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <div className="mt-1 relative">
                 <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                   className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500 pr-10"
                  placeholder="Enter your password"
                   disabled={loading}
                />
                 <button
                    type="button"
                   onClick={() => setShowPassword(!showPassword)}
                   className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                   aria-label={showPassword ? 'Hide password' : 'Show password'}
                 >
                   {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                 </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>}
            </motion.div>

            <motion.div variants={itemVariants} initial="hidden" animate="visible">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                 {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="mr-2"
                      >
                        <LoadingSpinner className="w-4 h-4 text-white" />
                      </motion.div>
                      Creating account...
                    </>
                 ) : (
                   'Sign up'
                 )}
              </button>
            </motion.div>
          </form>

          <motion.div variants={itemVariants} initial="hidden" animate="visible" className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
              Sign in
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Signup; 