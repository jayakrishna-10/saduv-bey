// app/components/spaced-repetition/SpacedRepetitionSelector.js
'use client';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Clock, 
  Target, 
  TrendingUp,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Plus,
  RefreshCw,
  Zap,
  Play,
  BarChart3,
  BookOpen,
  Timer
} from 'lucide-react';

const PAPERS = {
  paper1: {
    id: 'paper1',
    name: 'Paper 1',
    description: 'General Aspects of Energy Management',
    color: 'from-blue-500 to-indigo-600',
    gradient: 'bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30',
    icon: '📊'
  },
  paper2: {
    id: 'paper2',
    name: 'Paper 2', 
    description: 'Energy Efficiency in Thermal Utilities',
    color: 'from-orange-500 to-red-600',
    gradient: 'bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-900/30 dark:to-red-900/30',
    icon: '🔥'
  },
  paper3: {
    id: 'paper3',
    name: 'Paper 3',
    description: 'Energy Efficiency in Electrical Utilities',
    color: 'from-emerald-500 to-cyan-600',
    gradient: 'bg-gradient-to-br from-emerald-50 to-cyan-100 dark:from-emerald-900/30 dark:to-cyan-900/30',
    icon: '⚡'
  }
};

export function SpacedRepetitionSelector({ onStartSession, userStats }) {
  const { data: session } = useSession();
  const [cardStats, setCardStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [dailyGoalProgress, setDailyGoalProgress] = useState(0);
  const [recommendations, setRecommendations] = useState([]);

  // Fetch card statistics for each paper
  useEffect(() => {
    const fetchCardStats = async () => {
      setIsLoading(true);
      
      try {
        // Fetch stats for each paper
        const papers = ['paper1', 'paper2', 'paper3', 'all'];
        const statsPromises = papers.map(async paper => {
          const response = await fetch(`/api/spaced-repetition/cards?paper=${paper}&limit=0`);
          if (response.ok) {
            const result = await response.json();
            return { paper, meta: result.meta };
          }
          return { paper, meta: null };
        });

        const results = await Promise.all(statsPromises);
        const stats = {};
        
        results.forEach(({ paper, meta }) => {
          if (meta) {
            stats[paper] = meta;
          }
        });
        
        setCardStats(stats);
        
        // Calculate daily goal progress
        const todaysDue = stats.all?.dueCards || 0;
        const dailyGoal = 20; // Default daily goal
        setDailyGoalProgress(Math.min((todaysDue / dailyGoal) * 100, 100));
        
      } catch (error) {
        console.error('Error fetching card stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCardStats();
  }, []);

  // Generate recommendations based on stats
  useEffect(() => {
    if (!cardStats.all) return;
    
    const recs = [];
    const allStats = cardStats.all;
    
    if (allStats.overdueCards > 0) {
      recs.push({
        type: 'overdue',
        priority: 'high',
        title: 'Overdue Reviews',
        description: `${allStats.overdueCards} cards are overdue`,
        action: 'Review Now',
        count: allStats.overdueCards,
        color: 'text-red-600 dark:text-red-400',
        bg: 'bg-red-50 dark:bg-red-900/30',
        border: 'border-red-200 dark:border-red-700'
      });
    }
    
    if (allStats.dueCards > 0) {
      recs.push({
        type: 'due',
        priority: 'medium',
        title: 'Due Today',
        description: `${allStats.dueCards} cards ready for review`,
        action: 'Start Session',
        count: allStats.dueCards,
        color: 'text-blue-600 dark:text-blue-400',
        bg: 'bg-blue-50 dark:bg-blue-900/30',
        border: 'border-blue-200 dark:border-blue-700'
      });
    }
    
    if (allStats.newCards > 0) {
      recs.push({
        type: 'new',
        priority: 'low',
        title: 'New Cards',
        description: `${allStats.newCards} new cards to learn`,
        action: 'Learn New',
        count: allStats.newCards,
        color: 'text-green-600 dark:text-green-400',
        bg: 'bg-green-50 dark:bg-green-900/30',
        border: 'border-green-200 dark:border-green-700'
      });
    }
    
    setRecommendations(recs);
  }, [cardStats]);

  const handlePaperSelect = (paperId) => {
    onStartSession(paperId);
  };

  const createCardsFromWeakQuestions = async (paper = 'all') => {
    try {
      const response = await fetch('/api/spaced-repetition/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_from_weak_questions',
          paper: paper
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        // Refresh stats after creating cards
        window.location.reload();
      }
    } catch (error) {
      console.error('Error creating cards:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <RefreshCw className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading your review cards...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 pt-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 dark:text-gray-100 mb-4">
            Spaced{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              Repetition
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Intelligent review system that helps you remember what you've learned
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8"
        >
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-white/20 dark:border-gray-700/50">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Due Today</span>
            </div>
            <div className="text-2xl md:text-3xl font-light text-gray-900 dark:text-gray-100">
              {cardStats.all?.dueCards || 0}
            </div>
          </div>

          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-white/20 dark:border-gray-700/50">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Overdue</span>
            </div>
            <div className="text-2xl md:text-3xl font-light text-gray-900 dark:text-gray-100">
              {cardStats.all?.overdueCards || 0}
            </div>
          </div>

          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-white/20 dark:border-gray-700/50">
            <div className="flex items-center gap-3 mb-2">
              <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Learning</span>
            </div>
            <div className="text-2xl md:text-3xl font-light text-gray-900 dark:text-gray-100">
              {cardStats.all?.learningCards || 0}
            </div>
          </div>

          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-white/20 dark:border-gray-700/50">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Mature</span>
            </div>
            <div className="text-2xl md:text-3xl font-light text-gray-900 dark:text-gray-100">
              {cardStats.all?.matureCards || 0}
            </div>
          </div>
        </motion.div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Recommended Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendations.map((rec, index) => (
                <motion.button
                  key={rec.type}
                  onClick={() => handlePaperSelect('all')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${rec.bg} ${rec.border}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className={`font-medium ${rec.color}`}>{rec.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {rec.description}
                      </p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${rec.bg} ${rec.color}`}>
                      {rec.count}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Play className="h-4 w-4" />
                    <span className="text-sm font-medium">{rec.action}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Paper Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6 text-center">
            Choose Your Focus
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* All Papers Option */}
            <motion.button
              onClick={() => handlePaperSelect('all')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-3xl border-2 border-indigo-200 dark:border-indigo-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all"
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-2xl flex items-center justify-center">
                  🎯
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  All Papers
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Mixed review session
                </p>
                <div className="text-xs text-indigo-600 dark:text-indigo-400 space-y-1">
                  <div>Total: {cardStats.all?.totalCards || 0}</div>
                  <div>Due: {cardStats.all?.dueCards || 0}</div>
                </div>
              </div>
            </motion.button>

            {/* Individual Papers */}
            {Object.values(PAPERS).map((paper) => {
              const stats = cardStats[paper.id] || {};
              
              return (
                <motion.button
                  key={paper.id}
                  onClick={() => handlePaperSelect(paper.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-6 rounded-3xl border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all ${paper.gradient}`}
                >
                  <div className="text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r ${paper.color} text-white text-2xl flex items-center justify-center`}>
                      {paper.icon}
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {paper.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {paper.description}
                    </p>
                    <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                      <div>Total: {stats.totalCards || 0}</div>
                      <div>Due: {stats.dueCards || 0}</div>
                      {stats.overdueCards > 0 && (
                        <div className="text-red-600 dark:text-red-400">
                          Overdue: {stats.overdueCards}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* No Cards Available */}
        {cardStats.all && cardStats.all.totalCards === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center p-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-gray-700/50"
          >
            <BookOpen className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No Review Cards Available
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start by practicing some quizzes to build your spaced repetition deck
            </p>
            <div className="space-y-3">
              <button
                onClick={() => createCardsFromWeakQuestions()}
                className="flex items-center gap-2 mx-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all"
              >
                <Plus className="h-5 w-5" />
                Create Cards from Weak Areas
              </button>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                This will analyze your quiz performance and create review cards for questions you struggle with
              </p>
            </div>
          </motion.div>
        )}

        {/* Daily Goal Progress */}
        {cardStats.all && cardStats.all.totalCards > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-gray-700/50"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Daily Review Progress
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Timer className="h-4 w-4" />
                <span>Goal: 20 cards/day</span>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-3">
              <div 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(dailyGoalProgress, 100)}%` }}
              />
            </div>
            
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>{cardStats.all?.dueCards || 0} cards due today</span>
              <span>{Math.round(dailyGoalProgress)}% of daily goal</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
