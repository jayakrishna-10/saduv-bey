// app/components/AssessmentProgressTracker.js
'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  Circle, 
  Target, 
  TrendingUp, 
  Clock, 
  Award, 
  BarChart3,
  Star,
  AlertCircle,
  PlayCircle,
  BookOpen,
  Brain,
  Zap,
  Trophy
} from 'lucide-react';

export function AssessmentProgressTracker({ 
  assessmentRubrics, 
  userProgress = {}, 
  onProgressUpdate 
}) {
  const [selectedRubric, setSelectedRubric] = useState(null);
  const [currentProgress, setCurrentProgress] = useState(userProgress);
  const [completedTopics, setCompletedTopics] = useState(new Set());

  // Calculate overall progress
  const calculateOverallProgress = () => {
    if (!assessmentRubrics || assessmentRubrics.length === 0) return 0;
    
    const totalTopics = assessmentRubrics.length;
    const completedCount = assessmentRubrics.filter(rubric => 
      currentProgress[rubric.topic] && currentProgress[rubric.topic].level !== 'novice'
    ).length;
    
    return Math.round((completedCount / totalTopics) * 100);
  };

  // Get mastery level color
  const getMasteryColor = (level) => {
    const colors = {
      novice: 'text-gray-500 bg-gray-100 dark:bg-gray-800',
      developing: 'text-yellow-700 bg-yellow-100 dark:bg-yellow-900/50',
      proficient: 'text-blue-700 bg-blue-100 dark:bg-blue-900/50',
      advanced: 'text-purple-700 bg-purple-100 dark:bg-purple-900/50',
      expert: 'text-green-700 bg-green-100 dark:bg-green-900/50'
    };
    return colors[level] || colors.novice;
  };

  // Get mastery level icon
  const getMasteryIcon = (level) => {
    const icons = {
      novice: Circle,
      developing: PlayCircle,
      proficient: Target,
      advanced: Star,
      expert: Trophy
    };
    const IconComponent = icons[level] || Circle;
    return <IconComponent className="h-4 w-4" />;
  };

  // Update progress for a topic
  const updateTopicProgress = (topic, level, completedQuestions = []) => {
    const updatedProgress = {
      ...currentProgress,
      [topic]: {
        level,
        completedQuestions,
        lastUpdated: new Date().toISOString(),
        timeSpent: (currentProgress[topic]?.timeSpent || 0) + 1
      }
    };
    
    setCurrentProgress(updatedProgress);
    
    if (level !== 'novice') {
      setCompletedTopics(prev => new Set([...prev, topic]));
    }
    
    if (onProgressUpdate) {
      onProgressUpdate(updatedProgress);
    }
  };

  if (!assessmentRubrics || assessmentRubrics.length === 0) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">No assessment rubrics available</p>
      </div>
    );
  }

  const overallProgress = calculateOverallProgress();

  return (
    <div className="space-y-8">
      {/* Progress Overview */}
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-light text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            Learning Progress
          </h3>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-light text-indigo-600 dark:text-indigo-400">{overallProgress}%</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Complete</div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Overall Progress</span>
            <span>{completedTopics.size} of {assessmentRubrics.length} topics mastered</span>
          </div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
            />
          </div>
        </div>

        {/* Mastery Level Distribution */}
        <div className="grid grid-cols-5 gap-3">
          {['novice', 'developing', 'proficient', 'advanced', 'expert'].map(level => {
            const count = assessmentRubrics.filter(rubric => 
              currentProgress[rubric.topic]?.level === level
            ).length;
            
            return (
              <div key={level} className="text-center">
                <div className={`p-3 rounded-xl ${getMasteryColor(level)} mb-2`}>
                  {getMasteryIcon(level)}
                </div>
                <div className="text-lg font-light text-gray-900 dark:text-gray-100">{count}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 capitalize">{level}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Assessment Rubrics */}
      <div className="space-y-6">
        <h3 className="text-xl font-light text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Target className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          Assessment Rubrics
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {assessmentRubrics.map((rubric, index) => {
            const progress = currentProgress[rubric.topic];
            const currentLevel = progress?.level || 'novice';
            
            return (
              <motion.div
                key={rubric.topic}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/50 dark:bg-gray-800/50 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all cursor-pointer"
                onClick={() => setSelectedRubric(selectedRubric === rubric.topic ? null : rubric.topic)}
              >
                {/* Rubric Header */}
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">{rubric.topic}</h4>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getMasteryColor(currentLevel)}`}>
                    <div className="flex items-center gap-2">
                      {getMasteryIcon(currentLevel)}
                      <span className="capitalize">{currentLevel}</span>
                    </div>
                  </div>
                </div>

                {/* Mastery Levels Preview */}
                <div className="flex justify-between items-center mb-4">
                  {Object.entries(rubric.mastery_levels).map(([level, _]) => (
                    <div
                      key={level}
                      className={`w-8 h-2 rounded-full transition-all ${
                        level === currentLevel 
                          ? 'bg-indigo-500' 
                          : ['novice', 'developing', 'proficient', 'advanced', 'expert'].indexOf(level) < 
                            ['novice', 'developing', 'proficient', 'advanced', 'expert'].indexOf(currentLevel)
                          ? 'bg-green-400'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    />
                  ))}
                </div>

                {/* Progress Info */}
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{progress?.timeSpent || 0}h studied</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    <span>
                      {(['novice', 'developing', 'proficient', 'advanced', 'expert'].indexOf(currentLevel) + 1) * 20}% mastery
                    </span>
                  </div>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {selectedRubric === rubric.topic && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
                    >
                      {/* Mastery Level Details */}
                      <div className="space-y-4">
                        <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Mastery Levels</h5>
                        {Object.entries(rubric.mastery_levels).map(([level, description]) => (
                          <div
                            key={level}
                            className={`p-3 rounded-xl border-l-4 transition-all ${
                              level === currentLevel
                                ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500'
                                : 'bg-gray-50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-600'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className={`font-medium capitalize ${
                                level === currentLevel ? 'text-indigo-900 dark:text-indigo-100' : 'text-gray-700 dark:text-gray-300'
                              }`}>
                                {level}
                              </span>
                              {level === currentLevel && (
                                <CheckCircle2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                              )}
                            </div>
                            <p className={`text-sm ${
                              level === currentLevel ? 'text-indigo-800 dark:text-indigo-200' : 'text-gray-600 dark:text-gray-400'
                            }`}>
                              {description}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Self-Check Questions */}
                      {rubric.self_check_questions && rubric.self_check_questions.length > 0 && (
                        <div className="mt-6">
                          <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Self-Check Questions</h5>
                          <div className="space-y-3">
                            {rubric.self_check_questions.map((question, i) => (
                              <div key={i} className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-700">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded text-xs font-medium">
                                    {question.level}
                                  </span>
                                  <span className="text-xs text-purple-600 dark:text-purple-400">
                                    {question.time_limit}
                                  </span>
                                </div>
                                <p className="text-purple-900 dark:text-purple-100 font-medium mb-2">{question.question}</p>
                                <p className="text-purple-800 dark:text-purple-200 text-sm">{question.success_criteria}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Level Selection */}
                      <div className="mt-6">
                        <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Update Your Level</h5>
                        <div className="flex flex-wrap gap-2">
                          {Object.keys(rubric.mastery_levels).map(level => (
                            <button
                              key={level}
                              onClick={(e) => {
                                e.stopPropagation();
                                updateTopicProgress(rubric.topic, level);
                              }}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                level === currentLevel
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                {getMasteryIcon(level)}
                                <span className="capitalize">{level}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Achievement Badges */}
      {completedTopics.size > 0 && (
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6">
          <h3 className="text-xl font-light text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-6">
            <Award className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            Achievements
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`p-4 rounded-xl text-center ${
              completedTopics.size >= 1 ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
            }`}>
              <Star className="h-8 w-8 mx-auto mb-2" />
              <div className="font-medium text-sm">First Steps</div>
              <div className="text-xs">Master 1 topic</div>
            </div>
            
            <div className={`p-4 rounded-xl text-center ${
              completedTopics.size >= 3 ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
            }`}>
              <Brain className="h-8 w-8 mx-auto mb-2" />
              <div className="font-medium text-sm">Knowledge Builder</div>
              <div className="text-xs">Master 3 topics</div>
            </div>
            
            <div className={`p-4 rounded-xl text-center ${
              overallProgress >= 50 ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-200' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
            }`}>
              <Zap className="h-8 w-8 mx-auto mb-2" />
              <div className="font-medium text-sm">Halfway Hero</div>
              <div className="text-xs">50% complete</div>
            </div>
            
            <div className={`p-4 rounded-xl text-center ${
              overallProgress >= 100 ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
            }`}>
              <Trophy className="h-8 w-8 mx-auto mb-2" />
              <div className="font-medium text-sm">Chapter Master</div>
              <div className="text-xs">100% complete</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
