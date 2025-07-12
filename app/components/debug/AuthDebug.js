// app/components/debug/AuthDebug.js - Debug component to validate authentication state
'use client';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bug, Eye, EyeOff, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

const AuthDebug = ({ showByDefault = false }) => {
  const { data: session, status } = useSession();
  const [isVisible, setIsVisible] = useState(showByDefault);
  const [dbCheck, setDbCheck] = useState({ loading: false, result: null });

  // Function to validate Google ID format
  const validateGoogleId = (googleId) => {
    if (!googleId) return { valid: false, reason: 'No Google ID provided' };
    if (typeof googleId !== 'string') return { valid: false, reason: 'Google ID is not a string' };
    
    const googleIdPattern = /^\d{18,21}$/;
    if (!googleIdPattern.test(googleId)) {
      return { valid: false, reason: 'Invalid format - should be 18-21 digit numeric string' };
    }
    
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidPattern.test(googleId)) {
      return { valid: false, reason: 'This looks like a UUID, not a Google ID' };
    }
    
    return { valid: true, reason: 'Valid Google ID format' };
  };

  // Function to check if user exists in database
  const checkDatabase = async () => {
    if (!session?.user?.googleId) return;
    
    setDbCheck({ loading: true, result: null });
    
    try {
      const response = await fetch('/api/analytics?action=stats');
      if (response.ok) {
        const data = await response.json();
        setDbCheck({ 
          loading: false, 
          result: { 
            success: true, 
            message: 'User found in database',
            data: data
          } 
        });
      } else {
        const error = await response.text();
        setDbCheck({ 
          loading: false, 
          result: { 
            success: false, 
            message: `Database check failed: ${response.status} ${error}`,
            data: null
          } 
        });
      }
    } catch (error) {
      setDbCheck({ 
        loading: false, 
        result: { 
          success: false, 
          message: `Database check error: ${error.message}`,
          data: null
        } 
      });
    }
  };

  useEffect(() => {
    if (session?.user?.googleId && isVisible) {
      checkDatabase();
    }
  }, [session?.user?.googleId, isVisible]);

  // Only show in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const googleIdValidation = session?.user?.googleId ? validateGoogleId(session.user.googleId) : null;

  const getStatusIcon = (isValid) => {
    if (isValid === true) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (isValid === false) return <XCircle className="h-4 w-4 text-red-500" />;
    return <AlertCircle className="h-4 w-4 text-yellow-500" />;
  };

  const getStatusColor = (isValid) => {
    if (isValid === true) return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20';
    if (isValid === false) return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20';
    return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20';
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsVisible(!isVisible)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-4 right-4 p-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-full shadow-lg z-50 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
        title="Toggle Auth Debug"
      >
        <Bug className="h-5 w-5" />
      </motion.button>

      {/* Debug Panel */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-20 right-4 w-96 max-h-96 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-40"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Bug className="h-5 w-5" />
                  Auth Debug
                </h3>
                <button
                  onClick={() => setIsVisible(false)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                >
                  <EyeOff className="h-4 w-4 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4 text-sm">
                {/* Session Status */}
                <div className={`p-3 border rounded-lg ${getStatusColor(status === 'authenticated')}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(status === 'authenticated')}
                    <span className="font-medium">Session Status</span>
                  </div>
                  <div className="text-xs space-y-1">
                    <div>Status: <code>{status}</code></div>
                    <div>Authenticated: <code>{status === 'authenticated' ? 'true' : 'false'}</code></div>
                  </div>
                </div>

                {/* User Data */}
                {session?.user && (
                  <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">User Data</span>
                    </div>
                    <div className="text-xs space-y-1">
                      <div>Email: <code>{session.user.email}</code></div>
                      <div>Name: <code>{session.user.name}</code></div>
                      <div>Internal ID: <code>{session.user.id || 'Not set'}</code></div>
                    </div>
                  </div>
                )}

                {/* Google ID Validation */}
                {session?.user?.googleId && (
                  <div className={`p-3 border rounded-lg ${getStatusColor(googleIdValidation?.valid)}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(googleIdValidation?.valid)}
                      <span className="font-medium">Google ID Validation</span>
                    </div>
                    <div className="text-xs space-y-1">
                      <div>Google ID: <code className="break-all">{session.user.googleId}</code></div>
                      <div>Valid: <code>{googleIdValidation?.valid ? 'true' : 'false'}</code></div>
                      <div>Reason: <code>{googleIdValidation?.reason}</code></div>
                      <div>Type: <code>{typeof session.user.googleId}</code></div>
                      <div>Length: <code>{session.user.googleId.length}</code></div>
                    </div>
                  </div>
                )}

                {/* Database Check */}
                {session?.user?.googleId && (
                  <div className={`p-3 border rounded-lg ${
                    dbCheck.loading 
                      ? 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
                      : getStatusColor(dbCheck.result?.success)
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {dbCheck.loading ? (
                        <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        getStatusIcon(dbCheck.result?.success)
                      )}
                      <span className="font-medium">Database Check</span>
                      <button
                        onClick={checkDatabase}
                        disabled={dbCheck.loading}
                        className="ml-auto text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
                      >
                        Refresh
                      </button>
                    </div>
                    <div className="text-xs space-y-1">
                      {dbCheck.loading ? (
                        <div>Checking database...</div>
                      ) : dbCheck.result ? (
                        <>
                          <div>Status: <code>{dbCheck.result.success ? 'Success' : 'Failed'}</code></div>
                          <div>Message: <code>{dbCheck.result.message}</code></div>
                          {dbCheck.result.data && (
                            <div>Quiz Attempts: <code>{dbCheck.result.data.quizzes?.totalAttempts || 0}</code></div>
                          )}
                        </>
                      ) : (
                        <div>Click refresh to check database</div>
                      )}
                    </div>
                  </div>
                )}

                {/* No Session */}
                {!session && status !== 'loading' && (
                  <div className={`p-3 border rounded-lg ${getStatusColor(false)}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(false)}
                      <span className="font-medium">No Session</span>
                    </div>
                    <div className="text-xs">
                      User is not authenticated. Please sign in to see debug information.
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                {session?.user && (
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Quick Actions</div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => console.log('Session:', session)}
                        className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                      >
                        Log Session
                      </button>
                      <button
                        onClick={() => navigator.clipboard.writeText(session.user.googleId || '')}
                        className="px-2 py-1 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
                      >
                        Copy Google ID
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AuthDebug;
