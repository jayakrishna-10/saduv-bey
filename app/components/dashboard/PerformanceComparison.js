// FILE: app/components/dashboard/PerformanceComparison.js
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import { BarChart3, TrendingUp, AlertCircle } from 'lucide-react';
import { fetchChapterWeightages } from '@/lib/weightage-utils';

// Register ChartJS components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export function PerformanceComparison({ analytics }) {
  const [comparisonData, setComparisonData] = useState(null);
  const [viewMode, setViewMode] = useState('radar'); // 'radar' or 'table'
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (analytics?.chapterStatsByPaper) {
      processComparisonData();
    }
  }, [analytics]);

  const processComparisonData = async () => {
    if (!analytics?.chapterStatsByPaper) return;

    setIsLoading(true);
    try {
      // Fetch weightages from database
      const allWeightages = await fetchChapterWeightages();
      
      // Calculate average performance by paper
      const paperStats = {};
      const topChaptersByPaper = {};

      Object.entries(analytics.chapterStatsByPaper).forEach(([paper, chapters]) => {
        let totalWeightedScore = 0;
        let totalWeight = 0;
        let totalQuestions = 0;
        const chapterScores = [];

        Object.entries(chapters).forEach(([chapterName, stats]) => {
          const weightage = allWeightages[paper]?.[chapterName] || 0;
          const accuracy = stats.accuracy || 0;
          
          totalWeightedScore += accuracy * weightage;
          totalWeight += weightage;
          totalQuestions += stats.totalQuestions || 0;
          
          chapterScores.push({
            name: chapterName,
            accuracy,
            questions: stats.totalQuestions || 0,
            weightage
          });
        });

        // Sort chapters by accuracy
        chapterScores.sort((a, b) => b.accuracy - a.accuracy);

        paperStats[paper] = {
          averageScore: totalWeight > 0 ? totalWeightedScore / totalWeight : 0,
          totalQuestions,
          topChapters: chapterScores.slice(0, 3),
          weakChapters: chapterScores.slice(-3).reverse(),
          weightedAverageScore: totalWeight > 0 ? totalWeightedScore / totalWeight : 0
        };

        topChaptersByPaper[paper] = chapterScores.slice(0, 5);
      });

      // Prepare radar chart data
      const labels = ['Accuracy', 'Coverage', 'Consistency', 'Mastery', 'Practice'];
      const datasets = Object.entries(paperStats).map(([paper, stats], index) => {
        const colors = {
          paper1: { border: 'rgb(99, 102, 241)', bg: 'rgba(99, 102, 241, 0.2)' },
          paper2: { border: 'rgb(249, 115, 22)', bg: 'rgba(249, 115, 22, 0.2)' },
          paper3: { border: 'rgb(34, 197, 94)', bg: 'rgba(34, 197, 94, 0.2)' }
        };

        // Calculate metrics
        const accuracy = stats.weightedAverageScore; // Use weighted average instead of simple average
        const coverage = Math.min(100, (stats.totalQuestions / 200) * 100); // Assuming 200 questions is good coverage
        const consistency = calculateConsistency(analytics.chapterStatsByPaper[paper]);
        const mastery = calculateMastery(analytics.chapterStatsByPaper[paper]);
        const practice = Math.min(100, (stats.totalQuestions / 500) * 100); // Practice volume

        return {
          label: paper.replace('paper', 'Paper '),
          data: [accuracy, coverage, consistency, mastery, practice],
          borderColor: colors[paper].border,
          backgroundColor: colors[paper].bg,
          borderWidth: 2,
          pointBackgroundColor: colors[paper].border,
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: colors[paper].border,
        };
      });

      setComparisonData({
        labels,
        datasets,
        paperStats,
        topChaptersByPaper,
        weightagesSource: 'database'
      });
    } catch (error) {
      console.error('Error processing comparison data:', error);
      setComparisonData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateConsistency = (chapters) => {
    const accuracies = Object.values(chapters).map(c => c.accuracy || 0).filter(a => a > 0);
    if (accuracies.length === 0) return 0;
    
    const mean = accuracies.reduce((a, b) => a + b, 0) / accuracies.length;
    const variance = accuracies.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / accuracies.length;
    const stdDev = Math.sqrt(variance);
    
    // Lower std dev = higher consistency (normalized to 0-100 scale)
    return Math.max(0, 100 - (stdDev * 2)); // Multiply by 2 to make it more sensitive
  };

  const calculateMastery = (chapters) => {
    const totalChapters = Object.keys(chapters).length;
    if (totalChapters === 0) return 0;
    
    const masteredCount = Object.values(chapters).filter(c => 
      c.accuracy >= 80 && c.totalQuestions >= 10 // Need at least 10 questions to count as mastered
    ).length;
    
    return (masteredCount / totalChapters) * 100;
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12,
            family: 'Inter, system-ui, sans-serif'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        cornerRadius: 8,
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
        callbacks: {
          label: function(context) {
            const metricName = context.label;
            const value = context.parsed.r.toFixed(1);
            return `${context.dataset.label} ${metricName}: ${value}%`;
          }
        }
      }
    },
    scales: {
      r: {
        angleLines: {
          color: 'rgba(156, 163, 175, 0.2)'
        },
        grid: {
          color: 'rgba(156, 163, 175, 0.2)'
        },
        pointLabels: {
          color: 'rgb(156, 163, 175)',
          font: {
            size: 12,
            family: 'Inter, system-ui, sans-serif'
          }
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
          backdropColor: 'transparent',
          stepSize: 20,
          min: 0,
          max: 100,
          font: {
            size: 10
          }
        }
      }
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center justify-center h-64">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto mb-3"></div>
            <p>Loading performance comparison...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!comparisonData) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center justify-center h-64">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <BarChart3 className="h-8 w-8 mx-auto mb-3 opacity-50" />
            <p>No data available for comparison</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Paper-wise Performance Analysis
        </h3>
        
        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
          <button
            onClick={() => setViewMode('radar')}
            className={`px-3 py-1.5 text-sm rounded transition-colors ${
              viewMode === 'radar'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Radar View
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 text-sm rounded transition-colors ${
              viewMode === 'table'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Details
          </button>
        </div>
      </div>

      {viewMode === 'radar' ? (
        <>
          {/* Radar Chart */}
          <div className="h-80 mb-6">
            <Radar data={comparisonData} options={chartOptions} />
          </div>

          {/* Metric Explanations */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
            {[
              { label: 'Accuracy', desc: 'Weighted by chapter importance' },
              { label: 'Coverage', desc: 'Questions attempted' },
              { label: 'Consistency', desc: 'Performance stability' },
              { label: 'Mastery', desc: 'Chapters above 80%' },
              { label: 'Practice', desc: 'Total practice volume' }
            ].map((metric, index) => (
              <div key={metric.label} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  {metric.label}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {metric.desc}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Detailed Table View */
        <div className="space-y-6">
          {Object.entries(comparisonData.paperStats).map(([paper, stats]) => (
            <div key={paper} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  {paper.replace('paper', 'Paper ')}
                </h4>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Weighted Avg: <span className="font-medium text-gray-900 dark:text-gray-100">
                      {stats.weightedAverageScore.toFixed(1)}%
                    </span>
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    Questions: <span className="font-medium text-gray-900 dark:text-gray-100">
                      {stats.totalQuestions}
                    </span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Top Chapters */}
                <div>
                  <h5 className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">
                    Top Performing Chapters
                  </h5>
                  <div className="space-y-2">
                    {stats.topChapters.map((chapter, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700 dark:text-gray-300 truncate">
                          {chapter.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {chapter.weightage}%
                          </span>
                          <span className="font-medium text-green-600 dark:text-green-400">
                            {chapter.accuracy.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weak Chapters */}
                <div>
                  <h5 className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">
                    Needs Improvement
                  </h5>
                  <div className="space-y-2">
                    {stats.weakChapters.map((chapter, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700 dark:text-gray-300 truncate">
                          {chapter.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {chapter.weightage}%
                          </span>
                          <span className="font-medium text-red-600 dark:text-red-400">
                            {chapter.accuracy.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Data Source Information */}
      <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm text-blue-800 dark:text-blue-200">
            Analysis uses weighted averages based on official NCE chapter weightages from database
          </span>
        </div>
      </div>
    </motion.div>
  );
}
