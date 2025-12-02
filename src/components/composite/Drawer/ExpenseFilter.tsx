'use client';
import React, { useState, useEffect } from 'react';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from "@/components/atomic/drawer"
import { X, ChevronDown } from 'lucide-react';
import { useAppSelector } from '@/store';
import { Category } from '@/types/apiResponse';
import { Label } from '@/components/atomic/label';
import { Input } from '@/components/atomic/input';
import { CheckboxWithLabel } from '@/components/atomic/CheckboxWithLabel';
import { Calendar } from '@/components/atomic/calendar';
import { cn } from '@/lib/utils';
import type { DateRange } from 'react-day-picker';
import { DateTimePicker24h } from '@/components/atomic/date-time';

interface ExpenseFilterProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedCategories: string[];
    selectedDateRange: string[];
    amountMin: string;
    amountMax: string;
    onFilterApply: (filters: {
        categories: string[];
        dateRange: string[];
        amountMin: string;
        amountMax: string;
        customDateFrom?: string;
        customDateTo?: string;
    }) => void;
}

const ExpenseFilter = ({
    open,
    onOpenChange,
    selectedCategories: initialCategories,
    selectedDateRange: initialDateRange,
    amountMin: initialAmountMin,
    amountMax: initialAmountMax,
    onFilterApply
}: ExpenseFilterProps) => {
    const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategories);
    const [selectedDateRange, setSelectedDateRange] = useState<string>(initialDateRange[0] || '');
    const [amountMin, setAmountMin] = useState<string>(initialAmountMin);
    const [amountMax, setAmountMax] = useState<string>(initialAmountMax);
    const [dateRangeValue, setDateRangeValue] = useState<DateRange | undefined>();
    const [expandedSection, setExpandedSection] = useState<string | null>('');
    const [amountErrors, setAmountErrors] = useState<{ min?: string; max?: string }>({});
    const [dateRangeErrors, setDateRangeErrors] = useState<{ from?: string; to?: string }>({});

    const { categories, fetch_category_loading } = useAppSelector((state: any) => state.categories);

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    const validateAmount = (value: string, type: 'min' | 'max'): string | undefined => {
        if (!value) return undefined;
        
        const numValue = parseFloat(value);
        
        // Check if value is a valid number
        if (isNaN(numValue)) {
            return 'Please enter a valid number';
        }
        
        // Check if value is negative
        if (numValue < 0) {
            return 'Amount cannot be less than zero';
        }
        
        return undefined;
    };

    const validateAmountRange = (min: string, max: string): { min?: string; max?: string } => {
        const errors: { min?: string; max?: string } = {};
        
        if (!min && !max) {
            return errors;
        }
        
        const minNum = min ? parseFloat(min) : null;
        const maxNum = max ? parseFloat(max) : null;
        
        // Validate individual values
        if (min && minNum !== null) {
            const minError = validateAmount(min, 'min');
            if (minError) {
                errors.min = minError;
            }
        }
        
        if (max && maxNum !== null) {
            const maxError = validateAmount(max, 'max');
            if (maxError) {
                errors.max = maxError;
            }
        }
        
        // Validate min < max only if both are valid numbers
        if (minNum !== null && maxNum !== null && !errors.min && !errors.max) {
            if (minNum >= maxNum) {
                errors.min = 'Min amount must be less than max amount';
            }
        }
        
        return errors;
    };

    const validateDateRange = (from?: Date, to?: Date): { from?: string; to?: string } => {
        const errors: { from?: string; to?: string } = {};
        
        // If one is selected, both are required
        if (from && !to) {
            errors.to = 'End date is required when start date is selected';
        }
        
        if (to && !from) {
            errors.from = 'Start date is required when end date is selected';
        }
        
        // Validate start date can't be greater than end date
        if (from && to) {
            if (from > to) {
                errors.from = 'Start date cannot be greater than end date';
            }
        }
        
        return errors;
    };

    const handleAmountMinChange = (value: string) => {
        setAmountMin(value);
        const errors = validateAmountRange(value, amountMax);
        setAmountErrors(errors);
    };

    const handleAmountMaxChange = (value: string) => {
        setAmountMax(value);
        const errors = validateAmountRange(amountMin, value);
        setAmountErrors(errors);
    };

    // Update local state when props change
    useEffect(() => {
        setSelectedCategories(initialCategories);
        setSelectedDateRange(initialDateRange[0] || '');
        setAmountMin(initialAmountMin);
        setAmountMax(initialAmountMax);
        setAmountErrors({});
        setDateRangeErrors({});
    }, [initialCategories, initialDateRange, initialAmountMin, initialAmountMax]);

    const dateRanges = [
        'Today',
        'Yesterday',
        'This Week',
        'This Month',
        'Last Month',
        'Custom Range'
    ];

    const toggleCategory = (categoryId: string) => {
        if (selectedCategories.includes(categoryId)) {
            setSelectedCategories(selectedCategories.filter(c => c !== categoryId));
        } else {
            setSelectedCategories([...selectedCategories, categoryId]);
        }
    };

    const selectDateRange = (range: string) => {
        // Toggle: if clicking the already selected range, deselect it
        if (selectedDateRange === range) {
            setSelectedDateRange('');
            setDateRangeValue(undefined);
            setDateRangeErrors({});
        } else {
            setSelectedDateRange(range);
            // Clear custom dates if not selecting Custom Range
            if (range !== 'Custom Range') {
                setDateRangeValue(undefined);
                setDateRangeErrors({});
            }
        }
    };

    const handleReset = () => {
        setSelectedCategories([]);
        setSelectedDateRange('');
        setAmountMin('');
        setAmountMax('');
        setDateRangeValue(undefined);
        setAmountErrors({});
        setDateRangeErrors({});
        onFilterApply({
            categories: [],
            dateRange: [],
            amountMin: '',
            amountMax: '',
        });
        onOpenChange(false);
    };

    const handleApply = () => {
        // Validate amounts before applying
        const amountValidationErrors = validateAmountRange(amountMin, amountMax);
        if (amountValidationErrors.min || amountValidationErrors.max) {
            setAmountErrors(amountValidationErrors);
            return;
        }
        
        // Validate date range if Custom Range is selected
        if (selectedDateRange === 'Custom Range') {
            const dateValidationErrors = validateDateRange(dateRangeValue?.from, dateRangeValue?.to);
            if (dateValidationErrors.from || dateValidationErrors.to) {
                setDateRangeErrors(dateValidationErrors);
                return;
            }
        }
        
        const customDateFrom = dateRangeValue?.from ? dateRangeValue.from.toISOString() : '';
        const customDateTo = dateRangeValue?.to ? dateRangeValue.to.toISOString() : '';
        
        onFilterApply({
            categories: selectedCategories,
            dateRange: selectedDateRange ? [selectedDateRange] : [],
            amountMin,
            amountMax,
            customDateFrom,
            customDateTo,
        });
        onOpenChange(false);
    };

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent className="dark:bg-gray-800">
                <DrawerHeader className="sr-only">
                    <DrawerTitle>Filter Expenses</DrawerTitle>
                </DrawerHeader>
                <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 overflow-hidden flex flex-col max-h-[85vh]">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-light text-gray-900 dark:text-gray-100">Filter</h2>
                            <DrawerClose className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2">
                                <X size={24} strokeWidth={1.5} />
                            </DrawerClose>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="overflow-y-auto flex-1">
                        {/* Categories Filter - Accordion */}
                        <div className="border-b border-gray-200 dark:border-gray-700">
                            <button
                                onClick={() => toggleSection('categories')}
                                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <Label className="text-base font-medium text-gray-900 dark:text-gray-100 cursor-pointer">
                                        Categories
                                    </Label>
                                    {selectedCategories.length > 0 && (
                                        <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs rounded-full">
                                            {selectedCategories.length}
                                        </span>
                                    )}
                                </div>
                                <ChevronDown
                                    size={20}
                                    className={cn(
                                        "text-gray-400 dark:text-gray-500 transition-transform duration-200",
                                        expandedSection === 'categories' && "transform rotate-180"
                                    )}
                                />
                            </button>
                            {expandedSection === 'categories' && (
                                <div className="px-6 pb-4">
                                    {fetch_category_loading ? (
                                        <div className="text-sm text-gray-400 dark:text-gray-500 py-4">Loading categories...</div>
                                    ) : categories.length === 0 ? (
                                        <div className="text-sm text-gray-400 dark:text-gray-500 py-4">No categories available</div>
                                    ) : (
                                        <div className="space-y-3">
                                            {categories.map((category: Category) => (
                                                <div
                                                    onClick={() => toggleCategory(category._id)}
                                                    key={category._id}
                                                    className={cn(
                                                        "flex items-center gap-3 p-3 rounded-xl border transition-all",
                                                        selectedCategories.includes(category._id)
                                                            ? "border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20"
                                                            : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                                                    )}
                                                >
                                                    <div
                                                        className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0"
                                                        style={{ backgroundColor: category.color }}
                                                    >
                                                        {category.icon}
                                                    </div>
                                                    <CheckboxWithLabel
                                                        checked={selectedCategories.includes(category._id)}
                                                        onToggle={() => toggleCategory(category._id)}
                                                        label={category.name}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Date Range Filter - Accordion */}
                        <div className="border-b border-gray-200 dark:border-gray-700">
                            <button
                                onClick={() => toggleSection('dateRange')}
                                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <Label className="text-base font-medium text-gray-900 dark:text-gray-100 cursor-pointer">
                                        Date Range
                                    </Label>
                                    {selectedDateRange && (
                                        <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs rounded-full truncate max-w-[120px]">
                                            {selectedDateRange === 'Custom Range' && dateRangeValue?.from 
                                                ? `${dateRangeValue.from.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}${dateRangeValue.to ? ` - ${dateRangeValue.to.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : ''}`
                                                : selectedDateRange
                                            }
                                        </span>
                                    )}
                                </div>
                                <ChevronDown
                                    size={20}
                                    className={cn(
                                        "text-gray-400 dark:text-gray-500 transition-transform duration-200",
                                        expandedSection === 'dateRange' && "transform rotate-180"
                                    )}
                                />
                            </button>
                            {expandedSection === 'dateRange' && (
                                <div className="px-6 pb-4">
                                    <div className="grid grid-cols-2 gap-2">
                                        {dateRanges.map((range) => (
                                            <button
                                                key={range}
                                                onClick={() => selectDateRange(range)}
                                                className={cn(
                                                    "py-3 px-4 rounded-xl text-sm font-light transition-all",
                                                    selectedDateRange === range
                                                        ? "bg-indigo-500 dark:bg-indigo-600 text-white"
                                                        : "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600"
                                                )}
                                            >
                                                {range}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Custom Date Range Calendar */}
                                    {selectedDateRange === 'Custom Range' && (
                                        <div className="mt-4 space-y-4">
                                            <div>
                                                <DateTimePicker24h
                                                    label="Start Date & Time"
                                                    dateTime={dateRangeValue?.from}
                                                    setDateTime={(date) => {
                                                        const newRange = {
                                                            from: date,
                                                            to: dateRangeValue?.to
                                                        };
                                                        setDateRangeValue(newRange);
                                                        const errors = validateDateRange(newRange.from, newRange.to);
                                                        setDateRangeErrors(errors);
                                                    }}
                                                    placeholder="Select start date & time"
                                                />
                                                {dateRangeErrors.from && (
                                                    <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                                                        {dateRangeErrors.from}
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <DateTimePicker24h
                                                    label="End Date & Time"
                                                    dateTime={dateRangeValue?.to}
                                                    setDateTime={(date) => {
                                                        const newRange = {
                                                            from: dateRangeValue?.from,
                                                            to: date
                                                        };
                                                        setDateRangeValue(newRange);
                                                        const errors = validateDateRange(newRange.from, newRange.to);
                                                        setDateRangeErrors(errors);
                                                    }}
                                                    placeholder="Select end date & time"
                                                />
                                                {dateRangeErrors.to && (
                                                    <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                                                        {dateRangeErrors.to}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Amount Range Filter - Accordion */}
                        <div className="border-b border-gray-200 dark:border-gray-700">
                            <button
                                onClick={() => toggleSection('amount')}
                                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <Label className="text-base font-medium text-gray-900 dark:text-gray-100 cursor-pointer">
                                        Amount Range
                                    </Label>
                                    {(amountMin || amountMax) && (
                                        <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs rounded-full">
                                            {amountMin && `₹${amountMin}`}
                                            {amountMin && amountMax && ' - '}
                                            {amountMax && `₹${amountMax}`}
                                        </span>
                                    )}
                                </div>
                                <ChevronDown
                                    size={20}
                                    className={cn(
                                        "text-gray-400 dark:text-gray-500 transition-transform duration-200",
                                        expandedSection === 'amount' && "transform rotate-180"
                                    )}
                                />
                            </button>
                            {expandedSection === 'amount' && (
                                <div className="px-6 pb-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <Label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                                                Min Amount
                                            </Label>
                                            <Input
                                                type="number"
                                                min="0"
                                                step="1"
                                                placeholder="Not Set"
                                                value={amountMin}
                                                onChange={(e) => handleAmountMinChange(e.target.value)}
                                                className={cn(
                                                    "w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all",
                                                    amountErrors.min
                                                        ? "border-red-500 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-500"
                                                        : "border-gray-200 dark:border-gray-600 focus:ring-gray-200 dark:focus:ring-gray-600"
                                                )}
                                            />
                                            {amountErrors.min && (
                                                <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                                                    {amountErrors.min}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <Label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                                                Max Amount
                                            </Label>
                                            <Input
                                                type="number"
                                                min="0"
                                                step="1"
                                                placeholder="Not Set"
                                                value={amountMax}
                                                onChange={(e) => handleAmountMaxChange(e.target.value)}
                                                className={cn(
                                                    "w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all",
                                                    amountErrors.max
                                                        ? "border-red-500 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-500"
                                                        : "border-gray-200 dark:border-gray-600 focus:ring-gray-200 dark:focus:ring-gray-600"
                                                )}
                                            />
                                            {amountErrors.max && (
                                                <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                                                    {amountErrors.max}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex gap-3">
                            <button 
                                className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-light hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                                onClick={handleReset}
                            >
                                Reset
                            </button>
                            <button 
                                className={cn(
                                    "flex-1 py-3 rounded-xl font-light transition-all",
                                    amountErrors.min || amountErrors.max || dateRangeErrors.from || dateRangeErrors.to
                                        ? "bg-gray-400 dark:bg-gray-600 text-gray-200 dark:text-gray-400 cursor-not-allowed"
                                        : "bg-indigo-500 dark:bg-indigo-600 text-white hover:bg-indigo-600 dark:hover:bg-indigo-700"
                                )}
                                onClick={handleApply}
                                disabled={!!(amountErrors.min || amountErrors.max || dateRangeErrors.from || dateRangeErrors.to)}
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
};

export default ExpenseFilter;