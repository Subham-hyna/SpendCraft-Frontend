import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
  } from "@/components/atomic/drawer"
import { X } from "lucide-react";
import { useState } from "react";

interface ExpenseSortProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedSort: string;
    onSortChange: (sort: string) => void;
}

const ExpenseSort = ({ open, onOpenChange, selectedSort, onSortChange }: ExpenseSortProps) => {
    const [selectedSortId, setSelectedSortId] = useState<string>(selectedSort);
    const sortOptions = [
        { id: 'date_recent_to_old', label: 'Recent Date to Old Date' },
        { id: 'date_old_to_recent', label: 'Old Date to Recent Date' },
        { id: 'amount_highest_to_lowest', label: 'Amount Highest to Lowest' },
        { id: 'amount_lowest_to_highest', label: 'Amount Lowest to Highest' },
    ];

    const handleSortSelect = (sortId: string) => {
        setSelectedSortId(sortId);
    };

    const handleSortApply = () => {
        onSortChange(selectedSortId);
        onOpenChange(false);
    };

    const handleReset = () => {
        setSelectedSortId('date_recent_to_old');
        onSortChange('date_recent_to_old');
        onOpenChange(false);
    };

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent className="dark:bg-gray-800">
                <div className="p-6">
                    <DrawerHeader className="p-0 mb-6">
                        <div className="flex items-center justify-between">
                            <DrawerTitle className="text-xl font-light text-gray-900 dark:text-gray-100">Sort</DrawerTitle>
                            <DrawerClose className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2">
                                <X size={24} strokeWidth={1.5} />
                            </DrawerClose>
                        </div>
                    </DrawerHeader>

                    <div className="space-y-2 mb-6">
                        {sortOptions.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => handleSortSelect(option.id)}
                                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                                    selectedSortId === option.id
                                        ? 'bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-500 dark:border-indigo-400'
                                        : 'bg-gray-50 dark:bg-gray-700 border-2 border-transparent hover:bg-gray-100 dark:hover:bg-gray-600'
                                }`}
                            >
                                <span className={`text-base font-light ${
                                    selectedSortId === option.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300'
                                }`}>
                                    {option.label}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-3">
                        <button 
                            className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-light hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                            onClick={handleReset}
                        >
                            Reset
                        </button>
                        <DrawerClose asChild>
                            <button 
                                className="flex-1 py-3 bg-indigo-500 dark:bg-indigo-600 text-white rounded-xl font-light hover:bg-indigo-600 dark:hover:bg-indigo-700 transition-all"
                                onClick={handleSortApply}
                            >
                                Apply
                            </button>
                        </DrawerClose>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
};

export default ExpenseSort;