// app/nce/quiz/page.js
import { QuizApp } from '@/components/QuizApp';

export const metadata = {
  title: 'NCE Practice Quiz',
  description: 'Interactive quiz with instant feedback and explanations for NCE preparation',
};

export default function NCEQuizPage() {
  return <QuizApp />;
}
