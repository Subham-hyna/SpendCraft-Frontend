'use client'
import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { PieChart as PieChartIcon } from 'lucide-react'
import { formatIndianCurrency, formatCompactCurrency } from '@/lib/currencyFormat'

interface CategoryData {
  name: string
  value: number
  percentage: number
  expenseCount: number
  color: string
  chartColor: string
  icon: string
}

interface DoughnutChartProps {
  categoryChartData: CategoryData[]
  totalAmount: number
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ categoryChartData, totalAmount }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 sm:p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <PieChartIcon size={20} strokeWidth={1.5} className="text-gray-600 dark:text-gray-400" />
        <h3 className="text-lg sm:text-xl font-light text-gray-900 dark:text-gray-100">
          Category Distribution
        </h3>
      </div>

      {/* Doughnut Chart */}
      <div className="flex items-center justify-center mb-8">
        <div className="relative w-64 h-64 sm:w-72 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryChartData as any}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={110}
                paddingAngle={1}
                dataKey="value"
              >
                {categoryChartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.chartColor} 
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 font-light">Total</p>
            <p className="text-2xl font-light text-gray-900 dark:text-gray-100">
              {formatCompactCurrency(totalAmount, false)}
            </p>
          </div>
        </div>
      </div>

      {/* Category List */}
      <div className="space-y-4">
        {categoryChartData.map((category, index) => (
          <div key={index} className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
              style={{ backgroundColor: category.color }}
            >
              {category.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm sm:text-base font-light text-gray-900 dark:text-gray-100">{category.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-light">{category.expenseCount} expenses</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm sm:text-base font-light text-gray-900 dark:text-gray-100">
                {formatIndianCurrency(category.value, false)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-light">{category.percentage.toFixed(1)}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DoughnutChart
