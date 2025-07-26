// FILE: app/components/dashboard/ProgressView.js
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import { 
  TrendingUp, 
  Calendar,
  Target,
  Award,
  ChevronDown,
  Zap,
  Filter,
  CheckCircle
} from 'lucide-react';
import { format, subDays } from 'date-fns';
import { calculateLearningVelocity, calculateMasteryLevels } from '@/lib/dashboard-utils';

export function ProgressView({ analytics, recentActivity }) {
  const [timeRange, setTimeRange] = useState(30); // days
  const [progressData, setProgressData] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState('overall');

  useEffect(() => {
    if (analytics) {
      processProgressData();
    }
  }, [analytics, timeRange, selectedMetric]);

  const processProgressData = () => {
    if (!analytics?.activityData || analytics.activityData.length === 0) return;

    const endDate = new Date();
    const startDate = subDays(endDate, timeRange);
    
    // Filter data by time range
    const filteredData = analytics.activityData.filter(d => {
      const date = new Date(d.date);
      return date >= startDate && date <= endDate;
    });

    // Generate labels for all days in range
    const labels = [];
    const dateMap = new Map();
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = format(new Date(d), 'MMM dd');
      labels.push(dateStr);
      dateMap.set(dateStr, 0);
    }

    // Process data based on selected metric
    let dataPoints = [];
    let cumulativeQuestions = 0;
    let cumulativeCorrect = 0;

    if (selectedMetric === 'overall') {
      // Overall progress (cumulative accuracy)
      filteredData.forEach(d => {
        const dateStr = format(new Date(d.date), 'MMM dd');
        cumulativeQuestions += d.questionsAnswered || 0;
        cumulativeCorrect += Math.round((d.questionsAnswered || 0) * (d.accuracy || 0) / 100);
        const cumulativeAccuracy = cumulativeQuestions > 0 ? (cumulativeCorrect / cumulativeQuestions) * 100 : 0;
        dateMap.set(dateStr, cumulativeAccuracy);
      });
    } else if (selectedMetric === 'daily') {
      // Daily accuracy
      filteredData.forEach(d => {
        const dateStr = format(new Date(d.date), 'MMM dd');
        dateMap.set(dateStr, d.accuracy || 0);
      });
    } else if (selectedMetric === 'volume') {
      // Questions volume
      filteredData.forEach(d => {
        const dateStr = format(new Date(d.date), 'MMM dd');
        dateMap.set(dateStr, d.questionsAnswered || 0);
      });
    }

    dataPoints = labels.map(label => dateMap.get(label) || 0);

    // Calculate milestones
    const milestones = calculateMilestones(analytics, recentActivity);
    const velocity = calculateLearningVelocity(filteredData);

    setProgressData({
      labels,
      dataPoints,
      milestones,
      velocity,
      summary: calculateProgressSummary(analytics, filteredData)
    });
  };

  const calculateMilestones = (analytics, recentActivity) => {
    const milestones = [];
    const totalQuestions = analytics.totalStats?.questionsAttempted || 0;
    const overallAccuracy = analytics.analytics?.overall_accuracy || 0;
    
    // Question milestones
    if (totalQuestions >= 100) {
      milestones.push({
        type: 'questions',
        value: 100,
        label: 'First 100 Questions',
        achieved: true,
        icon: Target
      });
    }
    
    if (totalQuestions >= 500) {
      milestones.push({
        type: 'questions',
        value: 500,
        label: '500 Questions',
        achieved: true,
        icon: Award
      });
    }

    // Accuracy milestones
    if (overallAccuracy >= 70) {
      milestones.push({
        type: 'accuracy',
        value: 70,
        label: '70% Accuracy',
        achieved: true,
        icon: Zap
      });
    }

    // Next milestones
    const nextQuestionMilestone = totalQuestions < 100 ? 100 : 
                                 totalQuestions < 500 ? 500 : 
                                 totalQuestions < 1000 ? 1000 : 2000;
    
    milestones.push({
      type: 'questions',
      value: nextQuestionMilestone,
      label: `${nextQuestionMilestone} Questions`,
      achieved: false,
      progress: (totalQuestions / nextQuestionMilestone) * 100,
      remaining: nextQuestionMilestone - totalQuestions,
      icon: Target
    });

    return milestones.slice(0, 4);
  };

  const calculateProgressSummary = (analytics, filteredData) => {
    const totalDays = filteredData.length;
    const activeDays = filteredData.filter(d => d.questionsAnswered > 0).length;
    const avgAccuracy = filteredData.reduce((sum, d) => sum + (d.accuracy || 0), 0) / (activeDays || 1);
    const totalQuestions = filteredData.reduce((sum, d) => sum + (d.questionsAnswered || 0), 0);

    return {
      totalDays,
      activeDays,
      avgAccuracy,
      totalQuestions,
      consistency: activeDays > 0 ? (activeDays / totalDays) * 100 : 0
    };
  };

  const chartData = {
    labels: progressData?.labels || [],
    datasets: [{
      label: selectedMetric === 'overall' ? 'Cumulative Accuracy %' :
             selectedMetric === 'daily' ? 'Daily Accuracy %' :
             'Questions Answered',
      data: progressData?.dataPoints || [],
      borderColor: 'rgb(99, 102, 241)',
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      tension: 0.4,
      fill: true,
      pointRadius: 0,
      pointHoverRadius: 4,
      borderWidth: 2
    }]
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
        bodyFont: { size: 13 },
        callbacks: {
          label: function(context) {
            const value = context.parsed.y;
            if (selectedMetric === 'volume') {
              return `Questions: ${Math.round(value)}`;
            }
            return `${context.dataset.label}: ${value.toFixed(1)}%`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { 
          font: { size: 11 },
          color: 'rgb(156, 163, 175)',
          maxRotation: 45,
          minRotation: 45
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
          callback: function(value) {
            return selectedMetric === 'volume' ? value : value + '%';
          }
        }
      }
    }
  };

  const metrics = [
    { id: 'overall', label: 'Overall Progress', icon: TrendingUp },
    { id: 'daily', label: 'Daily Accuracy', icon: Target },
    { id: 'volume', label: 'Study Volume', icon: Calendar }
  ];

  const timeRanges = [
    { value: 7, label: '7 days' },
    { value: 30, label: '30 days' },
    { value: 90, label: '90 days' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Progress Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Learning Progress
          </h3>
          
          {/* Controls */}
          <div className="flex items-center gap-3">
            {/* Metric Selector */}
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
              {metrics.map(metric => {
                const Icon = metric.icon;
                return (
                  <button
                    key={metric.id}
                    onClick={() => setSelectedMetric(metric.id)}
                    className={`p-2 rounded transition-colors ${
                      selectedMetric === metric.id
                        ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                    title={metric.label}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                );
              })}
            </div>

            {/* Time Range Selector */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(Number(e.target.value))}
              className="text-sm px-3 py-1.5 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {timeRanges.map(range => (
                <option key={range.value} value={range.value}>{range.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Chart */}
        <div className="h-64 mb-6">
          <Line data={chartData} options={chartOptions} />
        </div>

        {/* Summary Stats */}
        {progressData?.summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {progressData.summary.activeDays}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Active Days</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {progressData.summary.totalQuestions}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Questions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {progressData.summary.avgAccuracy.toFixed(1)}%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Avg Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {progressData.summary.consistency.toFixed(0)}%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Consistency</div>
            </div>
          </div>
        )}
      </div>

      {/* Milestones */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
          Milestones & Achievements
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {progressData?.milestones.map((milestone, index) => {
            const Icon = milestone.icon;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl border ${
                  milestone.achieved
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700'
                    : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    milestone.achieved
                      ? 'bg-gradient-to-br from-green-400 to-emerald-500'
                      : 'bg-gradient-to-br from-gray-400 to-gray-500'
                  }`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className={`font-medium ${
                      milestone.achieved
                        ? 'text-green-900 dark:text-green-100'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {milestone.label}
                    </h4>
                    
                    {!milestone.achieved && milestone.progress && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                          <span>Progress</span>
                          <span>{milestone.progress.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${milestone.progress}%` }}
                            transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {milestone.remaining} more to go
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {milestone.achieved && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="text-green-500"
                    >
                      <CheckCircle className="h-5 w-5" />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Learning Velocity */}
      {progressData?.velocity && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-indigo-200 dark:border-indigo-700">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-indigo-900 dark:text-indigo-100 mb-1">
                Learning Velocity
              </h4>
              <p className="text-sm text-indigo-700 dark:text-indigo-300">
                Your improvement rate over the selected period
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {progressData.velocity.velocity > 0 ? '+' : ''}{progressData.velocity.velocity}%
              </div>
              <div className="text-xs text-indigo-600 dark:text-indigo-400">
                per week
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
