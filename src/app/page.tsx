'use client';

import { useRouter } from 'next/navigation';
import { Brain, BookOpen, Zap, Sparkles, ArrowRight, ChevronRight, Plus, FileText, Clock, BarChart, Star, Target, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';

export default function HomePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { theme } = useTheme();

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
        <div className="relative">
          <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full" />
          <div className="absolute inset-0 animate-ping rounded-full bg-indigo-500/20" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              className="space-y-8 text-center lg:text-left"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-700 dark:text-indigo-300 text-sm font-medium backdrop-blur-sm"
              >
                <Brain className="w-5 h-5 mr-2" />
                <span>Smart Learning Platform</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white"
              >
                Learn Smarter with{' '}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    BrainBoost
                  </span>
                  <motion.span
                    className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
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
                className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl lg:max-w-none mx-auto lg:mx-0 leading-relaxed"
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
                    className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center">
                      My Decks
                      <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center">
                      Get Started
                      <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="group relative px-8 py-4 border-2 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 rounded-xl font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-300 flex items-center justify-center"
                >
                  <span className="relative z-10 flex items-center">
                    View Dashboard
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
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
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl" />
                <Image
                  src={theme === 'dark' ? '/dark.png' : '/light.png'}
                  alt="Student studying illustration"
                  fill
                  className="object-contain drop-shadow-2xl transition-opacity duration-300"
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block mb-4"
          >
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium">
              <Star className="w-4 h-4 mr-2" />
              Powerful Features
            </span>
          </motion.div>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Everything You Need to Learn
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Powerful tools and features to help you learn efficiently and effectively
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: BookOpen,
              title: 'Smart Flashcards',
              description: 'Create and organize flashcards with ease. Our AI helps you create effective study materials.'
            },
            {
              icon: Zap,
              title: 'Spaced Repetition',
              description: 'Learn efficiently with our smart review system that adapts to your learning pace.'
            },
            {
              icon: Sparkles,
              title: 'AI-Powered Learning',
              description: 'Get personalized study recommendations and insights to optimize your learning.'
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              variants={fadeInUp}
              whileHover={{ y: -5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              <div className="relative">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white text-center">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-center">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* How It Works Section */}
      <div className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block mb-4"
            >
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium">
                <Target className="w-4 h-4 mr-2" />
                Simple Process
              </span>
            </motion.div>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Get started in minutes and begin your learning journey
            </p>
          </motion.div>

          <div className="relative">
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 dark:from-indigo-700 dark:via-purple-700 dark:to-pink-700 -translate-y-1/2" />

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
                  <div className="relative z-10 bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <item.icon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">
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
        className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block mb-4"
          >
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium">
              <Users className="w-4 h-4 mr-2" />
              Join Our Community
            </span>
          </motion.div>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Ready to Boost Your Learning?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of students who are learning smarter with BrainBoost.
          </p>
          <motion.button
            onClick={() => router.push(user ? '/decks' : '/login')}
            className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center mx-auto overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10 flex items-center">
              {user ? 'Go to My Decks' : 'Get Started for Free'}
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
} 