// FILE: app/dashboard/page.js
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  User, 
  Mail, 
  TrendingUp, 
  Award, 
  Clock, 
  Target,
  Calendar,
  Zap,
  BookOpen,
  ChevronRight
} from 'lucide-react';

// Import dashboard components
import { ChapterAccuracyBar } from '@/components/dashboard/ChapterAccuracyBar';
import { PredictedScoreCard } from '@/components/dashboard/PredictedScoreCard';
import { ChapterDetailModal } from '@/components/dashboard/ChapterDetailModal';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';

// Import utilities
import { 
  calculateStreak, 
  calculateMasteryLevels, 
  getStudyRecommendations,
  formatTimeSpent
} from '@/lib/dashboard-utils';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: null,
    analytics: null,
    recentActivity: { quizAttempts: [], testAttempts: [] }
  });
  
  // UI state
  const [selectedChapterDetail, setSelectedChapterDetail] = useState(null);
  const [showChapterModal, setShowChapterModal] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    } else if (status === 'authenticated') {
      fetchDashboardData();
    }
  }, [status, router]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch all dashboard data in parallel
      const [analyticsRes, attemptsRes] = await Promise.all([
        fetch('/api/user/learning-analytics'),
        fetch('/api/user/attempts')
      ]);

      const [analytics, attempts] = await Promise.all([
        analyticsRes.json(),
        attemptsRes.json()
      ]);

      // Process and set data
      setDashboardData({
        analytics: analytics,
        recentActivity: attempts
      });

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChapterClick = (chapterData) => {
    setSelectedChapterDetail(chapterData);
    setShowChapterModal(true);
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <DashboardSkeleton />
        </div>
      </div>
    );
  }

  if (status === 'authenticated' && dashboardData.analytics) {
    const { analytics, recentActivity } = dashboardData;
    const streak = calculateStreak(analytics.activityData || []);
    const masteryLevels = calculateMasteryLevels(analytics.chapterStats || {});
    const recommendations = getStudyRecommendations(analytics);
    
    // Calculate summary stats
    const totalQuestions = analytics.totalStats?.questionsAttempted || 0;
    const totalCorrect = analytics.totalStats?.correctAnswers || 0;
    const overallAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
    const totalTimeSpent = analytics.totalStats?.totalTimeSpent || 0;

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-center gap-6 mb-12">
            <img
              src={session.user.image}
              alt="User Avatar"
              className="w-24 h-24 rounded-full border-4 border-indigo-500 shadow-lg"
            />
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Welcome back, {session.user.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center md:justify-start gap-2 mt-1">
                <Mail className="h-4 w-4" />
                {session.user.email}
              </p>
              <div className="flex items-center justify-center md:justify-start gap-4 mt-3 text-sm">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Member since {new Date(session.user.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <Target className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                <span className="text-gray-600 dark:text-gray-400 text-sm">Total Questions</span>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{totalQuestions}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {totalCorrect} correct
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
                <span className="text-gray-600 dark:text-gray-400 text-sm">Overall Accuracy</span>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{overallAccuracy}%</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {overallAccuracy >= 70 ? 'Great job!' : 'Keep practicing'}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                <span className="text-gray-600 dark:text-gray-400 text-sm">Current Streak</span>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{streak.current} days</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Best: {streak.longest} days
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                <span className="text-gray-600 dark:text-gray-400 text-sm">Time Invested</span>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {formatTimeSpent(totalTimeSpent)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Total study time
              </p>
            </div>
          </div>

          {/* Recommendations Section */}
          {recommendations.length > 0 && (
            <div className="mb-8 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Study Recommendations
              </h3>
              <div className="space-y-3">
                {recommendations.slice(0, 2).map((rec, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      rec.priority === 'high' ? 'bg-red-500' :
                      rec.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                    <div>
                      <p className="text-blue-900 dark:text-blue-100 font-medium">{rec.message}</p>
                      <p className="text-blue-800 dark:text-blue-200 text-sm mt-1">{rec.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <ChapterAccuracyBar 
                chapterStats={analytics.chapterStatsByPaper}
                onChapterClick={handleChapterClick}
              />
            </div>
            <PredictedScoreCard />
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Quiz History */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
                Recent Quiz Activity
              </h2>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {recentActivity.quizAttempts.length > 0 ? (
                  recentActivity.quizAttempts.slice(0, 5).map(attempt => (
                    <div key={attempt.id} className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-800 dark:text-gray-200">
                            {attempt.paper.replace('paper', 'Paper ')} - {attempt.selected_topic || 'All Topics'}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(attempt.completed_at).toLocaleString()}
                          </p>
                        </div>
                        <span className="text-lg font-bold text-emerald-500">{attempt.score}%</span>
                      </div>
                      <div className="mt-4 flex justify-between text-sm text-gray-700 dark:text-gray-300">
                        <span>{attempt.correct_answers}/{attempt.total_questions} Correct</span>
                        <span>{formatTimeSpent(attempt.time_taken)}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No quiz attempts yet
                  </div>
                )}
              </div>
            </div>

            {/* Test History */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
                Recent Test Activity
              </h2>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {recentActivity.testAttempts.length > 0 ? (
                  recentActivity.testAttempts.slice(0, 5).map(attempt => (
                    <div key={attempt.id} className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-800 dark:text-gray-200">
                            {attempt.test_type.replace('paper', 'Paper ')} ({attempt.test_mode})
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(attempt.completed_at).toLocaleString()}
                          </p>
                        </div>
                        <span className="text-lg font-bold text-emerald-500">{attempt.score}%</span>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-gray-700 dark:text-gray-300">
                        <span>{attempt.correct_answers} Correct</span>
                        <span>{attempt.incorrect_answers} Incorrect</span>
                        <span>{attempt.unanswered} Unanswered</span>
                        <span>{formatTimeSpent(attempt.time_taken)}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No test attempts yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Chapter Detail Modal */}
        <ChapterDetailModal
          isOpen={showChapterModal}
          onClose={() => setShowChapterModal(false)}
          chapterData={selectedChapterDetail}
        />
      </div>
    );
  }

  return null;
}
