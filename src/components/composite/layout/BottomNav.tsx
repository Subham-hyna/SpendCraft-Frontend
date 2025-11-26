'use client';
import React from 'react';
import { Home, BarChart3, Calendar, User, Plus } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

const BottomNavigation = () => {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/home' },
    { id: 'stats', label: 'Stats', icon: BarChart3, path: '/stat' },
    { id: 'add', label: 'Add', icon: Plus, isCenter: true, path: '/add' },
    { id: 'calendar', label: 'Calendar', icon: Calendar, path: '/calendar' },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-slate-800 px-4 py-2 shadow-lg dark:shadow-gray-900/50">
      <div className="flex items-center justify-around max-w-lg mx-auto relative">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = pathname === item.path;

          if (item.isCenter) {
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className="relative -mt-8"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-400 dark:from-indigo-600 dark:to-indigo-500 rounded-full flex items-center justify-center text-white shadow-lg dark:shadow-indigo-500/20 hover:shadow-xl hover:scale-105 transition-all">
                  <IconComponent size={28} strokeWidth={2} />
                </div>
                <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs font-light text-gray-400 dark:text-gray-300 whitespace-nowrap">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={`flex flex-col items-center gap-1 p-2 transition-colors ${
                isActive
                  ? 'text-indigo-500 dark:text-indigo-400'
                  : 'text-gray-500 dark:text-gray-300 hover:text-indigo-400 dark:hover:text-indigo-500'
              }`}
            >
              <IconComponent size={22} strokeWidth={1.5} />
              <span className="text-xs font-light">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
