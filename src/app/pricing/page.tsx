'use client';

import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
  const router = useRouter();

  const tiers = [
    {
      name: 'Free',
      price: '$0',
      description: 'Perfect for getting started',
      features: [
        'Up to 5 decks',
        'Basic spaced repetition',
        'Community deck access',
        'Basic statistics',
      ],
      cta: 'Get Started',
      popular: false,
    },
    {
      name: 'Pro',
      price: '$9.99',
      period: '/month',
      description: 'For serious learners',
      features: [
        'Unlimited decks',
        'Advanced spaced repetition',
        'Priority deck access',
        'Detailed statistics',
        'Custom study schedules',
        'Export/Import decks',
        'Priority support',
      ],
      cta: 'Upgrade to Pro',
      popular: true,
    },
    {
      name: 'Team',
      price: '$29.99',
      period: '/month',
      description: 'For study groups and classes',
      features: [
        'Everything in Pro',
        'Team collaboration',
        'Shared decks',
        'Progress tracking',
        'Admin dashboard',
        'Custom branding',
        'Dedicated support',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Choose the plan that best fits your learning needs. All plans include a 14-day free trial.
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-2xl bg-white dark:bg-gray-800 shadow-lg ${
                tier.popular ? 'ring-2 ring-indigo-500' : ''
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-3 py-1 text-sm font-medium text-white text-center">
                  Most Popular
                </div>
              )}
              <div className="p-8">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {tier.name}
                </h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-5xl font-bold text-gray-900 dark:text-white">
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span className="ml-1 text-xl text-gray-500 dark:text-gray-400">
                      {tier.period}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  {tier.description}
                </p>
                <ul className="mt-8 space-y-4">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-6 w-6 text-green-500" />
                      </div>
                      <p className="ml-3 text-gray-600 dark:text-gray-400">
                        {feature}
                      </p>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => router.push('/signup')}
                  className={`mt-8 w-full rounded-xl px-4 py-3 text-center text-sm font-semibold text-white transition-colors ${
                    tier.popular
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600'
                      : 'bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600'
                  }`}
                >
                  {tier.cta}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Need a custom plan?
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Contact us for enterprise solutions and custom pricing.
          </p>
          <button
            onClick={() => router.push('/contact')}
            className="mt-6 inline-flex items-center rounded-xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-600"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Contact Sales
          </button>
        </motion.div>
      </div>
    </div>
  );
} 