// FILE: app/components/dashboard/ChapterDetailModal.js
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  TrendingUp, 
  Target, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  BarChart3,
  Calendar,
  Zap,
  BookOpen,
  FileText,
  Activity
} from 'lucide-react';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function ChapterDetailModal({ isOpen, onClose, chapterData, showWeeklyChart = false }) {
  const [detailedStats, setDetailedStats] = useState(null);
  const [weeklyData, setWeeklyData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(showWeeklyChart ? 'weekly' : 'overview');

  useEffect(() => {
    if (isOpen && chapterData) {
      fetchDetailedStats();
      if (showWeeklyChart) {
        fetchWeeklyData();
      }
    }
  }, [isOpen, chapterData, showWeeklyChart]);

  const fetchDetailedStats = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/user/chapter-performance?chapter=${encodeURIComponent(chapterData.chapter)}&paper=${chapterData.paper}&range=30&mode=single`);
      const data = await response.json();
      
      if (response.ok) {
        setDetailedStats(data);
      }
    } catch (error) {
      console.error('Error fetching detailed stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWeeklyData = async () => {
    try {
      const response = await fetch(`/api/user/chapter-performance?chapter=${encodeURIComponent(chapterData.chapter)}&paper=${chapterData.paper}&range=7&mode=single`);
      const data = await response.json();
      
      if (response.ok && data.performanceData?.chartData) {
        // Generate labels for last 7 days
        const today = new Date();
        const sevenDaysAgo = subDays(today, 6);
        const days = eachDayOfInterval({ start: sevenDaysAgo, end: today });
        
        const labels = days.map(day => format(day, 'EEE'));
        const questionsData = days.map(day => {
          const dayStr = format(day, 'yyyy-MM-dd');
          const dayData = data.performanceData.chartData.find(d => d.date === dayStr);
          return dayData ? dayData.questions : 0;
        });

        setWeeklyData({
          labels,
          datasets: [{
            label: 'Questions Attempted',
            data: questionsData,
            backgroundColor: 'rgba(99, 102, 241, 0.8)',
            borderColor: 'rgb(99, 102, 241)',
            borderWidth: 2,
            borderRadius: 6,
          }]
        });
      }
    } catch (error) {
      console.error('Error fetching weekly data:', error);
    }
  };

  const getMasteryLevel = (accuracy) => {
    if (accuracy >= 90) return { level: 'Expert', color: 'text-purple-600 dark:text-purple-400' };
    if (accuracy >= 80) return { level: 'Proficient', color: 'text-green-600 dark:text-green-400' };
    if (accuracy >= 70) return { level: 'Competent', color: 'text-blue-600 dark:text-blue-400' };
    if (accuracy >= 60) return { level: 'Developing', color: 'text-yellow-600 dark:text-yellow-400' };
    return { level: 'Beginner', color: 'text-red-600 dark:text-red-400' };
  };

  const handleStartQuiz = () => {
    const params = new URLSearchParams({
      paper: chapterData.paper,
      topic: chapterData.chapter,
      count: '20'
    });
    window.open(`/nce/quiz?${params.toString()}`, '_blank');
  };

  const handleStartTest = () => {
    const params = new URLSearchParams({
      type: chapterData.paper,
      mode: 'chapter',
      chapter: chapterData.chapter
    });
    window.open(`/nce/test?${params.toString()}`, '_blank');
  };

  const weeklyChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            return `${context.parsed.y} questions attempted`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { 
          font: { size: 11 },
          color: 'rgb(156, 163, 175)'
        }
      },
      y: {
        beginAtZero: true,
        grid: { 
          color: 'rgba(156, 163, 175, 0.1)',
          drawBorder: false
        },
        ticks: { 
          font: { size: 11 },
          color: 'rgb(156, 163, 175)',
          stepSize: 1
        }
      }
    }
  };

  if (!isOpen || !chapterData) return null;

  const mastery = getMasteryLevel(chapterData.accuracy);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  Chapter Analysis
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {chapterData.chapter} ({chapterData.paper?.replace('paper', 'Paper ')})
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Tabs */}
            {showWeeklyChart && (
              <div className="flex items-center gap-2 mt-4">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'overview'
                      ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('weekly')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'weekly'
                      ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  Weekly Progress
                </button>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {isLoading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
              </div>
            ) : (
              <>
                {activeTab === 'overview' && (
                  <>
                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">Accuracy</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {chapterData.accuracy}%
                        </p>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">Questions</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {chapterData.totalQuestions}
                        </p>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">Avg Time</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {chapterData.avgTimePerQuestion || 45}s
                        </p>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">Mastery</span>
                        </div>
                        <p className={`text-lg font-bold ${mastery.color}`}>
                          {mastery.level}
                        </p>
                      </div>
                    </div>

                    {/* Progress Visualization */}
                    <div className="mb-8">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                        Mastery Progress
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                          <span>Current Level: {mastery.level}</span>
                          <span>{chapterData.accuracy}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                          <motion.div
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${chapterData.accuracy}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span>Beginner</span>
                          <span>Expert</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'weekly' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                        Weekly Questions Attempted
                      </h3>
                      <div className="h-64">
                        {weeklyData ? (
                          <Bar data={weeklyData} options={weeklyChartOptions} />
                        ) : (
                          <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                            <div className="text-center">
                              <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                              <p className="text-sm">No practice data for this week</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Recent Performance */}
                {detailedStats?.performanceData?.chartData && detailedStats.performanceData.chartData.length > 0 && activeTab === 'overview' && (
                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                      Recent Performance (Last 5 Sessions)
                    </h3>
                    <div className="space-y-2">
                      {detailedStats.performanceData.chartData.slice(-5).reverse().map((session, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {format(new Date(session.date), 'MMM dd, yyyy')}
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {session.questions} questions
                            </span>
                            <span className={`text-sm font-medium ${
                              session.accuracy >= 80 ? 'text-green-600 dark:text-green-400' :
                              session.accuracy >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                              'text-red-600 dark:text-red-400'
                            }`}>
                              {session.accuracy}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Improvement Tips */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-2">
                        Improvement Recommendations
                      </h3>
                      <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                        {chapterData.accuracy < 60 ? (
                          <>
                            <li>• Review fundamental concepts in this chapter</li>
                            <li>• Practice 10-15 questions daily to build confidence</li>
                            <li>• Focus on understanding rather than memorization</li>
                          </>
                        ) : chapterData.accuracy < 80 ? (
                          <>
                            <li>• Target specific weak areas within this chapter</li>
                            <li>• Try timed practice to improve speed and accuracy</li>
                            <li>• Review incorrect answers thoroughly</li>
                          </>
                        ) : (
                          <>
                            <li>• Maintain your excellent performance</li>
                            <li>• Help others by explaining concepts</li>
                            <li>• Challenge yourself with advanced questions</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer with Action Buttons */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStartQuiz}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
              >
                <BookOpen className="h-4 w-4" />
                Start Chapter Quiz (20 questions)
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStartTest}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
              >
                <FileText className="h-4 w-4" />
                Chapter Mock Test
              </motion.button>
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {chapterData.weightage && (
                  <span>NCE Weightage: {chapterData.weightage}%</span>
                )}
              </div>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
