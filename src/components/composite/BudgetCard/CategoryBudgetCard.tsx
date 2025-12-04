"use client"
import React, { useState, useEffect } from 'react'
import { Budget, BudgetStatus } from '@/types/apiResponse'
import { cn, calculatePercentage } from '@/lib/utils'
import { formatIndianCurrency } from '@/lib/currencyFormat'
import CategoryBudgetCardSkeleton from '@/components/composite/Skeleton/CategoryBudgetCardSkeleton'
import ProgressBar from '@/components/composite/ProgressBar'
import { Edit2 } from 'lucide-react'

interface CategoryBudgetCardProps {
  budget: Budget
  loading?: boolean
  toggleLoading?: boolean
  onToggle?: () => void
  onEdit?: () => void
  spent?: number
}

const CategoryBudgetCard: React.FC<CategoryBudgetCardProps> = ({
  budget,
  loading = false,
  toggleLoading = false,
  onToggle,
  onEdit,
  spent = 0,
}) => {
  const [total, setTotal] = useState<number>(budget.amount)
  const [percentage, setPercentage] = useState<number>(0)
  const [remaining, setRemaining] = useState<number>(0)
  const [progressColor, setProgressColor] = useState<string>('bg-emerald-500')
  const [textColor, setTextColor] = useState<string>('text-emerald-600')
  // Helper function to calculate progress color based on percentage
  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500'
    if (percentage >= 75) return 'bg-orange-500'
    if (percentage >= 50) return 'bg-yellow-500'
    return 'bg-emerald-500'
  }

  // Helper function to get text color based on percentage
  const getTextColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600'
    if (percentage >= 75) return 'text-orange-600'
    if (percentage >= 50) return 'text-yellow-600'
    return 'text-emerald-600'
  }

  useEffect(() => {
    const newTotal = budget.amount
    const newPercentage = calculatePercentage(spent, newTotal)
    const newRemaining = Math.max(0, newTotal - spent)
    const newProgressColor = getProgressColor(newPercentage)
    const newTextColor = getTextColor(newPercentage)
    setTotal(newTotal)
    setPercentage(newPercentage)
    setRemaining(newRemaining)
    setProgressColor(newProgressColor)
    setTextColor(newTextColor)
  }, [budget.amount, spent])

  if (loading) {
    return <CategoryBudgetCardSkeleton />
  }

  return (
    <div className="border border-gray-100 rounded-2xl p-4">
      <div className="flex items-start gap-4 mb-3">
        <div 
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
          style={{ backgroundColor: budget.category_id?.color || '#FEF3E2' }}
        >
          {budget.category_id?.icon || '📦'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-base font-light text-gray-900">
                  {budget.category_id?.name || 'Unnamed Category'}
                </h4>
                {onToggle && (
                  <button
                    onClick={onToggle}
                    disabled={toggleLoading}
                    className={cn(
                      "relative w-12 h-7 rounded-full transition-colors shrink-0",
                      budget.status === BudgetStatus.ACTIVE 
                        ? 'bg-indigo-500' 
                        : 'bg-gray-200 dark:bg-gray-700',
                      toggleLoading ? 'opacity-50 cursor-not-allowed' : ''
                    )}
                  >
                    <div
                      className={cn(
                        "absolute top-1 left-1 w-5 h-5 bg-white dark:bg-gray-800 rounded-full transition-transform",
                        budget.status === BudgetStatus.ACTIVE ? 'transform translate-x-5' : '',
                        toggleLoading ? 'animate-pulse' : ''
                      )}
                    />
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 font-light">
                Monthly
              </p>
            </div>
            {onEdit && (
              <button 
              onClick={onEdit}
              className="text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-500 transition-colors p-2"
            >
              <Edit2 size={16} strokeWidth={1.5} />
            </button> 
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-2">
        <p className="text-lg font-light text-gray-900">{formatIndianCurrency(spent, false)}</p>
        <p className="text-sm text-gray-500 font-light">/ {formatIndianCurrency(total, false)}</p>
      </div>

      <div className="mb-2">
        <ProgressBar 
          percentage={percentage} 
          color={progressColor}
        />
      </div>

      <div className="flex items-center justify-between">
        <p className={cn("text-sm font-light", textColor)}>{percentage}%</p>
        <p className="text-xs text-gray-500 font-light">{formatIndianCurrency(remaining, false)} left</p>
      </div>
    </div>
  )
}

export default CategoryBudgetCard

