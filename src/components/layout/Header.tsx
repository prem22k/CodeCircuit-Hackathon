import { Link } from 'react-router-dom';
import { Moon, Sun, Brain } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export const Header = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Brain className="w-8 h-8 text-primary-500" />
            <span className="text-xl font-semibold">BrainBoost</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/decks" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
              Decks
            </Link>
            <Link to="/review" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
              Review
            </Link>
            <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
              Dashboard
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}; 