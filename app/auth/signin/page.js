// app/auth/signin/page.js
import React from 'react';
import { motion } from 'framer-motion';
import { LoginButton } from '@/components/auth/LoginButton';
import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans relative overflow-hidden transition-colors duration-300">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 opacity-40 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-gradient-to-br from-emerald-100 to-cyan-100 dark:from-emerald-900/20 dark:to-cyan-900/20 opacity-30 blur-3xl" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Back to home link */}
          <div className="mb-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </div>

          {/* Sign in card */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-gray-200/50 dark:border-gray-700/50 p-8 md:p-12 shadow-lg">
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-light text-gray-900 dark:text-gray-100 mb-4">
                Sign in to NCE Quiz
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Track your progress, analyze your performance, and achieve your NCE goals
              </p>
            </div>

            {/* Features list */}
            <div className="mb-8 space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span>Track your quiz and test performance</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Analyze chapter-wise progress</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Set study goals and track streaks</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Get personalized recommendations</span>
              </div>
            </div>

            {/* Sign in button */}
            <div className="text-center">
              <LoginButton className="w-full justify-center" />
            </div>

            {/* Privacy note */}
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-6">
              We only access your basic profile information and email address. 
              Your study data is private and secure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
