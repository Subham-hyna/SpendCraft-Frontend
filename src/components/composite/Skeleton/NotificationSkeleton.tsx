'use client'
import React from 'react'

const NotificationSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          {/* Title and Remove Button Row */}
          <div className="flex items-start justify-between mb-1">
            <div className="h-5 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>

          {/* Description */}
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
          <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />

          {/* Time and Action Row */}
          <div className="flex items-center justify-between">
            <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationSkeleton

