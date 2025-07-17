// FILE: app/components/test/TestSummary.js
'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Clock, RotateCw, Eye, Loader2, AlertTriangle } from 'lucide-react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart-js';
import { formatTime } from '@/lib/quiz-utils';

ChartJS.register(ArcElement, Tooltip, Legend);

export function TestSummary({ questions, answers, timeTaken, onReview, onRestart, saveStatus }) {
  const correct = questions.reduce((acc, q) => answers[q.main_id || q.id] === q.correct_answer ? acc + 1 : acc, 0);
  const incorrect = Object.keys(answers).length - correct;
  const unanswered = questions.length - Object.keys(answers).length;
  const score = Math.round((correct / questions.length) * 100);

  const chartData = {
    labels: ['Correct', 'Incorrect', 'Unanswered'],
    datasets: [{
      data: [correct, incorrect, unanswered],
      backgroundColor: ['#22c55e', '#ef4444', '#6b7280'],
      borderColor: ['#ffffff', '#ffffff', '#ffffff'],
      borderWidth: 2,
    }],
  };
  
  const chartOptions = {
    responsive: true,
    cutout: '70%',
    plugins: { legend: { display: false } },
  };

  const SaveStatusIndicator = () => {
    if(saveStatus === 'saving') return <div className="flex items-center gap-2 text-sm text-blue-500"><Loader2 className="animate-spin h-4 w-4" /> Saving results...</div>;
    if(saveStatus === 'success') return <div className="flex items-center gap-2 text-sm text-green-500"><Check className="h-4 w-4" /> Results saved.</div>;
    if(saveStatus === 'error') return <div className="flex items-center gap-2 text-sm text-red-500"><AlertTriangle className="h-4 w-4" /> Failed to save.</div>;
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-4xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8">
        <h1 className="text-4xl font-light text-center text-gray-900 dark:text-gray-100 mb-2">Test Complete!</h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">Here's your performance summary.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="relative w-full max-w-xs mx-auto">
            <Doughnut data={chartData} options={chartOptions} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-gray-600 dark:text-gray-400 text-sm">Your Score</p>
                <p className={`text-6xl font-bold ${score >= 50 ? 'text-green-500' : 'text-red-500'}`}>{score}%</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
                <StatCard icon={Check} value={correct} label="Correct" color="green" />
                <StatCard icon={X} value={incorrect} label="Incorrect" color="red" />
                <StatCard icon={Clock} value={formatTime(timeTaken)} label="Time" color="blue" />
            </div>
            <div className="flex flex-col gap-4">
              <motion.button onClick={onReview} whileHover={{ scale: 1.02 }} className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg flex items-center justify-center gap-2">
                <Eye className="h-5 w-5" /> Review Answers
              </motion.button>
              <motion.button onClick={onRestart} whileHover={{ scale: 1.02 }} className="w-full py-4 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-xl flex items-center justify-center gap-2">
                <RotateCw className="h-5 w-5" /> Take Another Test
              </motion.button>
            </div>
             <div className="text-center h-5"><SaveStatusIndicator /></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const StatCard = ({ icon: Icon, value, label, color }) => (
    <div className="bg-white/50 dark:bg-gray-700/50 p-4 rounded-xl text-center">
        <Icon className={`h-6 w-6 mx-auto mb-2 text-${color}-500`} />
        <p className={`text-2xl font-semibold text-gray-900 dark:text-gray-100`}>{value}</p>
        <p className="text-xs text-gray-600 dark:text-gray-400">{label}</p>
    </div>
)
