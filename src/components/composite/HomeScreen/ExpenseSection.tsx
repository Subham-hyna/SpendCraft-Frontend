'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { Expense } from '@/types/apiResponse'
import { formatIndianCurrency } from '@/lib/currencyFormat'
import ExpenseSkeleton from '@/components/composite/Skeleton/ExpenseSkeleton'

interface ExpenseSectionProps {
  expenses: Expense[]
  todayTotal: number
  isLoading?: boolean
  onExpenseClick: (expense: Expense) => void
}

const ExpenseSection = ({ expenses, todayTotal, isLoading = false, onExpenseClick }: ExpenseSectionProps) => {
  const router = useRouter()

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-light text-gray-900 dark:text-gray-100">Today's Expenses</h2>
          <div className="h-7 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <ExpenseSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-light text-gray-900 dark:text-gray-100">Today's Expenses</h2>
        <p className="text-lg font-light text-gray-900 dark:text-gray-100">{formatIndianCurrency(todayTotal, false)}</p>
      </div>
      {expenses.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-8 sm:p-12 text-center shadow-sm">
          <p className="text-gray-400 dark:text-gray-500 font-light">No expenses today</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm divide-y divide-gray-100 dark:divide-gray-700">
          {expenses.slice(0, 5).map((expense) => (
            <button
              key={expense._id}
              onClick={() => onExpenseClick(expense)}
              className="w-full p-4 sm:p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 dark:bg-gray-700 rounded-xl flex items-center justify-center text-xl sm:text-2xl shrink-0"
                    style={{ backgroundColor: expense.category_id?.color || '#FEF3E2' }}
                  >
                    {expense.category_id?.icon || '📦'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-light text-gray-900 dark:text-gray-100 text-sm sm:text-base truncate">{expense.title}</p>
                    {expense.category_id && (
                      <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 font-light truncate">
                        {expense.category_id.name}
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-lg sm:text-xl font-light text-gray-900 dark:text-gray-100 ml-3 shrink-0">
                  {formatIndianCurrency(expense.amount, false)}
                </p>
              </div>
            </button>
          ))}
          {expenses.length > 0 && (
            <div className="p-4 sm:p-5 flex justify-end">
              <button
                onClick={() => router.push('/expense')}
                className="text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors flex items-center gap-1 text-sm font-light"
              >
                View All
                <ChevronRight size={16} strokeWidth={1.5} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ExpenseSection

