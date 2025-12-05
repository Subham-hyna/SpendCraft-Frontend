'use client'
import React from 'react';

const Legend: React.FC = () => {
  return (
    <div className="mb-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 px-4 py-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg shrink-0"></div>
            <span className="text-xs font-light text-gray-700 dark:text-gray-300">Low {'< ₹500'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-amber-50 dark:bg-amber-900/30 rounded-lg shrink-0"></div>
            <span className="text-xs font-light text-gray-700 dark:text-gray-300">Medium ₹500-1000</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-rose-50 dark:bg-rose-900/30 rounded-lg shrink-0"></div>
            <span className="text-xs font-light text-gray-700 dark:text-gray-300">High {'> ₹1000'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Legend;

