'use client'
import React from 'react'

interface AreaChartSkeletonProps {
  className?: string
}

const AreaChartSkeleton: React.FC<AreaChartSkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl p-5 sm:p-6 shadow-sm ${className}`}>
      {/* Header Skeleton */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-6 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>

      {/* Chart Area Skeleton */}
      <div className="bg-gray-100 dark:bg-gray-700/50 rounded-xl p-4">
        <div className="h-[300px] w-full relative">
          {/* Simulated chart lines */}
          <svg className="w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="none">
            {/* Background grid lines */}
            {[1, 2, 3, 4, 5].map((i) => (
              <line
                key={`grid-h-${i}`}
                x1="0"
                y1={i * 60}
                x2="400"
                y2={i * 60}
                stroke="currentColor"
                strokeWidth="1"
                className="text-gray-200 dark:text-gray-600 opacity-30"
              />
            ))}
            {/* Animated area path */}
            <path
              d="M 20 250 Q 100 200, 180 150 T 340 100 T 380 80"
              fill="url(#gradient-skeleton)"
              className="opacity-20"
            />
            <path
              d="M 20 250 Q 100 200, 180 150 T 340 100 T 380 80"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              className="text-gray-300 dark:text-gray-600 animate-pulse"
            />
            <defs>
              <linearGradient id="gradient-skeleton" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="currentColor" stopOpacity={0.2} className="text-gray-300 dark:text-gray-600" />
                <stop offset="95%" stopColor="currentColor" stopOpacity={0} className="text-gray-300 dark:text-gray-600" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* X-axis labels skeleton */}
        <div className="flex justify-between mt-4 px-2">
          {[1, 2, 3, 4, 5, 6, 7].map((item) => (
            <div key={item} className="h-3 w-12 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
          ))}
        </div>
      </div>

      {/* List items skeleton */}
      <div className="mt-6 space-y-3">
        {[1, 2, 3, 4, 5, 6, 7].map((item) => (
          <div key={item} className="flex items-center justify-between py-3">
            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="flex items-center gap-3">
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AreaChartSkeleton

