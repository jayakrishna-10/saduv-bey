// FILE: app/components/dashboard/PredictedScoreCard.js
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, Award, AlertCircle, ChevronDown, Target } from 'lucide-react';
import { calculateAllPredictedScores } from '@/lib/weightage-utils';

export function PredictedScoreCard() {
  const [predictedScores, setPredictedScores] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedPaper, setExpandedPaper] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPredictedScores();
  }, []);

  const fetchPredictedScores = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/user/learning-analytics');
      const data = await response.json();
      
      if (response.ok) {
        // Use the new weightage-based calculation
        const scores = await calculateAllPredictedScores(data.chapterStatsByPaper);
        
        // Format scores for display
        setPredictedScores({
          overall: scores.overall,
          papers: {
            paper1: {
              score: scores.paper1,
              name: 'Paper 1'
            },
            paper2: {
              score: scores.paper2,
              name: 'Paper 2'
            },
            paper3: {
              score: scores.paper3,
              name: 'Paper 3'
            }
          }
        });
      } else {
        setError(data.error || 'Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching predicted scores:', error);
      setError('Network error occurred');
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

  const getScoreGrade = (score) => {
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'F';
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

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <Calculator className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Predicted Exam Score
          </h3>
        </div>
        <div className="text-center py-8 text-red-500 dark:text-red-400">
          <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">{error}</p>
          <button 
            onClick={fetchPredictedScores}
            className="mt-2 text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Try again
          </button>
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
            Based on NCE weightages
          </span>
        </div>
      </div>

      {/* Overall Score */}
      <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-700 dark:text-gray-300 font-medium">Overall Predicted Score</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {getScoreGrade(predictedScores.overall)}
            </span>
            <span className={`text-sm font-medium ${overallStatus.color}`}>
              {overallStatus.text}
            </span>
          </div>
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
            animate={{ width: `${Math.min(100, predictedScores.overall)}%` }}
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
                  {data.name}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {data.score.toFixed(1)}%
                </span>
                <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
                  {getScoreGrade(data.score)}
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
                <div className="pt-4">
                  {/* Score Progress Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Score Progress</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {data.score.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full bg-gradient-to-r ${getPaperColor(paper)}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, data.score)}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                      />
                    </div>
                  </div>

                  {/* Status Info */}
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Grade:</span>
                        <span className="font-bold text-gray-900 dark:text-gray-100">
                          {getScoreGrade(data.score)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Status:</span>
                        <span className={`font-medium ${getScoreStatus(data.score).color}`}>
                          {getScoreStatus(data.score).text}
                        </span>
                      </div>
                    </div>
                  </div>
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
                ? "Focus on fundamental concepts and practice consistently to improve your foundation."
                : predictedScores.overall < 70
                ? "You're making good progress! Target weak chapters to boost your overall performance."
                : "Excellent work! Maintain consistency and focus on perfecting difficult areas."}
            </p>
          </div>
        </div>
      </div>

      {/* Data Source Info */}
      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
        Scores calculated using official NCE chapter weightages from database
      </div>
    </div>
  );
}
