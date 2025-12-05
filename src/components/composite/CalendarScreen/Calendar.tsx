'use client'
import React from 'react';
import { formatCompactCurrency } from '@/lib/currencyFormat';
import dayjs, { Dayjs } from 'dayjs';

export interface CalendarDay {
  date: number;
  amount: number | null;
  expenses: number | null;
  color: string;
  textColor: string;
  isToday: boolean;
}

interface CalendarProps {
  days: CalendarDay[];
  firstDayOfMonth: number;
  monthStart: Dayjs;
  onDateClick?: (date: Dayjs) => void;
}

const Calendar: React.FC<CalendarProps> = ({ days, firstDayOfMonth, monthStart, onDateClick }) => {
  // Format amount for display
  const formatAmount = (amount: number | null): string => {
    if (amount === null) return '';
    if (amount >= 1000) {
      return formatCompactCurrency(amount, false).replace('₹', '');
    }
    return Math.round(amount).toString();
  };

  const handleDateClick = (day: CalendarDay) => {
    if (day.expenses !== null && day.expenses > 0 && onDateClick) {
      const fullDate = monthStart.date(day.date);
      onDateClick(fullDate);
    }
  };

  return (
    <div className="mb-6">
      <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
        {/* Week Days */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-xs font-medium text-gray-400 dark:text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Empty cells for alignment */}
          {[...Array(firstDayOfMonth)].map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          
          {/* Calendar dates */}
          {days.map((day) => (
            <div key={day.date} className="relative">
              <button
                onClick={() => handleDateClick(day)}
                className={`w-full aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all ${
                  day.amount !== null
                    ? `${day.color} ${day.textColor} ${day.expenses !== null && day.expenses > 0 ? 'hover:scale-105 cursor-pointer' : ''}`
                    : `${day.textColor} hover:bg-gray-50 dark:hover:bg-gray-700`
                } ${day.isToday ? 'border-2 border-indigo-500 dark:border-indigo-400' : ''}`}
                disabled={day.expenses === null || day.expenses === 0}
              >
                <span className={`text-sm sm:text-base font-light ${day.textColor}`}>{day.date}</span>
                {day.amount !== null && (
                  <span className="text-xs font-light">₹{formatAmount(day.amount)}</span>
                )}
              </button>
              {day.expenses !== null && day.expenses > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-500 text-white rounded-full text-xs flex items-center justify-center font-light">
                  {day.expenses}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;

