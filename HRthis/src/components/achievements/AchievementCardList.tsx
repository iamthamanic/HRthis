import React from 'react';
import { Achievement } from '../../types/gamification';
import { cn } from '../../utils/cn';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface AchievementCardListProps {
  achievement: Achievement;
  isUnlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  onClick?: () => void;
}

const RARITY_COLORS = {
  common: 'from-gray-300 to-gray-500',
  rare: 'from-blue-300 to-blue-500',
  epic: 'from-purple-300 to-purple-500',
  legendary: 'from-yellow-300 to-orange-500'
};

const RARITY_LABELS = {
  common: 'Häufig',
  rare: 'Selten', 
  epic: 'Episch',
  legendary: 'Legendär'
};

const getRarityBadgeClasses = (rarity: string) => {
  const rarityClasses = {
    legendary: 'bg-yellow-100 text-yellow-800',
    epic: 'bg-purple-100 text-purple-800',
    rare: 'bg-blue-100 text-blue-800',
    common: 'bg-gray-100 text-gray-800'
  };
  return rarityClasses[rarity as keyof typeof rarityClasses] || rarityClasses.common;
};

const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
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
);

export const AchievementCardList: React.FC<AchievementCardListProps> = ({
  achievement,
  isUnlocked,
  unlockedAt,
  progress = 0,
  onClick
}) => (
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
      `bg-gradient-to-br ${RARITY_COLORS[achievement.rarity]}`,
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
            getRarityBadgeClasses(achievement.rarity)
          )}>
            {RARITY_LABELS[achievement.rarity]}
          </div>
          {isUnlocked && unlockedAt && (
            <p className="text-xs text-gray-500 mt-1">
              {format(new Date(unlockedAt), 'dd.MM.yyyy', { locale: de })}
            </p>
          )}
        </div>
      </div>

      {/* Progress bar for locked achievements */}
      {!isUnlocked && progress > 0 && <ProgressBar progress={progress} />}
    </div>
  </div>
);