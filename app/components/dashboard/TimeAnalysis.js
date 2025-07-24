// FILE: app/components/dashboard/TimeAnalysis.js
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Doughnut } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Clock, Calendar, TrendingUp, Activity } from 'lucide-react';
import { formatTimeSpent } from '@/lib/dashboard-utils';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

export function TimeAnalysis({ analytics }) {
  const [timeStats, setTimeStats] = useState(null);

  useEffect(() => {
    if (analytics?.activityData) {
      analyzeTimePatterns();
    }
  }, [analytics]);

  const analyzeTimePatterns = () => {
    if (!analytics?.activityData || analytics.activityData.length === 0) return;

    // Analyze by day of week
    const dayOfWeekData = {
      Mon: { time: 0, sessions: 0 },
      Tue: { time: 0, sessions: 0 },
      Wed: { time: 0, sessions: 0 },
      Thu: { time: 0, sessions: 0 },
      Fri: { time: 0, sessions: 0 },
      Sat: { time: 0, sessions: 0 },
      Sun: { time: 0, sessions: 0 }
    };

    // Analyze by time of day (rough estimation based on session patterns)
    const timeOfDayData = {
      morning: 0,   // 6-12
      afternoon: 0, // 12-18
      evening: 0,   // 18-24
      night: 0      // 0-6
    };

    analytics.activityData.forEach(activity => {
      const date = new Date(activity.date);
      const dayName = date.toLocaleDateString('en', { weekday: 'short' });
      
      if (dayOfWeekData[dayName]) {
        dayOfWeekData[dayName].time += activity.timeSpent || 0;
        dayOfWeekData[dayName].sessions += 1;
      }
    });

    // Find most productive day
    const sortedDays = Object.entries(dayOfWeekData)
      .sort((a, b) => b[1].time - a[1].time);
    
    const mostProductiveDay = sortedDays[0][0];
    const totalTimeSpent = Object.values(dayOfWeekData)
      .reduce((sum, day) => sum + day.time, 0);

    // Calculate average session duration
    const totalSessions = analytics.activityData.filter(a => a.timeSpent > 0).length;
    const avgSessionDuration = totalSessions > 0 ? totalTimeSpent / totalSessions : 0;

    // Prepare chart data
    const chartData = {
      labels: Object.keys(dayOfWeekData),
      datasets: [{
        data: Object.values(dayOfWeekData).map(d => Math.round(d.time / 60)), // Convert to minutes
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',   // Monday - Indigo
          'rgba(139, 92, 246, 0.8)',  // Tuesday - Violet
          'rgba(168, 85, 247, 0.8)',  // Wednesday - Purple
          'rgba(217, 70, 239, 0.8)',  // Thursday - Fuchsia
          'rgba(236, 72, 153, 0.8)',  // Friday - Pink
          'rgba(251, 146, 60, 0.8)',  // Saturday - Orange
          'rgba(251, 191, 36, 0.8)'   // Sunday - Amber
        ],
        borderColor: [
          'rgb(99, 102, 241)',
          'rgb(139, 92, 246)',
          'rgb(168, 85, 247)',
          'rgb(217, 70, 239)',
          'rgb(236, 72, 153)',
          'rgb(251, 146, 60)',
          'rgb(251, 191, 36)'
        ],
        borderWidth: 2
      }]
    };

    setTimeStats({
      chartData,
      mostProductiveDay,
      totalTimeSpent,
      avgSessionDuration,
      dayOfWeekData
    });
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            return context.label + ': ' + context.parsed + ' min';
          }
        }
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 h-full"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg">
          <Clock className="h-5 w-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Time Analysis
        </h3>
      </div>

      {timeStats ? (
        <>
          {/* Total Time Card */}
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Study Time</span>
              <Activity className="h-4 w-4 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {formatTimeSpent(timeStats.totalTimeSpent)}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Avg session: {Math.round(timeStats.avgSessionDuration / 60)}m
            </div>
          </div>

          {/* Day Distribution Chart */}
          <div className="h-48 mb-6">
            <Doughnut data={timeStats.chartData} options={chartOptions} />
          </div>

          {/* Most Productive Day */}
          <div className="mb-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-sm font-medium text-indigo-900 dark:text-indigo-100">
                  Most Productive Day
                </span>
              </div>
              <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                {timeStats.mostProductiveDay}
              </span>
            </div>
          </div>

          {/* Day Breakdown */}
          <div className="space-y-2">
            {Object.entries(timeStats.dayOfWeekData)
              .sort((a, b) => b[1].time - a[1].time)
              .slice(0, 3)
              .map(([day, data]) => (
                <div key={day} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{day}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {Math.round(data.time / 60)}m
                  </span>
                </div>
              ))}
          </div>

          {/* Insight */}
          <div className="mt-4 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg">
            <div className="flex items-start gap-2">
              <TrendingUp className="h-4 w-4 text-indigo-600 dark:text-indigo-400 mt-0.5" />
              <p className="text-xs text-indigo-800 dark:text-indigo-200">
                You study most on {timeStats.mostProductiveDay}s. 
                Try to maintain consistency across all days.
              </p>
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          <div className="text-center">
            <Clock className="h-8 w-8 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No time data available</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
