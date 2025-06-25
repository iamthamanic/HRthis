import React, { useState } from 'react';
import { useAchievementsStore } from '../state/achievements';
import { Achievement } from '../types/gamification';
import { cn } from '../utils/cn';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface AchievementsGalleryProps {
  userId: string;
  showLocked?: boolean;
  showProgress?: boolean;
  layout?: 'grid' | 'list';
  filterCategory?: string;
  className?: string;
}

interface AchievementCardProps {
  achievement: Achievement;
  isUnlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  layout: 'grid' | 'list';
  onClick?: () => void;
}

const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  isUnlocked,
  unlockedAt,
  progress = 0,
  layout,
  onClick
}) => {
  const rarityColors = {
    common: 'from-gray-300 to-gray-500',
    rare: 'from-blue-300 to-blue-500',
    epic: 'from-purple-300 to-purple-500',
    legendary: 'from-yellow-300 to-orange-500'
  };

  const rarityLabels = {
    common: 'Häufig',
    rare: 'Selten', 
    epic: 'Episch',
    legendary: 'Legendär'
  };

  if (layout === 'list') {
    return (
      <div 
        className={cn(
          "flex items-center gap-4 p-4 bg-white rounded-lg border transition-all duration-200",
          isUnlocked 
            ? "border-gray-200 hover:shadow-md cursor-pointer" 
            : "border-gray-100 opacity-60",
          onClick && "hover:border-gray-300"
        )}
        onClick={onClick}
      >
        {/* Icon */}
        <div className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center text-2xl text-white shadow-md relative",
          `bg-gradient-to-br ${rarityColors[achievement.rarity]}`,
          !isUnlocked && "grayscale"
        )}>
          <span>{achievement.icon}</span>
          {!isUnlocked && progress > 0 && (
            <div className="absolute inset-0 rounded-full border-4 border-gray-300">
              <div 
                className="absolute inset-0 rounded-full border-4 border-blue-500"
                style={{
                  clipPath: `polygon(50% 50%, 50% 0%, ${50 + (progress / 100) * 50}% 0%, 100% 100%, 0% 100%)`
                }}
              />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className={cn(
                "font-semibold",
                isUnlocked ? "text-gray-900" : "text-gray-500"
              )}>
                {achievement.name}
              </h3>
              <p className={cn(
                "text-sm",
                isUnlocked ? "text-gray-600" : "text-gray-400"
              )}>
                {achievement.description}
              </p>
            </div>
            
            <div className="text-right">
              <div className={cn(
                "text-xs px-2 py-1 rounded-full font-medium",
                achievement.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-800' :
                achievement.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
                achievement.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              )}>
                {rarityLabels[achievement.rarity]}
              </div>
              {isUnlocked && unlockedAt && (
                <p className="text-xs text-gray-500 mt-1">
                  {format(new Date(unlockedAt), 'dd.MM.yyyy', { locale: de })}
                </p>
              )}
            </div>
          </div>

          {/* Progress bar for locked achievements */}
          {!isUnlocked && progress > 0 && (
            <div className="mt-2">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Fortschritt</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, progress)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Grid layout
  return (
    <div 
      className={cn(
        "bg-white rounded-xl p-6 border transition-all duration-200 group",
        isUnlocked 
          ? "border-gray-200 hover:shadow-lg cursor-pointer hover:scale-105" 
          : "border-gray-100 opacity-70",
        onClick && "hover:border-gray-300"
      )}
      onClick={onClick}
    >
      {/* Icon */}
      <div className="relative mb-4">
        <div className={cn(
          "w-20 h-20 rounded-full flex items-center justify-center text-3xl text-white shadow-lg mx-auto",
          `bg-gradient-to-br ${rarityColors[achievement.rarity]}`,
          !isUnlocked && "grayscale"
        )}>
          <span>{achievement.icon}</span>
        </div>
        
        {/* Progress ring for locked achievements */}
        {!isUnlocked && progress > 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48" 
                r="44"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className="text-gray-200"
              />
              <circle
                cx="48"
                cy="48"
                r="44"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 44}`}
                strokeDashoffset={`${2 * Math.PI * 44 * (1 - progress / 100)}`}
                className="text-blue-500 transition-all duration-300"
              />
            </svg>
          </div>
        )}
        
        {/* Lock icon for locked achievements */}
        {!isUnlocked && progress === 0 && (
          <div className="absolute bottom-0 right-0 w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm">
            🔒
          </div>
        )}
      </div>

      {/* Content */}
      <div className="text-center">
        <h3 className={cn(
          "font-semibold mb-2",
          isUnlocked ? "text-gray-900" : "text-gray-500"
        )}>
          {achievement.name}
        </h3>
        
        <p className={cn(
          "text-sm mb-3",
          isUnlocked ? "text-gray-600" : "text-gray-400"
        )}>
          {achievement.description}
        </p>
        
        {/* Rarity badge */}
        <div className={cn(
          "inline-block text-xs px-3 py-1 rounded-full font-medium mb-2",
          achievement.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-800' :
          achievement.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
          achievement.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        )}>
          {rarityLabels[achievement.rarity]}
        </div>
        
        {/* Unlock date */}
        {isUnlocked && unlockedAt && (
          <p className="text-xs text-gray-500">
            Freigeschaltet am {format(new Date(unlockedAt), 'dd.MM.yyyy', { locale: de })}
          </p>
        )}
        
        {/* Progress for locked achievements */}
        {!isUnlocked && progress > 0 && (
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-1">
              {Math.round(progress)}% abgeschlossen
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, progress)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Achievements Gallery Component
 * Shows all achievements with unlock status and progress
 */
export const AchievementsGallery: React.FC<AchievementsGalleryProps> = ({
  userId,
  showLocked = true,
  showProgress = true,
  layout = 'grid',
  filterCategory,
  className
}) => {
  const { getAchievements, getUserAchievements, getUnlockedAchievements, getLockedAchievements, getProgressStats } = useAchievementsStore();
  
  const [selectedCategory, setSelectedCategory] = useState<string>(filterCategory || 'all');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  const allAchievements = getAchievements();
  const userAchievements = getUserAchievements(userId);
  const unlockedAchievements = getUnlockedAchievements(userId);
  const lockedAchievements = getLockedAchievements(userId);
  const progressStats = getProgressStats(userId);

  // Filter achievements
  const filteredAchievements = allAchievements.filter(achievement => {
    if (selectedCategory !== 'all' && achievement.category !== selectedCategory) {
      return false;
    }
    if (!showLocked && !unlockedAchievements.some(ua => ua.id === achievement.id)) {
      return false;
    }
    return true;
  });

  // Get categories
  const categories = [
    { id: 'all', name: 'Alle', icon: '🏆' },
    { id: 'learning', name: 'Lernen', icon: '🎓' },
    { id: 'attendance', name: 'Anwesenheit', icon: '⏰' },
    { id: 'engagement', name: 'Engagement', icon: '💪' },
    { id: 'milestone', name: 'Meilensteine', icon: '🎯' },
    { id: 'special', name: 'Spezial', icon: '⭐' }
  ];

  const containerClasses = {
    grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
    list: "space-y-4"
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Header */}
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

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Fortschritt</span>
          <span>{progressStats.unlockedAchievements}/{progressStats.totalAchievements}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressStats.completionRate}%` }}
          />
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map(category => {
          const count = category.id === 'all' 
            ? allAchievements.length
            : allAchievements.filter(a => a.category === category.id).length;
            
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
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

      {/* Achievements grid/list */}
      <div className={containerClasses[layout]}>
        {filteredAchievements.map(achievement => {
          const userAchievement = userAchievements.find(ua => ua.achievementId === achievement.id);
          const isUnlocked = !!userAchievement;
          
          return (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              isUnlocked={isUnlocked}
              unlockedAt={userAchievement?.unlockedAt}
              progress={userAchievement?.progress || 0}
              layout={layout}
              onClick={() => setSelectedAchievement(achievement)}
            />
          );
        })}
      </div>

      {/* Empty state */}
      {filteredAchievements.length === 0 && (
        <div className="text-center py-12">
          <span className="text-6xl mb-4 block">🏆</span>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Keine Achievements gefunden
          </h3>
          <p className="text-gray-600">
            Probiere einen anderen Filter oder starte mit deinen ersten Aktivitäten!
          </p>
        </div>
      )}

      {/* Achievement Detail Modal */}
      {selectedAchievement && (() => {
        const modalRarityColors = {
          common: 'from-gray-300 to-gray-500',
          rare: 'from-blue-300 to-blue-500',
          epic: 'from-purple-300 to-purple-500',
          legendary: 'from-yellow-300 to-orange-500'
        };
        
        const modalRarityLabels = {
          common: 'Häufig',
          rare: 'Selten',
          epic: 'Episch',
          legendary: 'Legendär'
        };
        
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <div className="text-center">
                <div className={cn(
                  "w-24 h-24 rounded-full flex items-center justify-center text-4xl text-white shadow-lg mx-auto mb-4",
                  `bg-gradient-to-br ${modalRarityColors[selectedAchievement.rarity]}`
                )}>
                  {selectedAchievement.icon}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {selectedAchievement.name}
                </h3>
                
                <p className="text-gray-600 mb-4">
                  {selectedAchievement.description}
                </p>
                
                <div className="flex justify-center gap-4 mb-6">
                  <div className={cn(
                    "px-3 py-1 rounded-full text-sm font-medium",
                    selectedAchievement.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-800' :
                    selectedAchievement.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
                    selectedAchievement.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  )}>
                    {modalRarityLabels[selectedAchievement.rarity]}
                  </div>
                </div>
                
                <button
                  onClick={() => setSelectedAchievement(null)}
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Schließen
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};