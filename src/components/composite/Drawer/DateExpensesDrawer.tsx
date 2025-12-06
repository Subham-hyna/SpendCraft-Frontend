'use client'
import React from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/atomic/drawer";
import { ArrowLeft } from 'lucide-react';
import { Expense } from '@/types/apiResponse';
import ExpenseCard from '@/components/composite/ExpenseCard';
import dayjs, { Dayjs } from 'dayjs';
import { formatIndianCurrency } from '@/lib/currencyFormat';

interface DateExpensesDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate?: Dayjs | null;
  selectedCategoryName?: string | null;
  expenses: Expense[];
  onExpenseClick: (expense: Expense) => void;
}

const DateExpensesDrawer: React.FC<DateExpensesDrawerProps> = ({
  open,
  onOpenChange,
  selectedDate,
  selectedCategoryName,
  expenses,
  onExpenseClick
}) => {

  const handleClose = () => {
    onOpenChange(false);
  };

  const formatDate = (date: Dayjs): string => {
    return date.format('MMMM DD, YYYY');
  };

  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const getTitle = () => {
    if (selectedCategoryName) {
      return selectedCategoryName;
    }
    if (selectedDate) {
      return formatDate(selectedDate);
    }
    return 'Expenses';
  };

  const getEmptyMessage = () => {
    if (selectedCategoryName) {
      return 'No expenses found for this category';
    }
    return 'No expenses found for this date';
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh] dark:bg-gray-800">
        <DrawerHeader>
          <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <button 
                onClick={handleClose}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2"
              >
                <ArrowLeft size={24} strokeWidth={1.5} />
              </button>
              <div className="flex flex-col gap-1 justify-start items-start">
                <DrawerTitle className="text-xl font-light text-gray-900 dark:text-gray-100">
                  {getTitle()}
                </DrawerTitle>
                {expenses.length > 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-light mt-1">
                    {expenses.length} expense{expenses.length !== 1 ? 's' : ''} • {formatIndianCurrency(totalAmount, false)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </DrawerHeader>
        <div className="overflow-y-auto px-4 pb-6">
          {expenses.length > 0 ? (
            <div className="space-y-3 pt-4">
              {expenses.map((expense) => (
                <ExpenseCard 
                  key={expense._id} 
                  expense={expense} 
                  onClick={() => onExpenseClick(expense)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-gray-500 dark:text-gray-400 font-light">{getEmptyMessage()}</p>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default DateExpensesDrawer;

