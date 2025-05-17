'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Bookmark, Target, User, Settings, LogOut, Edit } from 'lucide-react';
import Image from 'next/image';

export function DashboardHeader() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

   // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (profileRef.current && !profileRef.current.contains(target)) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsProfileOpen(false);
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Helper function to get initials
  const getInitials = (name?: string | null): string => {
    if (!name) return '';
    const nameParts = name.split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    return nameParts[0].charAt(0).toUpperCase() + nameParts[nameParts.length - 1].charAt(0).toUpperCase();
  };

  const profileDropdownVariants = {
    hidden: {
      opacity: 0,
      y: 10,
      scale: 0.95,
      transition: { duration: 0.15, ease: 'easeIn' }
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.2, ease: 'easeOut' }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo and Title */}
        <Link href="/dashboard" className="flex items-center space-x-2 group">
           <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
           >
             <Brain className="w-6 h-6 text-indigo-600 dark:text-indigo-400 transition-colors" />
           </motion.div>
          <span className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-indigo-600 transition-all duration-300">BrainBoost</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 500 }}>
            <Link href="/decks" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors relative group">
              <span className="flex items-center space-x-1">
                 <Bookmark className="w-4 h-4" />
                <span>My Decks</span>
              </span>
              {/* Underline effect */}
              <motion.span
                className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 dark:bg-indigo-400 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
              />
            </Link>
          </motion.div>
           <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 500 }}>
            <Link href="/review" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors relative group">
               <span className="flex items-center space-x-1">
                 <Target className="w-4 h-4" />
                 <span>Review</span>
               </span>
               {/* Underline effect */}
               <motion.span
                className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 dark:bg-indigo-400 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
              />
            </Link>
           </motion.div>
        </nav>

        {/* Profile Dropdown */}
         {user && (
          <div className="relative" ref={profileRef}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 focus:outline-none"
                aria-label="Toggle profile dropdown"
              >
                {user?.photoURL ? (
                  <Image
                    src={user.photoURL}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="rounded-full ring-2 ring-indigo-500 dark:ring-indigo-400 object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 dark:from-indigo-600 dark:to-purple-600 flex items-center justify-center ring-2 ring-indigo-500 dark:ring-indigo-400 text-white font-semibold text-sm">
                    {getInitials(user?.displayName)}
                  </div>
                )}
              </motion.button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={profileDropdownVariants}
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 border border-gray-100 dark:border-gray-700 py-2 z-50"
                  >
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.displayName || 'User'}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                    </div>

                    <div className="py-1">
                      <motion.button
                        whileHover={{ x: 4, backgroundColor: 'rgba(99, 102, 241, 0.05)' }} // Using a subtle hover background
                         transition={{ type: "spring", stiffness: 500, damping: 25 }}
                        onClick={() => {
                          router.push('/profile');
                          setIsProfileOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span>View Profile</span>
                      </motion.button>

                      {/* Uncomment and customize if Edit Profile link is needed */}

                      <motion.button
                        whileHover={{ x: 4, backgroundColor: 'rgba(99, 102, 241, 0.05)' }}
                        transition={{ type: "spring", stiffness: 500, damping: 25 }}
                        onClick={() => {
                          router.push('/profile/edit');
                          setIsProfileOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit Profile</span>
                      </motion.button>

                      {/* Uncomment and customize if Settings link is needed */}

                      <motion.button
                        whileHover={{ x: 4, backgroundColor: 'rgba(99, 102, 241, 0.05)' }}
                        transition={{ type: "spring", stiffness: 500, damping: 25 }}
                        onClick={() => {
                          router.push('/settings');
                          setIsProfileOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </motion.button>

                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-700 my-1" />

                    <motion.button
                      whileHover={{ x: 4, backgroundColor: 'rgba(239, 68, 68, 0.05)' }} // Using a subtle red hover background
                      transition={{ type: "spring", stiffness: 500, damping: 25 }}
                      onClick={handleSignOut}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
           )}
      </div>
    </header>
  );
} 