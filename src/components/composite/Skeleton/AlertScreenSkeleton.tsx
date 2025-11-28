'use client'
import React from 'react'
import Header2 from '@/components/composite/Header2/Header2'
import Layout from '@/components/composite/layout'

const AlertScreenSkeleton = () => {
  return (
    <Layout isHeaderVisible={false}>
      <Header2 title="Alerts & Reminders" description="Manage your notifications preferences" />
      <div className="px-4 sm:px-6 -mt-8 space-y-4 pb-8">
        {/* Skeleton for multiple alert sections */}
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 sm:p-6 shadow-sm"
          >
            {/* Header Skeleton */}
            <div className="flex items-center gap-3 mb-5">
              {/* Icon Skeleton */}
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
              {/* Title Skeleton */}
              <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>

            {/* Toggle Section Skeleton */}
            <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex-1">
                {/* Toggle Title Skeleton */}
                <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
                {/* Toggle Description Skeleton */}
                <div className="h-4 w-56 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
              {/* Toggle Switch Skeleton */}
              <div className="w-12 h-7 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
            </div>

            {/* Optional: Checkboxes or Input Field Skeleton (only for first item) */}
            {item === 1 && (
              <div className="space-y-3 pl-1">
                {[1, 2, 3, 4].map((checkbox) => (
                  <div key={checkbox} className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            )}

            {/* Optional: Input Field Skeleton (only for last item) */}
            {item === 4 && (
              <div>
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
                <div className="relative">
                  <div className="w-full h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Layout>
  )
}

export default AlertScreenSkeleton

