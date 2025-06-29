import React from 'react';
import { cn } from '../../utils/cn';
import { CATEGORIES, getCategoryCount } from './useAchievementFilters';
import { Achievement } from '../../types/gamification';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  achievements: Achievement[];
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange,
  achievements
}) => (
  <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
    {CATEGORIES.map(category => {
      const count = getCategoryCount(achievements, category.id);
        
      return (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
            selectedCategory === category.id
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          )}
        >
          <span>{category.icon}</span>
          <span>{category.name}</span>
          <span className="text-xs opacity-75">({count})</span>
        </button>
      );
    })}
  </div>
);