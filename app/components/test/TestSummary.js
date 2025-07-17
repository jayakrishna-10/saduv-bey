// FILE: app/components/test/TestSummary.js
'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Minus, Clock, BarChart, RotateCw, Eye } from 'lucide-react';
import { formatTime } from '@/lib/quiz-utils';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

export function TestSummary({ questions, answers, timeTaken, onReview, onRestart }) {
  const correct = questions.reduce((acc, q) => answers[q.main_id || q.id] === q.correct_answer ? acc + 1 : acc, 0);
  const incorrect = Object.keys(answers).length - correct;
  const unanswered = questions.length - Object.keys(answers).length;
  const score = Math.round((correct / questions.length) * 100);

  const chartData = {
    labels: ['Correct', 'Incorrect', 'Unanswered'],
    datasets: [{
      data: [correct, incorrect, unanswered],
      backgroundColor: ['#22c55e', '#ef4444', '#6b7280'],
      borderRadius: 4,
    }],
  };
  
  const chartOptions = {
    indexAxis: 'y',
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { x: { display: false }, y: { display: false } },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-2">Test Complete!</h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">Here's your performance summary.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Panel: Score and Stats */}
          <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
            <p className="text-gray-600 dark:text-gray-400">Your Score</p>
            <p className={`text-7xl font-bold my-2 ${score >= 50 ? 'text-green-500' : 'text-red-500'}`}>{score}%</p>
            <div className="flex items-center gap-6 mt-4">
              <div className="text-center"><p className="text-2xl font-semibold text-green-500">{correct}</p><p className="text-sm">Correct</p></div>
              <div className="text-center"><p className="text-2xl font-semibold text-red-500">{incorrect}</p><p className="text-sm">Incorrect</p></div>
              <div className="text-center"><p className="text-2xl font-semibold text-gray-500">{unanswered}</p><p className="text-sm">Unanswered</p></div>
            </div>
            <div className="flex items-center gap-2 mt-6 text-gray-600 dark:text-gray-400">
              <Clock className="h-5 w-5" />
              <span>Time Taken: {formatTime(timeTaken)}</span>
            </div>
          </div>
          
          {/* Right Panel: Chart and Actions */}
          <div className="flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-lg mb-4 text-gray-800 dark:text-gray-200">Answer Breakdown</h3>
              <div className="h-40"><Bar options={chartOptions} data={chartData} /></div>
            </div>
            <div className="flex flex-col gap-4 mt-8">
              <motion.button onClick={onReview} whileHover={{ scale: 1.05 }} className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg flex items-center justify-center gap-2">
                <Eye className="h-5 w-5" /> Review Answers
              </motion.button>
              <motion.button onClick={onRestart} whileHover={{ scale: 1.05 }} className="w-full py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-lg flex items-center justify-center gap-2">
                <RotateCw className="h-5 w-5" /> Take Another Test
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
