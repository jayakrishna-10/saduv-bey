// app/nce/test/page.js - Main Test Page
import { TestApp } from '@/components/TestApp';

export const metadata = {
  title: 'NCE Practice Test | Mock & Practice Tests',
  description: 'Take NCE practice tests and mock exams with real-time feedback, detailed analysis, and performance tracking',
  keywords: 'NCE test, mock exam, practice test, energy management certification, exam preparation',
};

export default function NCETestPage() {
  return <TestApp />;
}
