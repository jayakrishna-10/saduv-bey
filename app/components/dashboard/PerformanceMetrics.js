// FILE: app/components/dashboard/PerformanceMetrics.js
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Zap,
  Brain,
  Target,
  Activity
} from 'lucide-react';
import { calculateLearningVelocity, calculateTrends } from '@/lib/dashboard-utils';

export function PerformanceMetrics({ analytics }) {
  const [performanceTrend, setPerformanceTrend] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState('accuracy');

  useEffect(() => {
    if (analytics?.activityData) {
      const trend = calculateTrends(analytics.activityData);
      const velocity = calculateLearningVelocity(analytics.activityData);
      setPerformanceTrend({ ...trend, velocity });
    }
  }, [analytics]);

  // Prepare chart data
  const getChartData = () => {
    if (!analytics?.activityData || analytics.activityData.length === 0) {
      return null;
    }

    const last7Days = analytics.activityData.slice(-7);
    const labels = last7Days.map(d => {
      const date = new Date(d.date);
      return date.toLocaleDateString('en', { weekday: 'short' });
    });

    const datasets = {
      accuracy: {
        label: 'Accuracy %',
        data: last7Days.map(d => d.accuracy || 0),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4
      },
      questions: {
        label: 'Questions',
        data: last7Days.map(d => d.questionsAnswered || 0),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4
      },
      time: {
        label: 'Time (min)',
        data: last7Days.map(d => Math.round((d.timeSpent || 0) / 60)),
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.4
      }
    };

    return {
      labels,
      datasets: [datasets[selectedMetric]]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        cornerRadius: 8,
        titleFont: { size: 14 },
        bodyFont: { size: 13 }
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
          color: 'rgb(156, 163, 175)'
        }
      }
    }
  };

  const getTrendIcon = (direction) => {
    switch (direction) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const metrics = [
    {
      id: 'accuracy',
      label: 'Accuracy Trend',
      icon: Target,
      color: 'from-indigo-500 to-blue-600',
      value: performanceTrend?.recentAverage?.toFixed(1) + '%' || '0%',
      change: performanceTrend?.change || 0
    },
    {
      id: 'questions',
      label: 'Daily Questions',
      icon: Brain,
      color: 'from-green-500 to-emerald-600',
      value: Math.round(analytics?.activityData?.slice(-7).reduce((sum, d) => sum + (d.questionsAnswered || 0), 0) / 7) || 0,
      change: null
    },
    {
      id: 'time',
      label: 'Study Time',
      icon: Activity,
      color: 'from-purple-500 to-pink-600',
      value: Math.round(analytics?.activityData?.slice(-7).reduce((sum, d) => sum + (d.timeSpent || 0), 0) / 420) + 'h' || '0h',
      change: null
    }
  ];

  const chartData = getChartData();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Performance Overview
        </h3>
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-yellow-500" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Last 7 days
          </span>
        </div>
      </div>

      {/* Metric Selector */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const isSelected = selectedMetric === metric.id;
          
          return (
            <button
              key={metric.id}
              onClick={() => setSelectedMetric(metric.id)}
              className={`
                relative p-4 rounded-xl transition-all duration-200 border
                ${isSelected 
                  ? 'bg-gradient-to-br ' + metric.color + ' text-white border-transparent shadow-lg scale-[1.02]'
                  : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                }
              `}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`h-4 w-4 ${isSelected ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
                {metric.change !== null && (
                  <div className="flex items-center gap-1">
                    {getTrendIcon(performanceTrend?.direction)}
                    <span className={`text-xs font-medium ${
                      isSelected ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {Math.abs(metric.change).toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
              <div className={`text-xl font-bold ${isSelected ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                {metric.value}
              </div>
              <div className={`text-xs ${isSelected ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                {metric.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* Chart */}
      <div className="h-48">
        {chartData ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No activity data available</p>
            </div>
          </div>
        )}
      </div>

      {/* Learning Velocity Indicator */}
      {performanceTrend?.velocity && (
        <div className="mt-4 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-sm font-medium text-indigo-900 dark:text-indigo-100">
                Learning Velocity
              </span>
            </div>
            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
              {performanceTrend.velocity.velocity > 0 ? '+' : ''}{performanceTrend.velocity.velocity}% per week
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
