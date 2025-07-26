// FILE: app/components/dashboard/PredictedScoreRadial.js
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, Info } from 'lucide-react';
import { calculateAllPredictedScores } from '@/lib/weightage-utils';
import React from 'react';

const PredictedScoreRadial = React.memo(({ analytics }) => {
  const [predictedScores, setPredictedScores] = useState(null);
  const [hoveredPaper, setHoveredPaper] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (analytics?.chapterStatsByPaper) {
      calculateScores();
    }
  }, [analytics?.chapterStatsByPaper]);

  const calculateScores = useCallback(async () => {
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
  }, [analytics?.chapterStatsByPaper]);

  const paperConfigs = useMemo(() => ({
    paper1: {
      name: 'Paper 1',
      color: 'from-blue-400 to-indigo-500',
      strokeColor: '#3b82f6',
      bgColor: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20'
    },
    paper2: {
      name: 'Paper 2', 
      color: 'from-orange-400 to-red-500',
      strokeColor: '#f97316',
      bgColor: 'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20'
    },
    paper3: {
      name: 'Paper 3',
      color: 'from-emerald-400 to-cyan-500', 
      strokeColor: '#10b981',
      bgColor: 'from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20'
    }
  }), []);

  const totalScore = useMemo(() => {
    if (!predictedScores) return 0;
    return Math.round((predictedScores.paper1 + predictedScores.paper2 + predictedScores.paper3) / 100 * 150);
  }, [predictedScores]);

  const improvementTip = useMemo(() => {
    if (!predictedScores) return '';
    if (predictedScores.overall < 50) {
      return "Focus on fundamental concepts across all papers to improve your foundation.";
    } else if (predictedScores.overall < 70) {
      return "Great progress! Target your weakest chapters to boost performance.";
    } else {
      return "Excellent work! Fine-tune weak areas to achieve top scores.";
    }
  }, [predictedScores?.overall]);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto mb-3"></div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Calculating predictions...
          </p>
        </div>
      </div>
    );
  }

  if (!predictedScores) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 h-full flex items-center justify-center">
        <div className="text-center">
          <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">
            Complete more quizzes to see predicted scores
          </p>
        </div>
      </div>
    );
  }

  const PaperCircle = React.memo(({ paperKey, index }) => {
    const config = paperConfigs[paperKey];
    const percentage = predictedScores[paperKey];
    const marks = Math.round((percentage / 100) * 50);
    
    const radius = 40;
    const strokeWidth = 6;
    const normalizedRadius = radius - strokeWidth * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div
        onMouseEnter={() => setHoveredPaper(paperKey)}
        onMouseLeave={() => setHoveredPaper(null)}
        className={`relative p-3 rounded-lg bg-gradient-to-br ${config.bgColor} border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow cursor-pointer`}
      >
        <div className="flex flex-col items-center">
          <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
            {config.name}
          </h4>
          
          <div className="relative">
            <svg
              height={radius * 2}
              width={radius * 2}
              className="transform -rotate-90"
            >
              <circle
                stroke="currentColor"
                className="text-gray-200 dark:text-gray-600"
                fill="transparent"
                strokeWidth={strokeWidth}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              <circle
                stroke={config.strokeColor}
                fill="transparent"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset }}
                strokeLinecap="round"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {marks}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                / 50
              </div>
            </div>
          </div>

          <div className={`mt-2 px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${config.color} text-white`}>
            {percentage.toFixed(1)}%
          </div>

          <div className="mt-1 flex items-center gap-1">
            <div className={`w-1.5 h-1.5 rounded-full ${
              marks >= 40 ? 'bg-green-500' : 
              marks >= 30 ? 'bg-blue-500' :
              marks >= 20 ? 'bg-amber-500' : 'bg-red-500'
            }`}></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {marks >= 40 ? 'Excellent' : 
               marks >= 30 ? 'Good' :
               marks >= 20 ? 'Fair' : 'Needs Work'}
            </span>
          </div>
        </div>

        {hoveredPaper === paperKey && (
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full p-2 bg-gray-900 text-white text-xs rounded-lg shadow-xl z-10 pointer-events-none whitespace-nowrap">
            <div className="text-center">
              <div className="font-medium">{config.name}</div>
              <div>{marks} marks out of 50</div>
              <div className="opacity-75">{percentage.toFixed(1)}% accuracy</div>
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        )}
      </div>
    );
  });

  PaperCircle.displayName = 'PaperCircle';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Predicted Scores
        </h3>
        <div className="relative group">
          <Info className="h-4 w-4 text-gray-400 cursor-help" />
          <div className="absolute right-0 top-6 w-48 p-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
            Based on your chapter-wise performance and NCE weightages from database
          </div>
        </div>
      </div>

      {/* Compact Layout with Papers and Summary */}
      <div className="space-y-4">
        {/* Papers Grid - Horizontal on larger screens */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {['paper1', 'paper2', 'paper3'].map((paperKey, index) => (
            <PaperCircle key={paperKey} paperKey={paperKey} index={index} />
          ))}
        </div>

        {/* Compact Summary Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Total Score */}
          <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg">
            <div className="text-center">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                Total Predicted Score
              </div>
              <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {totalScore} / 150
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Combined across all papers
              </div>
            </div>
          </div>

          {/* Improvement Tip */}
          <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg">
            <div className="flex items-start gap-2">
              <TrendingUp className="h-3 w-3 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-indigo-800 dark:text-indigo-200 leading-tight">
                {improvementTip}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Source */}
      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
        Based on NCE weightages • Updated in real-time
      </div>
    </div>
  );
});

PredictedScoreRadial.displayName = 'PredictedScoreRadial';

export { PredictedScoreRadial };
