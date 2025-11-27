'use client'
import React from 'react'

const CategorySkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:shadow-gray-900/20 border border-gray-100 dark:border-gray-700 p-5">
      {/* Header Section Skeleton */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          {/* Icon Skeleton */}
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse flex-shrink-0" />
          <div>
            {/* Title Skeleton */}
            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
            {/* Subcategory count Skeleton */}
            <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>
        {/* Edit Button Skeleton */}
        <div className="w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded animate-pulse flex-shrink-0" />
      </div>

      {/* Subcategories Section Skeleton */}
      <div>
        <div className="h-3 w-28 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-3" />
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-7 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default CategorySkeleton

