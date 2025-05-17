'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, HelpCircle, FileText, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function SupportPage() {
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

   const cardVariants = {
     hidden: { opacity: 0, scale: 0.9 },
     visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-10"
    >
      <motion.h1
        variants={itemVariants}
        className="text-4xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent"
      >
        Support & Help
      </motion.h1>

      <motion.p
        variants={itemVariants}
        className="text-xl text-gray-700 dark:text-gray-300 text-center leading-relaxed"
      >
        Find answers to common questions or get in touch with our support team.
      </motion.p>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
           variants={cardVariants}
           className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center space-y-4 border border-gray-200 dark:border-gray-700"
        >
           <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-full inline-flex items-center justify-center shadow-inner dark:shadow-none"
           >
             <HelpCircle className="w-10 h-10 text-indigo-700 dark:text-indigo-300" />
           </motion.div>
           <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Frequently Asked Questions</h3>
           <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
             Browse our FAQ section for quick answers to common inquiries about using BrainBoost.
           </p>
           {/* Replace # with your actual FAQ page link */}
           <Link href="#"
             className="inline-flex items-center font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
           >
             Go to FAQ
             <ArrowRight className="w-4 h-4 ml-1" />
           </Link>
        </motion.div>

         <motion.div
           variants={cardVariants}
           className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center space-y-4 border border-gray-200 dark:border-gray-700"
        >
           <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full inline-flex items-center justify-center shadow-inner dark:shadow-none"
           >
             <Mail className="w-10 h-10 text-green-700 dark:text-green-300" />
           </motion.div>
           <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Contact Support</h3>
           <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
             Can't find what you're looking for? Send us a message directly.
           </p>
           {/* Replace mailto:email@example.com with your support email or contact form link */}
           <Link href="mailto:support@brainboost.com"
             className="inline-flex items-center font-semibold text-green-600 dark:text-green-400 hover:underline"
           >
             Email Us
             <ArrowRight className="w-4 h-4 ml-1" />
           </Link>
        </motion.div>
      </div>

      {/* Optional: Add more sections like community forums, guides, etc. */}
       <motion.div variants={itemVariants} className="text-center text-gray-600 dark:text-gray-400 text-sm pt-8">
         <p>Need more help? Explore our <Link href="#" className="underline hover:no-underline text-indigo-600 dark:text-indigo-400">Guides</Link>.</p>
       </motion.div>

    </motion.div>
  );
} 