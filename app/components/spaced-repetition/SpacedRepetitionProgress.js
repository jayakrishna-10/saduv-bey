// app/components/spaced-repetition/SpacedRepetitionProgress.js
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Clock,
  Target,
  Zap,
  Brain,
  Award,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Timer,
  Activity
} from 'lucide-react';

import { CardUtils } from '@/lib/spaced-repetition-utils';

export function SpacedRepetitionProgress({ userStats, onBackToMenu }) {
  const [activeView, setActiveView] = useState('calendar');
  const [selectedTimeRange, setSelectedTimeRange] = useState('30');
  const [scheduleData, setScheduleData] = useState(null);
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Fetch schedule data
  useEffect(() => {
    fetchScheduleData();
  }, [selectedTimeRange]);

  const fetchScheduleData = async () => {
    setIsLoadingSchedule(true);
    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + parseInt(selectedTimeRange));
      
      const params = new URLSearchParams({
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        include_history: 'true'
      });

      const response = await fetch(`/api/spaced-repetition/schedule?${params}`);
      if (response.ok) {
        const result = await response.json();
        setScheduleData(result);
      }
    } catch (error) {
      console.error('Error fetching schedule data:', error);
    } finally {
      setIsLoadingSchedule(false);
    }
  };

  const views = [
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'predictions', label: 'Predictions', icon: TrendingUp },
    { id: 'insights', label: 'Insights', icon: Brain }
  ];

  const timeRanges = [
    { value: '7', label: '7 days' },
    { value: '14', label: '2 weeks' },
    { value: '30', label: '30 days' },
    { value: '90', label: '3 months' }
  ];

  // Calendar view component
  const CalendarView = () => {
    const today = new Date();
    const schedule = scheduleData?.schedule || [];
    
    // Generate calendar days
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const calendarDays = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      const dateStr = current.toISOString().split('T')[0];
      const dayData = schedule.find(s => s.date === dateStr);
      
      calendarDays.push({
        date: new Date(current),
        dateStr,
        isCurrentMonth: current.getMonth() === currentMonth.getMonth(),
        isToday: dateStr === today.toISOString().split('T')[0],
        cardCount: dayData?.total || 0,
        overdue: dayData?.overdue || 0,
        due: dayData?.due || 0,
        data: dayData
      });
      
      current.setDate(current.getDate() + 1);
    }

    const navigateMonth = (direction) => {
      const newMonth = new Date(currentMonth);
      newMonth.setMonth(newMonth.getMonth() + direction);
      setCurrentMonth(newMonth);
    };

    return (
      <div className="space-y-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h3>
            <div className="flex items-center gap-1">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <button
            onClick={() => setCurrentMonth(new Date())}
            className="px-3 py-2 text-sm bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900/70 transition-colors"
          >
            Today
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-700/50">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-600 dark:text-gray-400">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className={`p-2 rounded-lg cursor-pointer transition-all ${
                  !day.isCurrentMonth ? 'opacity-30' :
                  day.isToday ? 'bg-indigo-100 dark:bg-indigo-900/50 border-2 border-indigo-300 dark:border-indigo-600' :
                  day.cardCount > 0 ? 'bg-gray-100 dark:bg-gray-700' :
                  'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <div className="text-center">
                  <div className={`text-sm font-medium ${
                    day.isToday ? 'text-indigo-700 dark:text-indigo-300' :
                    day.isCurrentMonth ? 'text-gray-900 dark:text-gray-100' :
                    'text-gray-400 dark:text-gray-500'
                  }`}>
                    {day.date.getDate()}
                  </div>
                  
                  {day.cardCount > 0 && (
                    <div className="mt-1 space-y-1">
                      <div className={`text-xs px-1 rounded ${
                        day.overdue > 0 ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' :
                        day.due > 0 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' :
                        'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
                      }`}>
                        {day.cardCount}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Schedule Summary */}
        {scheduleData?.summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-4 border border-white/20 dark:border-gray-700/50">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-red-500" />
                <div>
                  <div className="text-2xl font-light text-gray-900 dark:text-gray-100">
                    {scheduleData.summary.overdueCards}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Overdue</div>
                </div>
              </div>
            </div>

            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-4 border border-white/20 dark:border-gray-700/50">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-blue-500" />
                <div>
                  <div className="text-2xl font-light text-gray-900 dark:text-gray-100">
                    {scheduleData.summary.dueTodayCards}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Due Today</div>
                </div>
              </div>
            </div>

            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-4 border border-white/20 dark:border-gray-700/50">
              <div className="flex items-center gap-3">
                <Calendar className="h-8 w-8 text-green-500" />
                <div>
                  <div className="text-2xl font-light text-gray-900 dark:text-gray-100">
                    {scheduleData.summary.dueThisWeekCards}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">This Week</div>
                </div>
              </div>
            </div>

            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-4 border border-white/20 dark:border-gray-700/50">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-purple-500" />
                <div>
                  <div className="text-2xl font-light text-gray-900 dark:text-gray-100">
                    {scheduleData.summary.averageDailyLoad}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Daily Avg</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Analytics view component
  const AnalyticsView = () => (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-700/50">
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Retention Rate</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Overall</span>
              <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {userStats?.retention?.overall || 0}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Recent</span>
              <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {userStats?.retention?.recent || 0}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Trend</span>
              <div className={`flex items-center gap-1 ${
                userStats?.retention?.trend === 'improving' ? 'text-green-600 dark:text-green-400' :
                userStats?.retention?.trend === 'declining' ? 'text-red-600 dark:text-red-400' :
                'text-gray-600 dark:text-gray-400'
              }`}>
                {userStats?.retention?.trend === 'improving' ? <TrendingUp className="h-4 w-4" /> :
                 userStats?.retention?.trend === 'declining' ? <TrendingDown className="h-4 w-4" /> :
                 <Activity className="h-4 w-4" />}
                <span className="text-sm capitalize">{userStats?.retention?.trend || 'stable'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-700/50">
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Study Time</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total</span>
              <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {CardUtils.formatDuration(userStats?.time?.totalStudyTime || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Daily Average</span>
              <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {CardUtils.formatDuration(userStats?.time?.dailyAverage || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Per Card</span>
              <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {userStats?.time?.averageResponseTime || 0}s
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-700/50">
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Card Status</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Cards</span>
              <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {userStats?.cards?.totalCards || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Mature</span>
              <span className="text-lg font-medium text-green-600 dark:text-green-400">
                {userStats?.cards?.byStatus?.mature || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Learning</span>
              <span className="text-lg font-medium text-blue-600 dark:text-blue-400">
                {userStats?.cards?.byStatus?.learning || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Paper Performance Comparison */}
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-700/50">
        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-6">Paper Performance</h4>
        <div className="space-y-4">
          {['paper1', 'paper2', 'paper3'].map((paper, index) => {
            const paperStats = userStats?.papers?.[paper] || {};
            const paperNames = ['Paper 1', 'Paper 2', 'Paper 3'];
            const colors = ['bg-blue-500', 'bg-orange-500', 'bg-emerald-500'];
            
            return (
              <div key={paper} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {paperNames[index]}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {paperStats.accuracy || 0}% accuracy
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${colors[index]} transition-all duration-500`}
                      style={{ width: `${Math.min(paperStats.accuracy || 0, 100)}%` }}
                    />
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 min-w-[80px]">
                    {paperStats.totalCards || 0} cards
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // Predictions view component
  const PredictionsView = () => (
    <div className="space-y-6">
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-700/50">
        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-6">Predicted Exam Scores</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {['paper1', 'paper2', 'paper3', 'overall'].map((paper, index) => {
            const score = userStats?.predictions?.[paper] || 0;
            const paperNames = ['Paper 1', 'Paper 2', 'Paper 3', 'Overall'];
            
            return (
              <div key={paper} className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className={`text-3xl font-light mb-2 ${
                  score >= 80 ? 'text-green-600 dark:text-green-400' :
                  score >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                  'text-red-600 dark:text-red-400'
                }`}>
                  {score}%
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {paperNames[index]}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-700/50">
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Readiness Indicator</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Overall Readiness</span>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                (userStats?.predictions?.overall || 0) >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' :
                (userStats?.predictions?.overall || 0) >= 60 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300' :
                'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
              }`}>
                {(userStats?.predictions?.overall || 0) >= 80 ? 'Ready' :
                 (userStats?.predictions?.overall || 0) >= 60 ? 'Almost Ready' : 'Needs Work'}
              </div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Based on your current performance and retention rates
            </div>
          </div>
        </div>

        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-700/50">
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Recommendations</h4>
          <div className="space-y-3">
            {userStats?.predictions?.overall < 60 && (
              <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                <div className="text-sm">
                  <div className="font-medium text-red-700 dark:text-red-300">Focus on weak areas</div>
                  <div className="text-red-600 dark:text-red-400">Review explanations carefully</div>
                </div>
              </div>
            )}
            {userStats?.predictions?.overall >= 60 && userStats?.predictions?.overall < 80 && (
              <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div className="text-sm">
                  <div className="font-medium text-yellow-700 dark:text-yellow-300">Keep practicing</div>
                  <div className="text-yellow-600 dark:text-yellow-400">You're on the right track</div>
                </div>
              </div>
            )}
            {userStats?.predictions?.overall >= 80 && (
              <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                <div className="text-sm">
                  <div className="font-medium text-green-700 dark:text-green-300">Excellent progress</div>
                  <div className="text-green-600 dark:text-green-400">Maintain consistency</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Insights view component
  const InsightsView = () => (
    <div className="space-y-6">
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-700/50">
        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-6">Learning Insights</h4>
        <div className="space-y-6">
          {/* Study Habits */}
          <div>
            <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Study Habits</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Timer className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium text-gray-900 dark:text-gray-100">Best Study Time</span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Based on your accuracy patterns
                </div>
                <div className="text-lg font-medium text-gray-900 dark:text-gray-100 mt-1">
                  Morning sessions
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="font-medium text-gray-900 dark:text-gray-100">Optimal Session</span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Sweet spot for accuracy
                </div>
                <div className="text-lg font-medium text-gray-900 dark:text-gray-100 mt-1">
                  15-20 cards
                </div>
              </div>
            </div>
          </div>

          {/* Strengths and Weaknesses */}
          <div>
            <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Performance Analysis</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Award className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="font-medium text-green-700 dark:text-green-300">Strengths</span>
                </div>
                <div className="space-y-1 text-sm text-green-600 dark:text-green-400">
                  <div>• Consistent daily practice</div>
                  <div>• Good retention on mature cards</div>
                  <div>• Improving response speed</div>
                </div>
              </div>
              
              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  <span className="font-medium text-orange-700 dark:text-orange-300">Areas to Improve</span>
                </div>
                <div className="space-y-1 text-sm text-orange-600 dark:text-orange-400">
                  <div>• Review overdue cards promptly</div>
                  <div>• Focus on Paper 2 topics</div>
                  <div>• Use difficulty ratings more</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderActiveView = () => {
    switch (activeView) {
      case 'calendar':
        return <CalendarView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'predictions':
        return <PredictionsView />;
      case 'insights':
        return <InsightsView />;
      default:
        return <CalendarView />;
    }
  };

  return (
    <div className="min-h-screen p-6 pt-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-light text-gray-900 dark:text-gray-100 mb-2">
              Progress Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track your learning journey and review schedule
            </p>
          </div>
          
          <button
            onClick={onBackToMenu}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
        </motion.div>

        {/* View Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 p-1 bg-white/50 dark:bg-gray-800/50 rounded-2xl border border-white/20 dark:border-gray-700/50">
          {views.map((view) => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                activeView === view.id
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <view.icon className="h-4 w-4" />
              <span className="text-sm font-medium">{view.label}</span>
            </button>
          ))}
        </div>

        {/* Time Range Selector (for calendar view) */}
        {activeView === 'calendar' && (
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Time Range:</span>
            <div className="flex gap-2">
              {timeRanges.map((range) => (
                <button
                  key={range.value}
                  onClick={() => setSelectedTimeRange(range.value)}
                  className={`px-3 py-1 rounded-lg text-sm transition-all ${
                    selectedTimeRange === range.value
                      ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
            
            <button
              onClick={fetchScheduleData}
              disabled={isLoadingSchedule}
              className="flex items-center gap-2 px-3 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${isLoadingSchedule ? 'animate-spin' : ''}`} />
              <span className="text-sm">Refresh</span>
            </button>
          </div>
        )}

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {isLoadingSchedule && activeView === 'calendar' ? (
              <div className="flex items-center justify-center py-20">
                <RefreshCw className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400" />
              </div>
            ) : (
              renderActiveView()
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
