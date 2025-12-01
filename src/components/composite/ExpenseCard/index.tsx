import { Calendar, FileText, MapPin } from 'lucide-react';
import React from 'react';
import { Expense } from '@/types/apiResponse';
import { convertFromUTC, DateFormats } from '@/lib/dateUtils';

interface ExpenseCardProps {
  expense: Expense;
  onClick?: () => void;
}

const ExpenseCard = ({ expense, onClick }: ExpenseCardProps) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 sm:p-5 shadow-sm hover:shadow-md dark:shadow-gray-900/20 dark:hover:shadow-gray-900/40 transition-shadow cursor-pointer">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0`}
          style={{ backgroundColor: expense.category_id?.color }}
        >
          {expense.category_id?.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-base sm:text-lg font-light text-gray-900 dark:text-gray-100 truncate">
              {expense.title}
            </h3>
            <p className="text-lg sm:text-xl font-light text-gray-900 dark:text-gray-100 flex-shrink-0">
              ₹{expense.amount}
            </p>
          </div>

          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-light mb-2">
            {expense.category_id?.name} · {expense.sub_category_id?.name}
          </p>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400 dark:text-gray-500 font-light">
            <span className="flex items-center gap-1">
              <Calendar size={12} strokeWidth={1.5} />
              {expense.datetime && convertFromUTC(expense.datetime as string, DateFormats.DD_MMM)}
            </span>
            <span>•</span>
            <span>
              {expense.datetime && convertFromUTC(expense.datetime as string, DateFormats.HH_MM_12)}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin size={12} strokeWidth={1.5} />
              {expense.location || ''}
            </span>
          </div>

          {expense.line_items.length > 0 && (
            <div className="mt-2 flex items-center gap-1 text-indigo-500 dark:text-indigo-400 text-xs font-light">
              <FileText size={12} strokeWidth={1.5} />
              <span>{expense.line_items.length} items</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseCard;



