'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Settings, Edit } from 'lucide-react';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import Image from 'next/image';

type ProfileSection = 'view' | 'edit' | 'settings';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<ProfileSection>('view');

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner className="w-12 h-12" />
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8"
        >
          User Profile
        </motion.h1>

        {/* Tabs */}
        <div className="mb-8 border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              className={`flex-1 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeSection === 'view'
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500'
              }`}
              onClick={() => setActiveSection('view')}
            >
              <User className="-ml-0.5 mr-2 w-5 h-5" aria-hidden="true" />
              View Profile
            </button>
            <button
              className={`flex-1 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeSection === 'edit'
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500'
              }`}
              onClick={() => setActiveSection('edit')}
            >
               <Edit className="-ml-0.5 mr-2 w-5 h-5" aria-hidden="true" />
              Edit Profile
            </button>
             <button
              className={`flex-1 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeSection === 'settings'
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500'
              }`}
              onClick={() => setActiveSection('settings')}
            >
              <Settings className="-ml-0.5 mr-2 w-5 h-5" aria-hidden="true" />
              Settings
            </button>
          </nav>
        </div>

        {/* Content */}
        <motion.div
           key={activeSection} // Key changes to trigger re-render and animation
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.3 }}
           className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700"
        >
          {
            activeSection === 'view' ? (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">View Profile</h2>
                 {/* Placeholder for profile image */}                
                 <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      {user?.photoURL ? (
                         <Image src={user.photoURL} alt="Profile" width={64} height={64} objectFit="cover" />
                      ) : (
                         <User className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                      )}
                    </div>
                    <div>
                       <p className="text-lg font-medium text-gray-900 dark:text-white">Name: {user?.displayName || 'N/A'}</p>
                       <p className="text-sm text-gray-600 dark:text-gray-400">Email: {user?.email || 'N/A'}</p>
                    </div>
                 </div>
                
                {/* Add other profile details here */}                
                 <p className="text-gray-700 dark:text-gray-300">User ID: {user?.id}</p>
                 {/* Add more details like creation date, etc. if available */}                
              </div>
            ) : activeSection === 'edit' ? (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Profile</h2>
                {/* Placeholder for edit form */}                
                 <div className="space-y-4">
                    <div>
                       <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Display Name</label>
                       <input type="text" name="displayName" id="displayName" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Enter display name" defaultValue={user?.displayName || ''} />
                    </div>
                    <div>
                       <label htmlFor="photoURL" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Profile Image URL</label>
                       <input type="text" name="photoURL" id="photoURL" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Enter image URL" defaultValue={user?.photoURL || ''} />
                    </div>
                     {/* Add other editable fields here */}
                    <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md">Save Changes</button>
                 </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h2>
                {/* Placeholder for settings */}                
                 <p className="text-gray-700 dark:text-gray-300">Settings options will go here.</p>
                 {/* Add various settings controls (toggles, dropdowns, etc.) */}                
              </div>
            )
          }
        </motion.div>
      </div>
    </div>
  );
} 