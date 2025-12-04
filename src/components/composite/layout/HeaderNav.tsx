'use client';
import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { useSidebar } from '@/hooks/useSidebar';
import { useAppSelector } from '@/store';
import { useRouter } from 'next/navigation';

interface HeaderNavProps {
  showNotificationBell?: boolean;
  showProfile?: boolean;
  pageHeading?: string;
}

const HeaderNav: React.FC<HeaderNavProps> = ({
  showNotificationBell = true,
  showProfile = true,
  pageHeading,
}) => {
  const { openSidebar } = useSidebar();
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();
  // Extract first name from user's name
  const firstName = user?.name?.split(' ')[0] || 'User';
  const userInitial = firstName.charAt(0).toUpperCase();
  const { notifications } = useAppSelector((state) => state.notifications);
  return (
    <header className="bg-white border-b border-gray-200 dark:bg-gray-950 dark:border-gray-800">
      <div className="flex items-center justify-between px-2 py-3">
        <button
          onClick={openSidebar}
          className="p-1 rounded-lg transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu size={24} strokeWidth={1.5} className="w-6 h-6 text-gray-700 dark:text-gray-200" />
        </button>

        {/* Middle Section - Page Heading or Profile */}
        <div className={`flex items-center gap-3 justify-start flex-1 ml-2`}>
          {pageHeading ? (
            <h1 className="text-lg font-light text-gray-900 dark:text-white">
              {pageHeading}
            </h1>
          ) : showProfile ? (
            <>
              {/* User Avatar */}
              <div onClick={() => router.push('/profile')} className={`w-10 h-10 ${!user?.photo_uri ? 'bg-gradient-to-br from-purple-400 to-purple-500' : ''} rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-sm ${user?.photo_uri ? 'border border-indigo-200 dark:border-indigo-300' : ''}`}>
                {user?.photo_uri ? (
                  <img
                    src={user.photo_uri}
                    alt={firstName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span>{userInitial}</span>
                )}
              </div>

              {/* Greeting Text */}
              <div className="flex flex-col">
                <span className="text-base font-light text-gray-900 dark:text-white">
                  Hi, {firstName}
                </span>
                {!user?.is_new_user && (
                  <span className="text-xs font-light text-gray-500 dark:text-gray-400">
                    Welcome back
                  </span>
                )}
              </div>
            </>
          ) : null}
        </div>

        {/* Notification Bell */}
        {showNotificationBell && (
          <button
            className="relative p-2 rounded-lg transition-colors"
            aria-label="Notifications"
            onClick={() => router.push('/notification')}
          >
            <Bell size={24} strokeWidth={1.5} className="w-6 h-6 text-gray-700 dark:text-gray-200" />
            {notifications.length > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>}
          </button>
        )}
      </div>
    </header>
  );
};

export default HeaderNav;