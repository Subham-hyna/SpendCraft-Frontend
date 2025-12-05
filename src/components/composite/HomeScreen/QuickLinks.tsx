'use client'
import React from 'react'
import { BarChart3, FileText, Wallet, Download } from 'lucide-react'
import { useRouter } from 'next/navigation'

const QuickLinks = () => {
  const router = useRouter()
  
  const quickActions = [
    { id: 1, name: 'Analytics', icon: <BarChart3 size={20} strokeWidth={1.5} className='text-gray-600' />, color: '#F3E8FF', path: '/report' },
    { id: 2, name: 'All Expenses', icon: <FileText size={20} strokeWidth={1.5} className='text-gray-600' />, color: '#E8F1FF', path: '/expense' },
    { id: 3, name: 'Budgets', icon: <Wallet size={20} strokeWidth={1.5} className='text-gray-600' />, color: '#DCFCE7', path: '/budget' },
    { id: 4, name: 'Export', icon: <Download size={20} strokeWidth={1.5} className='text-gray-600' />, color: '#FEF3E2', path: '/export' }
  ]

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-light text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {quickActions.map((action) => (
          <button
           onClick={() => router.push(action.path)}
            key={action.id}
            className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 sm:p-8 flex flex-col items-center gap-3 hover:shadow-md dark:hover:shadow-gray-900/20 transition-all"
          >
            <div
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl"
              style={{ backgroundColor: action.color }}
            >
              {action.icon}
            </div>
            <p className="text-sm sm:text-base font-light text-gray-900 dark:text-gray-100">{action.name}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

export default QuickLinks

