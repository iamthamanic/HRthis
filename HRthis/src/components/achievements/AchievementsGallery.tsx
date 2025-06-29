import React, { useState } from 'react';
import { useAchievementsStore } from '../../state/achievements';
import { Achievement } from '../../types/gamification';
import { cn } from '../../utils/cn';
import { AchievementModal } from './AchievementModal';
import { ProgressHeader } from './ProgressHeader';
import { CategoryFilter } from './CategoryFilter';
import { EmptyState } from './EmptyState';
import { AchievementGrid } from './AchievementGrid';
import { filterAchievements } from './useAchievementFilters';

interface AchievementsGalleryProps {
  userId: string;
  showLocked?: boolean;
  showProgress?: boolean;
  layout?: 'grid' | 'list';
  filterCategory?: string;
  className?: string;
}


/**
 * Achievements Gallery Component
 * Shows all achievements with unlock status and progress
 */
const Header: React.FC<{
  progressStats: any;
  layout: 'grid' | 'list';
}> = ({ progressStats, layout }) => (
  <div className="flex items-center justify-between mb-6">
    <div>
      <h2 className="text-2xl font-bold text-gray-900">Achievements</h2>
      <p className="text-gray-600">
        {progressStats.unlockedAchievements} von {progressStats.totalAchievements} freigeschaltet 
        ({Math.round(progressStats.completionRate)}%)
      </p>
    </div>
    
    {/* Layout toggle */}
    <div className="flex gap-2">
      <button
        onClick={() => layout !== 'grid' && window.location.reload()}
        className={cn(
          "p-2 rounded-lg",
          layout === 'grid' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
        )}
      >
        ⊞
      </button>
      <button
        onClick={() => layout !== 'list' && window.location.reload()}
        className={cn(
          "p-2 rounded-lg",
          layout === 'list' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
        )}
      >
        ☰
      </button>
    </div>
  </div>
);

const useAchievementsGalleryLogic = (userId: string, filterCategory?: string, showLocked = true) => {
  const { getAchievements, getUserAchievements, getUnlockedAchievements, getProgressStats } = useAchievementsStore();
  
  const [selectedCategory, setSelectedCategory] = useState<string>(filterCategory || 'all');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  const allAchievements = getAchievements();
  const userAchievements = getUserAchievements(userId);
  const unlockedAchievements = getUnlockedAchievements(userId);
  const progressStats = getProgressStats(userId);

  const unlockedAchievementIds = unlockedAchievements.map(ua => ua.id);
  const filteredAchievements = filterAchievements(
    allAchievements,
    selectedCategory,
    showLocked,
    unlockedAchievementIds
  );

  return {
    selectedCategory,
    selectedAchievement,
    allAchievements,
    userAchievements,
    progressStats,
    filteredAchievements,
    setSelectedCategory,
    setSelectedAchievement
  };
};

export const AchievementsGallery: React.FC<AchievementsGalleryProps> = ({
  userId,
  showLocked = true,
  showProgress = true,
  layout = 'grid',
  filterCategory,
  className
}) => {
  const galleryState = useAchievementsGalleryLogic(userId, filterCategory, showLocked);

  return (
    <div className={cn("w-full", className)}>
      <Header progressStats={galleryState.progressStats} layout={layout} />

      <ProgressHeader
        completionRate={galleryState.progressStats.completionRate}
        unlockedCount={galleryState.progressStats.unlockedAchievements}
        totalCount={galleryState.progressStats.totalAchievements}
      />

      <CategoryFilter
        selectedCategory={galleryState.selectedCategory}
        onCategoryChange={galleryState.setSelectedCategory}
        achievements={galleryState.allAchievements}
      />

      <AchievementGrid
        achievements={galleryState.filteredAchievements}
        userAchievements={galleryState.userAchievements}
        layout={layout}
        onAchievementClick={galleryState.setSelectedAchievement}
      />

      {galleryState.filteredAchievements.length === 0 && <EmptyState />}

      {galleryState.selectedAchievement && (
        <AchievementModal
          achievement={galleryState.selectedAchievement}
          onClose={() => galleryState.setSelectedAchievement(null)}
        />
      )}
    </div>
  );
};