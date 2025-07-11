// app/components/auth/ProtectedRoute.js
'use client';
import React from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { LoginButton } from './LoginButton';

export function ProtectedRoute({ children, fallback = null }) {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center p-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50">
          <div className="w-8 h-8 border-4 border-gray-300 dark:border-gray-600 border-t-gray-900 dark:border-t-gray-100 rounded-full mx-auto mb-4 animate-spin" />
          <p className="text-gray-700 dark:text-gray-300 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    if (fallback) {
      return fallback;
    }
    
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center p-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50 max-w-md">
          <h2 className="text-2xl font-light text-gray-900 dark:text-gray-100 mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please sign in to access your profile and track your progress.
          </p>
          <LoginButton />
        </div>
      </div>
    );
  }

  return children;
}