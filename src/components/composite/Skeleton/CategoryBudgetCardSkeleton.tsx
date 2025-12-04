"use client"
import React from 'react'

const CategoryBudgetCardSkeleton: React.FC = () => {
  return (
    <div className="border border-gray-100 dark:border-gray-800 rounded-2xl p-4 dark:bg-gray-800/50 animate-pulse">
      <div className="flex items-start gap-4 mb-3">
        <div className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-2xl shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                <div className="w-12 h-7 bg-gray-200 dark:bg-gray-700 rounded-full" />
              </div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20" />
            </div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-12 ml-2" />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mb-2">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-2" />
      <div className="flex items-center justify-between">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" />
      </div>
    </div>
  )
}

export default CategoryBudgetCardSkeleton

