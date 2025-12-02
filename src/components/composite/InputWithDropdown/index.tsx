'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Category, Subcategory } from '@/types/apiResponse'
import { Spinner } from '@/components/atomic/spinner'
import { Input } from '@/components/atomic/input'
import { Label } from '@/components/atomic/label'
import { Plus, ChevronDown, Cookie } from 'lucide-react'
import CreateUpdateCategory from '../Drawer/CreateUpdateCategory'
import { cn } from '@/lib/utils'

interface InputWithDropdownProps {
  type: 'category' | 'title'
  label: string
  value: string
  onChange: (value: string) => void
  categories?: Category[]
  selectedCategoryId?: string | null
  isLoading?: boolean
  placeholder?: string
  required?: boolean
  error?: string
  onCategorySelect?: (categoryId: string) => void
  onSubcategorySelect?: (subcategoryId: string) => void
}

const InputWithDropdown = ({
  type,
  label,
  value,
  onChange,
  categories = [],
  selectedCategoryId = null,
  isLoading = false,
  placeholder = '',
  required = false,
  error,
  onCategorySelect,
  onSubcategorySelect,
}: InputWithDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Get selected category
  const selectedCategory = selectedCategoryId
    ? categories.find((cat) => cat._id === selectedCategoryId)
    : null

  // Get subcategories for selected category
  const subcategories = selectedCategory?.subcategories || []

  // Filter categories based on search query
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Filter subcategories based on search query
  const filteredSubcategories = subcategories.filter((subcategory) =>
    subcategory.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      
      // Don't close if clicking on drawer/modal elements (Radix UI drawer)
      const drawerElement = (target as Element).closest('[role="dialog"]') || 
                           (target as Element).closest('[data-radix-portal]') ||
                           (target as Element).closest('[data-state]') ||
                           (target as Element).closest('[data-radix-dialog-content]') ||
                           (target as Element).closest('[data-radix-dialog-overlay]') ||
                           (target as Element).closest('[data-radix-drawer-content]') ||
                           (target as Element).closest('[data-radix-drawer-overlay]')
      
      // Don't close if clicking inside the dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        // Only close if not clicking on a drawer/modal
        if (!drawerElement) {
          setIsOpen(false)
        }
      }
    }

    if (isOpen) {
      // Use a small delay to allow drawer triggers to work
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside)
      }, 100)
      
      return () => {
        clearTimeout(timeoutId)
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isOpen])

  const handleCategoryClick = (categoryId: string) => {
    if (onCategorySelect) {
      onCategorySelect(categoryId)
    }
    setIsOpen(false)
    setSearchQuery('')
  }

  const handleSubcategoryClick = (subcategoryId: string) => {
    const subcategory = subcategories.find((sub) => sub._id === subcategoryId)
    if (subcategory && onSubcategorySelect) {
      onSubcategorySelect(subcategoryId)
      // Optionally set the title to subcategory name
      onChange(subcategory.name)
    }
    setIsOpen(false)
    setSearchQuery('')
  }

  // Reset search when dropdown closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('')
    }
  }, [isOpen])

  if (type === 'category') {
    const selectedCategoryName = selectedCategory ? selectedCategory.name : placeholder || 'Select category'

    return (
      <div className="relative" ref={dropdownRef}>
        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label} {required && '*'}
        </Label>

        {/* Category Dropdown Input */}
        <div className="relative">
          <div className="relative">
            {/* Category Icon */}
            {selectedCategory && !isOpen && (
              <div
                className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg flex items-center justify-center text-base shrink-0 z-10"
                style={{ backgroundColor: selectedCategory.color }}
              >
                {selectedCategory.icon}
              </div>
            )}
            <Input
              type="text"
              value={isOpen ? searchQuery : (selectedCategory?.name || '')}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                if (!isOpen) {
                  setIsOpen(true)
                }
              }}
              onFocus={() => {
                setIsOpen(true)
                if (selectedCategory) {
                  setSearchQuery('')
                }
              }}
              placeholder={placeholder || 'Search or select category...'}
              style={{ borderRadius: '8px' }}
              className={cn(
                "w-full py-5 bg-gray-50 dark:bg-gray-700 border text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 font-light pr-10",
                selectedCategory && !isOpen ? "pl-12" : "pl-4",
                !selectedCategoryId && !isOpen && "text-gray-400 dark:text-gray-500",
                error 
                  ? "border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500" 
                  : "border-gray-200 dark:border-gray-600"
              )}
            />
            <button
              type="button"
              onClick={() => {
                setIsOpen(!isOpen)
                if (isOpen) {
                  setSearchQuery('')
                } else if (selectedCategory) {
                  setSearchQuery('')
                }
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
            >
              <ChevronDown
                size={18}
                className={cn(
                  "text-gray-400 dark:text-gray-500 transition-transform duration-200",
                  isOpen && "transform rotate-180"
                )}
              />
            </button>
          </div>
        </div>

        {/* Category Dropdown List */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-60 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Spinner className="w-6 h-6 text-indigo-500" />
              </div>
            ) : categories.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">No categories available</p>
                <CreateUpdateCategory
                  trigger={
                    <div
                      className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-xl font-light hover:bg-indigo-600 transition-all text-sm cursor-pointer"
                    >
                      <Plus size={16} strokeWidth={1.5} />
                      Add New Category
                    </div>
                  }
                />
              </div>
            ) : (
              <div className="p-2">
                {filteredCategories.length > 0 ? (
                  <>
                    {filteredCategories.map((category: Category) => {
                      const subcategoryCount = category.subcategories.length
                      
                      return (
                        <button
                          key={category._id}
                          type="button"
                          onClick={() => handleCategoryClick(category._id)}
                          className={cn(
                            "w-full text-left px-4 py-3 rounded-lg text-sm transition-colors font-light flex items-center justify-between gap-3",
                            selectedCategoryId === category._id
                              ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
                              : "text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
                          )}
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div
                              className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0"
                              style={{ backgroundColor: category.color }}
                            >
                              {category.icon}
                            </div>
                            <span className="font-light truncate">{category.name}</span>
                          </div>
                          
                          {/* Subcategory count badge */}
                          {subcategoryCount > 0 && (
                            <div
                              className="px-2 py-1 rounded-md text-xs font-medium shrink-0text-gray-700"
                              style={{ backgroundColor: category.color }}
                              title={`${subcategoryCount} subcategor${subcategoryCount === 1 ? 'y' : 'ies'}`}
                            >
                              {subcategoryCount}+
                            </div>
                          )}
                        </button>
                      )
                    })}
                    {/* Add New Category Button */}
                    <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <CreateUpdateCategory
                        trigger={
                          <div
                            className="w-full text-left px-4 py-2 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-light flex items-center gap-2 cursor-pointer"
                          >
                            <Plus size={16} strokeWidth={1.5} />
                            Add New Category
                          </div>
                        }
                        onClose={() => {
                          // Categories will be refreshed automatically by CreateUpdateCategory
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <div className="p-4 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      No categories found matching "{searchQuery}"
                    </p>
                    <CreateUpdateCategory
                      trigger={
                        <div
                          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-xl font-light hover:bg-indigo-600 transition-all text-sm cursor-pointer"
                        >
                          <Plus size={16} strokeWidth={1.5} />
                          Add New Category
                        </div>
                      }
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  // Title mode with subcategory dropdown
  return (
    <div className="relative" ref={dropdownRef}>
      <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label} {required && '*'}
      </Label>

      {/* Text Input */}
      <div className="relative">
        <Input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
            setSearchQuery(e.target.value)
            if (subcategories.length > 0 && !isOpen) {
              setIsOpen(true)
            }
          }}
          onFocus={() => {
            if (subcategories.length > 0) {
              setIsOpen(true)
            }
          }}
          placeholder={placeholder}
          style={{ borderRadius: '8px' }}
          className={cn(
            "w-full px-4 py-5 bg-gray-50 dark:bg-gray-700 border text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 font-light",
            error 
              ? "border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500" 
              : "border-gray-200 dark:border-gray-600"
          )}
        />
      </div>

      {/* Subcategory Dropdown - Only show if category is selected, has subcategories, and filtered results exist */}
      {isOpen && selectedCategoryId && subcategories.length > 0 && filteredSubcategories.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-60 overflow-y-auto">
          <div className="p-2">
            {filteredSubcategories.map((subcategory: Subcategory) => (
              <button
                key={subcategory._id}
                type="button"
                onClick={() => handleSubcategoryClick(subcategory._id)}
                className="w-full text-left px-4 py-2 rounded-lg text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-light"
              >
                {subcategory.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default InputWithDropdown
