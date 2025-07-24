// app/nce/spaced-repetition/page.js
import { SpacedRepetitionApp } from '@/components/spaced-repetition/SpacedRepetitionApp';

export const metadata = {
  title: 'Spaced Repetition - NCE Preparation',
  description: 'Intelligent spaced repetition system for better retention of NCE exam concepts using the SM-2 algorithm',
  keywords: 'NCE, spaced repetition, learning, memory, retention, SM-2 algorithm, energy manager, energy auditor',
};

export default function SpacedRepetitionPage() {
  return (
    <div className="min-h-screen">
      <SpacedRepetitionApp />
    </div>
  );
}
