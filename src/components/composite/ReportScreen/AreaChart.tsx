'use client'
import React from 'react'
import { AreaChart as RechartsAreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp } from 'lucide-react'
import { formatIndianCurrency } from '@/lib/currencyFormat'

interface ChartDataItem {
  period: string
  displayPeriod: string
  dateRange: string
  amount: number
  change: string | null
  isSpike: boolean
  periodRaw: string
}

interface AreaChartProps {
  chartData: ChartDataItem[]
  frequency?: string
  onPeriodClick?: (item: ChartDataItem) => void
}

const AreaChart: React.FC<AreaChartProps> = ({ chartData, frequency, onPeriodClick }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 sm:p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp size={20} strokeWidth={1.5} className="text-gray-600 dark:text-gray-400" />
        <h3 className="text-lg sm:text-xl font-light text-gray-900 dark:text-gray-100">
          Spending Trend Analysis (7 Periods)
        </h3>
      </div>
      <div className="bg-gray-100 dark:bg-gray-700/50 rounded-xl p-4">
        <ResponsiveContainer width="100%" height={300}>
          <RechartsAreaChart
            data={chartData}
            margin={{ 
              top: 10, 
              right: 20, 
              left: 20, 
              bottom: 30 
            }}
            className="border-0 outline-none"
          >
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="period" 
              stroke="transparent"
              style={{ fontSize: '12px', fontFamily: 'inherit' }}
              tickLine={false}
              axisLine={false}
              interval={0}
              tick={(props: any) => {
                const { x, y, payload } = props
                const topMargin = 8
                
                const displayValue = frequency === 'week' 
                  ? payload.value.replace('Week ', 'W')
                  : payload.value
                
                return (
                  <text
                    x={x}
                    y={y + topMargin}
                    textAnchor="middle"
                    fill="#6b7280"
                    fontSize="12px"
                    className="font-light"
                  >
                    {displayValue}
                  </text>
                )
              }}
            />
            <YAxis hide={true} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value: number) => formatIndianCurrency(value)}
              labelStyle={{ 
                color: '#374151',
                fontWeight: '500',
                marginBottom: '4px',
                fontSize: '14px'
              }}
            />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#6366f1"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorAmount)"
            />
          </RechartsAreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Period List with Amounts and Percentage Changes */}
      <div className="mt-6 px-2">
        {chartData.map((item, index) => {
          const isNegative = item.change && (item.change.includes('-') || item.change === 'NaN%')
          const isPositive = item.change && (item.change.includes('+') || item.change === 'Infinity%')
          
          return (
            <div
              key={index}
              onClick={() => onPeriodClick?.(item)}
              className={`flex items-center justify-between py-4 px-3 border-b border-gray-100 dark:border-gray-700/50 last:border-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors rounded-lg`}
            >
              <div className="flex flex-col">
                <span className="text-sm text-gray-600 dark:text-gray-400 font-light">{item.displayPeriod}</span>
                {frequency === 'week' && item.dateRange && (
                  <span className="text-xs text-gray-400 dark:text-gray-500 font-light mt-1">{item.dateRange}</span>
                )}
              </div>
              <div className="flex flex-col items-end gap-1">
                {item.change && (
                  <span
                    className={`text-xs font-light ${
                      item.isSpike
                        ? 'text-red-600 dark:text-red-400'
                        : isNegative
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : isPositive
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {isPositive ? '↑' : isNegative ? '↓' : ''} {item.change}
                  </span>
                )}
                <span className="text-sm sm:text-base font-light text-gray-900 dark:text-gray-100">
                  {formatIndianCurrency(item.amount)}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AreaChart
