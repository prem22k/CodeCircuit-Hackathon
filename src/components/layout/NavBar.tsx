'use client';

import { Brain, User, Settings, LogOut, Edit } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export function NavBar() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Add click outside handler for profile dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Check if the click is outside the profile dropdown and the button
      if (!target.closest('.profile-dropdown-container') && !target.closest('.profile-button')) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsProfileOpen(false);
      router.push('/login'); // Redirect to login page after sign out
    } catch (error) {
      console.error('Error signing out:', error);
      // Optionally show a toast notification for error
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

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <motion.div
              whileHover={{ rotate: 10 }}
              whileTap={{ scale: 0.9 }}
            >
              <Brain className="h-8 w-8 text-black dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors" />
            </motion.div>
            <span className="ml-2 text-xl font-bold bg-gradient-to-r from-black to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
              BrainBoost
            </span>
          </Link>

          {/* Navigation Links and Profile (only show when logged in) */}
          {user ? (
            <div className="flex items-center space-x-6">
              <Link
                href="/decks"
                className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors text-sm font-medium"
              >
                My Decks
              </Link>
              <Link
                href="/review"
                className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors text-sm font-medium"
              >
                Review
              </Link>

              {/* Profile Hover/Click Area */}
              <div 
                className="relative profile-dropdown-container flex items-center space-x-2 cursor-pointer"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 focus:outline-none profile-button"
                >
                  {user?.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="rounded-full ring-2 ring-gray-200 dark:ring-gray-700"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center ring-2 ring-gray-200 dark:ring-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300">
                      {getInitials(user?.displayName)}
                    </div>
                  )}
                </motion.div>

                {/* Username on Hover */}
                <AnimatePresence>
                  {isHovering && !isProfileOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      {user?.displayName || 'User'}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Full Profile Dropdown on Click */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ type: "spring", duration: 0.3 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-2 z-50 origin-top-right"
                    >
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.displayName || 'User'}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                      </div>
                      
                      <div className="py-1">
                        <motion.button
                          whileHover={{ x: 4 }}
                          onClick={() => {
                            router.push('/profile');
                            setIsProfileOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2"
                        >
                          <User className="w-4 h-4" />
                          <span>View Profile</span>
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ x: 4 }}
                          onClick={() => {
                            router.push('/profile/edit');
                            setIsProfileOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Edit Profile</span>
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ x: 4 }}
                          onClick={() => {
                            router.push('/settings');
                            setIsProfileOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2"
                        >
                          <Settings className="w-4 h-4" />
                          <span>Settings</span>
                        </motion.button>
                      </div>
                      
                      <div className="border-t border-gray-100 dark:border-gray-700 my-1" />
                      
                      <motion.button
                        whileHover={{ x: 4 }}
                        onClick={handleSignOut}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm font-medium"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
} 