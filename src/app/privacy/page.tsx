'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function PrivacyPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8"
    >
      <motion.h1
        variants={itemVariants}
        className="text-4xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent"
      >
        Privacy Policy
      </motion.h1>

      <motion.section variants={itemVariants} className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">1. Introduction</h2>
        <p>
          Your privacy is important to us. This Privacy Policy explains how BrainBoost collects, uses, discloses, and safeguards your information when you use our Service.
        </p>
        <p>
          Please read this policy carefully to understand our policies and practices regarding your information and how we will treat it.
        </p>
      </motion.section>

      <motion.section variants={itemVariants} className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">2. Information We Collect</h2>
        <p>
          We collect information that you provide directly to us when you use the Service, such as when you create an account, create or study flashcards, or contact us.
        </p>
        <ul className="list-disc list-inside space-y-2">
            <li>Account information (e.g., email address, name)</li>
            <li>Flashcard content (front and back of cards)</li>
            <li>Study data (e.g., review history, performance metrics)</li>
            <li>Communication data (e.g., emails sent to support)</li>
        </ul>
        <p>
          We may also collect some information automatically, such as usage data and technical information about your device.
        </p>
      </motion.section>

       <motion.section variants={itemVariants} className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">3. How We Use Your Information</h2>
        <p>
          We use the information we collect to provide, maintain, and improve the Service, including to:
        </p>
         <ul className="list-disc list-inside space-y-2">
            <li>Operate and deliver the Service to you.</li>
            <li>Personalize your learning experience.</li>
            <li>Analyze usage and trends to improve the Service.</li>
            <li>Communicate with you about the Service.</li>
        </ul>
      </motion.section>

       <motion.section variants={itemVariants} className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">4. Information Sharing and Disclosure</h2>
        <p>
          We do not sell your personal information to third parties. We may share your information in limited circumstances, such as:
        </p>
        <ul className="list-disc list-inside space-y-2">
            <li>With your consent.</li>
            <li>To comply with legal obligations.</li>
            <li>To protect our rights and property.</li>
            <li>With service providers who help us operate the Service (they are contractually obligated to keep your information confidential).</li>
        </ul>
      </motion.section>

      <motion.section variants={itemVariants} className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">5. Data Security</h2>
        <p>
          We implement reasonable measures to protect your information from unauthorized access, use, or disclosure. However, no internet transmission is entirely secure, and we cannot guarantee the absolute security of your data.
        </p>
      </motion.section>

       <motion.section variants={itemVariants} className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">6. Your Rights</h2>
        <p>
          Depending on your location, you may have certain rights regarding your personal information, such as the right to access, correct, or delete your data.
        </p>
      </motion.section>

       <motion.section variants={itemVariants} className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">7. Children's Privacy</h2>
        <p>
          Our Service is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13.
        </p>
      </motion.section>

       <motion.section variants={itemVariants} className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">8. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.
        </p>
      </motion.section>

       <motion.section variants={itemVariants} className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">9. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at [Your Contact Email].
        </p>
      </motion.section>

    </motion.div>
  );
} 