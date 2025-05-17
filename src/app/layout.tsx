'use client';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/components/common/Toast';
import { NavBar } from '@/components/layout/NavBar';
import { Footer } from '@/components/Footer';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BrainBoost - Smart Flashcards',
  description: 'Learn smarter with AI-powered flashcards',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <ToastProvider>
              <div className="min-h-screen flex flex-col">
                <NavBar />
                <main className="flex-grow">
                  {children}
                </main>
                <Footer />
              </div>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
} 