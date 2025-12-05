'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Calendar, ChevronDown } from 'lucide-react'

interface FrequencyOption {
  value: string
  label: string
}

interface FrequencyDropdownProps {
  options: FrequencyOption[]
  selectedValue: string
  onSelect: (value: string) => void
  className?: string
}

const FrequencyDropdown: React.FC<FrequencyDropdownProps> = ({ 
  options, 
  selectedValue, 
  onSelect,
  className = '' 
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const selectedOption = options.find(opt => opt.value === selectedValue)

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button 
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="w-full bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
      >
        <div className="flex items-center gap-2">
          <Calendar size={18} strokeWidth={1.5} className="text-gray-400 dark:text-gray-500" />
          <span className="text-sm font-light text-gray-900 dark:text-gray-100">
            {selectedOption?.label || 'Day'}
          </span>
        </div>
        <ChevronDown 
          size={18} 
          strokeWidth={1.5} 
          className={`text-gray-400 dark:text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isDropdownOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg overflow-hidden">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onSelect(option.value)
                setIsDropdownOpen(false)
              }}
              className={`w-full text-left px-4 py-3 text-sm font-light transition-colors ${
                selectedValue === option.value
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default FrequencyDropdown

