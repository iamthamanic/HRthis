import React from 'react';
import { cn } from '../../../utils/cn';

interface TabNavigationProps {
  activeTab: 'shop' | 'earn' | 'history' | 'manage';
  isAdmin: boolean;
  onTabChange: (tab: 'shop' | 'earn' | 'history' | 'manage') => void;
}

interface TabButtonProps {
  id: 'shop' | 'earn' | 'history' | 'manage';
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ id, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex-1 py-2 px-3 rounded-md transition-colors",
      isActive ? "bg-blue-500 text-white" : "bg-transparent text-gray-700 hover:bg-gray-100"
    )}
  >
    <span className="text-center font-medium text-sm">
      {label}
    </span>
  </button>
);

const TAB_CONFIGS = [
  { id: 'shop' as const, label: '🪙 Coins einlösen' },
  { id: 'earn' as const, label: '💰 Coins bekommen' },
  { id: 'history' as const, label: '📊 Historie' },
  { id: 'manage' as const, label: '⚙️ Verwaltung', adminOnly: true }
];

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  isAdmin,
  onTabChange
}) => {
  const availableTabs = TAB_CONFIGS.filter(tab => !tab.adminOnly || isAdmin);

  return (
    <div className="flex bg-white rounded-lg p-1 mb-6 shadow-sm">
      {availableTabs.map(tab => (
        <TabButton
          key={tab.id}
          id={tab.id}
          label={tab.label}
          isActive={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}
        />
      ))}
    </div>
  );
};