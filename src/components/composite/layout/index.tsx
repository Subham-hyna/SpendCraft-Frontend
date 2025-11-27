'use client'
import React from 'react'
import Sidebar from '@/components/composite/Sidebar'
import HeaderNav from './HeaderNav'
import BottomNav from './BottomNav'
import LayoutSkeleton from '../Skeleton/LayoutSkeleton'
import { SidebarProvider } from '@/hooks/useSidebar'
import { useAppSelector } from '@/store'

interface LayoutProps {
    children: React.ReactNode;
    isHeaderVisible?: boolean;
    isBottomNavVisible?: boolean;
    pageHeading?: string;
    showNotificationBell?: boolean;
    showProfile?: boolean;
}

const LayoutContent = ({children, isHeaderVisible = true, isBottomNavVisible = true, pageHeading, showNotificationBell, showProfile}: LayoutProps) => {
    const { fetch_user_loading: user_fetch_loading } = useAppSelector((state) => state.auth);
    
    if (user_fetch_loading) {
        return <LayoutSkeleton />
    }
    
    return (
        <div className='flex h-screen w-full mx-auto overflow-hidden'>
            <Sidebar />
            <div className='flex flex-col flex-1 w-full overflow-hidden'>
                {isHeaderVisible && <HeaderNav pageHeading={pageHeading} showNotificationBell={showNotificationBell} showProfile={showProfile} />}
                <main className='flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900'>
                    {children}
                </main> 
                {isBottomNavVisible && <BottomNav />}
            </div>
        </div>
    )
}

const Layout = ({children, isHeaderVisible = true, isBottomNavVisible = true, pageHeading = '', showNotificationBell = true, showProfile = true}: LayoutProps) => {
  return (
    <SidebarProvider>
      <LayoutContent isHeaderVisible={isHeaderVisible} isBottomNavVisible={isBottomNavVisible} pageHeading={pageHeading} showNotificationBell={showNotificationBell} showProfile={showProfile}>
        {children}
      </LayoutContent>
    </SidebarProvider>
  )
}

export default Layout