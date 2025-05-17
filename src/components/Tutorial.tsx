'use client';

import { useState } from 'react';
import { Brain, Plus, BookOpen, BarChart3, X } from 'lucide-react';

const steps = [
  {
    title: 'Welcome to BrainBoost!',
    description: 'Let\'s get you started with your learning journey.',
    icon: Brain,
  },
  {
    title: 'Create Your First Deck',
    description: 'Click the "Create Deck" button to start making your first set of flashcards.',
    icon: Plus,
  },
  {
    title: 'Review Your Cards',
    description: 'Use our spaced repetition system to review your cards at the optimal time for maximum retention.',
    icon: BookOpen,
  },
  {
    title: 'Track Your Progress',
    description: 'Monitor your learning progress with detailed statistics and insights.',
    icon: BarChart3,
  },
];

interface TutorialProps {
  onComplete: () => void;
}

export default function Tutorial({ onComplete }: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsVisible(false);
      onComplete();
    }
  };

  const handleSkip = () => {
    setIsVisible(false);
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 relative">
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-full">
              <Icon className="w-8 h-8 text-primary-500" />
            </div>
          </div>
          <h3 className="text-xl font-semibold">{currentStepData.title}</h3>
          <p className="text-gray-600 dark:text-gray-400">{currentStepData.description}</p>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <div className="flex gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentStep ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
          <button
            onClick={handleNext}
            className="btn btn-primary"
          >
            {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
} 