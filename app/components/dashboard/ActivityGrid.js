// FILE: app/components/dashboard/ActivityGrid.js
'use client';

import { useState, useEffect } from 'react';
import { format, subDays, eachDayOfInterval, startOfYear, endOfYear } from 'date-fns';
import { Activity, Calendar, Target, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

export function ActivityGrid() {
  const [activityData, setActivityData] = useState({ questions: {}, accuracy: {} });
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [selectedView, setSelectedView] = useState('questions'); // 'questions' or 'accuracy'

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
    const colors = {
      questions: [
        'bg-gray-100 dark:bg-gray-800',
        'bg-indigo-200 dark:bg-indigo-900',
        'bg-indigo-400 dark:bg-indigo-700',
        'bg-indigo-600 dark:bg-indigo-500',
        'bg-indigo-800 dark:bg-indigo-400'
      ],
      accuracy: [
        'bg-gray-100 dark:bg-gray-800',
        'bg-red-200 dark:bg-red-900',
        'bg-yellow-200 dark:bg-yellow-900',
        'bg-green-300 dark:bg-green-800',
        'bg-green-500 dark:bg-green-600'
      ]
    };
    return colors[type][level];
  };

  const renderGrid = () => {
    const today = new Date();
    const yearAgo = subDays(today, 364); // 52 weeks
    const days = eachDayOfInterval({ start: yearAgo, end: today });
    
    // Group days by week
    const weeks = [];
    let currentWeek = [];
    
    days.forEach((day, index) => {
      currentWeek.push(day);
      if (day.getDay() === 6 || index === days.length - 1) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    return (
      <div className="flex gap-1">
        {/* Day labels */}
        <div className="flex flex-col gap-1 text-xs text-gray-500 dark:text-gray-400 pr-2">
          <div className="h-3"></div>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
            <div key={day} className="h-3 flex items-center">
              {i % 2 === 0 ? day : ''}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {/* Month label */}
                {weekIndex === 0 || (week[0] && week[0].getDate() <= 7) ? (
                  <div className="h-3 text-xs text-gray-500 dark:text-gray-400">
                    {week[0] ? format(week[0], 'MMM') : ''}
                  </div>
                ) : (
                  <div className="h-3"></div>
                )}
                
                {/* Week cells */}
                {[0, 1, 2, 3, 4, 5, 6].map(dayIndex => {
                  const day = week.find(d => d.getDay() === dayIndex);
                  if (!day) {
                    return <div key={dayIndex} className="w-3 h-3"></div>;
                  }
                  
                  const dateStr = format(day, 'yyyy-MM-dd');
                  const value = selectedView === 'questions' 
                    ? activityData.questions[dateStr] || 0
                    : activityData.accuracy[dateStr] || 0;
                  const level = getIntensityLevel(value, selectedView);
                  
                  return (
                    <motion.div
                      key={dayIndex}
                      className={`w-3 h-3 rounded-sm cursor-pointer transition-all ${
                        getColorClass(level, selectedView)
                      } ${hoveredDate === dateStr ? 'ring-2 ring-indigo-500 dark:ring-indigo-400' : ''}`}
                      onMouseEnter={() => setHoveredDate(dateStr)}
                      onMouseLeave={() => setHoveredDate(null)}
                      whileHover={{ scale: 1.2 }}
                      title={`${format(day, 'MMM dd, yyyy')}: ${
                        selectedView === 'questions' 
                          ? `${value} questions`
                          : `${value}% accuracy`
                      }`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const calculateStreak = () => {
    const today = new Date();
    let streak = 0;
    let currentDate = today;
    
    while (true) {
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      if (activityData.questions[dateStr] && activityData.questions[dateStr] > 0) {
        streak++;
        currentDate = subDays(currentDate, 1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  const calculateTotalDays = () => {
    return Object.keys(activityData.questions).filter(
      date => activityData.questions[date] > 0
    ).length;
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Activity Overview
        </h3>
        <div className="h-40 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  const currentStreak = calculateStreak();
  const totalActiveDays = calculateTotalDays();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Activity Overview
        </h3>
        
        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
          <button
            onClick={() => setSelectedView('questions')}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              selectedView === 'questions'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            Questions
          </button>
          <button
            onClick={() => setSelectedView('accuracy')}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              selectedView === 'accuracy'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            Accuracy
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
            <Flame className="h-6 w-6 text-orange-500" />
            {currentStreak}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Day Streak</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
            <Calendar className="h-6 w-6 text-indigo-500" />
            {totalActiveDays}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Active Days</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
            <Target className="h-6 w-6 text-green-500" />
            {Math.round((totalActiveDays / 365) * 100)}%
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Consistency</p>
        </div>
      </div>

      {/* Activity Grid */}
      <div className="overflow-x-auto">
        {renderGrid()}
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-between">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {selectedView === 'questions' ? 'Questions per day' : 'Daily accuracy'}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">Less</span>
          {[0, 1, 2, 3, 4].map(level => (
            <div
              key={level}
              className={`w-3 h-3 rounded-sm ${getColorClass(level, selectedView)}`}
            />
          ))}
          <span className="text-xs text-gray-500 dark:text-gray-400">More</span>
        </div>
      </div>

      {/* Hover Tooltip */}
      {hoveredDate && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute z-10 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg shadow-lg pointer-events-none"
          style={{
            left: '50%',
            transform: 'translateX(-50%)',
            bottom: '100%',
            marginBottom: '8px'
          }}
        >
          <div className="font-medium">
            {format(new Date(hoveredDate), 'MMMM d, yyyy')}
          </div>
          <div>
            {selectedView === 'questions' 
              ? `${activityData.questions[hoveredDate] || 0} questions attempted`
              : `${activityData.accuracy[hoveredDate] || 0}% accuracy`
            }
          </div>
        </motion.div>
      )}
    </div>
  );
}
