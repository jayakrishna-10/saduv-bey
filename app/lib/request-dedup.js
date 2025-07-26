// FILE: app/lib/request-dedup.js

// Store for pending requests
const pendingRequests = new Map();

// Store for deduplication statistics (development only)
const dedupStats = {
  totalRequests: 0,
  deduplicatedRequests: 0,
  activeRequests: 0,
  requestTypes: {},
  errors: [],
  startTime: Date.now()
};

const MAX_ERROR_LOG = 50;
const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Enhanced deduplication with monitoring and statistics
 * 
 * @param {string} key - Unique key for the request
 * @param {Function} fetchFn - Function that returns a promise
 * @returns {Promise} - The deduplicated promise
 */
export async function dedupeRequest(key, fetchFn) {
  if (isDevelopment) {
    dedupStats.totalRequests++;
    
    // Track request types for analytics
    const requestType = key.split('-')[0];
    dedupStats.requestTypes[requestType] = (dedupStats.requestTypes[requestType] || 0) + 1;
  }

  // Check if request is already pending
  if (pendingRequests.has(key)) {
    if (isDevelopment) {
      dedupStats.deduplicatedRequests++;
      console.log(`[DEDUP] Reusing pending request for: ${key} (${dedupStats.deduplicatedRequests} total duplicates avoided)`);
    } else {
      console.log(`[DEDUP] Reusing pending request for: ${key}`);
    }
    return pendingRequests.get(key);
  }
  
  // Create new request promise with enhanced error handling
  if (isDevelopment) {
    console.log(`[DEDUP] Creating new request for: ${key} (${pendingRequests.size} active requests)`);
    dedupStats.activeRequests = Math.max(dedupStats.activeRequests, pendingRequests.size + 1);
  } else {
    console.log(`[DEDUP] Creating new request for: ${key}`);
  }

  const promise = fetchFn()
    .then(result => {
      // Log successful completion in development
      if (isDevelopment) {
        console.log(`[DEDUP] Request completed successfully for: ${key}`);
      }
      return result;
    })
    .catch(error => {
      // Enhanced error logging
      if (isDevelopment) {
        const errorInfo = {
          key,
          error: error.message,
          timestamp: new Date().toISOString(),
          stack: error.stack
        };
        
        dedupStats.errors.unshift(errorInfo);
        if (dedupStats.errors.length > MAX_ERROR_LOG) {
          dedupStats.errors.length = MAX_ERROR_LOG;
        }
        
        console.error(`[DEDUP] Request failed for: ${key}`, error);
      }
      throw error;
    })
    .finally(() => {
      // Clean up after request completes
      pendingRequests.delete(key);
      if (isDevelopment) {
        console.log(`[DEDUP] Cleaned up request for: ${key} (${pendingRequests.size} requests remaining)`);
      } else {
        console.log(`[DEDUP] Cleaned up request for: ${key}`);
      }
    });
  
  // Store the promise
  pendingRequests.set(key, promise);
  
  return promise;
}

/**
 * Clear all pending requests (useful for cleanup)
 */
export function clearPendingRequests() {
  const clearedCount = pendingRequests.size;
  pendingRequests.clear();
  
  if (isDevelopment) {
    console.log(`[DEDUP] Cleared ${clearedCount} pending requests`);
  } else {
    console.log('[DEDUP] Cleared all pending requests');
  }
}

/**
 * Get count of pending requests (useful for debugging)
 */
export function getPendingRequestCount() {
  return pendingRequests.size;
}

/**
 * Get list of pending request keys (development only)
 */
export function getPendingRequestKeys() {
  if (!isDevelopment) return [];
  return Array.from(pendingRequests.keys());
}

/**
 * Get deduplication statistics (development only)
 */
export function getDedupStats() {
  if (!isDevelopment) {
    return {
      message: 'Statistics only available in development mode'
    };
  }

  const uptime = Date.now() - dedupStats.startTime;
  const duplicateRate = dedupStats.totalRequests > 0 
    ? (dedupStats.deduplicatedRequests / dedupStats.totalRequests * 100).toFixed(2)
    : 0;

  return {
    ...dedupStats,
    uptime: `${Math.round(uptime / 1000)}s`,
    duplicateRate: `${duplicateRate}%`,
    currentlyPending: pendingRequests.size,
    pendingKeys: Array.from(pendingRequests.keys()),
    recentErrors: dedupStats.errors.slice(0, 10)
  };
}

/**
 * Reset deduplication statistics (development only)
 */
export function resetDedupStats() {
  if (!isDevelopment) return;

  dedupStats.totalRequests = 0;
  dedupStats.deduplicatedRequests = 0;
  dedupStats.activeRequests = 0;
  dedupStats.requestTypes = {};
  dedupStats.errors = [];
  dedupStats.startTime = Date.now();
  
  console.log('[DEDUP] Statistics reset');
}

/**
 * Force cancel a pending request by key (emergency use only)
 */
export function cancelPendingRequest(key) {
  if (pendingRequests.has(key)) {
    pendingRequests.delete(key);
    console.log(`[DEDUP] Force cancelled request: ${key}`);
    return true;
  }
  return false;
}

/**
 * Get memory usage of pending requests (development only)
 */
export function getMemoryUsage() {
  if (!isDevelopment) return null;

  const keys = Array.from(pendingRequests.keys());
  const totalKeySize = keys.reduce((sum, key) => sum + key.length, 0);
  
  return {
    pendingRequestCount: pendingRequests.size,
    totalKeySize: `${totalKeySize} chars`,
    averageKeySize: keys.length > 0 ? `${Math.round(totalKeySize / keys.length)} chars` : '0 chars',
    estimatedMemoryUsage: `~${Math.round((totalKeySize + pendingRequests.size * 100) / 1024)}KB`
  };
}

/**
 * Auto-cleanup function to prevent memory leaks
 * Call this periodically to clean up any stuck requests
 */
export function autoCleanup(maxAge = 10 * 60 * 1000) { // 10 minutes default
  const startTime = Date.now();
  let cleanedCount = 0;

  // This is a basic cleanup - in a real implementation, you'd want to track
  // request start times and clean up only truly stuck requests
  
  if (pendingRequests.size > 100) { // If too many pending requests
    console.warn(`[DEDUP] High number of pending requests (${pendingRequests.size}), performing cleanup`);
    clearPendingRequests();
    cleanedCount = pendingRequests.size;
  }

  if (isDevelopment && cleanedCount > 0) {
    console.log(`[DEDUP] Auto-cleanup completed in ${Date.now() - startTime}ms, cleaned ${cleanedCount} requests`);
  }

  return cleanedCount;
}

// Auto-cleanup every 5 minutes in development
if (isDevelopment && typeof window !== 'undefined') {
  setInterval(autoCleanup, 5 * 60 * 1000);
}

export default {
  dedupeRequest,
  clearPendingRequests,
  getPendingRequestCount,
  getPendingRequestKeys,
  getDedupStats,
  resetDedupStats,
  cancelPendingRequest,
  getMemoryUsage,
  autoCleanup
};
