import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useToastStore } from '../components/common/Toast';

export const Login = () => {
  const { user, signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const addToast = useToastStore((state) => state.addToast);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
      addToast('success', 'Successfully signed in!');
    } catch (error) {
      console.error('Login error:', error);
      addToast('error', 'Failed to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (user) {
    return <Navigate to="/decks" replace />;
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <div className="text-center space-y-6 max-w-md mx-auto p-6">
        <h1 className="text-4xl font-bold mb-2">Welcome to BrainBoost</h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
          Sign in to sync your flashcards across devices and never lose your progress.
        </p>
        
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full btn bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 
                   flex items-center justify-center gap-3 py-3"
        >
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              <img
                src="https://www.google.com/favicon.ico"
                alt="Google"
                className="w-5 h-5"
              />
              Continue with Google
            </>
          )}
        </button>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-8">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}; 