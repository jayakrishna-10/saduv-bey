// FILE: app/nce/test/page.js
'use client';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

// Dynamically import TestApp with no SSR
const TestApp = dynamic(() => import('@/components/TestApp'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="text-center p-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/50 shadow-2xl">
        <Loader2 className="h-12 w-12 mx-auto animate-spin text-indigo-600 dark:text-indigo-400 mb-4" />
        <p className="text-lg font-light text-gray-700 dark:text-gray-300">Loading Test Environment...</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Preparing your exam session</p>
      </div>
    </div>
  )
});

export default function NCETestPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center p-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/50 shadow-2xl">
          <Loader2 className="h-12 w-12 mx-auto animate-spin text-indigo-600 dark:text-indigo-400 mb-4" />
          <p className="text-lg font-light text-gray-700 dark:text-gray-300">Loading Test Environment...</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Preparing your exam session</p>
        </div>
      </div>
    );
  }

  return <TestApp />;
}
