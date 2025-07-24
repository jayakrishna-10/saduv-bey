// FILE: app/components/dashboard/WeakAreasHeatmap.js
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ChevronRight, Target, BookOpen } from 'lucide-react';
import { CHAPTER_WEIGHTAGES } from '@/lib/dashboard-utils';

export function WeakAreasHeatmap({ analytics }) {
  const [heatmapData, setHeatmapData] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState('all');
  const [hoveredChapter, setHoveredChapter] = useState(null);

  useEffect(() => {
    if (analytics?.chapterStatsByPaper) {
      processHeatmapData();
    }
  }, [analytics, selectedPaper]);

  const processHeatmapData = () => {
    if (!analytics?.chapterStatsByPaper) return;

    let allChapters = [];

    if (selectedPaper === 'all') {
      // Combine all papers
      Object.entries(analytics.chapterStatsByPaper).forEach(([paper, chapters]) => {
        Object.entries(chapters).forEach(([chapterName, stats]) => {
          const weightage = CHAPTER_WEIGHTAGES[paper]?.[chapterName] || 0;
          allChapters.push({
            chapter: chapterName,
            paper,
            accuracy: stats.accuracy || 0,
            questions: stats.totalQuestions || 0,
            weightage,
            impact: weightage * (100 - (stats.accuracy || 0)) / 100 // Higher impact for low accuracy + high weightage
          });
        });
      });
    } else {
      // Single paper
      const chapters = analytics.chapterStatsByPaper[selectedPaper] || {};
      Object.entries(chapters).forEach(([chapterName, stats]) => {
        const weightage = CHAPTER_WEIGHTAGES[selectedPaper]?.[chapterName] || 0;
        allChapters.push({
          chapter: chapterName,
          paper: selectedPaper,
          accuracy: stats.accuracy || 0,
          questions: stats.totalQuestions || 0,
          weightage,
          impact: weightage * (100 - (stats.accuracy || 0)) / 100
        });
      });
    }

    // Sort by impact (highest impact = needs most attention)
    allChapters.sort((a, b) => b.impact - a.impact);
    
    // Take top 10 weak areas
    setHeatmapData(allChapters.slice(0, 10));
  };

  const getAccuracyColor = (accuracy) => {
    if (accuracy >= 80) return 'bg-gradient-to-br from-green-500 to-emerald-600';
    if (accuracy >= 70) return 'bg-gradient-to-br from-blue-500 to-cyan-600';
    if (accuracy >= 60) return 'bg-gradient-to-br from-yellow-500 to-amber-600';
    if (accuracy >= 50) return 'bg-gradient-to-br from-orange-500 to-red-600';
    return 'bg-gradient-to-br from-red-600 to-red-800';
  };

  const getAccuracyTextColor = (accuracy) => {
    if (accuracy >= 80) return 'text-green-600 dark:text-green-400';
    if (accuracy >= 70) return 'text-blue-600 dark:text-blue-400';
    if (accuracy >= 60) return 'text-yellow-600 dark:text-yellow-400';
    if (accuracy >= 50) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const papers = [
    { id: 'all', name: 'All Papers' },
    { id: 'paper1', name: 'Paper 1' },
    { id: 'paper2', name: 'Paper 2' },
    { id: 'paper3', name: 'Paper 3' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-red-400 to-orange-500 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Focus Areas
          </h3>
        </div>
        
        {/* Paper Filter */}
        <select
          value={selectedPaper}
          onChange={(e) => setSelectedPaper(e.target.value)}
          className="text-sm px-3 py-1.5 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {papers.map(paper => (
            <option key={paper.id} value={paper.id}>{paper.name}</option>
          ))}
        </select>
      </div>

      {heatmapData.length > 0 ? (
        <div className="space-y-3">
          {heatmapData.map((item, index) => (
            <motion.div
              key={`${item.paper}-${item.chapter}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onMouseEnter={() => setHoveredChapter(item)}
              onMouseLeave={() => setHoveredChapter(null)}
              className="relative group cursor-pointer"
            >
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all">
                {/* Accuracy Indicator */}
                <div className="relative">
                  <div className={`w-12 h-12 rounded-lg ${getAccuracyColor(item.accuracy)} opacity-20`} />
                  <span className={`absolute inset-0 flex items-center justify-center text-sm font-bold ${getAccuracyTextColor(item.accuracy)}`}>
                    {Math.round(item.accuracy)}%
                  </span>
                </div>
                
                {/* Chapter Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                    {item.chapter}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <span>{item.paper.replace('paper', 'Paper ')}</span>
                    <span>•</span>
                    <span>{item.questions} questions</span>
                    <span>•</span>
                    <span>{item.weightage}% weightage</span>
                  </div>
                </div>
                
                {/* Action Icon */}
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
              </div>
              
              {/* Impact Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-orange-400 to-red-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${item.impact * 10}%` }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Target className="h-8 w-8 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No weak areas identified</p>
          <p className="text-xs mt-1">Complete more quizzes to see focus areas</p>
        </div>
      )}

      {/* Tooltip */}
      {hoveredChapter && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed z-50 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-xl pointer-events-none"
          style={{
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <div className="font-medium mb-1">{hoveredChapter.chapter}</div>
          <div className="text-xs opacity-90">
            Impact Score: {(hoveredChapter.impact * 10).toFixed(1)}/10
          </div>
          <div className="text-xs opacity-90 mt-1">
            Click to practice this chapter
          </div>
        </motion.div>
      )}

      {/* Action Button */}
      {heatmapData.length > 0 && (
        <motion.a
          href={`/quiz?paper=${heatmapData[0].paper}&topic=${encodeURIComponent(heatmapData[0].chapter)}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-red-700 transition-all shadow-lg"
        >
          <BookOpen className="h-4 w-4" />
          Practice Weakest Chapter
        </motion.a>
      )}
    </motion.div>
  );
}
