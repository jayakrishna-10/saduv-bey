// FILE: app/components/dashboard/PredictedScoreRadial.js
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, Award, Info } from 'lucide-react';
import { calculateAllPredictedScores } from '@/lib/weightage-utils';

export function PredictedScoreRadial({ analytics }) {
  const [predictedScores, setPredictedScores] = useState(null);
  const [hoveredPaper, setHoveredPaper] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (analytics?.chapterStatsByPaper) {
      calculateScores();
    }
  }, [analytics]);

  const calculateScores = async () => {
    setIsLoading(true);
    try {
      const scores = await calculateAllPredictedScores(analytics.chapterStatsByPaper);
      setPredictedScores(scores);
    } catch (error) {
      console.error('Error calculating predicted scores:', error);
      setPredictedScores(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981'; // green
    if (score >= 60) return '#3b82f6'; // blue
    if (score >= 40) return '#f59e0b'; // amber
    return '#ef4444'; // red
  };

  const getGradientColors = (score) => {
    if (score >= 80) return 'from-emerald-400 to-green-500';
    if (score >= 60) return 'from-blue-400 to-indigo-500';
    if (score >= 40) return 'from-amber-400 to-orange-500';
    return 'from-red-400 to-pink-500';
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 h-full flex items-center justify-center"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto mb-3"></div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Calculating predictions...
          </p>
        </div>
      </motion.div>
    );
  }

  if (!predictedScores) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 h-full flex items-center justify-center"
      >
        <div className="text-center">
          <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">
            Complete more quizzes to see predicted score
          </p>
        </div>
      </motion.div>
    );
  }

  const overallScore = predictedScores.overall;
  const radius = 70;
  const strokeWidth = 12;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Predicted Score
        </h3>
        <div className="relative group">
          <Info className="h-4 w-4 text-gray-400 cursor-help" />
          <div className="absolute right-0 top-6 w-48 p-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
            Based on your chapter-wise performance and official NCE weightages from database
          </div>
        </div>
      </div>

      {/* Radial Progress */}
      <div className="flex flex-col items-center justify-center py-4">
        <div className="relative">
          <svg
            height={radius * 2}
            width={radius * 2}
            className="transform -rotate-90"
          >
            {/* Background circle */}
            <circle
              stroke="currentColor"
              className="text-gray-200 dark:text-gray-700"
              fill="transparent"
              strokeWidth={strokeWidth}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            {/* Progress circle */}
            <motion.circle
              stroke={getScoreColor(overallScore)}
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference + ' ' + circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: "easeOut" }}
              strokeLinecap="round"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
          </svg>
          
          {/* Score Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {Math.round(overallScore)}%
              </div>
              <div className="text-lg font-bold text-gray-600 dark:text-gray-400">
                {getScoreGrade(overallScore)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Overall
              </div>
            </motion.div>
          </div>
        </div>

        {/* Status Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className={`mt-4 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getGradientColors(overallScore)} text-white`}
        >
          {overallScore >= 60 ? 'Passing' : overallScore >= 50 ? 'Borderline' : 'Need Improvement'}
        </motion.div>
      </div>

      {/* Paper-wise Breakdown */}
      <div className="space-y-3 mt-6">
        {[
          { key: 'paper1', name: 'Paper 1', color: 'from-blue-400 to-indigo-500' },
          { key: 'paper2', name: 'Paper 2', color: 'from-orange-400 to-red-500' },
          { key: 'paper3', name: 'Paper 3', color: 'from-emerald-400 to-cyan-500' }
        ].map((paper, index) => (
          <motion.div
            key={paper.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            onMouseEnter={() => setHoveredPaper(paper.key)}
            onMouseLeave={() => setHoveredPaper(null)}
            className="relative group"
          >
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {paper.name}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  {predictedScores[paper.key].toFixed(1)}%
                </span>
                <span className="text-xs font-bold text-gray-600 dark:text-gray-400 w-6 text-center">
                  {getScoreGrade(predictedScores[paper.key])}
                </span>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${paper.color}`}
                initial={{ width: 0 }}
                animate={{ width: `${predictedScores[paper.key]}%` }}
                transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
              />
            </div>

            {/* Hover Tooltip */}
            {hoveredPaper === paper.key && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-0 top-full mt-2 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-xl z-10 pointer-events-none whitespace-nowrap"
              >
                {paper.name}: {predictedScores[paper.key].toFixed(1)}% (Grade {getScoreGrade(predictedScores[paper.key])})
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Score Breakdown */}
      <div className="mt-6 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Best Paper</div>
            <div className="font-bold text-gray-900 dark:text-gray-100">
              {Math.max(predictedScores.paper1, predictedScores.paper2, predictedScores.paper3).toFixed(0)}%
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Average</div>
            <div className="font-bold text-gray-900 dark:text-gray-100">
              {overallScore.toFixed(0)}%
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Weakest Paper</div>
            <div className="font-bold text-gray-900 dark:text-gray-100">
              {Math.min(predictedScores.paper1, predictedScores.paper2, predictedScores.paper3).toFixed(0)}%
            </div>
          </div>
        </div>
      </div>

      {/* Improvement Tip */}
      <div className="mt-4 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg">
        <div className="flex items-start gap-2">
          <TrendingUp className="h-4 w-4 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-indigo-800 dark:text-indigo-200">
            {overallScore < 50 
              ? "Focus on fundamental concepts across all papers to improve your foundation."
              : overallScore < 70
              ? "Great progress! Target your weakest paper to boost overall performance."
              : "Excellent work! Fine-tune weak chapters to achieve top scores."}
          </div>
        </div>
      </div>

      {/* Data Source */}
      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
        Based on official NCE weightages • Updated in real-time
      </div>
    </motion.div>
  );
}
