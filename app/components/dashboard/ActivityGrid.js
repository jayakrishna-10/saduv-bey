// FILE: app/components/dashboard/ActivityGrid.js
'use client';

import { useState, useEffect } from 'react';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import { Activity, Calendar, Target, Flame, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export function ActivityGrid() {
  const [activityData, setActivityData] = useState({ questions: {}, accuracy: {} });
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [selectedView, setSelectedView] = useState('questions'); // 'questions' or 'accuracy'
  const [statistics, setStatistics] = useState(null);

  useEffect(() => {
    fetchActivityData();
  }, []);

  const fetchActivityData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/user/activity-grid');
      const data = await response.json();
      
      if (response.ok) {
        // Convert array data to object for easier lookup
        const questionsMap = {};
        const accuracyMap = {};
        
        data.questionsGrid.forEach(item => {
          questionsMap[item.date] = item.count;
        });
        
        data.accuracyGrid.forEach(item => {
          accuracyMap[item.date] = item.accuracy;
        });
        
        setActivityData({
          questions: questionsMap,
          accuracy: accuracyMap
        });
        
        setStatistics(data.statistics);
      }
    } catch (error) {
      console.error('Error fetching activity data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getIntensityLevel = (value, type) => {
    if (!value || value === 0) return 0;
    
    if (type === 'questions') {
      if (value >= 50) return 4;
      if (value >= 30) return 3;
      if (value >= 15) return 2;
      if (value >= 1) return 1;
    } else { // accuracy
      if (value >= 80) return 4;
      if (value >= 60) return 3;
      if (value >= 40) return 2;
      if (value >= 1) return 1;
    }
    return 0;
  };

  const getColorClass = (level, type) => {
    if (type === 'questions') {
      switch (level) {
        case 0: return 'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700';
        case 1: return 'bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900 dark:to-indigo-800';
        case 2: return 'bg-gradient-to-br from-indigo-300 to-indigo-400 dark:from-indigo-700 dark:to-indigo-600';
        case 3: return 'bg-gradient-to-br from-indigo-500 to-indigo-600 dark:from-indigo-500 dark:to-indigo-400';
        case 4: return 'bg-gradient-to-br from-indigo-700 to-indigo-800 dark:from-indigo-400 dark:to-indigo-300';
      }
    } else {
      switch (level) {
        case 0: return 'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700';
        case 1: return 'bg-gradient-to-br from-red-200 to-red-300 dark:from-red-900 dark:to-red-800';
        case 2: return 'bg-gradient-to-br from-amber-200 to-amber-300 dark:from-amber-900 dark:to-amber-800';
        case 3: return 'bg-gradient-to-br from-emerald-300 to-emerald-400 dark:from-emerald-800 dark:to-emerald-700';
        case 4: return 'bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-500';
      }
    }
  };

  const renderGrid = () => {
    const today = new Date();
    const thirtyDaysAgo = subDays(today, 29); // 30 days including today
    const days = eachDayOfInterval({ start: thirtyDaysAgo, end: today });
    
    // Group days by week (7 days each)
    const weeks = [];
    let currentWeek = [];
    
    days.forEach((day, index) => {
      currentWeek.push(day);
      if (currentWeek.length === 7 || index === days.length - 1) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    return (
      <div className="flex flex-col gap-2">
        {/* Day labels */}
        <div className="flex gap-1 text-xs text-gray-500 dark:text-gray-400 mb-2">
          <div className="w-8 text-center">Mon</div>
          <div className="w-8 text-center">Tue</div>
          <div className="w-8 text-center">Wed</div>
          <div className="w-8 text-center">Thu</div>
          <div className="w-8 text-center">Fri</div>
          <div className="w-8 text-center">Sat</div>
          <div className="w-8 text-center">Sun</div>
        </div>

        {/* Grid */}
        <div className="space-y-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex gap-1">
              {[0, 1, 2, 3, 4, 5, 6].map(dayIndex => {
                const day = week[dayIndex];
                if (!day) {
                  return <div key={dayIndex} className="w-8 h-8"></div>;
                }
                
                const dateStr = format(day, 'yyyy-MM-dd');
                const value = selectedView === 'questions' 
                  ? activityData.questions[dateStr] || 0
                  : activityData.accuracy[dateStr] || 0;
                const level = getIntensityLevel(value, selectedView);
                
                return (
                  <motion.div
                    key={dayIndex}
                    className={`w-8 h-8 rounded cursor-pointer transition-all ${
                      getColorClass(level, selectedView)
                    } ${hoveredDate === dateStr ? 'ring-2 ring-indigo-500 dark:ring-indigo-400 scale-110' : ''}`}
                    onMouseEnter={() => setHoveredDate(dateStr)}
                    onMouseLeave={() => setHoveredDate(null)}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.1 }}
                    title={`${format(day, 'MMM d, yyyy')}: ${value}${selectedView === 'questions' ? ' questions' : '% accuracy'}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Activity Heatmap
        </h3>
        <div className="h-40 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      </motion.div>
    );
  }

  const currentStreak = statistics?.currentStreak || 0;
  const longestStreak = statistics?.longestStreak || 0;
  const totalActiveDays = statistics?.activeDays || 0;
  const activityRate = statistics?.activityRate || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg">
            <Calendar className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            30-Day Activity
          </h3>
        </div>
        
        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
          <button
            onClick={() => setSelectedView('questions')}
            className={`px-3 py-1.5 text-sm rounded transition-all ${
              selectedView === 'questions'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            Volume
          </button>
          <button
            onClick={() => setSelectedView('accuracy')}
            className={`px-3 py-1.5 text-sm rounded transition-all ${
              selectedView === 'accuracy'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            Accuracy
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-3 border border-orange-200 dark:border-orange-700"
        >
          <div className="flex items-center gap-2 mb-1">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="text-xs text-gray-600 dark:text-gray-400">Current</span>
          </div>
          <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {currentStreak}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">days</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-3 border border-purple-200 dark:border-purple-700"
        >
          <div className="flex items-center gap-2 mb-1">
            <Target className="h-4 w-4 text-purple-500" />
            <span className="text-xs text-gray-600 dark:text-gray-400">Best</span>
          </div>
          <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {longestStreak}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">days</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-3 border border-blue-200 dark:border-blue-700"
        >
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-4 w-4 text-blue-500" />
            <span className="text-xs text-gray-600 dark:text-gray-400">Active</span>
          </div>
          <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {totalActiveDays}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">days</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-3 border border-green-200 dark:border-green-700"
        >
          <div className="flex items-center gap-2 mb-1">
            <Target className="h-4 w-4 text-green-500" />
            <span className="text-xs text-gray-600 dark:text-gray-400">Rate</span>
          </div>
          <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {activityRate}%
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">active</div>
        </motion.div>
      </div>

      {/* Activity Grid */}
      <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
        {renderGrid()}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Info className="h-3 w-3 text-gray-400" />
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {selectedView === 'questions' ? 'Questions per day' : 'Daily accuracy percentage'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">Less</span>
          {[0, 1, 2, 3, 4].map(level => (
            <motion.div
              key={level}
              whileHover={{ scale: 1.2 }}
              className={`w-3 h-3 rounded ${getColorClass(level, selectedView)}`}
            />
          ))}
          <span className="text-xs text-gray-500 dark:text-gray-400">More</span>
        </div>
      </div>

      {/* Hover Tooltip */}
      {hoveredDate && activityData.questions[hoveredDate] !== undefined && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed z-50 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-xl pointer-events-none"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="font-medium mb-1">
            {format(new Date(hoveredDate), 'MMMM d, yyyy')}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
              <span>{activityData.questions[hoveredDate] || 0} questions</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>{activityData.accuracy[hoveredDate] || 0}% accuracy</span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
