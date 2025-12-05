'use client'
import React from 'react';
import { formatCompactCurrency } from '@/lib/currencyFormat';

interface StatsCardsProps {
  totalSpent: number;
  totalExpenses: number;
  avgPerDay: number;
}

const StatsCards: React.FC<StatsCardsProps> = ({ totalSpent, totalExpenses, avgPerDay }) => {
  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
        <p className="text-xs text-gray-700 dark:text-gray-300 mb-1 font-light">Total Spent</p>
        <p className="text-lg sm:text-xl font-light text-gray-900 dark:text-gray-100">
          {formatCompactCurrency(totalSpent, false)}
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
        <p className="text-xs text-gray-700 dark:text-gray-300 mb-1 font-light">Expenses</p>
        <p className="text-lg sm:text-xl font-light text-gray-900 dark:text-gray-100">
          {totalExpenses}
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
        <p className="text-xs text-gray-700 dark:text-gray-300 mb-1 font-light">Avg/Day</p>
        <p className="text-lg sm:text-xl font-light text-gray-900 dark:text-gray-100">
          {formatCompactCurrency(avgPerDay, false)}
        </p>
      </div>
    </div>
  );
};

export default StatsCards;

