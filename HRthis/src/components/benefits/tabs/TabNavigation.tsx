import React from 'react';
import { cn } from '../../../utils/cn';

interface TabNavigationProps {
  activeTab: 'shop' | 'earn' | 'history' | 'manage';
  isAdmin: boolean;
  onTabChange: (tab: 'shop' | 'earn' | 'history' | 'manage') => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  isAdmin,
  onTabChange
}) => {
  return (
    <div className="flex bg-white rounded-lg p-1 mb-6 shadow-sm">
      <button
        onClick={() => onTabChange('shop')}
        className={cn(
          "flex-1 py-2 px-3 rounded-md transition-colors",
          activeTab === 'shop' ? "bg-blue-500 text-white" : "bg-transparent text-gray-700 hover:bg-gray-100"
        )}
      >
        <span className="text-center font-medium text-sm">
          🪙 Coins einlösen
        </span>
      </button>
      <button
        onClick={() => onTabChange('earn')}
        className={cn(
          "flex-1 py-2 px-3 rounded-md transition-colors",
          activeTab === 'earn' ? "bg-blue-500 text-white" : "bg-transparent text-gray-700 hover:bg-gray-100"
        )}
      >
        <span className="text-center font-medium text-sm">
          💰 Coins bekommen
        </span>
      </button>
      <button
        onClick={() => onTabChange('history')}
        className={cn(
          "flex-1 py-2 px-3 rounded-md transition-colors",
          activeTab === 'history' ? "bg-blue-500 text-white" : "bg-transparent text-gray-700 hover:bg-gray-100"
        )}
      >
        <span className="text-center font-medium text-sm">
          📊 Historie
        </span>
      </button>
      {isAdmin && (
        <button
          onClick={() => onTabChange('manage')}
          className={cn(
            "flex-1 py-2 px-3 rounded-md transition-colors",
            activeTab === 'manage' ? "bg-blue-500 text-white" : "bg-transparent text-gray-700 hover:bg-gray-100"
          )}
        >
          <span className="text-center font-medium text-sm">
            ⚙️ Verwaltung
          </span>
        </button>
      )}
    </div>
  );
};