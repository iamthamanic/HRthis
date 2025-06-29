import React from 'react';
import { Achievement } from '../../types/gamification';
import { cn } from '../../utils/cn';

interface AchievementModalProps {
  achievement: Achievement;
  onClose: () => void;
}

const MODAL_RARITY_COLORS = {
  common: 'from-gray-300 to-gray-500',
  rare: 'from-blue-300 to-blue-500',
  epic: 'from-purple-300 to-purple-500',
  legendary: 'from-yellow-300 to-orange-500'
};

const MODAL_RARITY_LABELS = {
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

export const AchievementModal: React.FC<AchievementModalProps> = ({
  achievement,
  onClose
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full">
        <div className="text-center">
          <div className={cn(
            "w-24 h-24 rounded-full flex items-center justify-center text-4xl text-white shadow-lg mx-auto mb-4",
            `bg-gradient-to-br ${MODAL_RARITY_COLORS[achievement.rarity]}`
          )}>
            {achievement.icon}
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {achievement.name}
          </h3>
          
          <p className="text-gray-600 mb-4">
            {achievement.description}
          </p>
          
          <div className="flex justify-center gap-4 mb-6">
            <div className={cn(
              "px-3 py-1 rounded-full text-sm font-medium",
              getRarityBadgeClasses(achievement.rarity)
            )}>
              {MODAL_RARITY_LABELS[achievement.rarity]}
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};