import React from 'react';
import { Achievement } from '../../types/gamification';
import { cn } from '../../utils/cn';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface AchievementCardGridProps {
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

const ProgressRing: React.FC<{ progress: number }> = ({ progress }) => (
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
);

export const AchievementCardGrid: React.FC<AchievementCardGridProps> = ({
  achievement,
  isUnlocked,
  unlockedAt,
  progress = 0,
  onClick
}) => (
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
        `bg-gradient-to-br ${RARITY_COLORS[achievement.rarity]}`,
        !isUnlocked && "grayscale"
      )}>
        <span>{achievement.icon}</span>
      </div>
      
      {/* Progress ring for locked achievements */}
      {!isUnlocked && progress > 0 && <ProgressRing progress={progress} />}
      
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
        getRarityBadgeClasses(achievement.rarity)
      )}>
        {RARITY_LABELS[achievement.rarity]}
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