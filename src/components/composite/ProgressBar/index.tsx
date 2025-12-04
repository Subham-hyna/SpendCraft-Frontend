"use client"
import React from 'react'
import { cn } from '@/lib/utils'

interface ProgressBarProps {
  percentage: number
  height?: string
  className?: string
  barClassName?: string
  showPercentage?: boolean
  color?: string
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  height = 'h-2',
  className,
  barClassName,
  showPercentage = false,
  color,
}) => {
  // Helper function to calculate progress color based on percentage if color not provided
  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500'
    if (percentage >= 75) return 'bg-orange-500'
    if (percentage >= 50) return 'bg-yellow-500'
    return 'bg-emerald-500'
  }

  const progressColor = color || getProgressColor(percentage)
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100)

  return (
    <div className={cn("bg-gray-100 rounded-full overflow-hidden", height, className)}>
      <div 
        className={cn("h-full rounded-full transition-all", progressColor, barClassName)}
        style={{ width: `${clampedPercentage}%` }}
      />
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700">
          {clampedPercentage.toFixed(0)}%
        </div>
      )}
    </div>
  )
}

export default ProgressBar

