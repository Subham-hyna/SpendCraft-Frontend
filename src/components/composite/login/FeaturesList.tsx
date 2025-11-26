import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface FeaturesListProps {
  features: Feature[];
  className?: string;
}

export const FeaturesList: React.FC<FeaturesListProps> = ({ features, className = '' }) => {
  return (
    <div className={`space-y-4 mb-10 ${className}`}>
      {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <div key={index} className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center transition-colors duration-300">
              <Icon size={20} strokeWidth={1.5} className="text-gray-500 dark:text-gray-300" />
            </div>
            <div>
              <p className="text-sm font-light text-gray-900 dark:text-gray-100 mb-0.5 transition-colors duration-300">{feature.title}</p>
              <p className="text-xs font-light text-gray-400 dark:text-gray-400 transition-colors duration-300">{feature.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

