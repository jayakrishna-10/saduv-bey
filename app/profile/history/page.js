// app/profile/history/page.js
'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { 
  getUserQuizAttempts, 
  getUserTestAttempts,
  getUserStudySessions 
} from '@/lib/database';
import { 
  Calendar,
  Clock,
  Target,
  FileText,
  BookOpen,
  Filter,
  Download,
  Search,
  TrendingUp,
  Trophy,
  Play
} from 'lucide-react';

export default function HistoryPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('all');
  const [quizHistory, setQuizHistory] = useState([]);
  const [testHistory, setTestHistory] = useState([]);
  const [studySessions, setStudySessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState('30');

  useEffect(() => {
    if (session?.user?.googleId || session?.user?.id) {
      fetchHistory();
    }
  }, [session?.user?.googleId, session?.user?.id, selectedDateRange]);

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Use googleId if available, otherwise fallback to id
      const userId = session.user.googleId || session.user.id;
      
      const [quizzes, tests, sessions] = await Promise.all([
        getUserQuizAttempts(userId, 50),
        getUserTestAttempts(userId, 50),
        getUserStudySessions(userId, parseInt(selectedDateRange))
      ]);

      setQuizHistory(quizzes || []);
      setTestHistory(tests || []);
      setStudySessions(sessions || []);
    } catch (error) {
      console.error('Error fetching history:', error);
      setError('Failed to load history data');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${minutes}m`;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/50 dark:text-emerald-400';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/50 dark:text-yellow-400';
    return 'text-red-600 bg-red-100 dark:bg-red-900/50 dark:text-red-400';
  };

  // Combine and filter data based on active tab and search
  const getFilteredData = () => {
    let allData = [];
    
    if (activeTab === 'all' || activeTab === 'quizzes') {
      allData.push(...quizHistory.map(quiz => ({
        ...quiz,
        type: 'quiz',
        title: quiz.selected_topic || quiz.paper || 'Quiz',
        date: quiz.completed_at,
        duration: quiz.time_taken
      })));
    }
    
    if (activeTab === 'all' || activeTab === 'tests') {
      allData.push(...testHistory.map(test => ({
        ...test,
        type: 'test',
        title: `${test.test_type} Test`,
        date: test.completed_at,
        duration: test.time_taken
      })));
    }

    // Sort by date (newest first)
    allData.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Filter by search term
    if (searchTerm) {
      allData = allData.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return allData;
  };

  const exportHistory = () => {
    const data = {
      quizzes: quizHistory,
      tests: testHistory,
      sessions: studySessions,
      exportDate: new Date().toISOString(),
      user: session.user.email
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `study-history-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'all', label: 'All Activity', icon: Calendar },
    { id: 'quizzes', label: 'Quizzes', icon: Target },
    { id: 'tests', label: 'Tests', icon: FileText },
    { id: 'sessions', label: 'Study Sessions', icon: BookOpen },
  ];

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center p-8">
              <div className="w-8 h-8 border-4 border-gray-300 dark:border-gray-600 border-t-gray-900 dark:border-t-gray-100 rounded-full mx-auto mb-4 animate-spin" />
              <p className="text-gray-700 dark:text-gray-300">Loading your study history...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Study History
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Track your learning journey and review past performance
                </p>
              </div>
              <button
                onClick={exportHistory}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 space-y-4">
            {/* Search and Date Range */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <select
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-300 hover:bg-white/90 dark:hover:bg-gray-800/90'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          {activeTab === 'sessions' ? (
            /* Study Sessions View */
            <div className="space-y-4">
              {studySessions.length > 0 ? (
                studySessions.map((session) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                          <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            {new Date(session.session_date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {session.questions_answered} questions • {session.quiz_attempts} quizzes • {session.test_attempts} tests
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900 dark:text-gray-100">
                          {formatTime(session.time_spent * 60)}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 text-sm">
                          Study time
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No study sessions found</p>
                </div>
              )}
            </div>
          ) : (
            /* Activities View */
            <div className="space-y-4">
              {getFilteredData().length > 0 ? (
                getFilteredData().map((activity, index) => (
                  <motion.div
                    key={`${activity.type}-${activity.id}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${
                          activity.type === 'quiz' 
                            ? 'bg-emerald-100 dark:bg-emerald-900/50' 
                            : 'bg-purple-100 dark:bg-purple-900/50'
                        }`}>
                          {activity.type === 'quiz' ? (
                            <Target className={`h-6 w-6 ${
                              activity.type === 'quiz' 
                                ? 'text-emerald-600 dark:text-emerald-400' 
                                : 'text-purple-600 dark:text-purple-400'
                            }`} />
                          ) : (
                            <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 capitalize">
                            {activity.title}
                          </h3>
                          <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 text-sm">
                            <span>{formatDate(activity.date)}</span>
                            {activity.duration && (
                              <>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatTime(activity.duration)}
                                </div>
                              </>
                            )}
                            <span>•</span>
                            <span>{activity.total_questions} questions</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(activity.score)}`}>
                          {activity.score}%
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                          {activity.correct_answers}/{activity.total_questions} correct
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  {error ? (
                    <div>
                      <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                      <button
                        onClick={fetchHistory}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                      >
                        Retry
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Play className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No activity found</p>
                      <p className="text-sm">Start taking quizzes and tests to build your history!</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
