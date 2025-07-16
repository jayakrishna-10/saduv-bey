// FILE: app/components/dashboard/DashboardSkeleton.js
'use client';

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        <div className="space-y-3">
          <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>

      {/* Charts Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart Skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="h-[300px] bg-gray-100 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Accuracy Bar Skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
          <div className="h-[300px] bg-gray-100 dark:bg-gray-700 rounded"></div>
        </div>
      </div>

      {/* Bottom Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Predicted Score Skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="space-y-4">
            <div className="h-20 bg-gray-100 dark:bg-gray-700 rounded"></div>
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Grid Skeleton */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-2"></div>
                <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
              </div>
            ))}
          </div>
          <div className="h-40 bg-gray-100 dark:bg-gray-700 rounded"></div>
        </div>
      </div>

      {/* History Tables Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[...Array(2)].map((_, tableIndex) => (
          <div key={tableIndex}>
            <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, cardIndex) => (
                <div key={cardIndex} className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-2">
                      <div className="h-5 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                    <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
