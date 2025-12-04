"use client"
import React from 'react'

const OverallBudgetCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 mb-6 shadow-sm animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <div className="h-4 bg-gray-200 rounded w-32" />
            <div className="w-12 h-7 bg-gray-200 rounded-full" />
          </div>
          <div className="h-12 bg-gray-200 rounded w-40 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-24" />
        </div>
        <div className="text-right">
          <div className="h-10 bg-gray-200 rounded w-16 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-12 mb-3" />
          <div className="h-8 bg-gray-200 rounded w-24" />
        </div>
      </div>
      <div className="h-2 bg-gray-200 rounded-full" />
    </div>
  )
}

export default OverallBudgetCardSkeleton

