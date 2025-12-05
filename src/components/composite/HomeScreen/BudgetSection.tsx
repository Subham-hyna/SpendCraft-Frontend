'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { Wallet, ChevronRight } from 'lucide-react'
import { BudgetType } from '@/types/apiResponse'
import { formatIndianCurrency } from '@/lib/currencyFormat'
import { calculatePercentage } from '@/lib/utils'
import ProgressBar from '@/components/composite/ProgressBar'
import OverallBudgetCardSkeleton from '@/components/composite/Skeleton/OverallBudgetCardSkeleton'
import CategoryBudgetCardSkeleton from '@/components/composite/Skeleton/CategoryBudgetCardSkeleton'
import { Budget, ExpenseStats } from '@/types/apiResponse'

interface BudgetSectionProps {
  budgets: Budget[]
  expenseStats?: ExpenseStats
  isLoading?: boolean
}

const BudgetSection = ({ budgets, expenseStats, isLoading = false }: BudgetSectionProps) => {
  const router = useRouter()

  const getTextColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600 dark:text-red-400'
    if (percentage >= 75) return 'text-orange-600 dark:text-orange-400'
    if (percentage >= 50) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-emerald-600 dark:text-emerald-400'
  }

  // Get overall budget
  const overallBudget = budgets?.find(budget => budget.type === BudgetType.OVERALL)

  // Calculate this month's total spending
  const thisMonthSpending = expenseStats?.total_amount || 0

  // Calculate overall budget percentage
  const overallBudgetPercentage = overallBudget 
    ? calculatePercentage(thisMonthSpending, overallBudget.amount)
    : 0

  // Get top 4 category budgets with their expense stats (sorted by percentage descending)
  const budgetCategories = React.useMemo(() => {
    const categoryBudgets = budgets?.filter(budget => budget.type === BudgetType.PARTICULAR) || []

    const categories = categoryBudgets.map(budget => {
      const categoryStat = expenseStats?.categories.find(
        stat => stat.category_id === budget.category_id?._id
      )
      const spent = categoryStat?.total_amount || 0
      const percentage = calculatePercentage(spent, budget.amount)

      return {
        id: budget._id,
        name: budget.category_id?.name || 'Unnamed Category',
        icon: budget.category_id?.icon || '📦',
        spent,
        total: budget.amount,
        percentage,
        color: budget.category_id?.color || '#FEF3E2'
      }
    })

    // Sort by percentage descending and take top 4
    return categories.sort((a, b) => b.percentage - a.percentage).slice(0, 4)
  }, [budgets, expenseStats])

  if (isLoading) {
    return (
      <div>
        <h2 className="text-xl sm:text-2xl font-light text-gray-900 dark:text-gray-100 mb-4">Budget Overview</h2>
        <div className="space-y-6">
          <OverallBudgetCardSkeleton />
          {[1, 2, 3, 4].map((i) => (
            <CategoryBudgetCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-light text-gray-900 dark:text-gray-100 mb-4">Budget Overview</h2>

      {!overallBudget && budgetCategories.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-8 sm:p-12 text-center shadow-sm">
          <p className="text-gray-400 dark:text-gray-500 font-light">No budgets set</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 sm:p-6 space-y-6 shadow-sm">
          {/* Overall Budget - Always at top */}
          {overallBudget && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-xl sm:text-2xl">
                    <Wallet size={24} className="text-indigo-500 dark:text-indigo-400" />
                  </div>
                  <div>
                    <p className="font-light text-gray-900 dark:text-gray-100 text-sm sm:text-base">Overall Budget</p>
                    <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 font-light">
                      {formatIndianCurrency(thisMonthSpending, false)} of {formatIndianCurrency(overallBudget.amount, false)}
                    </p>
                  </div>
                </div>
                <p className={`text-xl sm:text-2xl font-light ${getTextColor(overallBudgetPercentage)}`}>
                  {overallBudgetPercentage}%
                </p>
              </div>
              <ProgressBar
                percentage={overallBudgetPercentage}
              />
            </div>
          )}

          {/* Top 4 Category Budgets */}
          {budgetCategories.length > 0 && (
            <>
              {budgetCategories.map((category) => (
                <div key={category.id}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 dark:bg-gray-700 rounded-xl flex items-center justify-center text-xl sm:text-2xl"
                        style={{ backgroundColor: category.color }}
                      >
                        {category.icon}
                      </div>
                      <div>
                        <p className="font-light text-gray-900 dark:text-gray-100 text-sm sm:text-base">{category.name}</p>
                        <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 font-light">
                          {formatIndianCurrency(category.spent, false)} of {formatIndianCurrency(category.total, false)}
                        </p>
                      </div>
                    </div>
                    <p className={`text-xl sm:text-2xl font-light ${getTextColor(category.percentage)}`}>
                      {category.percentage}%
                    </p>
                  </div>
                  <ProgressBar
                    percentage={category.percentage}
                  />
                </div>
              ))}
            </>
          )}

          {/* View All Button - Bottom Right */}
          {(overallBudget || budgetCategories.length > 0) && (
            <div className="flex justify-end">
              <button
                onClick={() => router.push('/budget')}
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

export default BudgetSection

