import { Subcategory, Category } from '@/types/apiResponse';
import { Edit2, Trash2 } from 'lucide-react'
import React from 'react'

interface CategoryCardProps {
  title: string;
  subcategories: Subcategory[];
  icon: string;
  bgColor: string;
  category?: Category;
  onEdit?: (category: Category) => void;
  onDelete?: (category: Category) => void;
}

const CategoryCard = ({ title, subcategories, icon, bgColor, category, onEdit, onDelete }: CategoryCardProps  ) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:shadow-gray-900/20 border border-gray-100 dark:border-gray-700 p-5 hover:shadow-md dark:hover:shadow-gray-900/30 transition-shadow duration-300">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 bg-gradient-to-br rounded-xl flex items-center justify-center flex-shrink-0`} style={{ backgroundColor: bgColor }}>
              <span className="text-xl">{icon}</span>
            </div>
            <div>
              <h2 className="text-xl font-light text-gray-900 dark:text-gray-100 tracking-tight">{title}</h2>
              <p className="text-xs text-gray-400 dark:text-gray-400 mt-0.5">{subcategories.length} subcategories</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
          <button 
            onClick={() => category && onEdit && onEdit(category)}
            className="text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex-shrink-0"
          >
            <Edit2 size={18} strokeWidth={1.5} />
          </button>
          <button 
            onClick={() => category && onDelete && onDelete(category)}
            className="text-red-400 dark:text-red-400 hover:text-red-600 dark:hover:text-red-600 transition-colors flex-shrink-0"
          >
            <Trash2 size={18} strokeWidth={1.5} />
          </button>
          </div>
        </div>

        {/* Subcategories Section */}
        {subcategories.length > 0 ? <div className="">
          <p className="text-xs font-medium text-gray-400 dark:text-gray-400 uppercase tracking-wider mb-3">Subcategories</p>
          <div className="flex flex-wrap gap-2">
            {subcategories.map((sub) => (
              <span
                key={sub._id}
                className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-light hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
              >
                {sub.name}
              </span>
            ))}
          </div>
        </div> : <div className="mb-5">
          <p className="text-xs font-medium text-gray-400 dark:text-gray-400 uppercase tracking-wider mb-3">No subcategories</p>
        </div>}
      </div>
  )
}

export default CategoryCard