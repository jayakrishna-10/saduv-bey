// app/nce/test/page.js
'use client';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

// Dynamically import TestApp with no SSR - Using default export
const TestApp = dynamic(() => import('@/components/TestApp'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
        <div className="text-center">
          <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin text-white" />
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
            <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin text-white" />
            <p className="text-white text-sm">Loading test interface...</p>
          </div>
        </div>
      </div>
    );
  }

  return <TestApp />;
}
