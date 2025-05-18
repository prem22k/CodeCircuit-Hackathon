'use client';

import { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';

interface TutorialProps {
  onComplete: () => void;
}

const steps = [
  {
    title: 'Welcome to BrainBoost!',
    description: 'Let\'s take a quick tour of how to use the app effectively.',
  },
  {
    title: 'Create Your First Deck',
    description: 'Start by creating a deck of flashcards for any subject you want to learn.',
  },
  {
    title: 'Add Flashcards',
    description: 'Add questions and answers to your deck. You can add as many cards as you need.',
  },
  {
    title: 'Review Your Cards',
    description: 'Use our smart review system to learn efficiently. Cards will be shown at the perfect time for maximum retention.',
  },
  {
    title: 'Track Your Progress',
    description: 'Monitor your learning progress and get insights to optimize your study sessions.',
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg p-6 max-w-md w-full mx-4 relative shadow-lg">
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground">{steps[currentStep].title}</h3>
          <p className="text-muted-foreground">
            {steps[currentStep].description}
          </p>

          <div className="flex justify-between items-center pt-4">
            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${index === currentStep
                    ? 'bg-primary'
                    : 'bg-muted'
                    }`}
                />
              ))}
            </div>
            <button
              onClick={handleNext}
              className="btn btn-primary flex items-center gap-2"
            >
              {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 