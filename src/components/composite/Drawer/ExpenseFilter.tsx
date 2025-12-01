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

    const { categories, fetch_category_loading } = useAppSelector((state: any) => state.categories);

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    // Update local state when props change
    useEffect(() => {
        setSelectedCategories(initialCategories);
        setSelectedDateRange(initialDateRange[0] || '');
        setAmountMin(initialAmountMin);
        setAmountMax(initialAmountMax);
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
        setSelectedDateRange(range);
        // Clear custom dates if not selecting Custom Range
        if (range !== 'Custom Range') {
            setDateRangeValue(undefined);
        }
    };

    const handleReset = () => {
        setSelectedCategories([]);
        setSelectedDateRange('');
        setAmountMin('');
        setAmountMax('');
        setDateRangeValue(undefined);
        onFilterApply({
            categories: [],
            dateRange: [],
            amountMin: '',
            amountMax: '',
        });
        onOpenChange(false);
    };

    const handleApply = () => {
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
                                        <div className="mt-4 flex justify-center">
                                            <Calendar
                                                mode="range"
                                                selected={dateRangeValue}
                                                onSelect={setDateRangeValue}
                                                className="rounded-lg border border-gray-200 dark:border-gray-700"
                                                numberOfMonths={1}
                                            />
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
                                                placeholder="Not Set"
                                                value={amountMin}
                                                onChange={(e) => setAmountMin(e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600 focus:border-transparent transition-all"
                                            />
                                        </div>
                                        <div>
                                            <Label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                                                Max Amount
                                            </Label>
                                            <Input
                                                type="number"
                                                placeholder="Not Set"
                                                value={amountMax}
                                                onChange={(e) => setAmountMax(e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600 focus:border-transparent transition-all"
                                            />
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
                                className="flex-1 py-3 bg-indigo-500 dark:bg-indigo-600 text-white rounded-xl font-light hover:bg-indigo-600 dark:hover:bg-indigo-700 transition-all"
                                onClick={handleApply}
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