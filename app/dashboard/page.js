// FILE: app/dashboard/page.js
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  BarChart3, 
  TrendingUp,
  BookOpen,
  Target,
  Zap
} from 'lucide-react';

// Import dashboard components
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';
import { AnalyticsView } from '@/components/dashboard/AnalyticsView';
import { ProgressView } from '@/components/dashboard/ProgressView';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // State management
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    analytics: null,
    recentActivity: { quizAttempts: [], testAttempts: [] }
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    } else if (status === 'authenticated') {
      fetchDashboardData();
    }
  }, [status, router]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [analyticsRes, attemptsRes] = await Promise.all([
        fetch('/api/user/learning-analytics'),
        fetch('/api/user/attempts')
      ]);

      const [analytics, attempts] = await Promise.all([
        analyticsRes.json(),
        attemptsRes.json()
      ]);

      setDashboardData({
        analytics: analytics,
        recentActivity: attempts
      });

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'progress', label: 'Progress', icon: TrendingUp }
  ];

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <DashboardSkeleton />
        </div>
      </div>
    );
  }

  if (status === 'authenticated' && dashboardData.analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <DashboardHeader 
            session={session} 
            analytics={dashboardData.analytics}
          />

          {/* Tab Navigation */}
          <div className="mt-8 mb-6">
            <nav className="flex space-x-1 bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-2xl p-1 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200
                      ${activeTab === tab.id
                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-md'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                      }
                    `}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'overview' && (
                <DashboardOverview 
                  analytics={dashboardData.analytics}
                  recentActivity={dashboardData.recentActivity}
                />
              )}
              {activeTab === 'analytics' && (
                <AnalyticsView 
                  analytics={dashboardData.analytics}
                />
              )}
              {activeTab === 'progress' && (
                <ProgressView 
                  analytics={dashboardData.analytics}
                  recentActivity={dashboardData.recentActivity}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return null;
}
