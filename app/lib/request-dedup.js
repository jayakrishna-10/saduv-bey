// app/lib/request-dedup.js

// Store for pending requests
const pendingRequests = new Map();

/**
 * Deduplicates concurrent requests to the same endpoint
 * If a request is already in-flight, returns the existing promise
 * 
 * @param {string} key - Unique key for the request
 * @param {Function} fetchFn - Function that returns a promise
 * @returns {Promise} - The deduplicated promise
 */
export async function dedupeRequest(key, fetchFn) {
  // Check if request is already pending
  if (pendingRequests.has(key)) {
    console.log(`[DEDUP] Reusing pending request for: ${key}`);
    return pendingRequests.get(key);
  }
  
  // Create new request promise
  console.log(`[DEDUP] Creating new request for: ${key}`);
  const promise = fetchFn()
    .finally(() => {
      // Clean up after request completes
      pendingRequests.delete(key);
      console.log(`[DEDUP] Cleaned up request for: ${key}`);
    });
  
  // Store the promise
  pendingRequests.set(key, promise);
  
  return promise;
}

/**
 * Clear all pending requests (useful for cleanup)
 */
export function clearPendingRequests() {
  pendingRequests.clear();
  console.log('[DEDUP] Cleared all pending requests');
}

/**
 * Get count of pending requests (useful for debugging)
 */
export function getPendingRequestCount() {
  return pendingRequests.size;
}
