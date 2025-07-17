// app/components/test/TestPerformanceAnalysis.js
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Trophy, 
  Target, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Flag,
  BarChart3,
  PieChart,
  Award,
  BookOpen,
  Zap,
  Brain,
  Users,
  Star,
  Calendar,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  RefreshCw
} from 'lucide-react';
import { 
  analyzeTestPerformance, 
  calculateGrade, 
  normalizeChapterName, 
  formatTime 
} from '@/lib/test-utils';

export function TestPerformanceAnalysis({
  isOpen = false,
  onClose,
  answers = [],
  questions = [],
  timeTaken = 0,
  totalTime = 0,
  testType = 'mock',
  testConfig = {},
  onRetakeTest,
  onNewTest
}) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'topics', 'recommendations'

  // Analyze performance
  const analysis = useMemo(() => {
    return analyzeTestPerformance(answers, questions, timeTaken, totalTime);
  }, [answers, questions, timeTaken, totalTime]);

  // Calculate grade
  const grade = useMemo(() => {
    return calculateGrade(analysis.accuracy);
  }, [analysis.accuracy]);

  // Performance insights
  const insights = useMemo(() => {
    const insights = [];
    
    // Time management insights
    if (analysis.timeEfficiency < 50) {
      insights.push({
        type: 'positive',
        icon: Clock,
        title: 'Excellent Time Management',
        description: 'You completed the test efficiently with time to spare.',
        color: 'emerald'
      });
    } else if (analysis.timeEfficiency > 95) {
      insights.push({
        type: 'warning',
        icon: Clock,
        title: 'Time Pressure',
        description: 'You used almost all available time. Consider practicing speed.',
        color: 'orange'
      });
    }

    // Accuracy insights
    if (analysis.accuracy >= 80) {
      insights.push({
        type: 'positive',
        icon: Target,
        title: 'Strong Performance',
        description: 'Your accuracy demonstrates solid understanding of the concepts.',
        color: 'emerald'
      });
    } else if (analysis.accuracy < 60) {
      insights.push({
        type: 'warning',
        icon: AlertCircle,
        title: 'Needs Improvement',
        description: 'Focus on fundamental concepts and practice more questions.',
        color: 'red'
      });
    }

    // Completion insights
    if (analysis.unansweredQuestions === 0) {
      insights.push({
        type: 'positive',
        icon: CheckCircle,
        title: 'Complete Attempt',
        description: 'You answered all questions - great test-taking discipline!',
        color: 'blue'
      });
    } else if (analysis.unansweredQuestions > analysis.totalQuestions * 0.1) {
      insights.push({
        type: 'warning',
        icon: AlertCircle,
        title: 'Many Unanswered',
        description: `${analysis.unansweredQuestions} questions left unanswered. Work on time management.`,
        color: 'orange'
      });
    }

    return insights;
  }, [analysis]);

  // Topic performance data for visualization
  const topicData = useMemo(() => {
    return Object.entries(analysis.topicPerformance).map(([topic, performance]) => ({
      name: topic,
      accuracy: performance.total > 0 ? Math.round((performance.correct / performance.total) * 100) : 0,
      attempted: performance.total,
      correct: performance.correct
    })).sort((a, b) => b.accuracy - a.accuracy);
  }, [analysis.topicPerformance]);

  const getInsightColor = (color) => {
    const colors = {
      emerald: 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300',
      blue: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300',
      orange: 'bg-orange-50 dark:bg-orange-900/30 border-orange-200 dark:border-orange-700 text-orange-700 dark:text-orange-300',
      red: 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700 text-red-700 dark:text-red-300'
    };
    return colors[color] || colors.blue;
  };

  const getGradeColor = (grade) => {
    const colors = {
      'A+': 'from-emerald-500 to-green-500',
      'A': 'from-green-500 to-emerald-500',
      'B+': 'from-blue-500 to-cyan-500',
      'B': 'from-indigo-500 to-blue-500',
      'C+': 'from-yellow-500 to-orange-500',
      'C': 'from-orange-500 to-red-500',
      'F': 'from-red-500 to-red-600'
    };
    return colors[grade.grade] || colors.B;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/50 w-full max-w-6xl max-h-[95vh] overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/70 dark:bg-gray-900/70">
            <div className="flex items-center gap-3">
              <div className={`p-2 bg-gradient-to-r ${getGradeColor(grade)} rounded-xl`}>
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Performance Analysis</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {testType === 'mock' ? 'Mock Test' : 'Practice Test'} Results & Insights
                </p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Grade Banner */}
          <div className={`p-6 bg-gradient-to-r ${getGradeColor(grade)} text-white`}>
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                className="inline-flex items-center gap-4 mb-4"
              >
                <div className="text-6xl font-bold">{grade.grade}</div>
                <div className="text-left">
                  <div className="text-2xl font-semibold">{analysis.accuracy}%</div>
                  <div className="text-lg opacity-90">{grade.message}</div>
                </div>
              </motion.div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-2xl font-bold">{analysis.correctAnswers}</div>
                  <div className="text-sm opacity-90">Correct</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{analysis.incorrectAnswers}</div>
                  <div className="text-sm opacity-90">Incorrect</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{analysis.unansweredQuestions}</div>
                  <div className="text-sm opacity-90">Unanswered</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{formatTime(timeTaken)}</div>
                  <div className="text-sm opacity-90">Time Used</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'topics', label: 'Topic Analysis', icon: BookOpen },
              { id: 'recommendations', label: 'Recommendations', icon: Zap }
            ].map(tab => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-2 px-6 py-4 transition-all ${
                  activeTab === tab.id
                    ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-white/70 dark:bg-gray-700/70'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span className="font-medium">{tab.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-6 space-y-6"
                >
                  {/* Performance Insights */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                      Performance Insights
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {insights.map((insight, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-4 rounded-2xl border ${getInsightColor(insight.color)}`}
                        >
                          <div className="flex items-start gap-3">
                            <insight.icon className="h-5 w-5 mt-0.5" />
                            <div>
                              <h4 className="font-medium mb-1">{insight.title}</h4>
                              <p className="text-sm opacity-90">{insight.description}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Detailed Statistics */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                      Detailed Statistics
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-2xl border border-blue-200 dark:border-blue-700">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          <span className="text-blue-800 dark:text-blue-200 text-sm font-medium">Accuracy</span>
                        </div>
                        <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                          {analysis.accuracy}%
                        </div>
                      </div>
                      
                      <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-2xl border border-purple-200 dark:border-purple-700">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                          <span className="text-purple-800 dark:text-purple-200 text-sm font-medium">Time Efficiency</span>
                        </div>
                        <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                          {analysis.timeEfficiency}%
                        </div>
                      </div>
                      
                      <div className="p-4 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl border border-emerald-200 dark:border-emerald-700">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-emerald-800 dark:text-emerald-200 text-sm font-medium">Avg. Time/Q</span>
                        </div>
                        <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                          {analysis.averageTimePerQuestion}s
                        </div>
                      </div>
                      
                      <div className="p-4 bg-orange-50 dark:bg-orange-900/30 rounded-2xl border border-orange-200 dark:border-orange-700">
                        <div className="flex items-center gap-2 mb-2">
                          <BarChart3 className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                          <span className="text-orange-800 dark:text-orange-200 text-sm font-medium">Completion</span>
                        </div>
                        <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                          {Math.round(((analysis.totalQuestions - analysis.unansweredQuestions) / analysis.totalQuestions) * 100)}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Performance Comparison */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                      Performance Benchmarks
                    </h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-700 dark:text-gray-300 font-medium">NCE Passing Score</span>
                          <span className="text-gray-900 dark:text-gray-100 font-bold">60%</span>
                        </div>
                        <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-gray-400 to-gray-500 w-[60%]"></div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-indigo-700 dark:text-indigo-300 font-medium">Your Performance</span>
                          <span className="text-indigo-900 dark:text-indigo-100 font-bold">{analysis.accuracy}%</span>
                        </div>
                        <div className="w-full h-3 bg-indigo-200 dark:bg-indigo-800 rounded-full overflow-hidden">
                          <motion.div 
                            className={`h-full bg-gradient-to-r ${getGradeColor(grade)}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${analysis.accuracy}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'topics' && (
                <motion.div
                  key="topics"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
                    Topic-wise Performance Analysis
                  </h3>
                  
                  {topicData.length === 0 ? (
                    <div className="text-center py-12">
                      <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">
                        No topic-specific data available
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {topicData.map((topic, index) => (
                        <motion.div
                          key={topic.name}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-6 bg-white/70 dark:bg-gray-800/70 rounded-2xl border border-gray-200/50 dark:border-gray-700/50"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                              {topic.name}
                            </h4>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                {topic.accuracy}%
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {topic.correct}/{topic.attempted} correct
                              </div>
                            </div>
                          </div>
                          
                          <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full rounded-full ${
                                topic.accuracy >= 80 
                                  ? 'bg-gradient-to-r from-emerald-500 to-green-500'
                                  : topic.accuracy >= 60
                                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                                    : topic.accuracy >= 40
                                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                                      : 'bg-gradient-to-r from-red-500 to-red-600'
                              }`}
                              initial={{ width: 0 }}
                              animate={{ width: `${topic.accuracy}%` }}
                              transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                            />
                          </div>
                          
                          <div className="mt-3 flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                              Strength Level:
                            </span>
                            <span className={`font-medium ${
                              topic.accuracy >= 80 
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : topic.accuracy >= 60
                                  ? 'text-blue-600 dark:text-blue-400'
                                  : topic.accuracy >= 40
                                    ? 'text-yellow-600 dark:text-yellow-400'
                                    : 'text-red-600 dark:text-red-400'
                            }`}>
                              {topic.accuracy >= 80 ? 'Strong' : 
                               topic.accuracy >= 60 ? 'Good' : 
                               topic.accuracy >= 40 ? 'Needs Work' : 'Weak'}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'recommendations' && (
                <motion.div
                  key="recommendations"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
                    Personalized Study Recommendations
                  </h3>
                  
                  <div className="space-y-6">
                    {/* Priority Actions */}
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-500" />
                        Priority Actions
                      </h4>
                      <div className="space-y-3">
                        {analysis.recommendations.map((recommendation, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-xl border border-yellow-200 dark:border-yellow-700"
                          >
                            <div className="w-6 h-6 rounded-full bg-yellow-500 text-white text-sm font-bold flex items-center justify-center mt-0.5">
                              {index + 1}
                            </div>
                            <p className="text-yellow-800 dark:text-yellow-200">{recommendation}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Study Focus Areas */}
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                        <Target className="h-5 w-5 text-red-500" />
                        Study Focus Areas
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {topicData
                          .filter(topic => topic.accuracy < 70)
                          .slice(0, 4)
                          .map((topic, index) => (
                            <motion.div
                              key={topic.name}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="p-4 bg-red-50 dark:bg-red-900/30 rounded-xl border border-red-200 dark:border-red-700"
                            >
                              <h5 className="font-medium text-red-900 dark:text-red-100 mb-2">
                                {topic.name}
                              </h5>
                              <p className="text-red-700 dark:text-red-300 text-sm">
                                Current: {topic.accuracy}% - Practice more questions in this area
                              </p>
                            </motion.div>
                          ))}
                      </div>
                    </div>

                    {/* Next Steps */}
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                        <ChevronRight className="h-5 w-5 text-blue-500" />
                        Recommended Next Steps
                      </h4>
                      <div className="space-y-3">
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-700">
                          <div className="flex items-center gap-3 mb-2">
                            <RefreshCw className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            <span className="font-medium text-blue-900 dark:text-blue-100">Practice More</span>
                          </div>
                          <p className="text-blue-800 dark:text-blue-200 text-sm">
                            Take more practice tests focusing on your weak areas
                          </p>
                        </div>
                        
                        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl border border-emerald-200 dark:border-emerald-700">
                          <div className="flex items-center gap-3 mb-2">
                            <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                            <span className="font-medium text-emerald-900 dark:text-emerald-100">Study Resources</span>
                          </div>
                          <p className="text-emerald-800 dark:text-emerald-200 text-sm">
                            Review chapter notes for topics where you scored below 60%
                          </p>
                        </div>
                        
                        <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-xl border border-purple-200 dark:border-purple-700">
                          <div className="flex items-center gap-3 mb-2">
                            <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            <span className="font-medium text-purple-900 dark:text-purple-100">Time Management</span>
                          </div>
                          <p className="text-purple-800 dark:text-purple-200 text-sm">
                            Practice timed questions to improve your speed and accuracy
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-900/50">
            <button
              onClick={onClose}
              className="px-6 py-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all font-medium"
            >
              Close Analysis
            </button>
            
            <div className="flex gap-3">
              {onRetakeTest && (
                <motion.button
                  onClick={onRetakeTest}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-all"
                >
                  <RefreshCw className="h-4 w-4" />
                  Retake Test
                </motion.button>
              )}
              
              {onNewTest && (
                <motion.button
                  onClick={onNewTest}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-all"
                >
                  <Award className="h-4 w-4" />
                  New Test
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
