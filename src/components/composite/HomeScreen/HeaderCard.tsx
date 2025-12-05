'use client'
import React, { useState } from 'react'
import { TrendingUp, FileText, Mic, Plus } from 'lucide-react'
import { formatIndianCurrency } from '@/lib/currencyFormat'
import { useAppSelector } from '@/store'
import { Spinner } from '@/components/atomic/spinner'
import { useRouter } from 'next/navigation'

interface HeaderCardProps {
  thisMonthSpending: number
  budgetLeft: number
  headerLoading: boolean
  onAddExpense: (query: string) => void
}

const HeaderCard = ({ thisMonthSpending, budgetLeft, headerLoading, onAddExpense }: HeaderCardProps) => {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const { user_query_loading } = useAppSelector((state) => state.expenses);

  const handleUserQuery = () => {
    onAddExpense(query)
  }

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div 
        onClick={() => router.push('/expense')}
        className="bg-gradient-to-br from-indigo-500 to-indigo-400 dark:from-indigo-600 dark:to-indigo-500 rounded-2xl p-5 text-white shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <p className="text-xs sm:text-sm font-light text-indigo-100">This Month</p>
            <TrendingUp size={14} strokeWidth={1.5} className="text-indigo-100" />
          </div>
          {headerLoading ? (
            <div className="h-8 sm:h-10 w-32 bg-white/20 dark:bg-white/10 rounded animate-pulse" />
          ) : (
            <p className="text-2xl sm:text-3xl font-light">{formatIndianCurrency(thisMonthSpending, false)}</p>
          )}
        </div>

        <div 
        onClick={() => router.push('/budget')} 
        className="bg-gradient-to-br from-gray-600 to-gray-500 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-5 text-white shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <p className="text-xs sm:text-sm font-light text-gray-100">Budget Left</p>
            <FileText size={14} strokeWidth={1.5} className="text-gray-100" />
          </div>
          {headerLoading ? (
            <div className="h-8 sm:h-10 w-32 bg-white/20 dark:bg-white/10 rounded animate-pulse" />
          ) : (
            <p className="text-2xl sm:text-3xl font-light">{formatIndianCurrency(budgetLeft, false)}</p>
          )}
        </div>
      </div>

      {/* Voice Input */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-2 flex items-center gap-3 shadow-sm">
        <input
          type="text"
          placeholder="Say what you spent... 'Coffee ₹150'"
          className="flex-1 text-sm sm:text-base text-gray-600 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 outline-none font-light bg-transparent"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors p-2">
          <Mic size={20} strokeWidth={1.5} />
        </button>
      </div>

      {/* Add Expense Button */}
      <button 
        onClick={handleUserQuery} 
        className="w-full bg-indigo-500 dark:bg-indigo-600 text-white rounded-2xl py-4 flex items-center justify-center gap-2 hover:bg-indigo-600 dark:hover:bg-indigo-700 transition-all shadow-sm font-light"
        disabled={user_query_loading}
      >
        {user_query_loading ? <><Spinner width={20} height={20} /> Adding...</>: (
          <>
            <Plus size={20} strokeWidth={1.5} />
            Add Expense
          </>
        )}
      </button>
    </>
  )
}

export default HeaderCard

