'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/components/common/Toast';
import { useEffect, useState } from 'react';

// Define available themes
const themes = {
  light: 'light',
  dark: 'dark',
  system: 'system',
} as const;

// Define theme colors for meta tags
const themeColors = {
  light: '#ffffff',
  dark: '#111827',
} as const;

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  // Handle system theme changes
  useEffect(() => {
    setMounted(true);

    // Update meta theme-color based on system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateThemeColor = (e: MediaQueryListEvent | MediaQueryList) => {
      const theme = e.matches ? themeColors.dark : themeColors.light;
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme);
    };

    // Initial theme color
    updateThemeColor(mediaQuery);

    // Listen for system theme changes
    mediaQuery.addEventListener('change', updateThemeColor);

    return () => mediaQuery.removeEventListener('change', updateThemeColor);
  }, []);

  // Prevent flash of wrong theme
  if (!mounted) {
    return (
      <div style={{ visibility: 'hidden' }}>
        {children}
      </div>
    );
  }

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      themes={Object.values(themes)}
      storageKey="brainboost-theme"
    >
      <AuthProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </AuthProvider>
    </NextThemesProvider>
  );
} 