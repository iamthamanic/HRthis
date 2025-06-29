import React from 'react';
import { cn } from '../../utils/cn';

interface Achievement {
  id: string;
  name: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface AchievementsGridProps {
  achievements: Achievement[];
}

export const AchievementsGrid: React.FC<AchievementsGridProps> = ({ 
  achievements 
}) => (
  <div className="w-full">
    <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Achievements</h3>
    
    {achievements.length > 0 ? (
      <div className="flex justify-center gap-4 flex-wrap">
        {achievements.slice(0, 6).map((achievement) => (
          <div
            key={achievement.id}
            className="relative group cursor-pointer transform hover:scale-110 transition-transform"
          >
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-lg",
              achievement.rarity === 'legendary' ? 'bg-gradient-to-r from-purple-400 to-pink-400' :
              achievement.rarity === 'epic' ? 'bg-gradient-to-r from-purple-300 to-blue-400' :
              achievement.rarity === 'rare' ? 'bg-gradient-to-r from-blue-300 to-green-400' :
              'bg-gradient-to-r from-yellow-300 to-orange-400'
            )}>
              <span>{achievement.icon}</span>
            </div>
            
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              {achievement.name}
            </div>
          </div>
        ))}
        
        {achievements.length > 6 && (
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-300">
            <span className="text-xs">+{achievements.length - 6}</span>
          </div>
        )}
      </div>
    ) : (
      <div className="text-center py-8">
        <span className="text-4xl mb-2 block">🏆</span>
        <p className="text-gray-500">Noch keine Achievements freigeschaltet</p>
        <p className="text-sm text-gray-400">Absolviere Schulungen und sammle XP!</p>
      </div>
    )}
  </div>
);