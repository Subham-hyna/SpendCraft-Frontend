'use client'
import React from 'react'

interface DoughnutChartSkeletonProps {
  className?: string
}

const DoughnutChartSkeleton: React.FC<DoughnutChartSkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl p-5 sm:p-6 shadow-sm ${className}`}>
      {/* Header Skeleton */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>

      {/* Doughnut Chart Skeleton */}
      <div className="flex items-center justify-center mb-8">
        <div className="relative w-48 h-48">
          {/* Outer circle skeleton */}
          <div className="absolute inset-0 rounded-full border-8 border-gray-200 dark:border-gray-700 animate-pulse" />
          {/* Inner circle (donut hole) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-white dark:bg-gray-800 rounded-full" />
          </div>
          {/* Center text skeleton */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
            <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Category List Skeleton */}
      <div className="space-y-4">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="flex items-center gap-3">
            {/* Colored dot skeleton */}
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl shrink-0 animate-pulse" />
            <div className="flex-1 min-w-0">
              {/* Category name skeleton */}
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
              {/* Expense count skeleton */}
              <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
            <div className="text-right shrink-0">
              {/* Amount skeleton */}
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
              {/* Percentage skeleton */}
              <div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DoughnutChartSkeleton

