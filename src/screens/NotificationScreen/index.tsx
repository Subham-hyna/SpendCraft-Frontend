"use client"
import Header2 from '@/components/composite/Header2/Header2'
import Layout from '@/components/composite/layout'
import React, { useEffect } from 'react'
import { useAppSelector } from '@/store'
import { getNotifications, markAllAsRead } from '@/store/thunks'
import { useAppDispatch } from '@/store'
import NotificationCard from '@/components/composite/NotificationCard'
import NotificationSkeleton from '@/components/composite/Skeleton/NotificationSkeleton'

const NotificationScreen = () => {
  const { notifications, fetch_notifications_loading } = useAppSelector(
    (state) => state.notifications
  )
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getNotifications())
  }, [dispatch])

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead())
  }

  return (
    <Layout isHeaderVisible={false} showProfile={false}>
      <Header2 title="Notification" description="Manage your notifications" onMarkAllAsRead={handleMarkAllAsRead} unreadCount={notifications.length > 0 ? notifications.length : undefined} />
      <div className="px-4 sm:px-6 -mt-8 space-y-3 pb-8">
        {fetch_notifications_loading ? (
          // Skeleton loading state
          Array.from({ length: 5 }).map((_, index) => <NotificationSkeleton key={index} />)
        ) : notifications.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400 text-base mb-2">No notifications yet</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                You'll see your notifications here when they arrive
              </p>
            </div>
          </div>
        ) : (
          // Notifications list
          notifications.map((notification) => (
            <NotificationCard
              key={notification._id}
              notification={notification}
            />
          ))
        )}
      </div>
    </Layout>
  )
}

export default NotificationScreen
