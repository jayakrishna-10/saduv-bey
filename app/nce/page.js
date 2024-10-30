// app/nce/page.js
import NCEHomepage from '@/components/NCEHomepage';

export default function NCEPage() {
  return <NCEHomepage />;
}

// app/nce/quiz/page.js (Your existing quiz page)
'use client';
import { QuizApp } from '@/components/QuizApp';

export default function QuizPage() {
  return <QuizApp />;
}
