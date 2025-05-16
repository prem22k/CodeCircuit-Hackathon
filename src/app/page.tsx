'use client';

import Link from 'next/link';
import { Brain, Zap, BarChart3, Share2 } from 'lucide-react';

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => {
  return (
    <div className="card hover:shadow-xl transition-shadow">
      <div className="space-y-4">
        {icon}
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </div>
    </div>
  );
};

export default function HomePage() {
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="text-center space-y-8 py-12">
        <h1 className="text-4xl md:text-6xl font-bold">
          Master Any Subject with
          <span className="text-primary-500"> Smart Flashcards</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Boost your learning with our scientifically-proven spaced repetition system.
          Remember more, study less.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/decks" className="btn btn-primary">
            Get Started
          </Link>
          <a
            href="#features"
            className="btn bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
          >
            Learn More
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose BrainBoost?</h2>
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
      </section>
    </div>
  );
} 