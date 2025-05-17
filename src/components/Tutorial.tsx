'use client';

import { useState } from 'react';
import { X, ArrowRight, Brain, BookOpen, Plus, Target, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TutorialProps {
  onComplete: () => void;
}

const steps = [
  {
    title: 'Welcome to BrainBoost! 🎉',
    description: 'Your personal AI-powered flashcard learning companion. Let\'s explore how to make the most of your learning journey.',
    icon: Brain,
    color: 'from-purple-500 to-blue-500',
  },
  {
    title: 'Create Your First Deck',
    description: 'Start by creating a deck of flashcards for any subject you want to learn. Organize your knowledge into focused collections.',
    icon: BookOpen,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Add Smart Flashcards',
    description: 'Add questions and answers to your deck. Our AI helps you create effective cards that maximize learning retention.',
    icon: Plus,
    color: 'from-cyan-500 to-teal-500',
  },
  {
    title: 'Review with Spaced Repetition',
    description: 'Use our smart review system to learn efficiently. Cards will be shown at the perfect time for maximum retention.',
    icon: Target,
    color: 'from-teal-500 to-emerald-500',
  },
  {
    title: 'Track Your Progress',
    description: 'Monitor your learning progress with detailed analytics and insights. Watch your knowledge grow over time.',
    icon: Activity,
    color: 'from-emerald-500 to-green-500',
  },
];

export default function Tutorial({ onComplete }: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-lg w-full mx-4 relative shadow-2xl"
      >
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleSkip}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          <X className="w-6 h-6" />
        </motion.button>

        <div className="space-y-6">
          {/* Icon and Progress */}
          <div className="flex flex-col items-center space-y-4">
            <motion.div
              key={currentStep}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`p-4 rounded-2xl bg-gradient-to-r ${currentStepData.color} shadow-lg`}
            >
              <Icon className="w-8 h-8 text-white" />
            </motion.div>
            
            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.8 }}
                  animate={{ 
                    scale: index === currentStep ? 1.2 : 1,
                    backgroundColor: index === currentStep ? '#000' : '#e5e7eb'
                  }}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep
                      ? 'bg-black dark:bg-white'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-4"
            >
              <h3 className="text-2xl font-bold bg-gradient-to-r from-black to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                {currentStepData.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                {currentStepData.description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSkip}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-medium"
            >
              Skip Tutorial
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 shadow-lg hover:shadow-xl transition-shadow"
            >
              <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Next'}</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 