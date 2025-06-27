// app/nce/test/page.js
'use client';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

// Dynamically import TestApp with no SSR
const TestApp = dynamic(() => import('@/components/TestApp').then(mod => ({ default: mod.TestApp })), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full mx-auto mb-3 animate-spin" />
          <p className="text-white text-sm">Loading test interface...</p>
        </div>
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
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full mx-auto mb-3 animate-spin" />
            <p className="text-white text-sm">Loading test interface...</p>
          </div>
        </div>
      </div>
    );
  }

  return <TestApp />;
}
