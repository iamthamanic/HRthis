import React from 'react';
import { cn } from '../../utils/cn';

type TabType = 'accessories' | 'colors';

interface CustomizationTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const CustomizationTabs: React.FC<CustomizationTabsProps> = ({
  activeTab,
  onTabChange
}) => (
  <div className="flex space-x-4 mb-6 border-b">
    <button
      onClick={() => onTabChange('accessories')}
      className={cn(
        "pb-2 px-4 font-medium transition-colors",
        activeTab === 'accessories'
          ? "text-blue-600 border-b-2 border-blue-600"
          : "text-gray-600 hover:text-gray-800"
      )}
    >
      Accessoires
    </button>
    <button
      onClick={() => onTabChange('colors')}
      className={cn(
        "pb-2 px-4 font-medium transition-colors",
        activeTab === 'colors'
          ? "text-blue-600 border-b-2 border-blue-600"
          : "text-gray-600 hover:text-gray-800"
      )}
    >
      Farben
    </button>
  </div>
);