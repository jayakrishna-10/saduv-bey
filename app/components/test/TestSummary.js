// FILE: app/components/test/TestSummary.js
'use client';
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  MinusCircle, 
  Clock, 
  Award, 
  Target, 
  TrendingUp,
  RefreshCw,
  Eye,
  FileText,
  Edit,
  CheckCircle2,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { isCorrectAnswer } from '@/lib/quiz-utils';

export function TestSummary({ 
  questions, 
  answers, 
  timeTaken, 
  onReview, 
  onRestart, 
  saveStatus,
  testConfig 
}) {
  const stats = useMemo(() => {
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;

    questions.forEach(q => {
      const userAnswer = answers[q.main_id || q.id];
      if (!userAnswer) {
        unanswered++;
      } else if (isCorrectAnswer(userAnswer, q.correct_answer)) {
        correct++;
      } else {
        incorrect++;
      }
    });

    const score = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;
    return { correct, incorrect, unanswered, score };
  }, [questions, answers]);

  // Trigger confetti for high scores
  React.useEffect(() => {
    if (stats.score >= 80) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [stats.score]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 60) return 'text-blue-600 dark:text-blue-400';
    if (score >= 40) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreMessage = (score) => {
    if (score >= 90) return 'Outstanding Performance! 🎉';
    if (score >= 80) return 'Excellent Work! 🌟';
    if (score >= 70) return 'Good Job! 👍';
    if (score >= 60) return 'Nice Effort! 💪';
    if (score >= 50) return 'Keep Practicing! 📚';
    return 'More Practice Needed 💡';
  };

  const SaveStatusBadge = () => {
    if (!saveStatus) return null;
    
    const statusConfig = {
      saving: {
        icon: Loader2,
        text: 'Saving results...',
        className: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
        animate: true
      },
      success: {
        icon: CheckCircle2,
        text: 'Results saved',
        className: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
        animate: false
      },
      error: {
        icon: AlertTriangle,
        text: 'Save failed',
        className: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
        animate: false
      }
    };

    const config = statusConfig[saveStatus];
    if (!config) return null;

    const Icon = config.icon;

    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${config.className}`}
      >
        <Icon className={`h-4 w-4 ${config.animate ? 'animate-spin' : ''}`} />
        <span>{config.text}</span>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/50 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="relative p-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            <div className="absolute top-4 right-4">
              <SaveStatusBadge />
            </div>
            
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-xl rounded-full mb-4"
              >
                <Award className="h-10 w-10" />
              </motion.div>
              
              <h1 className="text-3xl font-bold mb-2">Test Completed!</h1>
              <p className="text-lg opacity-90">{getScoreMessage(stats.score)}</p>
              
              {/* Test Mode Badge */}
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur rounded-lg">
                {testConfig?.mode === 'mock' ? (
                  <>
                    <FileText className="h-4 w-4" />
                    <span className="text-sm font-medium">Mock Test - {testConfig.paper.toUpperCase()}</span>
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Practice Test - {testConfig?.paper.toUpperCase()}
                      {testConfig?.topic && testConfig.topic !== 'all' && ` - ${testConfig.topic}`}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Score Display */}
          <div className="p-8 text-center border-b border-gray-200 dark:border-gray-700">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`text-6xl font-bold mb-2 ${getScoreColor(stats.score)}`}
            >
              {stats.score}%
            </motion.div>
            <p className="text-gray-600 dark:text-gray-400">Overall Score</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8">
            <StatCard
              icon={CheckCircle}
              value={stats.correct}
              label="Correct"
              color="text-emerald-600 dark:text-emerald-400"
              bgColor="bg-emerald-100 dark:bg-emerald-900/30"
            />
            <StatCard
              icon={XCircle}
              value={stats.incorrect}
              label="Incorrect"
              color="text-red-600 dark:text-red-400"
              bgColor="bg-red-100 dark:bg-red-900/30"
            />
            <StatCard
              icon={MinusCircle}
              value={stats.unanswered}
              label="Unanswered"
              color="text-gray-600 dark:text-gray-400"
              bgColor="bg-gray-100 dark:bg-gray-700/30"
            />
            <StatCard
              icon={Clock}
              value={formatTime(timeTaken)}
              label="Time Taken"
              color="text-blue-600 dark:text-blue-400"
              bgColor="bg-blue-100 dark:bg-blue-900/30"
            />
          </div>

          {/* Performance Insights */}
          <div className="p-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              Performance Insights
            </h3>
            <div className="space-y-3">
              <InsightRow 
                label="Accuracy Rate" 
                value={`${stats.score}%`} 
                color={getScoreColor(stats.score)} 
              />
              <InsightRow 
                label="Questions Attempted" 
                value={`${questions.length - stats.unanswered} of ${questions.length}`} 
              />
              <InsightRow 
                label="Average Time per Question" 
                value={`${Math.round(timeTaken / questions.length)}s`} 
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-8 bg-gray-50 dark:bg-gray-800/50 flex flex-col sm:flex-row gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onReview}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors shadow-lg"
            >
              <Eye className="h-5 w-5" />
              Review Answers
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRestart}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-xl transition-colors"
            >
              <RefreshCw className="h-5 w-5" />
              Start New Test
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, value, label, color, bgColor }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className={`${bgColor} rounded-xl p-4 text-center`}
    >
      <Icon className={`h-8 w-8 ${color} mx-auto mb-2`} />
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
    </motion.div>
  );
}

function InsightRow({ label, value, color = 'text-gray-900 dark:text-gray-100' }) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
      <span className="text-gray-600 dark:text-gray-400">{label}</span>
      <span className={`font-semibold ${color}`}>{value}</span>
    </div>
  );
}
