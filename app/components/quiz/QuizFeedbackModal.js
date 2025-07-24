// FILE: app/components/quiz/QuizFeedbackModal.js
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader2, CheckCircle, AlertTriangle, MessageSquare } from 'lucide-react';

export function QuizFeedbackModal({ isOpen, onClose, question, selectedPaper }) {
  const { data: session } = useSession();
  const [feedbackType, setFeedbackType] = useState('issue');
  const [feedbackText, setFeedbackText] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const resetForm = () => {
    setFeedbackType('issue');
    setFeedbackText('');
    setContactEmail('');
    setSubmitStatus(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleTextareaChange = (e) => {
    // Explicitly handle the textarea change to ensure spaces are preserved
    const value = e.target.value;
    setFeedbackText(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!feedbackText.trim()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const feedbackData = {
        questionId: question?.main_id || question?.id,
        questionText: question?.question_text,
        paper: selectedPaper || question?.paper,
        feedbackType,
        feedbackText: feedbackText.trim(),
        contactEmail: session?.user?.email || contactEmail || null,
        userId: session?.user?.id || null
      };

      const response = await fetch('/api/quiz/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackData)
      });

      if (response.ok) {
        setSubmitStatus('success');
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black cursor-pointer"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 w-full max-w-md max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Report an Issue
                </h3>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Form Content - Scrollable */}
            <div className="max-h-[calc(90vh-8rem)] overflow-y-auto">
              <form onSubmit={handleSubmit} className="p-6">
                {/* Question Preview */}
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Question:</p>
                  <p className="text-sm text-gray-900 dark:text-gray-100 line-clamp-3">
                    {question?.question_text || 'No question text available'}
                  </p>
                </div>

                {/* Feedback Type */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Issue Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFeedbackType('issue')}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        feedbackType === 'issue'
                          ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-2 border-blue-300 dark:border-blue-700'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-transparent hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      Question Issue
                    </button>
                    <button
                      type="button"
                      onClick={() => setFeedbackType('explanation')}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        feedbackType === 'explanation'
                          ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-2 border-blue-300 dark:border-blue-700'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-transparent hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      Explanation Issue
                    </button>
                  </div>
                </div>

                {/* Feedback Text */}
                <div className="mb-4">
                  <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Describe the issue <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="feedback"
                    name="feedback"
                    value={feedbackText}
                    onChange={handleTextareaChange}
                    placeholder={feedbackType === 'issue' 
                      ? "e.g., Wrong answer marked as correct, typo in question..." 
                      : "e.g., Incorrect explanation, missing details..."
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors"
                    style={{
                      fontFamily: 'inherit',
                      whiteSpace: 'pre-wrap',
                      wordWrap: 'break-word'
                    }}
                    rows={4}
                    required
                    autoComplete="off"
                    spellCheck="true"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Please provide as much detail as possible to help us understand the issue.
                  </p>
                </div>

                {/* Contact Email (only if not logged in) */}
                {!session && (
                  <div className="mb-6">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Contact Email <span className="text-sm text-gray-500">(optional)</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      autoComplete="email"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      We'll only use this to follow up on your feedback
                    </p>
                  </div>
                )}

                {/* Submit Status */}
                {submitStatus && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
                      submitStatus === 'success'
                        ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300'
                        : 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300'
                    }`}
                  >
                    {submitStatus === 'success' ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">Thank you! Your feedback has been submitted.</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm">Failed to submit feedback. Please try again.</span>
                      </>
                    )}
                  </motion.div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !feedbackText.trim()}
                  className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all ${
                    isSubmitting || !feedbackText.trim()
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Submit Feedback
                    </>
                  )}
                </button>

                {/* Debug info (remove in production) */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="mt-4 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                    <p>Characters: {feedbackText.length}</p>
                    <p>Trimmed length: {feedbackText.trim().length}</p>
                  </div>
                )}
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
