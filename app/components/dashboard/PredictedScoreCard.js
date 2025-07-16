// FILE: app/components/dashboard/PredictedScoreCard.js
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, Award, AlertCircle, ChevronDown, Target } from 'lucide-react';
import { calculatePredictedScore } from '@/lib/dashboard-utils';

export function PredictedScoreCard() {
  const [predictedScores, setPredictedScores] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedPaper, setExpandedPaper] = useState(null);

  useEffect(() => {
    fetchPredictedScores();
  }, []);

  const fetchPredictedScores = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/user/learning-analytics');
      const data = await response.json();
      
      if (response.ok) {
        // Use chapterStats for calculation (legacy format is still provided)
        const scores = calculatePredictedScore(data.chapterStats);
        setPredictedScores(scores);
      }
    } catch (error) {
      console.error('Error fetching predicted scores:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPaperColor = (paper) => {
    const colors = {
      paper1: 'from-blue-500 to-indigo-600',
      paper2: 'from-orange-500 to-red-600',
      paper3: 'from-emerald-500 to-cyan-600'
    };
    return colors[paper] || 'from-gray-500 to-gray-600';
  };

  const getScoreStatus = (score) => {
    if (score >= 60) return { text: 'Passing', color: 'text-green-600 dark:text-green-400' };
    if (score >= 50) return { text: 'Borderline', color: 'text-yellow-600 dark:text-yellow-400' };
    return { text: 'Need Improvement', color: 'text-red-600 dark:text-red-400' };
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <Calculator className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Predicted Exam Score
          </h3>
        </div>
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  if (!predictedScores) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <Calculator className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Predicted Exam Score
          </h3>
        </div>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Complete more quizzes to generate score prediction</p>
        </div>
      </div>
    );
  }

  const overallStatus = getScoreStatus(predictedScores.overall);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Calculator className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Predicted Exam Score
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-gray-400" />
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Based on recent performance
          </span>
        </div>
      </div>

      {/* Overall Score */}
      <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-700 dark:text-gray-300 font-medium">Overall Predicted Score</span>
          <span className={`text-sm font-medium ${overallStatus.color}`}>
            {overallStatus.text}
          </span>
        </div>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {predictedScores.overall.toFixed(1)}%
          </span>
          <span className="text-gray-500 dark:text-gray-400 mb-1">/ 100%</span>
        </div>
        <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <motion.div 
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${predictedScores.overall}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Paper-wise Breakdown */}
      <div className="space-y-3 flex-1">
        {Object.entries(predictedScores.papers).map(([paper, data]) => (
          <div key={paper} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <button
              onClick={() => setExpandedPaper(expandedPaper === paper ? null : paper)}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getPaperColor(paper)}`}></div>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {paper.replace('paper', 'Paper ')}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {data.score.toFixed(1)}%
                </span>
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${
                  expandedPaper === paper ? 'rotate-180' : ''
                }`} />
              </div>
            </button>

            {expandedPaper === paper && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700"
              >
                <div className="pt-4 space-y-2">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Chapter-wise Contribution:
                  </div>
                  {data.chapterBreakdown
                    .sort((a, b) => b.contribution - a.contribution)
                    .slice(0, 5)
                    .map((chapter, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700 dark:text-gray-300 truncate max-w-[200px]">
                          {chapter.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {chapter.weightage}% weight
                          </span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            +{chapter.contribution.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  {data.chapterBreakdown.length > 5 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 text-center pt-2">
                      +{data.chapterBreakdown.length - 5} more chapters
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {/* Tips Section */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="flex items-start gap-3">
          <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
              Improvement Tip
            </p>
            <p className="text-xs text-blue-800 dark:text-blue-200">
              {predictedScores.overall < 50 
                ? "Focus on chapters with low accuracy scores to improve your overall performance."
                : predictedScores.overall < 70
                ? "You're on track! Target chapters below 70% accuracy for better results."
                : "Great performance! Maintain consistency and review weak areas periodically."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
