'use client'
import React from 'react'

const ExpenseSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 sm:p-5 shadow-sm dark:shadow-gray-900/20">
      <div className="flex items-start gap-4">
        {/* Icon Skeleton */}
        <div className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse shrink-0" />

        {/* Content Skeleton */}
        <div className="flex-1 min-w-0">
          {/* Title and Amount Row */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse shrink-0" />
          </div>

          {/* Category and Subcategory */}
          <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />

          {/* Date, Time, Location Row */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-3 w-1 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-3 w-1 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExpenseSkeleton



