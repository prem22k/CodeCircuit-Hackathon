import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useTheme } from 'next-themes';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Example: Log the error to an error reporting service
    console.error('Uncaught error caught by Error Boundary:', error, errorInfo);
    // In a real app, you might send this to a service like Sentry or Bugsnag
  }

  render() {
    if (this.state.hasError) {
      // Render custom fallback UI
      return (
        <AnimatePresence mode="wait">
          <motion.div
            key="error-boundary-fallback"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="text-center space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 border border-gray-100 dark:border-gray-700 max-w-md w-full"
            >
              <motion.div
                initial={{ rotate: 0, scale: 0 }}
                animate={{ rotate: [0, 10, -10, 0], scale: 1 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="mx-auto text-red-500"
              >
                 <AlertTriangle className="w-16 h-16 mx-auto" />
              </motion.div>
             
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Oops! Something Went Wrong
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                An unexpected error occurred. We're working to fix it.
                Please try refreshing the page.
              </p>

              {/* Optional: Display error details in development */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="text-left text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg overflow-x-auto">
                  <strong className="block mb-2">Error Details:</strong>
                  <pre className="whitespace-pre-wrap break-words">
                    {this.state.error.message}
                    {/* In a real app, be careful not to expose sensitive info */}
                  </pre>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              >
                Refresh Page
              </motion.button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      );
    }

    return this.props.children;
  }
} 