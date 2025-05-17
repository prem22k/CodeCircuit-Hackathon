'use client';

import { useRouter } from 'next/navigation';
import { Brain, BookOpen, Zap, Sparkles, ArrowRight, ChevronRight, Plus, FileText, Clock, BarChart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="space-y-6 text-center lg:text-left"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.5, delay: 0.2 }}
                 className="inline-flex items-center px-4 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium"
              >
                <Brain className="w-5 h-5 mr-2" />
                <span>Smart Learning Platform</span>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-black to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent"
              >
                Learn Smarter with{' '}
                <span className="relative">
                  BrainBoost
                  <motion.span
                    className="absolute -bottom-2 left-0 w-full h-1 bg-black dark:bg-white"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, delay: 1.0 }}
                  />
                </span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl lg:max-w-none mx-auto lg:mx-0"
              >
                Create AI-powered flashcards, study efficiently, and master any subject with our smart learning platform.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                {user ? (
                  <Link
                    href="/decks"
                    className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-semibold shadow-md hover:shadow-lg transition-shadow flex items-center justify-center group"
                  >
                    My Decks
                    <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-semibold shadow-md hover:shadow-lg transition-shadow flex items-center justify-center group"
                  >
                    Get Started
                    <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="px-8 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-center group"
                >
                  View Dashboard
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative flex justify-center lg:justify-end"
            >
              <div className="relative aspect-square max-w-sm lg:max-w-lg w-full">
                <Image
                  src="/studying.svg"
                  alt="Student studying illustration"
                  fill
                  className="object-contain drop-shadow-lg"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Everything you need to learn efficiently and effectively
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <motion.div 
            className="card hover:shadow-xl transition-all duration-300 text-center p-8 relative overflow-hidden group"
            variants={fadeInUp}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-primary-100 dark:bg-primary-900 rounded-xl">
                  <BookOpen className="w-12 h-12 text-primary-500" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Flashcards</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Create and organize flashcards with ease. Our AI helps you create effective study materials.
              </p>
            </div>
          </motion.div>

          <motion.div 
            className="card hover:shadow-xl transition-all duration-300 text-center p-8 relative overflow-hidden group"
            variants={fadeInUp}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-primary-100 dark:bg-primary-900 rounded-xl">
                  <Zap className="w-12 h-12 text-primary-500" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Spaced Repetition</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Learn efficiently with our smart review system that adapts to your learning pace.
              </p>
            </div>
          </motion.div>

          <motion.div 
            className="card hover:shadow-xl transition-all duration-300 text-center p-8 relative overflow-hidden group"
            variants={fadeInUp}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-primary-100 dark:bg-primary-900 rounded-xl">
                  <Sparkles className="w-12 h-12 text-primary-500" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">AI-Powered Learning</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get personalized study recommendations and insights to optimize your learning.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* How It Works Section */}
      <div className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Get started in minutes and begin your learning journey
            </p>
          </motion.div>

          <div className="relative">
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-primary-200 dark:bg-primary-800 -translate-y-1/2" />
            
            <div className="grid lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Plus,
                  title: 'Create Decks',
                  description: 'Create custom flashcard decks for any subject'
                },
                {
                  icon: FileText,
                  title: 'Add Cards',
                  description: 'Add flashcards with questions and answers'
                },
                {
                  icon: Clock,
                  title: 'Review',
                  description: 'Review cards with our smart spaced repetition system'
                },
                {
                  icon: BarChart,
                  title: 'Track Progress',
                  description: 'Monitor your learning progress and get insights'
                }
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="relative z-10 bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-lg">
                    <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-6">
                      <item.icon className="w-8 h-8 text-primary-500" />
                    </div>
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">
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
        className="relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Boost Your Learning?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of students who are learning smarter with BrainBoost.
          </p>
          <motion.button
            onClick={() => router.push(user ? '/decks' : '/login')}
            className="btn btn-primary btn-lg group bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {user ? 'Go to My Decks' : 'Get Started for Free'}
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
} 