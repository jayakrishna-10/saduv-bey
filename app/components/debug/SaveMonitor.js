// FILE: app/components/debug/SaveMonitor.js
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Eye,
  EyeOff,
  Database
} from 'lucide-react';
import { getDedupStats, getPendingRequestCount } from '@/lib/request-dedup';

export function SaveMonitor({ isVisible = false, position = 'bottom-right' }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [stats, setStats] = useState({});
  const [saveData, setSaveData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Only show in development
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Auto-refresh stats
  useEffect(() => {
    if (!isDevelopment || !isVisible) return;

    const updateStats = () => {
      const dedupStats = getDedupStats();
      const pendingCount = getPendingRequestCount();
      
      setStats({
        ...dedupStats,
        pendingCount,
        lastUpdated: new Date().toLocaleTimeString()
      });
    };

    updateStats();
    const interval = setInterval(updateStats, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [isDevelopment, isVisible]);

  // Fetch save operation data from debug API
  const fetchSaveData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/debug/saves?hours=1&checkDuplicates=true');
      if (response.ok) {
        const data = await response.json();
        setSaveData(data);
      }
    } catch (error) {
      console.error('Failed to fetch save data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isExpanded && !saveData) {
      fetchSaveData();
    }
  }, [isExpanded]);

  if (!isDevelopment || !isVisible) {
    return null;
  }

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4'
  };

  const getStatusColor = () => {
    if (stats.pendingCount > 0) return 'text-yellow-500';
    if (stats.deduplicatedRequests > 0) return 'text-blue-500';
    return 'text-green-500';
  };

  const getStatusIcon = () => {
    if (stats.pendingCount > 0) return <Activity className="h-4 w-4 animate-pulse" />;
    if (stats.recentErrors?.length > 0) return <AlertTriangle className="h-4 w-4" />;
    return <CheckCircle className="h-4 w-4" />;
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-[9999] font-mono text-xs`}>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-2 bg-black/90 text-white rounded-lg p-4 w-80 max-h-96 overflow-auto"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Database className="h-4 w-4" />
                Save Monitor
              </h3>
              <button
                onClick={fetchSaveData}
                disabled={isLoading}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Deduplication Stats */}
            <div className="mb-4">
              <h4 className="text-yellow-400 mb-2">Deduplication Stats</h4>
              <div className="space-y-1 text-gray-300">
                <div>Total Requests: <span className="text-white">{stats.totalRequests || 0}</span></div>
                <div>Duplicates Avoided: <span className="text-green-400">{stats.deduplicatedRequests || 0}</span></div>
                <div>Duplicate Rate: <span className="text-blue-400">{stats.duplicateRate || '0%'}</span></div>
                <div>Currently Pending: <span className="text-yellow-400">{stats.pendingCount || 0}</span></div>
                <div>Uptime: <span className="text-gray-400">{stats.uptime || '0s'}</span></div>
              </div>
            </div>

            {/* Request Types */}
            {stats.requestTypes && Object.keys(stats.requestTypes).length > 0 && (
              <div className="mb-4">
                <h4 className="text-yellow-400 mb-2">Request Types</h4>
                <div className="space-y-1 text-gray-300">
                  {Object.entries(stats.requestTypes).map(([type, count]) => (
                    <div key={type}>
                      {type}: <span className="text-white">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Save Operation Data */}
            {saveData && (
              <div className="mb-4">
                <h4 className="text-yellow-400 mb-2">Recent Saves (1h)</h4>
                <div className="space-y-1 text-gray-300">
                  <div>Quiz Saves: <span className="text-white">{saveData.statistics?.quiz?.total || 0}</span></div>
                  <div>Test Saves: <span className="text-white">{saveData.statistics?.test?.total || 0}</span></div>
                  {saveData.potentialDuplicates && (
                    <>
                      <div>Quiz Duplicates: <span className="text-red-400">{saveData.potentialDuplicates.quiz?.length || 0}</span></div>
                      <div>Test Duplicates: <span className="text-red-400">{saveData.potentialDuplicates.test?.length || 0}</span></div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Recent Errors */}
            {stats.recentErrors && stats.recentErrors.length > 0 && (
              <div className="mb-4">
                <h4 className="text-red-400 mb-2">Recent Errors</h4>
                <div className="space-y-1 text-gray-300 max-h-20 overflow-auto">
                  {stats.recentErrors.slice(0, 3).map((error, index) => (
                    <div key={index} className="text-red-300 text-xs truncate">
                      {error.key}: {error.error}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pending Requests */}
            {stats.pendingKeys && stats.pendingKeys.length > 0 && (
              <div>
                <h4 className="text-yellow-400 mb-2">Pending Requests</h4>
                <div className="space-y-1 text-gray-300 max-h-16 overflow-auto">
                  {stats.pendingKeys.slice(0, 3).map((key, index) => (
                    <div key={index} className="text-yellow-300 text-xs truncate">
                      {key}
                    </div>
                  ))}
                  {stats.pendingKeys.length > 3 && (
                    <div className="text-gray-500">... and {stats.pendingKeys.length - 3} more</div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compact Status Indicator */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`
          flex items-center gap-2 px-3 py-2 bg-black/80 text-white rounded-lg
          border border-gray-600 hover:border-gray-400 transition-all
        `}
      >
        <span className={getStatusColor()}>
          {getStatusIcon()}
        </span>
        
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-2">
            <span className="text-xs">SAVE</span>
            {stats.pendingCount > 0 && (
              <span className="bg-yellow-500 text-black text-xs px-1 rounded">
                {stats.pendingCount}
              </span>
            )}
          </div>
          <div className="text-xs text-gray-400">
            {stats.deduplicatedRequests || 0} deduped
          </div>
        </div>

        {isExpanded ? (
          <EyeOff className="h-3 w-3 text-gray-400" />
        ) : (
          <Eye className="h-3 w-3 text-gray-400" />
        )}
      </motion.button>
    </div>
  );
}

// Hook to use save monitoring in components
export function useSaveMonitor() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const interval = setInterval(() => {
      const dedupStats = getDedupStats();
      const pendingCount = getPendingRequestCount();
      
      setStats({
        ...dedupStats,
        pendingCount
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return stats;
}
