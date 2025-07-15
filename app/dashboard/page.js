// FILE: app/dashboard/page.js
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2, User, Mail, BarChart3, FileText, Clock, Target, CheckCircle, Percent } from 'lucide-react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [attempts, setAttempts] = useState({ quizAttempts: [], testAttempts: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    } else if (status === 'authenticated') {
      fetch('/api/user/attempts')
        .then(res => res.json())
        .then(data => {
          if(data.error) throw new Error(data.error);
          setAttempts(data);
          setIsLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch attempts:", err);
          setIsLoading(false);
        });
    }
  }, [status, router]);

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500 dark:text-gray-400" />
      </div>
    );
  }
  
  const formatTime = (seconds) => {
    if (seconds === null || seconds === undefined) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (status === 'authenticated') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center gap-6 mb-12">
            <img
              src={session.user.image}
              alt="User Avatar"
              className="w-24 h-24 rounded-full border-4 border-indigo-500"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Welcome, {session.user.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-1">
                <Mail className="h-4 w-4" />
                {session.user.email}
              </p>
            </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
                    <BarChart3 className="text-indigo-500" />
                    Quiz History
                </h2>
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {attempts.quizAttempts.length > 0 ? attempts.quizAttempts.map(attempt => (
                        <div key={attempt.id} className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{attempt.paper.replace('paper', 'Paper ')} - {attempt.selected_topic || 'All Topics'}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(attempt.completed_at).toLocaleString()}</p>
                                </div>
                                <span className="text-lg font-bold text-emerald-500">{attempt.score}%</span>
                            </div>
                            <div className="mt-4 flex justify-between text-sm text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 pt-3">
                                <div className="flex items-center gap-1.5"><Target className="h-4 w-4 text-blue-500"/> {attempt.correct_answers}/{attempt.total_questions} Correct</div>
                                <div className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-purple-500"/> {formatTime(attempt.time_taken)}</div>
                            </div>
                        </div>
                    )) : (<div className="text-center py-8 text-gray-500 dark:text-gray-400">No quiz attempts found.</div>)}
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
                    <FileText className="text-purple-500" />
                    Test History
                </h2>
                 <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {attempts.testAttempts.length > 0 ? attempts.testAttempts.map(attempt => (
                        <div key={attempt.id} className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                           <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{attempt.test_type.replace('paper', 'Paper ')} ({attempt.test_mode})</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(attempt.completed_at).toLocaleString()}</p>
                                </div>
                                <span className="text-lg font-bold text-emerald-500">{attempt.score}%</span>
                            </div>
                            <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 pt-3">
                                <div className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-green-500"/> {attempt.correct_answers} Correct</div>
                                <div className="flex items-center gap-1.5"><Percent className="h-4 w-4 text-red-500"/> {attempt.incorrect_answers} Incorrect</div>
                                <div className="flex items-center gap-1.5"><Target className="h-4 w-4 text-yellow-500"/> {attempt.unanswered} Unanswered</div>
                                <div className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-purple-500"/> {formatTime(attempt.time_taken)}</div>
                            </div>
                        </div>
                    )) : (<div className="text-center py-8 text-gray-500 dark:text-gray-400">No test attempts found.</div>)}
                </div>
            </div>
        </div>
      </div>
    );
  }

  return null;
}
