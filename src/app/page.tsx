'use client';

import { useRouter } from 'next/navigation';
import { Brain, BookOpen, Zap, Sparkles, ArrowRight, ChevronRight, Plus, FileText, Clock, BarChart, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export default function HomePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { theme } = useTheme();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const cardVariants = {
     hidden: { opacity: 0, scale: 0.9 },
     visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
  }

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
            <LoadingSpinner className="w-16 h-16 text-indigo-500 dark:text-indigo-400" />
            <p className="mt-4 text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-24 pb-16">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-white via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              className="space-y-8 text-center lg:text-left"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                 variants={itemVariants}
                 className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300 text-sm font-semibold border border-indigo-200 dark:border-indigo-700"
              >
                <Brain className="w-5 h-5 mr-2" />
                <span>Elevate Your Learning</span>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white"
              >
                Master Anything with{' '}
                <span className="relative bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                  BrainBoost AI
                  <motion.span
                    className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-400"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, delay: 1.5 }}
                  />
                </span>
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl lg:max-w-none mx-auto lg:mx-0 leading-relaxed"
              >
                Leverage the power of AI to create personalized flashcards, optimize your study sessions, and achieve your learning goals faster.
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                {user ? (
                  <Link
                    href="/decks"
                    className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                  >
                    My Decks
                    <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                  >
                    Get Started for Free
                    <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="px-8 py-4 border border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 rounded-lg font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors flex items-center justify-center group focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                >
                  View Dashboard
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="relative flex justify-center lg:justify-end"
            >
              <div className="relative aspect-square max-w-sm lg:max-w-lg w-full drop-shadow-2xl">
                <Image
                  src={theme === 'dark' ? '/dark.png' : '/light.png'}
                  alt="Student studying illustration"
                  fill
                  className="object-contain transition-opacity duration-300"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="text-center mb-16">
          <motion.h2
             variants={itemVariants}
             className="text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent"
          >
            Powerful Features at Your Fingertips
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed"
          >
            Everything you need to create, study, and master your subjects efficiently.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            className="card hover:shadow-xl transition-all duration-300 text-center p-8 relative overflow-hidden group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
            variants={cardVariants}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center shadow-inner dark:shadow-none">
                  <BookOpen className="w-10 h-10 text-indigo-700 dark:text-indigo-300" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Smart Flashcard Creation</h3>
              <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
                Easily create detailed flashcards with rich text and media. Let AI assist you in generating cards from notes.
              </p>
            </div>
          </motion.div>

          <motion.div
            className="card hover:shadow-xl transition-all duration-300 text-center p-8 relative overflow-hidden group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
            variants={cardVariants}
          >
             <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="flex justify-center mb-6">
                 <div className="p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center shadow-inner dark:shadow-none">
                  <Zap className="w-10 h-10 text-indigo-700 dark:text-indigo-300" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Intelligent Study Modes</h3>
              <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
                Utilize spaced repetition and other science-backed methods tailored to your learning progress.
              </p>
            </div>
          </motion.div>

          <motion.div
            className="card hover:shadow-xl transition-all duration-300 text-center p-8 relative overflow-hidden group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
            variants={cardVariants}
          >
             <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="flex justify-center mb-6">
                 <div className="p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center shadow-inner dark:shadow-none">
                  <Sparkles className="w-10 h-10 text-indigo-700 dark:text-indigo-300" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Performance Analytics</h3>
              <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
                Track your mastery, review streaks, and identify areas for improvement with detailed insights.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* How It Works Section */}
      <div className="py-20 px-4 bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-16"
          >
            <motion.h2
               variants={itemVariants}
               className="text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent"
            >
              Your Path to Mastery
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed"
            >
              It's simple to start learning with BrainBoost in just a few steps.
            </motion.p>
          </motion.div>

          <div className="relative">
            {/* Gradient Line */}
            <div className="hidden lg:block absolute top-[68px] left-0 right-0 h-1 bg-gradient-to-r from-indigo-400 to-purple-400 dark:from-indigo-600 dark:to-purple-600" />

            <div className="grid lg:grid-cols-4 gap-12">
              {[{
                  icon: Plus,
                  title: 'Create Your First Deck',
                  description: 'Start by organizing your learning material into custom flashcard decks.'
                },
                {
                  icon: FileText,
                  title: 'Add & Generate Cards',
                  description: 'Fill your decks with cards manually or let our AI help generate them from text.'
                },
                {
                  icon: Clock,
                  title: 'Study & Review Daily',
                  description: 'Engage with smart study modes that adapt to your progress and reinforce memory.'
                },
                {
                  icon: CheckCircle,
                  title: 'Achieve Mastery',
                  description: 'Track your performance, celebrate milestones, and conquer your learning goals.'
                }
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  className="relative"
                  variants={itemVariants}
                >
                  {/* Circle Icon */}
                  <div className="hidden lg:flex absolute top-12 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 ring-4 ring-white dark:ring-gray-900 items-center justify-center">
                     <span className="text-white font-bold text-lg">{index + 1}</span>
                  </div>

                  <div className="relative z-10 bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-lg border border-gray-200 dark:border-gray-700 space-y-4 mt-8 lg:mt-0">
                    <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto shadow-inner dark:shadow-none">
                      <item.icon className="w-8 h-8 text-indigo-700 dark:text-indigo-300" />
                    </div>
                    <h3 className="font-semibold text-xl text-gray-900 dark:text-white">{item.title}</h3>
                    <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <motion.div
        className="relative overflow-hidden bg-gradient-to-br from-white via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
           <motion.h2
              variants={itemVariants}
              className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent"
            >
              Ready to Transform Your Study Habits?
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-xl text-gray-700 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Join the BrainBoost community today and experience a smarter way to learn.
            </motion.p>
          <motion.button
            variants={itemVariants}
            onClick={() => router.push(user ? '/decks' : '/login')}
            className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group mx-auto focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {user ? 'Go to My Decks' : 'Start Your Free Trial'}
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
} 