"use client"
import React, { useEffect, useState, useMemo } from 'react'
import Layout from '@/components/composite/layout'
import Header2 from '@/components/composite/Header2/Header2'
import { useAppDispatch, useAppSelector } from '@/store'
import { getDayjsInUserTimezone, getUserTimezone, toISOUTC } from '@/lib/dateUtils'
import { getMonthlyExpenses, getRangeExpenses } from '@/store/thunks'
import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import { formatIndianCurrency } from '@/lib/currencyFormat'
import AreaChartSkeleton from '@/components/composite/Skeleton/AreaChartSkeleton'
import DoughnutChartSkeleton from '@/components/composite/Skeleton/DoughnutChartSkeleton'
import AreaChart from '@/components/composite/ReportScreen/AreaChart'
import DoughnutChart from '@/components/composite/ReportScreen/DoughnutChart'
import FrequencyDropdown from '@/components/composite/ReportScreen/FrequencyDropdown'

dayjs.extend(isoWeek)

// Calculate week date range from ISO week format (e.g., "2025-W44")
const getWeekDateRange = (isoWeekString: string): string => {
  const match = isoWeekString.match(/(\d{4})-W(\d{2})/)
  if (!match) return isoWeekString
  
  const year = parseInt(match[1])
  const week = parseInt(match[2])
  
  try {
    // Use ISO week calculation
    // Find January 4th of the year (always in week 1)
    const jan4 = dayjs(`${year}-01-04`)
    // Get the day of week (0 = Sunday, 1 = Monday, etc.)
    const jan4DayOfWeek = jan4.day()
    // Convert to ISO day (Monday = 1, Sunday = 7)
    const jan4IsoDay = jan4DayOfWeek === 0 ? 7 : jan4DayOfWeek
    // Calculate days to add to get to Monday of target week
    const daysToMonday = 1 - jan4IsoDay
    const daysToTargetWeek = (week - 1) * 7
    const weekStart = jan4.add(daysToMonday + daysToTargetWeek, 'day')
    const weekEnd = weekStart.add(6, 'day') // Sunday of the same week
    
    // Format as "MMM DD - MMM DD"
    const startFormatted = weekStart.format('MMM DD')
    const endFormatted = weekEnd.format('MMM DD')
    
    return `${startFormatted} - ${endFormatted}`
  } catch (error) {
    return isoWeekString
  }
}

// Format period label based on frequency
const formatPeriodLabel = (period: string, frequency: string): string => {
  if (frequency === 'day') {
    return dayjs(period).format('MMM DD')
  } else if (frequency === 'week') {
    // Format like "2025-W44" to show week number with date range
    const weekMatch = period.match(/W(\d+)/)
    if (weekMatch) {
      const weekNumber = weekMatch[1]
      const dateRange = getWeekDateRange(period)
      return `Week ${weekNumber}\n${dateRange}`
    }
    return period
  } else if (frequency === 'month') {
    return dayjs(period).format('MMM YYYY')
  } else if (frequency === 'year') {
    return dayjs(period).format('YYYY')
  }
  return period
}

// Predefined 16-color palette for pie chart (assigned uniquely to each category)
const PIE_CHART_COLORS = [
  '#60a5fa', // blue-400
  '#34d399', // emerald-400
  '#fbbf24', // amber-400
  '#f87171', // red-400
  '#a78bfa', // violet-400
  '#fb7185', // rose-400
  '#4ade80', // green-400
  '#22d3ee', // cyan-400
  '#f472b6', // pink-400
  '#818cf8', // indigo-400
  '#38bdf8', // sky-400
  '#84cc16', // lime-400
  '#f59e0b', // amber-500
  '#ec4899', // pink-500
  '#8b5cf6', // violet-500
  '#06b6d4', // cyan-500
]

const ReportScreen = () => {

 const dispatch = useAppDispatch()

 const { range_expenses, range_expenses_loading, monthly_expenses, monthly_expenses_loading, create_update_expense_loading } = useAppSelector((state) => state.expenses)

 const [selectedRange, setSelectedRange] = useState<string>('day')

 const frequencyOptions = [
   { value: 'day', label: 'Day' },
   { value: 'week', label: 'Week' },
   { value: 'month', label: 'Month' },
   { value: 'year', label: 'Year' }
 ]

 const fetchData = async () => {
    const now = getDayjsInUserTimezone();
    const timezone = getUserTimezone();

    const startOfMonth = now.startOf('month');
    const endOfMonth = now.endOf('month');

    let startDate: any = '';
    let endDate: any = '';
    if (selectedRange === 'day') {
        startDate = now.subtract(6, 'day');
        startDate = startDate.startOf('day');
        endDate = now.endOf('day')
    }
    if (selectedRange === 'week') {
        startDate = now.subtract(6, 'week');
        startDate = startDate.startOf('week');
        endDate = now.endOf('week');
    }
    if (selectedRange === 'month') {
        startDate = now.subtract(6, 'month');
        startDate = startDate.startOf('month');
        endDate = now.endOf('month');
    }
    if (selectedRange === 'year') {
        startDate = now.subtract(6, 'year');
        startDate = startDate.startOf('year');
        endDate = now.endOf('year');
    }

    await Promise.all([
        dispatch(getRangeExpenses(
            {
                start_date: toISOUTC(startDate.toDate()),
                end_date: toISOUTC(endDate.toDate()),
                timezone: timezone,
                frequency: selectedRange,
            }
        )),
        dispatch(getMonthlyExpenses({
            start_date: toISOUTC(startOfMonth.toDate()),
            end_date: toISOUTC(endOfMonth.toDate()),
            timezone: getUserTimezone()
          }))
    ])
 }

 useEffect(() => {
    fetchData();
 }, [selectedRange, create_update_expense_loading]);


 // Prepare chart data with percentage changes
 const chartData = useMemo(() => {
   if (!range_expenses?.data) return []

   return range_expenses.data.map((item, index) => {
     const label = formatPeriodLabel(item.period, range_expenses.frequency)
     // For week frequency, split label into week number and date range
     const isWeek = range_expenses.frequency === 'week'
     const [weekLabel, dateRange] = isWeek ? label.split('\n') : [label, '']
     
     // Calculate percentage change from previous period
     let change: string | null = null
     let isSpike = false
     if (index > 0) {
       const prevAmount = range_expenses.data[index - 1].total_amount
       if (prevAmount === 0 && item.total_amount > 0) {
         change = 'Infinity%'
         isSpike = true
       } else if (prevAmount > 0) {
         const percentChange = ((item.total_amount - prevAmount) / prevAmount) * 100
         if (isNaN(percentChange) || !isFinite(percentChange)) {
           change = 'NaN%'
         } else {
           change = `${percentChange >= 0 ? '+' : ''}${percentChange.toFixed(1)}%`
           // Consider it a spike if change is > 100%
           if (Math.abs(percentChange) > 100) {
             isSpike = true
           }
         }
       } else {
         change = 'NaN%'
       }
     }
     
     // Format period for display (e.g., "Apr 25", "Oct 25")
     let displayPeriod = weekLabel
     if (range_expenses.frequency === 'month') {
       displayPeriod = dayjs(item.period).format('MMM YY')
     } else if (range_expenses.frequency === 'day') {
       displayPeriod = dayjs(item.period).format('MMM DD')
     } else if (range_expenses.frequency === 'year') {
       displayPeriod = dayjs(item.period).format('YYYY')
     }
     
     return {
       period: weekLabel, // Main label for X-axis
       displayPeriod, // Formatted period for list display
       dateRange: dateRange || '', // Date range for week (shown below)
       amount: item.total_amount,
       change,
       isSpike,
       periodRaw: item.period
     }
   })
 }, [range_expenses])


 // Prepare category data for doughnut chart
 const categoryChartData = useMemo(() => {
   if (!monthly_expenses?.categoryData?.categories) return []

   const totalAmount = monthly_expenses.categoryData.total_amount
   
   // Create a copy of the array before sorting (Redux state is immutable)
   const categories = [...monthly_expenses.categoryData.categories]
     .sort((a, b) => b.total_amount - a.total_amount)
     .map((cat, index) => {
       const percentage = totalAmount > 0 ? ((cat.total_amount / totalAmount) * 100).toFixed(1) : '0'
       return {
         name: cat.category.name,
         value: cat.total_amount,
         percentage: parseFloat(percentage),
         expenseCount: cat.expense_count,
         color: cat.category.color, // Category's original color for list dot
         chartColor: PIE_CHART_COLORS[index % PIE_CHART_COLORS.length], // Unique color from palette for pie chart
         icon: cat.category.icon || '💰'
       }
     })
   
   return categories
 }, [monthly_expenses])

  return (
    <Layout isHeaderVisible={false} >
      <Header2 title="Reports & Insights" description="Comprehensive spending analysis" />
      
      {/* Frequency Dropdown */}
      <div className="px-4 sm:px-6 -mt-4 mb-6">
        <FrequencyDropdown
          options={frequencyOptions}
          selectedValue={selectedRange}
          onSelect={setSelectedRange}
        />
      </div>

      {/* Area Chart */}
      {range_expenses_loading ? (
        <div className="px-4 sm:px-6 mb-6">
          <AreaChartSkeleton />
        </div>
      ) : chartData.length > 0 ? (
        <div className="px-4 sm:px-6 mb-6">
          <AreaChart 
            chartData={chartData}
            frequency={range_expenses?.frequency}
          />
        </div>
      ) : (
        <div className="px-4 sm:px-6 mb-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <div className="flex items-center justify-center">
              <div className="text-sm text-gray-500 font-light">No data available for the selected period</div>
            </div>
          </div>
        </div>
      )}

      {/* Category Distribution */}
      {monthly_expenses_loading ? (
        <div className="px-4 sm:px-6 mb-6">
          <DoughnutChartSkeleton />
        </div>
      ) : categoryChartData.length > 0 ? (
        <div className="px-4 sm:px-6 mb-6">
          <DoughnutChart 
            categoryChartData={categoryChartData}
            totalAmount={monthly_expenses?.categoryData?.total_amount || 0}
          />
        </div>
      ) : null}
    </Layout>
  )
}

export default ReportScreen