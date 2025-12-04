'use client'
import React, { useState } from 'react'
import { X } from 'lucide-react'
import { Notification } from '@/types/apiResponse'
import { getRelativeTime } from '@/lib/dateUtils'
import { useRouter } from 'next/navigation'
import { markAsRead } from '@/store/thunks'
import { useAppDispatch } from '@/store'
import { Spinner } from '@/components/atomic/spinner'

interface NotificationCardProps {
  notification: Notification
  onRemove?: (id: string) => void
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onRemove,
}) => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const dispatch = useAppDispatch()

  const handleClick = () => {
    dispatch(markAsRead(notification._id))
    if (notification.redirect_uri) {
      router.push(notification.redirect_uri)
    }
  }

  const handleMarkAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      setLoading(true)
      await dispatch(markAsRead(notification._id))
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      onClick={notification.redirect_uri ? handleClick : undefined}
      className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 shadow-sm transition-all hover:shadow-md ${
        notification.redirect_uri ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">
              {notification.label}
            </h3>
          </div>

          {notification.description && (
            <p className="text-sm font-light mb-2 text-gray-600 dark:text-gray-300">
              {notification.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400 dark:text-gray-500 font-light">
              {getRelativeTime(notification.created_at)}
            </p>
            <button disabled={loading} className="text-xs text-indigo-500 dark:text-indigo-400 font-light" onClick={handleMarkAsRead}>
                {loading ? <Spinner width={18} height={18} /> : 'Mark as read'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationCard

