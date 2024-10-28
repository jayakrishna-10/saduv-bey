'use client';
import dynamic from 'next/dynamic';

// Update the import path
const QuizApp = dynamic(() => import('../components/QuizApp'), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="min-h-screen">
      <QuizApp />
    </main>
  );
}
