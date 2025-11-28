"use client"
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Spinner } from '@/components/atomic/spinner';

export interface SettingItem {
  id: string | number;
  label: string;
  description?: string;
  icon: LucideIcon;
  color?: string;
  toggle?: boolean;
  state?: boolean;
  setState?: (value: boolean) => void;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
}

interface SettingsGroupProps {
  title: string;
  id?: string;
  titleColor?: string;
  items: SettingItem[];
  loading?: boolean;
  className?: string;
}

const SettingsGroup: React.FC<SettingsGroupProps> = ({
  title,
  id,
  titleColor = 'text-gray-900',
  items,
  loading = false,
  className = '',
}) => {
  if (loading) {
    return (
      <div className={className} id={id}>
        <h3 className={`text-lg font-light ${titleColor} mb-3 px-1`}>{title}</h3>
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 animate-pulse"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                </div>
              </div>
              <div className="w-12 h-7 bg-gray-200 dark:bg-gray-700 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={className} id={id}>
      <h3 className={`text-lg font-light ${titleColor} mb-3 px-1`}>{title}</h3>
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        {items.map((item, index) => {
          const IconComponent = item.icon;
          const isLast = index === items.length - 1;
          
          return (
            <SettingItem
              key={item.id}
              item={item}
              IconComponent={IconComponent}
              showBorder={!isLast}
            />
          );
        })}
      </div>
    </div>
  );
};

interface SettingItemProps {
  item: SettingItem;
  IconComponent: LucideIcon;
  showBorder: boolean;
}

const SettingItem: React.FC<SettingItemProps> = ({ item, IconComponent, showBorder }) => {
  const iconBgColor = item.color ? `${item.color}20` : 'bg-indigo-50 dark:bg-indigo-900/20';
  const iconColor = item.color || '#6366F1';

  const handleClick = () => {
    if (item.loading || item.disabled) return;
    
    if (item.toggle && item.setState) {
      item.setState(!item.state);
    } else if (item.onClick) {
      item.onClick();
    }
  };

  return (
    <div
      className={`flex items-center justify-between p-4 ${
        showBorder ? 'border-b border-gray-100 dark:border-gray-700' : ''
      } ${item.disabled ? 'opacity-50' : ''}`}
    >
      <div className="flex items-center gap-3 flex-1">
        <div
          className={`w-10 h-10 ${!item.color ? iconBgColor : ''} rounded-xl flex items-center justify-center`}
          style={item.color ? { backgroundColor: `${item.color}20` } : undefined}
        >
          <IconComponent
            size={18}
            strokeWidth={1.5}
            style={{ color: iconColor }}
            className={item.loading ? 'animate-pulse' : ''}
          />
        </div>
        <div className="flex-1">
          <p className="text-sm sm:text-base font-light text-gray-900 dark:text-gray-100">
            {item.label}
          </p>
          {item.description && (
            <p className="text-xs text-gray-400 dark:text-gray-500 font-light">
              {item.description}
            </p>
          )}
        </div>
      </div>

      {(item.onClick || item.setState) &&
      <>
      {item.toggle ? (
        <button
          onClick={handleClick}
          disabled={item.loading || item.disabled}
          className={`relative w-12 h-7 rounded-full transition-colors ${
            item.state ? 'bg-indigo-500' : 'bg-gray-200 dark:bg-gray-700'
          } ${item.loading ? 'opacity-50 cursor-not-allowed' : ''} ${
            item.disabled ? 'cursor-not-allowed' : ''
          }`}
        >
          <div
            className={`absolute top-1 left-1 w-5 h-5 bg-white dark:bg-gray-800 rounded-full transition-transform ${
              item.state ? 'transform translate-x-5' : ''
            } ${item.loading ? 'animate-pulse' : ''}`}
          />
        </button>
      ) : (
        <button
          onClick={handleClick}
          disabled={item.loading || item.disabled}
          className={`${item.loading ? 'opacity-50 cursor-not-allowed' : ''} ${
            item.disabled ? 'cursor-not-allowed' : ''
          }`}
        >
          {item.loading ? (
            <Spinner width={18} height={18} />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-gray-400 dark:text-gray-600"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          )}
        </button>
      )}
      </>
      }
    </div>
  );
};

export default SettingsGroup;

