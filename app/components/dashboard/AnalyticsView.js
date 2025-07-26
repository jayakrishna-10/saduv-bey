// FILE: app/components/dashboard/AnalyticsView.js
'use client';

import { motion } from 'framer-motion';
import { ChapterPerformanceChart } from './ChapterPerformanceChart';
import { ActivityGrid } from './ActivityGrid';
import { PerformanceComparison } from './PerformanceComparison';
import { TimeAnalysis } from './TimeAnalysis';

export function AnalyticsView({ analytics }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Performance Comparison Across Papers */}
      <PerformanceComparison analytics={analytics} />

      {/* Activity Heatmap */}
      <ActivityGrid />

      {/* Chapter Performance Over Time */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChapterPerformanceChart 
            selectedChapters={[]} 
            dateRange={30}
          />
        </div>
        
        {/* Time Analysis */}
        <div className="lg:col-span-1">
          <TimeAnalysis analytics={analytics} />
        </div>
      </div>
    </motion.div>
  );
}
