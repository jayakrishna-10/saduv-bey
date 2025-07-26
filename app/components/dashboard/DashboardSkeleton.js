// FILE: app/components/dashboard/DashboardSkeleton.js
'use client';

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
          <div className="space-y-2">
            <div className="h-7 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
        <div className="hidden md:flex gap-3">
          <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
        </div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center justify-between mb-2">
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
            <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
            <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>

      {/* Tab Navigation Skeleton */}
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-2xl p-1 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
        <div className="flex space-x-1">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex-1 h-11 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          ))}
        </div>
      </div>

      {/* Main Content Grid Skeleton */}
      <div className="space-y-6">
        {/* Top Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 h-96">
            <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-100 dark:bg-gray-700 rounded-xl"></div>
              ))}
            </div>
            <div className="h-48 bg-gray-100 dark:bg-gray-700 rounded"></div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 h-96">
            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
            <div className="flex items-center justify-center h-40 mb-6">
              <div className="w-32 h-32 bg-gray-100 dark:bg-gray-700 rounded-full"></div>
            </div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 dark:bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, cardIndex) => (
            <div key={cardIndex} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-100 dark:bg-gray-700 rounded-xl"></div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-100 dark:bg-gray-700 rounded-xl"></div>
              ))}
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 dark:bg-gray-700 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
