"use client"
import React, { useState, useEffect } from 'react'
import { Budget, BudgetStatus } from '@/types/apiResponse'
import { cn, calculatePercentage } from '@/lib/utils'
import { formatIndianCurrency } from '@/lib/currencyFormat'
import OverallBudgetCardSkeleton from '@/components/composite/Skeleton/OverallBudgetCardSkeleton'
import ProgressBar from '@/components/composite/ProgressBar'
import { Edit2 } from 'lucide-react'

interface OverallBudgetCardProps {
  budget: Budget | undefined
  loading?: boolean
  toggleLoading?: boolean
  onToggle?: () => void
  onEdit?: () => void
  spent?: number
}

const OverallBudgetCard: React.FC<OverallBudgetCardProps> = ({
  budget,
  loading = false,
  toggleLoading = false,
  onToggle,
  onEdit,
  spent = 0,
}) => {
  const [total, setTotal] = useState<number>(budget?.amount || 0)
  const [percentage, setPercentage] = useState<number>(0)
  const [remaining, setRemaining] = useState<number>(0)
  const [progressColor, setProgressColor] = useState<string>('bg-emerald-500')
  const [textColor, setTextColor] = useState<string>('text-emerald-600')
  const [statusText, setStatusText] = useState<string>('Good')

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

  // Get status text
  const getStatusText = (percentage: number) => {
    if (percentage >= 90) return 'Critical'
    if (percentage >= 75) return 'Warning'
    if (percentage >= 50) return 'Moderate'
    return 'Good'
  }

  useEffect(() => {
    const newTotal = budget?.amount || 0
    const newPercentage = calculatePercentage(spent, newTotal)
    const newRemaining = Math.max(0, newTotal - spent)
    const newProgressColor = getProgressColor(newPercentage)
    const newTextColor = getTextColor(newPercentage)
    const newStatusText = getStatusText(newPercentage)

    setTotal(newTotal)
    setPercentage(newPercentage)
    setRemaining(newRemaining)
    setProgressColor(newProgressColor)
    setTextColor(newTextColor)
    setStatusText(newStatusText)
  }, [budget?.amount, spent])

  if (loading) {
    return <OverallBudgetCardSkeleton />
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 mb-6 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <p className="text-sm text-gray-500 font-light">Overall Budget · Monthly</p>
            {budget && onToggle && (
              <button
                onClick={onToggle}
                disabled={toggleLoading}
                className={cn(
                  "relative w-12 h-7 rounded-full transition-colors",
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
          <h2 className="text-4xl sm:text-5xl font-light text-gray-900 mb-2">
            {formatIndianCurrency(spent, false)}
          </h2>
          <p className="text-sm text-gray-600 font-light">of {formatIndianCurrency(total, false)}</p>
        </div>
        <div className="text-right">
          <p className={cn("text-3xl sm:text-4xl font-light mb-2", textColor)}>{percentage}%</p>
          <p className={cn("text-xs sm:text-sm font-medium mb-3", textColor)}>{statusText}</p>
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
      
      {/* Progress Bar */}
      <ProgressBar 
        percentage={percentage} 
        color={progressColor}
      />
    </div>
  )
}

export default OverallBudgetCard

