'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function TermsPage() {
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
        Terms of Service
      </motion.h1>

      <motion.section variants={itemVariants} className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">1. Introduction</h2>
        <p>
          Welcome to BrainBoost! These Terms of Service (the "Terms") govern your use of the BrainBoost website, mobile applications, and services (collectively, the "Service"). By accessing or using the Service, you agree to be bound by these Terms.
        </p>
        <p>
          If you do not agree to these Terms, please do not use the Service.
        </p>
      </motion.section>

      <motion.section variants={itemVariants} className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">2. Acceptance of Terms</h2>
        <p>
          By creating an account or using the Service, you affirm that you are of legal age to enter into these Terms, or if you are not, that you have obtained parental or guardian consent to enter into these Terms.
        </p>
      </motion.section>

       <motion.section variants={itemVariants} className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">3. Changes to Terms</h2>
        <p>
          We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on this page. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.
        </p>
      </motion.section>

       <motion.section variants={itemVariants} className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">4. User Accounts</h2>
        <p>
          You may need to create an account to access certain features of the Service. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
        </p>
        <p>
          You agree to provide accurate and complete information when creating your account and to update your information promptly if it changes.
        </p>
      </motion.section>

      <motion.section variants={itemVariants} className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">5. Content and Use of Service</h2>
        <p>
          You are responsible for all content you create, upload, or submit to the Service. You agree not to use the Service for any unlawful or prohibited purpose.
        </p>
        <p>
          You agree not to: 
        </p>
        <ul className="list-disc list-inside space-y-2">
            <li>Upload content that is illegal, harmful, or infringing.</li>
            <li>Attempt to gain unauthorized access to the Service or its systems.</li>
            <li>Interfere with the operation of the Service.</li>
        </ul>
      </motion.section>

       <motion.section variants={itemVariants} className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">6. Intellectual Property</h2>
        <p>
          The Service and its original content, features, and functionality are owned by BrainBoost and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
        </p>
      </motion.section>

       <motion.section variants={itemVariants} className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">7. Termination</h2>
        <p>
          We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms.
        </p>
      </motion.section>

       <motion.section variants={itemVariants} className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">8. Disclaimer of Warranties</h2>
        <p>
          The Service is provided on an "AS IS" and "AS AVAILABLE" basis. BrainBoost makes no warranties, expressed or implied, regarding the operation of the Service or the information, content, or materials included therein.
        </p>
      </motion.section>

       <motion.section variants={itemVariants} className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">9. Limitation of Liability</h2>
        <p>
          In no event shall BrainBoost, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage.
        </p>
      </motion.section>

       <motion.section variants={itemVariants} className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">10. Governing Law</h2>
        <p>
          These Terms shall be governed and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.
        </p>
      </motion.section>

       <motion.section variants={itemVariants} className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">11. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at [Your Contact Email].
        </p>
      </motion.section>

       <motion.section variants={itemVariants} className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">12. Effective Date</h2>
        <p>
          These Terms are effective as of [Date, e.g., October 27, 2023].
        </p>
      </motion.section>

    </motion.div>
  );
} 