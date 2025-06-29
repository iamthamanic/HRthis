import React from 'react';

interface ProgressHeaderProps {
  completionRate: number;
  unlockedCount: number;
  totalCount: number;
}

export const ProgressHeader: React.FC<ProgressHeaderProps> = ({
  completionRate,
  unlockedCount,
  totalCount
}) => (
  <div className="mb-6">
    <div className="flex justify-between text-sm text-gray-600 mb-2">
      <span>Fortschritt</span>
      <span>{unlockedCount}/{totalCount}</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-3">
      <div 
        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
        style={{ width: `${completionRate}%` }}
      />
    </div>
  </div>
);