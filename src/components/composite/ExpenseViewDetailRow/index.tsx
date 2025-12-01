import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ExpenseViewDetailRowProps {
  icon: LucideIcon;
  label: string;
  value: string;
  secondaryValue?: string;
}

const ExpenseViewDetailRow = ({ icon: Icon, label, value, secondaryValue }: ExpenseViewDetailRowProps) => {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center shrink-0 mt-1">
        <Icon size={18} strokeWidth={1.5} className="text-gray-400 dark:text-gray-500" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-500 dark:text-gray-400 font-light mb-1">{label}</p>
        <p className="text-base sm:text-lg font-light text-gray-900 dark:text-gray-100">{value}</p>
        {secondaryValue && (
          <p className="text-sm text-gray-500 dark:text-gray-400 font-light mt-0.5">{secondaryValue}</p>
        )}
      </div>
    </div>
  );
};

export default ExpenseViewDetailRow;

