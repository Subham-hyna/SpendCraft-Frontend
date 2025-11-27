'use client';
import { useSidebar } from '@/hooks/useSidebar';
import { Filter, Menu, X } from 'lucide-react'
import React from 'react'

interface Header2Props {
  title: string;
  description?: string;
  onFilterClick?: () => void;
  onMarkAllAsRead?: () => void;
  unreadCount?: number;
}

const Header2 = ({ title, description, onFilterClick, onMarkAllAsRead, unreadCount }: Header2Props) => {
    const { openSidebar } = useSidebar();
  return (
    <div className="bg-gradient-to-b from-indigo-500 to-indigo-400 text-white px-4 sm:px-6 pt-8 pb-12">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-4">
            <button onClick={openSidebar} className="text-white hover:bg-white/20 transition-colors p-2 rounded-lg">
              <Menu size={24} strokeWidth={1.5} />
            </button>
            <div>
              <h1 className="text-3xl sm:text-4xl font-light tracking-tight mb-2">{title}</h1>
              <p className="text-indigo-100 text-sm sm:text-base font-light">
                {description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onFilterClick && <button 
              onClick={onFilterClick}
              className="text-white hover:bg-white/20 transition-colors p-2 rounded-lg"
            >
              <Filter size={22} strokeWidth={1.5} />
            </button>}
            {onMarkAllAsRead && unreadCount && unreadCount > 0 && (
              <button 
                onClick={onMarkAllAsRead}
                className="text-white bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-xl text-sm font-light backdrop-blur-sm border border-white/30"
              >
                Mark all read
              </button>
            )}
          </div>
        </div>
      </div>
  )
}

export default Header2