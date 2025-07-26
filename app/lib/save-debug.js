// FILE: app/lib/save-debug.js
// Debug utility to monitor and track save operations

const DEBUG_ENABLED = process.env.NODE_ENV === 'development';

// In-memory store for debugging save operations
const saveOperationLog = [];
const MAX_LOG_ENTRIES = 100;

/**
 * Log save operation attempts for debugging
 */
export function logSaveOperation(operation) {
  if (!DEBUG_ENABLED) return;

  const logEntry = {
    timestamp: new Date().toISOString(),
    operation: operation.type, // 'quiz' or 'test'
    userId: operation.userId,
    attemptId: operation.attemptId,
    status: operation.status, // 'started', 'success', 'error', 'duplicate'
    details: operation.details,
    stackTrace: operation.error ? new Error().stack : null
  };

  saveOperationLog.unshift(logEntry);
  
  // Keep only the last MAX_LOG_ENTRIES
  if (saveOperationLog.length > MAX_LOG_ENTRIES) {
    saveOperationLog.length = MAX_LOG_ENTRIES;
  }

  console.log(`[SAVE-DEBUG] ${logEntry.status.toUpperCase()}: ${operation.type} save for user ${operation.userId}`, logEntry.details);
}

/**
 * Get recent save operations for debugging
 */
export function getRecentSaveOperations(userId = null, limit = 20) {
  if (!DEBUG_ENABLED) return [];

  let filtered = saveOperationLog;
  
  if (userId) {
    filtered = saveOperationLog.filter(entry => entry.userId === userId);
  }

  return filtered.slice(0, limit);
}

/**
 * Get save operation statistics
 */
export function getSaveOperationStats(userId = null) {
  if (!DEBUG_ENABLED) return {};

  let entries = saveOperationLog;
  
  if (userId) {
    entries = saveOperationLog.filter(entry => entry.userId === userId);
  }

  const stats = {
    total: entries.length,
    successful: entries.filter(e => e.status === 'success').length,
    failed: entries.filter(e => e.status === 'error').length,
    duplicates: entries.filter(e => e.status === 'duplicate').length,
    byType: {
      quiz: entries.filter(e => e.operation === 'quiz').length,
      test: entries.filter(e => e.operation === 'test').length
    },
    recentErrors: entries
      .filter(e => e.status === 'error')
      .slice(0, 5)
      .map(e => ({ timestamp: e.timestamp, error: e.details?.error, userId: e.userId }))
  };

  return stats;
}

/**
 * Clear save operation logs (for testing)
 */
export function clearSaveOperationLogs() {
  if (!DEBUG_ENABLED) return;
  
  saveOperationLog.length = 0;
  console.log('[SAVE-DEBUG] Operation logs cleared');
}

/**
 * Generate save operation report
 */
export function generateSaveOperationReport() {
  if (!DEBUG_ENABLED) return null;

  const stats = getSaveOperationStats();
  const recentOps = getRecentSaveOperations(null, 10);
  
  return {
    summary: stats,
    recentOperations: recentOps,
    duplicateRate: stats.total > 0 ? (stats.duplicates / stats.total * 100).toFixed(2) + '%' : '0%',
    errorRate: stats.total > 0 ? (stats.failed / stats.total * 100).toFixed(2) + '%' : '0%',
    generatedAt: new Date().toISOString()
  };
}

/**
 * Hook for React components to monitor save operations
 */
export function useSaveOperationMonitor() {
  if (typeof window === 'undefined' || !DEBUG_ENABLED) {
    return {
      logSave: () => {},
      getStats: () => ({}),
      getRecent: () => []
    };
  }

  return {
    logSave: logSaveOperation,
    getStats: getSaveOperationStats,
    getRecent: getRecentSaveOperations,
    generateReport: generateSaveOperationReport
  };
}
