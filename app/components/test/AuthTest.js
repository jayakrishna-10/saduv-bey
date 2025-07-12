// app/components/test/AuthTest.js - Component to test authentication fixes
'use client';
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Play, 
  Database, 
  User, 
  Zap,
  RefreshCw
} from 'lucide-react';
import { GoogleIdUtils } from '@/lib/googleIdUtils';
import { AnalyticsService } from '@/lib/analytics';

const AuthTest = () => {
  const { data: session, status } = useSession();
  const [testResults, setTestResults] = useState({});
  const [isRunning, setIsRunning] = useState(false);

  const runTest = async (testName, testFunction) => {
    setTestResults(prev => ({ ...prev, [testName]: { status: 'running' } }));
    
    try {
      const result = await testFunction();
      setTestResults(prev => ({ 
        ...prev, 
        [testName]: { status: 'success', ...result } 
      }));
    } catch (error) {
      setTestResults(prev => ({ 
        ...prev, 
        [testName]: { status: 'error', error: error.message } 
      }));
    }
  };

  const tests = {
    'Session Validation': async () => {
      if (!session) throw new Error('No session found');
      if (!session.user) throw new Error('No user in session');
      if (!session.user.googleId) throw new Error('No Google ID in session');
      
      const validation = GoogleIdUtils.validate(session.user.googleId);
      if (!validation.isValid) throw new Error(validation.reason);
      
      return { 
        googleId: session.user.googleId,
        validation: validation.reason 
      };
    },

    'Database Connectivity': async () => {
      const response = await fetch('/api/analytics?action=stats');
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`API returned ${response.status}: ${error}`);
      }
      
      const data = await response.json();
      return { 
        message: 'Database connection successful',
        hasData: Object.keys(data).length > 0 
      };
    },

    'Analytics Recording': async () => {
      if (!session?.user?.googleId) throw new Error('No Google ID available');
      
      // Test recording a simple analytics event
      const testData = {
        paper: 'paper1',
        chapter: 'test-chapter',
        totalQuestions: 1,
        correctAnswers: 1,
        score: 100,
        timeTaken: 30,
        questionsData: [{
          questionId: 'test-q1',
          selectedOption: 'a',
          isCorrect: true
        }]
      };
      
      const result = await AnalyticsService.recordQuizAttempt(session.user.googleId, testData);
      if (!result) throw new Error('Analytics recording returned null');
      
      return { message: 'Analytics recording successful' };
    },

    'User Progress Tracking': async () => {
      if (!session?.user?.googleId) throw new Error('No Google ID available');
      
      const stats = await AnalyticsService.getUserStats(session.user.googleId);
      if (!stats) throw new Error('Could not retrieve user stats');
      
      return { 
        message: 'User progress tracking operational',
        quizAttempts: stats.quizzes.totalAttempts,
        testAttempts: stats.tests.totalAttempts
      };
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults({});
    
    for (const [testName, testFunction] of Object.entries(tests)) {
      await runTest(testName, testFunction);
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setIsRunning(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running':
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'running':
        return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20';
      case 'success':
        return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20';
      case 'error':
        return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20';
      default:
        return 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50';
    }
  };

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const allTestsRun = Object.keys(testResults).length === Object.keys(tests).length;
  const allTestsPassed = allTestsRun && Object.values(testResults).every(result => result.status === 'success');

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Zap className="h-6 w-6 text-yellow-500" />
          Authentication System Test
        </h2>
        <motion.button
          onClick={runAllTests}
          disabled={isRunning || status !== 'authenticated'}
          whileHover={{ scale: isRunning ? 1 : 1.05 }}
          whileTap={{ scale: isRunning ? 1 : 0.95 }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            isRunning || status !== 'authenticated'
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          <Play className="h-4 w-4" />
          {isRunning ? 'Running Tests...' : 'Run All Tests'}
        </motion.button>
      </div>

      {status !== 'authenticated' && (
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-yellow-800 dark:text-yellow-200 text-sm">
            Please sign in to run authentication tests.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {Object.entries(tests).map(([testName, _]) => {
          const result = testResults[testName];
          const status = result?.status || 'pending';
          
          return (
            <motion.div
              key={testName}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 border rounded-lg transition-all ${getStatusColor(status)}`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  {getStatusIcon(status)}
                  {testName}
                </h3>
                {result && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {status}
                  </span>
                )}
              </div>
              
              {result?.error && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-2">
                  Error: {result.error}
                </p>
              )}
              
              {result?.message && status === 'success' && (
                <p className="text-green-600 dark:text-green-400 text-sm mt-2">
                  {result.message}
                </p>
              )}
              
              {result?.googleId && (
                <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                  Google ID: {result.googleId}
                </p>
              )}
              
              {result?.validation && (
                <p className="text-gray-600 dark:text-gray-400 text-xs">
                  Validation: {result.validation}
                </p>
              )}
              
              {typeof result?.hasData !== 'undefined' && (
                <p className="text-gray-600 dark:text-gray-400 text-xs">
                  Has Data: {result.hasData ? 'Yes' : 'No'}
                </p>
              )}
              
              {(typeof result?.quizAttempts !== 'undefined' || typeof result?.testAttempts !== 'undefined') && (
                <p className="text-gray-600 dark:text-gray-400 text-xs">
                  Quiz Attempts: {result.quizAttempts || 0}, Test Attempts: {result.testAttempts || 0}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>

      {allTestsRun && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`mt-6 p-4 border rounded-lg text-center ${
            allTestsPassed 
              ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
              : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
          }`}
        >
          {allTestsPassed ? (
            <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-300">
              <CheckCircle className="h-6 w-6" />
              <span className="font-medium">All Tests Passed! 🎉</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-red-700 dark:text-red-300">
              <XCircle className="h-6 w-6" />
              <span className="font-medium">Some Tests Failed</span>
            </div>
          )}
          <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">
            {allTestsPassed 
              ? 'Authentication system is working correctly!'
              : 'Check the failed tests above for issues to resolve.'
            }
          </p>
        </motion.div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Test Coverage:</h4>
        <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            Session & Google ID validation
          </div>
          <div className="flex items-center gap-1">
            <Database className="h-3 w-3" />
            Database connectivity
          </div>
          <div className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            Analytics recording
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Progress tracking
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthTest;
