'use client';

import Link from 'next/link';
import { Brain, Zap, BarChart3, Share2, ArrowRight } from 'lucide-react';

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => {
  return (
    <div className="card hover:shadow-xl transition-shadow p-6 rounded-xl bg-white dark:bg-gray-800">
      <div className="space-y-4">
        <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-lg w-fit">
          {icon}
        </div>
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </div>
    </div>
  );
};

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-900/10 -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Master Any Subject with
              <span className="text-primary-500 block mt-2">Smart Flashcards</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Boost your learning with our scientifically-proven spaced repetition system.
              Remember more, study less.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/login" 
                className="btn btn-primary text-lg px-8 py-4 flex items-center justify-center gap-2 group"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#features"
                className="btn bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 text-lg px-8 py-4"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">Why Choose BrainBoost?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Brain className="w-8 h-8 text-primary-500" />}
              title="Smart Learning"
              description="Our spaced repetition algorithm adapts to your learning pace, showing cards at the perfect time for maximum retention."
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8 text-primary-500" />}
              title="Quick & Easy"
              description="Create flashcard decks in seconds. Review them anywhere, anytime. Perfect for busy learners."
            />
            <FeatureCard
              icon={<BarChart3 className="w-8 h-8 text-primary-500" />}
              title="Track Progress"
              description="Visualize your learning journey with detailed statistics and progress tracking."
            />
          </div>
        </div>
      </section>
    </div>
  );
} 