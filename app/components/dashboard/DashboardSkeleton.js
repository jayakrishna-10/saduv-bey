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

      {/* Recommendations Skeleton */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 bg-blue-200 dark:bg-blue-700 rounded"></div>
          <div className="h-6 w-48 bg-blue-200 dark:bg-blue-700 rounded"></div>
        </div>
        <div className="space-y-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-300 dark:bg-blue-600 rounded-full mt-2"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 w-full bg-blue-200 dark:bg-blue-700 rounded"></div>
                <div className="h-3 w-3/4 bg-blue-100 dark:bg-blue-800 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chapter Accuracy Chart Skeleton */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="flex gap-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
          <div className="h-[500px] bg-gray-100 dark:bg-gray-700 rounded"></div>
        </div>

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
