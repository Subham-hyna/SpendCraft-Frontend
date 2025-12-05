'use client'
import React from 'react'
import Header2 from '@/components/composite/Header2/Header2'
import Layout from '@/components/composite/layout'

const CalendarScreenSkeleton = () => {
  return (
    <Layout isHeaderVisible={false}>
      <Header2 title="Calendar" description="View your monthly expenses" />
      <div className="px-4 -mt-5 pb-24">
        {/* Month Filter Skeleton */}
        <div className="flex justify-center mb-4">
          <div className="h-10 w-40 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
              <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
              <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Calendar Skeleton */}
        <div className="mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
            {/* Week Days Skeleton */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                <div key={day} className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              ))}
            </div>

            {/* Calendar Grid Skeleton */}
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 35 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
              ))}
            </div>
          </div>
        </div>

        {/* Legend Skeleton */}
        <div className="mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 px-4 py-3 shadow-sm">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 justify-center">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                  <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category Stats Skeleton */}
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-5 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center gap-4">
                  <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
                  <div className="flex-1">
                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
                    <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </div>
                  <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default CalendarScreenSkeleton

