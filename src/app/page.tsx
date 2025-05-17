'use client';

import { useRouter } from 'next/navigation';
import { Brain, BookOpen, Zap, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-8 py-16">
        <div className="flex justify-center">
          <Brain className="w-16 h-16 text-primary-500" />
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
          Learn Smarter with{' '}
          <span className="text-primary-500">BrainBoost</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Create AI-powered flashcards, study efficiently, and master any subject with our smart learning platform.
        </p>
        <div className="flex justify-center gap-4">
          {user ? (
            <button
              onClick={() => router.push('/decks')}
              className="btn btn-primary btn-lg"
            >
              My Decks
            </button>
          ) : (
            <button
              onClick={() => router.push('/login')}
              className="btn btn-primary btn-lg"
            >
              Get Started
            </button>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 py-16">
        <div className="card text-center p-6">
          <div className="flex justify-center mb-4">
            <BookOpen className="w-12 h-12 text-primary-500" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Smart Flashcards</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Create and organize flashcards with ease. Our AI helps you create effective study materials.
          </p>
        </div>
        <div className="card text-center p-6">
          <div className="flex justify-center mb-4">
            <Zap className="w-12 h-12 text-primary-500" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Spaced Repetition</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Learn efficiently with our smart review system that adapts to your learning pace.
          </p>
        </div>
        <div className="card text-center p-6">
          <div className="flex justify-center mb-4">
            <Sparkles className="w-12 h-12 text-primary-500" />
          </div>
          <h3 className="text-xl font-semibold mb-2">AI-Powered Learning</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Get personalized study recommendations and insights to optimize your learning.
          </p>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-500 font-bold">1</span>
            </div>
            <h3 className="font-semibold mb-2">Create Decks</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Create custom flashcard decks for any subject
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-500 font-bold">2</span>
            </div>
            <h3 className="font-semibold mb-2">Add Cards</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Add flashcards with questions and answers
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-500 font-bold">3</span>
            </div>
            <h3 className="font-semibold mb-2">Review</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Review cards with our smart spaced repetition system
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-500 font-bold">4</span>
            </div>
            <h3 className="font-semibold mb-2">Track Progress</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Monitor your learning progress and get insights
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center py-16">
        <h2 className="text-3xl font-bold mb-4">Ready to Boost Your Learning?</h2>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Join thousands of students who are learning smarter with BrainBoost.
        </p>
        <button
          onClick={() => router.push(user ? '/decks' : '/login')}
          className="btn btn-primary btn-lg"
        >
          {user ? 'Go to My Decks' : 'Get Started for Free'}
        </button>
      </div>
    </div>
  );
} 