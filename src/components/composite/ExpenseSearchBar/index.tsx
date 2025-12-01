import { ArrowUpDown, Filter, Search } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';

interface ExpenseSearchBarProps {
  onSortClick: () => void;
  onFilterClick: () => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  placeholder?: string;
  debounceDelay?: number;
  hasActiveFilters?: boolean;
  hasActiveSort?: boolean;
}

const ExpenseSearchBar = ({
  onSortClick,
  onFilterClick,
  searchValue = '',
  onSearchChange,
  placeholder = 'Search expenses...',
  debounceDelay = 500,
  hasActiveFilters = false,
  hasActiveSort = false,
}: ExpenseSearchBarProps) => {
  const [inputValue, setInputValue] = useState(searchValue);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const wasFocusedRef = useRef(false);

  // Sync input value when searchValue prop changes externally
  useEffect(() => {
    setInputValue(searchValue);
  }, [searchValue]);

  // Maintain focus after searchValue prop changes (after fetch completes)
  useEffect(() => {
    if (wasFocusedRef.current && inputRef.current) {
      // Restore focus after parent re-renders from fetch
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [searchValue]);

  // Debounce the search change callback
  useEffect(() => {
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      // Check if input is focused before calling the callback
      wasFocusedRef.current = document.activeElement === inputRef.current;
      onSearchChange?.(inputValue);
    }, debounceDelay);

    // Cleanup on unmount or when inputValue changes
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [inputValue, debounceDelay, onSearchChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue); // Update immediately for UI responsiveness
  };

  const handleInputFocus = () => {
    // Ensure input maintains focus
    inputRef.current?.focus();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 px-4 py-3 mb-6 flex items-center gap-3 shadow-sm dark:shadow-gray-900/20">
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        className="flex-1 text-sm text-gray-600 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 outline-none font-light bg-transparent"
      />
      <button className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1">
        <Search size={20} strokeWidth={1.5} />
      </button>
      <button 
        onClick={onSortClick}
        className="text-gray-400 dark:text-gray-500 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors p-1 relative"
      >
        <ArrowUpDown size={20} strokeWidth={1.5} />
        {
          hasActiveSort && (
            <span className="absolute top-0 right-0 bg-indigo-500 dark:bg-indigo-600 text-white text-[10px] font-medium w-2 h-2 rounded-full flex items-center justify-center">
            </span>
          )
        }
      </button>
      <button 
        onClick={onFilterClick}
        className="text-gray-400 dark:text-gray-500 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors p-1 relative"
      >
        <Filter size={20} strokeWidth={1.5} />
        {hasActiveFilters && (
          <span className="absolute top-0 right-0 bg-indigo-500 dark:bg-indigo-600 text-white text-[10px] font-medium w-2 h-2 rounded-full flex items-center justify-center">
          </span>
        )}
      </button>
    </div>
  );
};

export default ExpenseSearchBar;

