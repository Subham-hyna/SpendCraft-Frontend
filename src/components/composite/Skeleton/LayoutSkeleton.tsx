'use client'
import React from 'react'

const LayoutSkeleton = () => {
  return (
    <div className='flex min-h-screen w-full mx-auto overflow-hidden'>
      {/* Sidebar Skeleton */}
      <div className='w-0 md:w-0 hidden'>
        {/* Sidebar is hidden on mobile, so no skeleton needed */}
      </div>

      {/* Main Content Area */}
      <div className='flex flex-col flex-1 w-full overflow-hidden'>
        {/* Header Skeleton */}
        <div className='bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800'>
          <div className='flex items-center justify-between px-4 py-3'>
            {/* Menu Button Skeleton */}
            <div className='w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse' />
            
            {/* User Info Skeleton */}
            <div className='flex items-center gap-3 flex-1 ml-4'>
              {/* Avatar Skeleton */}
              <div className='w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse' />
              
              {/* Greeting Text Skeleton */}
              <div className='flex flex-col gap-2'>
                <div className='h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse' />
                <div className='h-3 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse' />
              </div>
            </div>

            {/* Notification Bell Skeleton */}
            <div className='w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse' />
          </div>
        </div>

        {/* Main Content Skeleton */}
        <main className='flex-1 overflow-y-auto p-4'>
          <div className='space-y-4'>
            {/* Card Skeletons */}
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className='bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4'
              >
                <div className='space-y-3'>
                  <div className='h-5 w-3/4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse' />
                  <div className='h-4 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse' />
                  <div className='h-4 w-5/6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse' />
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Bottom Nav Skeleton */}
        <div className='bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-slate-800 px-4 py-2'>
          <div className='flex items-center justify-around max-w-lg mx-auto'>
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className='flex flex-col items-center gap-1'>
                <div className='w-6 h-6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse' />
                <div className='h-3 w-12 bg-gray-200 dark:bg-gray-800 rounded animate-pulse' />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LayoutSkeleton

