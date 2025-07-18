// app/lib/cache.js
import { Redis } from '@upstash/redis';

const CACHE_DURATION = {
  QUESTIONS: 3600,      // 1 hour
  TOPICS: 86400,        // 24 hours
  METADATA: 86400,      // 24 hours
  QUESTION_IDS: 7200,   // 2 hours
};

// Environment check for development
const isDevelopment = process.env.NODE_ENV === 'development';

// Initialize Redis client
const redis = Redis.fromEnv();

/**
 * Generic cache wrapper that handles getting/setting cached data
 * Falls back to direct fetch if cache fails
 */
export async function getCachedData(key, fetchFn, ttl = CACHE_DURATION.QUESTIONS) {
  // Skip cache in development for easier testing
  if (isDevelopment && process.env.SKIP_CACHE === 'true') {
    console.log(`[DEV] Skipping cache for ${key}`);
    return fetchFn();
  }

  try {
    // Try to get from cache
    const startTime = Date.now();
    const cached = await redis.get(key);
    
    if (cached) {
      console.log(`[CACHE HIT] ${key} (${Date.now() - startTime}ms)`);
      return cached;
    }
    
    // If not in cache, fetch fresh data
    console.log(`[CACHE MISS] ${key}, fetching fresh data`);
    const fetchStartTime = Date.now();
    const fresh = await fetchFn();
    console.log(`[FETCH] ${key} completed in ${Date.now() - fetchStartTime}ms`);
    
    // Store in cache with TTL (non-blocking)
    redis.set(key, fresh, { ex: ttl }).catch(err => {
      console.error(`[CACHE] Failed to set ${key}:`, err);
    });
    
    return fresh;
  } catch (error) {
    console.error(`[CACHE ERROR] ${key}:`, error);
    // Fallback to direct fetch if cache fails
    return fetchFn();
  }
}

/**
 * Generate consistent cache keys
 */
export function generateCacheKey(type, params) {
  // Sort params for consistent keys
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((acc, key) => {
      if (params[key] !== undefined && params[key] !== null) {
        acc[key] = params[key];
      }
      return acc;
    }, {});
  
  return `${type}:${JSON.stringify(sortedParams)}`;
}

/**
 * Invalidate cache by pattern
 */
export async function invalidateCache(pattern) {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await Promise.all(keys.map(key => redis.del(key)));
      console.log(`[CACHE] Invalidated ${keys.length} keys matching ${pattern}`);
    }
  } catch (error) {
    console.error('[CACHE] Invalidation error:', error);
  }
}

/**
 * Get cache statistics
 */
export async function getCacheStats() {
  try {
    const keys = await redis.keys('*');
    const stats = {
      totalKeys: keys.length,
      byType: {}
    };
    
    keys.forEach(key => {
      const type = key.split(':')[0];
      stats.byType[type] = (stats.byType[type] || 0) + 1;
    });
    
    return stats;
  } catch (error) {
    console.error('[CACHE] Stats error:', error);
    return null;
  }
}

// Export cache durations for use in other files
export { CACHE_DURATION };
