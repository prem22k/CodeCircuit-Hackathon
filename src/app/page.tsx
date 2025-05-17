'use client';

import { useRouter } from 'next/navigation';
import { Brain, BookOpen, Zap, Sparkles, ArrowRight, ChevronRight, Plus, FileText, Clock, BarChart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Hero } from '@/components/Hero';

export default function Home() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Hero />
      {/* Add other sections below the hero */}
    </div>
  );
} 