'use client'
import React, { useState, useEffect, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { getDayjsInUserTimezone } from '@/lib/dateUtils';
import dayjs, { Dayjs } from 'dayjs';

interface MonthFilterProps {
  currentDate: Dayjs;
  onDateChange: (date: Dayjs) => void;
}

const MonthFilter: React.FC<MonthFilterProps> = ({ currentDate, onDateChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(() => currentDate.month());
  const [selectedYear, setSelectedYear] = useState(() => currentDate.year());

  // Generate months and years for dropdown
  const months = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const month = dayjs().month(i);
      return {
        value: i,
        label: month.format('MMMM')
      };
    });
  }, []);

  const years = useMemo(() => {
    const currentYear = getDayjsInUserTimezone().year();
    const startYear = currentYear - 5; // 5 years back
    const endYear = currentYear + 5; // 5 years forward
    return Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
  }, []);

  // Initialize selected month/year when dropdown opens
  useEffect(() => {
    if (isDropdownOpen) {
      setSelectedMonth(currentDate.month());
      setSelectedYear(currentDate.year());
    }
  }, [isDropdownOpen, currentDate]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isDropdownOpen && !target.closest('.dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isDropdownOpen]);

  // Handle month/year selection in dropdown
  const handleMonthSelect = (month: number) => {
    setSelectedMonth(month);
  };

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
  };

  // Apply the selected month/year
  const handleApply = () => {
    onDateChange(dayjs().year(selectedYear).month(selectedMonth).startOf('month'));
    setIsDropdownOpen(false);
  };

  // Format month and year
  const monthName = currentDate.format('MMMM');
  const year = currentDate.format('YYYY');

  return (
    <div className="flex justify-center mb-4 relative">
      <div className="relative dropdown-container">
        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-6 py-2 text-sm font-light text-gray-700 dark:text-gray-300 shadow-sm hover:shadow-md transition-all flex items-center gap-2"
        >
          <span>{monthName} {year}</span>
          <ChevronDown size={16} strokeWidth={1.5} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isDropdownOpen && (
          <>
            {/* Backdrop to close dropdown */}
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsDropdownOpen(false)}
            />
            {/* Dropdown Menu */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg z-20 p-4 min-w-[280px]">
              <div className="space-y-4">
                {/* Month Selection */}
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 block">Month</label>
                  <div className="grid grid-cols-3 gap-2">
                    {months.map((month) => (
                      <button
                        key={month.value}
                        onClick={() => handleMonthSelect(month.value)}
                        className={`px-3 py-2 rounded-lg text-sm font-light transition-all ${
                          selectedMonth === month.value
                            ? 'bg-indigo-500 dark:bg-indigo-600 text-white'
                            : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                        }`}
                      >
                        {month.label.substring(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Year Selection */}
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 block">Year</label>
                  <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                    {years.map((yearOption) => (
                      <button
                        key={yearOption}
                        onClick={() => handleYearSelect(yearOption)}
                        className={`px-3 py-2 rounded-lg text-sm font-light transition-all ${
                          selectedYear === yearOption
                            ? 'bg-indigo-500 dark:bg-indigo-600 text-white'
                            : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                        }`}
                      >
                        {yearOption}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Apply Button */}
                <button
                  onClick={handleApply}
                  className="w-full px-4 py-2 bg-indigo-500 dark:bg-indigo-600 text-white rounded-lg text-sm font-light hover:bg-indigo-600 dark:hover:bg-indigo-700 transition-all"
                >
                  Apply
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MonthFilter;

