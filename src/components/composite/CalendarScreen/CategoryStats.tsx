'use client'
import React from 'react';
import { TrendingUp } from 'lucide-react';
import { formatIndianCurrency } from '@/lib/currencyFormat';

interface Category {
  rank: number;
  name: string;
  icon: string;
  percentage: number;
  amount: number;
  color: string;
}

interface CategoryStatsProps {
  topCategories: Category[];
}

const CategoryStats: React.FC<CategoryStatsProps> = ({ topCategories }) => {
  if (topCategories.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp size={20} strokeWidth={1.5} className="text-gray-400 dark:text-gray-500" />
          <h3 className="text-lg font-light text-gray-900 dark:text-gray-100">Top Categories This Month</h3>
        </div>
        <div className="space-y-4">
          {topCategories.map((category) => (
            <div key={category.rank} className="flex items-center gap-4">
              <span className="text-xl font-light text-gray-400 dark:text-gray-500 w-8">#{category.rank}</span>
              <div className={`w-12 h-12 ${category.color} rounded-xl flex items-center justify-center text-2xl`}>
                {category.icon}
              </div>
              <div className="flex-1">
                <p className="font-light text-gray-900 dark:text-gray-100 text-sm sm:text-base">{category.name}</p>
                <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 font-light">{category.percentage}% of total</p>
              </div>
              <p className="text-lg font-light text-gray-900 dark:text-gray-100">{formatIndianCurrency(category.amount, false)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryStats;

