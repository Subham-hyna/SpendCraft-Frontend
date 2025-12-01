'use client'
import React from 'react'
import { useAppSelector } from '@/store'
import { X, LogOut, ChevronRight } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import logo from '@/assets/icons/white_logo.png'
import { useSidebar } from '@/hooks/useSidebar'
import { menuItems } from './menuItems'
import { logout } from '@/store/thunks/authThunks'
import { useAppDispatch } from '@/store'
import { Spinner } from '@/components/atomic/spinner'
import { removeCookie } from '@/services/axiosInstance'

const Sidebar = () => {
  const { isSidebarOpen: isOpen, closeSidebar: onClose } = useSidebar()
  const {user, logout_loading} = useAppSelector((state) => state.auth)
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useAppDispatch()

  const handleNavigation = (path: string) => {
    router.push(path)
    onClose()
  }

  const getUserInitial = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase()
    }
    return 'U'
  }

  const handleLogout = async () => {
    try {
        await dispatch(logout()).unwrap();
        router.push('/login');
    } catch (err: any) {
        console.log(err);
    }
}

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className='fixed inset-0 bg-gray-900/50 dark:bg-black/70 backdrop-blur-sm z-40'
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-80 bg-white dark:bg-gray-950 overflow-hidden flex flex-col shadow-2xl z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Header */}
        <div className='bg-gradient-to-br from-indigo-600 to-indigo-400 dark:from-indigo-700 dark:to-indigo-500 text-white p-5'>
          <div className='flex items-start justify-between mb-5'>
            <span className='flex items-center gap-2'>
            <Image
                src={logo}
                alt="SpendCraft Logo"
                width={28}
                height={28}
                className="object-contain opacity-80 dark:opacity-90"
              />
            <h2 className='text-xl font-light text-white'>SpendCraft</h2>
            </span>
            <button 
              onClick={onClose}
              className='text-white hover:text-gray-200 dark:hover:text-gray-300 transition-colors p-2'
              aria-label='Close sidebar'
            >
              <X size={20} strokeWidth={1.5} />
            </button>
          </div>

          {/* Profile Section */}
          <div className='flex items-center gap-3' onClick={() => handleNavigation('/profile')}>
            {user?.photo_uri ? (
              <Image
                src={user.photo_uri}
                alt={user.name}
                width={48}
                height={48}
                className='rounded-full border border-indigo-200 dark:border-indigo-300'
              />
            ) : (
              <div className='w-12 h-12 bg-white/60 dark:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-200 text-lg font-light border border-indigo-200 dark:border-indigo-300'>
                {getUserInitial()}
              </div>
            )}
            <div>
              <p className='text-base font-light text-white'>{user?.name || 'User'}</p>
              <p className='text-xs text-white/90 dark:text-white/80 font-light'>{user?.email || 'user@email.com'}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className='flex-1 overflow-y-auto bg-white dark:bg-gray-900'>
          <div className='py-4'>
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center justify-between px-6 py-4 transition-colors group relative ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-500 dark:border-indigo-400'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  disabled={logout_loading}
                >
                  <div className='flex items-center gap-4'>
                    <item.icon 
                      size={20} 
                      strokeWidth={1.5} 
                      className={`transition-colors ${
                        isActive
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : 'text-gray-400 dark:text-gray-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400'
                      }`}
                    />
                    <span className={`text-base font-light transition-colors ${
                      isActive
                        ? 'text-indigo-700 dark:text-indigo-300'
                        : 'text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white'
                    }`}>
                      {item.label}
                    </span>
                  </div>
                  <div className='flex items-center gap-2'>
                    {item.badge && (
                      <span className='bg-red-400 dark:bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full min-w-[24px] text-center'>
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight 
                      size={18} 
                      strokeWidth={1.5} 
                      className={`transition-colors ${
                        isActive
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-gray-200'
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Logout Button */}
        <div className='border-t border-gray-200 dark:border-slate-800 px-6 py-3 bg-white dark:bg-gray-900'>
          <button 
            onClick={() => {
              handleLogout()
            }}
            disabled={logout_loading}
            className='w-full flex items-center justify-center gap-2 py-2.5 text-gray-500 dark:text-gray-50 hover:text-gray-700 dark:hover:text-gray-300 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {logout_loading ? (
              <Spinner className='text-gray-500 dark:text-gray-50 w-[18px] h-[18px]' />
            ) : (
              <LogOut size={18} strokeWidth={1.5} className='group-hover:text-gray-700 dark:group-hover:text-gray-300' />
            )}
            <span className='text-sm font-light'>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar