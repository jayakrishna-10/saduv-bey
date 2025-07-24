// FILE: app/components/dashboard/DashboardOverview.js
'use client';

import { motion } from 'framer-motion';
import { PerformanceMetrics } from './PerformanceMetrics';
import { LearningInsights } from './LearningInsights';
import { WeakAreasHeatmap } from './WeakAreasHeatmap';
import { StudyRecommendations } from './StudyRecommendations';
import { RecentAchievements } from './RecentAchievements';
import { PredictedScoreRadial } from './PredictedScoreRadial';

export function DashboardOverview({ analytics, recentActivity }) {
  return (
    <div className="space-y-6">
      {/* Top Row - Key Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Overview */}
        <div className="lg:col-span-2">
          <PerformanceMetrics analytics={analytics} />
        </div>
        
        {/* Predicted Score */}
        <div className="lg:col-span-1">
          <PredictedScoreRadial analytics={analytics} />
        </div>
      </div>

      {/* Middle Row - Insights and Weak Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Learning Insights */}
        <LearningInsights analytics={analytics} />
        
        {/* Weak Areas Heatmap */}
        <WeakAreasHeatmap analytics={analytics} />
      </div>

      {/* Bottom Row - Recommendations and Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Study Recommendations */}
        <div className="lg:col-span-2">
          <StudyRecommendations analytics={analytics} />
        </div>
        
        {/* Recent Achievements */}
        <div className="lg:col-span-1">
          <RecentAchievements 
            analytics={analytics} 
            recentActivity={recentActivity} 
          />
        </div>
      </div>
    </div>
  );
}
