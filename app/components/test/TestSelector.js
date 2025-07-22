// app/components/test/TestSelector.js
'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Settings, 
  BookOpen, 
  Filter, 
  Hash, 
  Play, 
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Zap,
  Target,
  Clock,
  ChevronRight,
  FileText,
  Edit,
  Loader2,
  Home,
  Lock,
  Crown,
  LogIn,
  Calendar,
  Users,
  Star,
  AlertCircle
} from 'lucide-react';
import { fetchTopics, prefetchAllTopics } from '@/lib/quiz-utils';
import { useRouter } from 'next/navigation';

const PAPERS = {
  paper1: {
    id: 'paper1',
    name: 'Paper 1',
    description: 'General Aspects of Energy Management and Energy Audit',
    color: 'from-blue-500 to-indigo-600',
    gradient: 'bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30',
    icon: '📊',
    topics: 9
  },
  paper2: {
    id: 'paper2',
    name: 'Paper 2', 
    description: 'Energy Efficiency in Thermal Utilities',
    color: 'from-orange-500 to-red-600',
    gradient: 'bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-900/30 dark:to-red-900/30',
    icon: '🔥',
    topics: 8
  },
  paper3: {
    id: 'paper3',
    name: 'Paper 3',
    description: 'Energy Efficiency in Electrical Utilities',
    color: 'from-emerald-500 to-cyan-600',
    gradient: 'bg-gradient-to-br from-emerald-50 to-cyan-100 dark:from-emerald-900/30 dark:to-cyan-900/30',
    icon: '⚡',
    topics: 10
  }
};

export function TestSelector({ 
  onStartTest, 
  isLoading,
  onClose,
  isModal = false 
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isAuthenticated = !!(session?.user);
  
  const [config, setConfig] = useState({
    mode: 'mock', // 'mock' or 'practice'
    selectedPaper: 'paper1',
    selectedTopic: 'all',
    questionCount: 50, // Default for mock, will change for practice
  });

  const [step, setStep] = useState(1); // 1: Mode + Paper + Topic (if practice), 2: Settings (if practice)
  const [topics, setTopics] = useState([]);
  const [isTopicsLoading, setIsTopicsLoading] = useState(false);
  const [topicsCache, setTopicsCache] = useState({});
  const [hasPrefetched, setHasPrefetched] = useState(false);

  // Prefetch all topics on component mount (only once)
  useEffect(() => {
    if (!hasPrefetched) {
      console.log('[TestSelector] Prefetching all topics...');
      setHasPrefetched(true);
      
      prefetchAllTopics()
        .then(() => {
          console.log('[TestSelector] Topics prefetched successfully');
        })
        .catch(error => {
          console.error('[TestSelector] Prefetch error:', error);
        });
    }
  }, [hasPrefetched]);

  // Fetch topics when paper changes in practice mode
  useEffect(() => {
    if (config.mode === 'practice' && config.selectedPaper) {
      // Check cache first
      if (topicsCache[config.selectedPaper]) {
        setTopics(topicsCache[config.selectedPaper]);
        return;
      }

      setIsTopicsLoading(true);
      fetchTopics(config.selectedPaper)
        .then(data => {
          const topicsData = data || [];
          setTopics(topicsData);
          // Cache the result
          setTopicsCache(prev => ({
            ...prev,
            [config.selectedPaper]: topicsData
          }));
          setIsTopicsLoading(false);
        })
        .catch(() => {
          setTopics([]);
          setIsTopicsLoading(false);
        });
    }
  }, [config.mode, config.selectedPaper, topicsCache]);

  const handlePaperSelect = useCallback((paperId) => {
    setConfig(prev => ({
      ...prev,
      selectedPaper: paperId,
      selectedTopic: 'all' // Reset topic when paper changes
    }));
  }, []);

  const handleNext = useCallback(() => {
    // For mock tests, we can start directly after paper selection
    if (config.mode === 'mock') {
      handleApply();
    } else if (step < 2) {
      setStep(step + 1);
    }
  }, [config.mode, step]);

  const handlePrevious = useCallback(() => {
    if (step > 1) setStep(step - 1);
  }, [step]);

  const handleApply = useCallback(() => {
    // Build test configuration
    let testConfig;
    
    if (config.mode === 'mock') {
      testConfig = {
        mode: 'mock',
        paper: config.selectedPaper,
        topic: 'all',
        questionCount: 50,
        timeLimit: 60 * 60 // 60 minutes in seconds
      };
    } else {
      testConfig = {
        mode: 'practice',
        paper: config.selectedPaper,
        topic: config.selectedTopic,
        questionCount: config.questionCount,
        timeLimit: config.questionCount * 72 // 72 seconds per question
      };
    }
    
    onStartTest(testConfig);
  }, [config, onStartTest]);

  const handleReset = useCallback(() => {
    setConfig({
      mode: 'mock',
      selectedPaper: 'paper1',
      selectedTopic: 'all',
      questionCount: 50
    });
    setStep(1);
  }, []);

  const handleModeChange = useCallback((mode) => {
    setConfig(prev => ({
      ...prev,
      mode,
      questionCount: mode === 'mock' ? 50 : 20
    }));
  }, []);

  const handleTopicSelect = useCallback((topic) => {
    setConfig(prev => ({ ...prev, selectedTopic: topic }));
  }, []);

  const handleQuestionCountChange = useCallback((count) => {
    setConfig(prev => ({ ...prev, questionCount: count }));
  }, []);

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    } else {
      // Navigate to home if no onClose handler provided
      router.push('/');
    }
  }, [onClose, router]);

  const handleSignIn = useCallback(() => {
    // Import signIn from next-auth/react and call it
    import('next-auth/react').then(({ signIn }) => {
      signIn('google');
    });
  }, []);

  // Memoized values
  const stepProgress = useMemo(() => {
    if (config.mode === 'mock') return 100;
    return (step / 2) * 100;
  }, [config.mode, step]);

  const questionCountLabel = useMemo(() => {
    const count = config.questionCount;
    if (count <= 10) return { label: 'Quick', icon: Zap, color: 'text-yellow-600 dark:text-yellow-400' };
    if (count <= 30) return { label: 'Standard', icon: Target, color: 'text-blue-600 dark:text-blue-400' };
    return { label: 'Comprehensive', icon: Clock, color: 'text-purple-600 dark:text-purple-400' };
  }, [config.questionCount]);

  const stepText = useMemo(() => {
    if (config.mode === 'mock') {
      return 'Choose Paper for Mock Test';
    }
    return step === 1 ? 'Choose Mode, Paper & Topic' : 'Configure Test Settings';
  }, [config.mode, step]);

  const totalSteps = config.mode === 'mock' ? 1 : 2;
  const showCloseButton = true; // Always show close button

  return (
    <div 
      className={`${isModal ? 'fixed inset-0 bg-black/50 backdrop-blur-sm z-[70]' : 'min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800'} flex items-center justify-center p-4`}
      onClick={(e) => {
        // Handle backdrop clicks for modals
        if (isModal && e.target === e.currentTarget && onClose) {
          onClose();
        }
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/50 w-full max-w-3xl shadow-2xl flex flex-col"
        style={{ maxHeight: isModal ? '90vh' : '100vh' }}
      >
        {/* Header */}
        <div className="relative p-6 border-b border-gray-200/50 dark:border-gray-700/50 flex-shrink-0">
          {showCloseButton && (
            <button
              onClick={handleClose}
              className="absolute top-6 right-6 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors group"
              aria-label={onClose ? "Close dialog" : "Go to home"}
            >
              {onClose ? (
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200" />
              ) : (
                <Home className="h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200" />
              )}
            </button>
          )}
          
          <div className="pr-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Customize Your Test
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Step {step} of {totalSteps}: {stepText}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${stepProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>

        {/* Authentication Status Banner */}
        {!isAuthenticated && (
          <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 border-b border-amber-200 dark:border-amber-700 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-full">
                  <Lock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-amber-900 dark:text-amber-100 font-medium text-sm">
                    Limited Access - 2023 Questions Only
                  </p>
                  <p className="text-amber-700 dark:text-amber-300 text-xs">
                    Sign in to access all years and get comprehensive test analytics
                  </p>
                </div>
              </div>
              <button
                onClick={handleSignIn}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-sm text-sm"
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </button>
            </div>
          </div>
        )}

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {/* Step 1: Mode Selection + Paper + Topic (for practice) */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Mock Test Limitation Warning for Non-Authenticated Users */}
                {!isAuthenticated && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/30 rounded-xl border border-red-200 dark:border-red-700">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-red-900 dark:text-red-100 mb-1">
                          Mock Test Limitations
                        </h4>
                        <p className="text-red-800 dark:text-red-200 text-sm">
                          Mock tests are limited to 2023 questions only for non-registered users. 
                          Sign in to access the full exam simulation with questions from all years.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Mode Selection */}
                <div>
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Select Your Test Mode
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Choose between a realistic exam simulation or a flexible practice session
                      {!isAuthenticated && (
                        <span className="block mt-1 text-amber-600 dark:text-amber-400 font-medium">
                          (Both modes limited to 2023 questions for non-registered users)
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <motion.button
                      onClick={() => handleModeChange('mock')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 md:p-6 rounded-2xl transition-all duration-300 border-2 ${
                        config.mode === 'mock'
                          ? 'border-indigo-300 dark:border-indigo-600 shadow-lg ring-2 ring-indigo-100 dark:ring-indigo-900/50 transform scale-[1.02]'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'
                      } bg-gradient-to-br from-red-50 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 relative overflow-hidden`}
                    >
                      {/* Premium indicator for authenticated users */}
                      {isAuthenticated && (
                        <div className="absolute top-2 right-2">
                          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                            <Crown className="h-3 w-3" />
                            All Years
                          </div>
                        </div>
                      )}

                      {/* Mobile Layout - Horizontal */}
                      <div className="flex md:hidden items-start gap-4">
                        <div className="w-14 h-14 flex-shrink-0 rounded-xl bg-gradient-to-r from-red-500 to-orange-600 text-white shadow-lg flex items-center justify-center">
                          <FileText className="h-7 w-7" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                            Mock Test
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                            {isAuthenticated ? 'Real exam simulation' : 'Limited simulation (2023)'}
                          </div>
                          <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                            50 questions, 60 minutes timer. Experience the actual exam conditions.
                            {!isAuthenticated && ' (2023 questions only)'}
                          </p>
                          {config.mode === 'mock' && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ type: "spring", stiffness: 300 }}
                              className="mt-2"
                            >
                              <CheckCircle2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                            </motion.div>
                          )}
                        </div>
                      </div>

                      {/* Desktop Layout - Vertical */}
                      <div className="hidden md:block text-left">
                        <div className="w-16 h-16 mb-4 rounded-xl bg-gradient-to-r from-red-500 to-orange-600 text-white text-2xl shadow-lg flex items-center justify-center">
                          <FileText className="h-8 w-8" />
                        </div>
                        <div className="mb-2">
                          <div className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                            Mock Test
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                            {isAuthenticated ? 'Real exam simulation' : 'Limited simulation (2023)'}
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          50 questions, 60 minutes timer. Experience the actual exam conditions.
                          {!isAuthenticated && ' (2023 questions only)'}
                        </p>
                        {config.mode === 'mock' && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="mt-3"
                          >
                            <CheckCircle2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                          </motion.div>
                        )}
                      </div>
                    </motion.button>

                    <motion.button
                      onClick={() => handleModeChange('practice')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 md:p-6 rounded-2xl transition-all duration-300 border-2 ${
                        config.mode === 'practice'
                          ? 'border-indigo-300 dark:border-indigo-600 shadow-lg ring-2 ring-indigo-100 dark:ring-indigo-900/50 transform scale-[1.02]'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'
                      } bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 relative overflow-hidden`}
                    >
                      {/* Premium indicator for authenticated users */}
                      {isAuthenticated && (
                        <div className="absolute top-2 right-2">
                          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                            <Crown className="h-3 w-3" />
                            All Years
                          </div>
                        </div>
                      )}

                      {/* Mobile Layout - Horizontal */}
                      <div className="flex md:hidden items-start gap-4">
                        <div className="w-14 h-14 flex-shrink-0 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg flex items-center justify-center">
                          <Edit className="h-7 w-7" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                            Practice Test
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                            {isAuthenticated ? 'Custom practice session' : 'Limited practice (2023)'}
                          </div>
                          <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                            Choose your topics and question count. 72 seconds per question.
                            {!isAuthenticated && ' (2023 questions only)'}
                          </p>
                          {config.mode === 'practice' && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ type: "spring", stiffness: 300 }}
                              className="mt-2"
                            >
                              <CheckCircle2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                            </motion.div>
                          )}
                        </div>
                      </div>

                      {/* Desktop Layout - Vertical */}
                      <div className="hidden md:block text-left">
                        <div className="w-16 h-16 mb-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white text-2xl shadow-lg flex items-center justify-center">
                          <Edit className="h-8 w-8" />
                        </div>
                        <div className="mb-2">
                          <div className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                            Practice Test
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                            {isAuthenticated ? 'Custom practice session' : 'Limited practice (2023)'}
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          Choose your topics and question count. 72 seconds per question.
                          {!isAuthenticated && ' (2023 questions only)'}
                        </p>
                        {config.mode === 'practice' && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="mt-3"
                          >
                            <CheckCircle2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                          </motion.div>
                        )}
                      </div>
                    </motion.button>
                  </div>
                </div>

                {/* Premium Features for Authenticated Users */}
                {isAuthenticated && (
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl border border-green-200 dark:border-green-700">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-full">
                        <Star className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <h4 className="font-medium text-green-900 dark:text-green-100">Premium Test Access Unlocked!</h4>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                        <Calendar className="h-4 w-4" />
                        All Years
                      </div>
                      <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                        <BookOpen className="h-4 w-4" />
                        All Topics
                      </div>
                      <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                        <Sparkles className="h-4 w-4" />
                        Full Analytics
                      </div>
                      <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                        <Users className="h-4 w-4" />
                        Progress Tracking
                      </div>
                    </div>
                  </div>
                )}

                {/* Paper Selection */}
                <div className="border-t border-gray-200/50 dark:border-gray-700/50 pt-6">
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Select Your Paper
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Choose which NCE paper you'd like to practice
                      {!isAuthenticated && (
                        <span className="block mt-1 text-amber-600 dark:text-amber-400 font-medium">
                          (2023 questions only for non-registered users)
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {Object.values(PAPERS).map((paper) => (
                      <motion.button
                        key={paper.id}
                        onClick={() => handlePaperSelect(paper.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-4 md:p-6 rounded-2xl transition-all duration-300 border-2 ${
                          config.selectedPaper === paper.id
                            ? 'border-indigo-300 dark:border-indigo-600 shadow-lg ring-2 ring-indigo-100 dark:ring-indigo-900/50 transform scale-[1.02]'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'
                        } ${paper.gradient} relative overflow-hidden`}
                      >
                        {/* Premium indicator for authenticated users */}
                        {isAuthenticated && (
                          <div className="absolute top-2 right-2">
                            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                              <Crown className="h-3 w-3" />
                              All Years
                            </div>
                          </div>
                        )}

                        {/* Mobile Layout - Horizontal */}
                        <div className="flex md:hidden items-start gap-4">
                          <div className={`w-14 h-14 flex-shrink-0 rounded-xl bg-gradient-to-r ${paper.color} text-white text-xl shadow-lg flex items-center justify-center`}>
                            {paper.icon}
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                              {paper.name}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                              {isAuthenticated ? `${paper.topics} topics, all years` : `${paper.topics} topics, 2023 only`}
                            </div>
                            <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                              {paper.description}
                            </p>
                            {config.selectedPaper === paper.id && (
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="mt-2"
                              >
                                <CheckCircle2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                              </motion.div>
                            )}
                          </div>
                        </div>

                        {/* Desktop Layout - Vertical */}
                        <div className="hidden md:block text-center">
                          <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r ${paper.color} text-white text-2xl shadow-lg flex items-center justify-center`}>
                            {paper.icon}
                          </div>
                          <div className="mb-2">
                            <div className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                              {paper.name}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                              {isAuthenticated ? `${paper.topics} topics, all years` : `${paper.topics} topics, 2023 only`}
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            {paper.description}
                          </p>
                          {config.selectedPaper === paper.id && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ type: "spring", stiffness: 300 }}
                              className="mt-3"
                            >
                              <CheckCircle2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mx-auto" />
                            </motion.div>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Topic Selection (Only for Practice Mode) */}
                {config.mode === 'practice' && (
                  <div className="border-t border-gray-200/50 dark:border-gray-700/50 pt-6">
                    <div className="space-y-4">
                      <label className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-gray-100">
                        <Filter className="h-5 w-5" />
                        Choose Topic Focus
                        {!isAuthenticated && (
                          <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 rounded-full text-xs font-medium">
                            2023 Only
                          </span>
                        )}
                      </label>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                        Select a specific topic or practice all topics from {PAPERS[config.selectedPaper]?.name}
                        {!isAuthenticated && (
                          <span className="block mt-1 text-amber-600 dark:text-amber-400">
                            Topics are limited to questions from 2023 for non-registered users
                          </span>
                        )}
                      </p>
                      
                      <div className="grid grid-cols-1 gap-3">
                        {/* All Topics Option */}
                        <motion.button
                          onClick={() => handleTopicSelect('all')}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          className={`p-4 rounded-xl text-left transition-all border-2 ${
                            config.selectedTopic === 'all'
                              ? 'border-indigo-300 dark:border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 shadow-md'
                              : 'border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-900 dark:text-gray-100">
                                All Topics
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                Practice questions from all {topics.length} available topics
                                {!isAuthenticated && ' (2023 questions only)'}
                              </div>
                            </div>
                            {config.selectedTopic === 'all' && (
                              <CheckCircle2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                            )}
                          </div>
                        </motion.button>

                        {/* Individual Topic Options */}
                        {isTopicsLoading ? (
                          <div className="flex items-center justify-center p-8 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-800/50">
                            <Loader2 className="h-5 w-5 animate-spin text-gray-400 mr-2" />
                            <span className="text-sm text-gray-500 dark:text-gray-400">Loading topics...</span>
                          </div>
                        ) : topics.length > 0 ? (
                          <div className="max-h-48 overflow-y-auto space-y-2 border border-gray-200 dark:border-gray-700 rounded-xl p-3 bg-gray-50/50 dark:bg-gray-800/50">
                            {topics.map((topic, index) => (
                              <motion.button
                                key={topic}
                                onClick={() => handleTopicSelect(topic)}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.02 }}
                                className={`w-full p-3 rounded-lg text-left transition-all border ${
                                  config.selectedTopic === topic
                                    ? 'border-indigo-300 dark:border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 shadow-sm'
                                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {topic}
                                  </span>
                                  {config.selectedTopic === topic && (
                                    <CheckCircle2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                  )}
                                </div>
                              </motion.button>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                )}

                {/* Selection Summary */}
                <div className={`p-4 rounded-xl border ${
                  isAuthenticated 
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-700'
                    : 'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-700'
                }`}>
                  <h4 className={`font-medium mb-2 ${
                    isAuthenticated 
                      ? 'text-indigo-900 dark:text-indigo-100'
                      : 'text-amber-900 dark:text-amber-100'
                  }`}>
                    Current Selection
                  </h4>
                  <div className={`space-y-1 text-sm ${
                    isAuthenticated 
                      ? 'text-indigo-800 dark:text-indigo-200'
                      : 'text-amber-800 dark:text-amber-200'
                  }`}>
                    <div>🎯 Mode: {config.mode === 'mock' ? 'Mock Test' : 'Practice Test'}</div>
                    <div>📄 Paper: {PAPERS[config.selectedPaper]?.name}</div>
                    {config.mode === 'practice' && (
                      <div>🎯 Topic: {config.selectedTopic === 'all' ? 'All Topics' : config.selectedTopic}</div>
                    )}
                    {config.mode === 'mock' && (
                      <>
                        <div>📊 Questions: 50</div>
                        <div>⏱️ Time: 60 minutes</div>
                      </>
                    )}
                    {!isAuthenticated && (
                      <div className={`flex items-center gap-2 mt-2 pt-2 border-t ${
                        isAuthenticated 
                          ? 'border-indigo-200 dark:border-indigo-700'
                          : 'border-amber-200 dark:border-amber-700'
                      }`}>
                        <Lock className="h-4 w-4" />
                        <span>Limited to 2023 questions only</span>
                      </div>
                    )}
                  </div>

                  {/* Upgrade prompt for non-authenticated users */}
                  {!isAuthenticated && (
                    <div className="mt-4 pt-4 border-t border-amber-200 dark:border-amber-700">
                      <p className="text-amber-800 dark:text-amber-200 text-sm mb-3">
                        Want access to all years and comprehensive analytics?
                      </p>
                      <button
                        onClick={handleSignIn}
                        className="w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-sm text-sm flex items-center justify-center gap-2"
                      >
                        <LogIn className="h-4 w-4" />
                        Sign In for Full Access
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 2: Settings (Only for Practice Mode) */}
            {step === 2 && config.mode === 'practice' && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Practice Test Settings
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Configure your practice session
                    {!isAuthenticated && (
                      <span className="block mt-1 text-amber-600 dark:text-amber-400">
                        (Limited to 2023 questions)
                      </span>
                    )}
                  </p>
                </div>

                {/* Question Count */}
                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                    <Hash className="h-4 w-4" />
                    Number of Questions: {config.questionCount}
                  </label>
                  
                  <div className="space-y-4">
                    <input
                      type="range"
                      min="5"
                      max="50"
                      step="5"
                      value={config.questionCount}
                      onChange={(e) => handleQuestionCountChange(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                    
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>5 (Quick)</span>
                      <span>25 (Standard)</span>
                      <span>50 (Comprehensive)</span>
                    </div>

                    {/* Question Count Indicator */}
                    <div className="flex items-center justify-center gap-2 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      {(() => {
                        const { label, icon: Icon, color } = questionCountLabel;
                        const totalTime = config.questionCount * 72; // 72 seconds per question
                        const minutes = Math.floor(totalTime / 60);
                        const seconds = totalTime % 60;
                        return (
                          <>
                            <Icon className={`h-5 w-5 ${color}`} />
                            <span className={`text-sm font-medium ${color}`}>{label} Session</span>
                            <span className="text-gray-600 dark:text-gray-400 text-sm">
                              ({minutes} min {seconds > 0 ? `${seconds} sec` : ''})
                            </span>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* Time Information */}
                <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    <div>
                      <span className="text-gray-900 dark:text-gray-100 font-medium">Time Allotment</span>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">72 seconds per question</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {Math.floor((config.questionCount * 72) / 60)} min {(config.questionCount * 72) % 60} sec
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Total test duration
                    </div>
                  </div>
                </div>

                {/* Final Summary */}
                <div className={`p-6 rounded-2xl border ${
                  isAuthenticated 
                    ? 'bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 border-indigo-200 dark:border-indigo-700'
                    : 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 border-amber-200 dark:border-amber-700'
                }`}>
                  <h4 className={`font-semibold mb-4 flex items-center gap-2 ${
                    isAuthenticated 
                      ? 'text-indigo-900 dark:text-indigo-100'
                      : 'text-amber-900 dark:text-amber-100'
                  }`}>
                    <CheckCircle2 className="h-5 w-5" />
                    Ready to Start Practice Test
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className={`font-medium ${
                        isAuthenticated 
                          ? 'text-indigo-700 dark:text-indigo-300'
                          : 'text-amber-700 dark:text-amber-300'
                      }`}>Paper</div>
                      <div className={isAuthenticated 
                        ? 'text-indigo-900 dark:text-indigo-100'
                        : 'text-amber-900 dark:text-amber-100'
                      }>{PAPERS[config.selectedPaper]?.name}</div>
                    </div>
                    <div>
                      <div className={`font-medium ${
                        isAuthenticated 
                          ? 'text-indigo-700 dark:text-indigo-300'
                          : 'text-amber-700 dark:text-amber-300'
                      }`}>Questions</div>
                      <div className={isAuthenticated 
                        ? 'text-indigo-900 dark:text-indigo-100'
                        : 'text-amber-900 dark:text-amber-100'
                      }>{config.questionCount}</div>
                    </div>
                    <div className="col-span-2">
                      <div className={`font-medium ${
                        isAuthenticated 
                          ? 'text-indigo-700 dark:text-indigo-300'
                          : 'text-amber-700 dark:text-amber-300'
                      }`}>Topic</div>
                      <div className={isAuthenticated 
                        ? 'text-indigo-900 dark:text-indigo-100'
                        : 'text-amber-900 dark:text-amber-100'
                      }>
                        {config.selectedTopic === 'all' ? 'All Topics' : config.selectedTopic}
                      </div>
                    </div>
                    <div>
                      <div className={`font-medium ${
                        isAuthenticated 
                          ? 'text-indigo-700 dark:text-indigo-300'
                          : 'text-amber-700 dark:text-amber-300'
                      }`}>Time per Question</div>
                      <div className={isAuthenticated 
                        ? 'text-indigo-900 dark:text-indigo-100'
                        : 'text-amber-900 dark:text-amber-100'
                      }>72 seconds</div>
                    </div>
                    <div>
                      <div className={`font-medium ${
                        isAuthenticated 
                          ? 'text-indigo-700 dark:text-indigo-300'
                          : 'text-amber-700 dark:text-amber-300'
                      }`}>Year Access</div>
                      <div className={isAuthenticated 
                        ? 'text-indigo-900 dark:text-indigo-100'
                        : 'text-amber-900 dark:text-amber-100'
                      }>
                        {isAuthenticated ? 'All Years' : '2023 Only'}
                      </div>
                    </div>
                  </div>

                  {/* Upgrade prompt for non-authenticated users */}
                  {!isAuthenticated && (
                    <div className="mt-4 pt-4 border-t border-amber-200 dark:border-amber-700">
                      <p className="text-amber-800 dark:text-amber-200 text-sm mb-3">
                        Want access to all years and comprehensive analytics?
                      </p>
                      <button
                        onClick={handleSignIn}
                        className="w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-sm text-sm flex items-center justify-center gap-2"
                      >
                        <LogIn className="h-4 w-4" />
                        Sign In for Full Access
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer - Fixed at bottom */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-900/50 flex-shrink-0">
          <div className="flex items-center gap-3">
            {step > 1 && (
              <button
                onClick={handlePrevious}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors font-medium"
              >
                Previous
              </button>
            )}
            
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            {(config.mode === 'mock' || (config.mode === 'practice' && step === 2)) ? (
              <motion.button
                onClick={handleApply}
                disabled={isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-medium rounded-xl hover:from-emerald-700 hover:to-cyan-700 transition-all duration-200 shadow-lg disabled:opacity-50"
              >
                <Play className="h-4 w-4" />
                Start Test
              </motion.button>
            ) : (
              <motion.button
                onClick={handleNext}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
              >
                Next Step
                <ChevronRight className="h-4 w-4" />
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
