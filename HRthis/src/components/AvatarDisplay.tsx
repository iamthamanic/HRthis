import React from 'react';
import { useAvatarStore } from '../state/avatar';
import { useAchievementsStore } from '../state/achievements';
import { cn } from '../utils/cn';

interface AvatarDisplayProps {
  userId: string;
  showEditButton?: boolean;
  onEdit?: () => void;
  className?: string;
}

/**
 * Large Avatar Display Component (for Settings/Profile page)
 * Shows full avatar with level, skills, and achievements like Screenshot 2
 */
export const AvatarDisplay: React.FC<AvatarDisplayProps> = ({
  userId,
  showEditButton = false,
  onEdit,
  className
}) => {
  const { _getUserAvatar } = useAvatarStore();
  const { _getUserAchievements, _getUnlockedAchievements } = useAchievementsStore();
  
  const userAvatar = getUserAvatar(userId);
  const userAchievements = getUserAchievements(userId);
  const unlockedAchievements = getUnlockedAchievements(userId);

  if (!userAvatar) {
    return (
      <div className={cn("flex flex-col items-center p-6", className)}>
        <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-4">
          <span className="text-gray-400 text-4xl">👤</span>
        </div>
        <p className="text-gray-500">Avatar wird geladen...</p>
      </div>
    );
  }

  // Calculate progress to next level
  const progressPercent = userAvatar.nextLevelXP > 0 
    ? (userAvatar.currentLevelXP / userAvatar.nextLevelXP) * 100 
    : 100;

  return (
    <div className={cn("flex flex-col items-center p-6 bg-white rounded-xl", className)}>
      {/* Avatar Circle with Level */}
      <div className="relative mb-6">
        {/* Main Avatar Circle */}
        <div className="w-40 h-40 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center relative overflow-hidden">
          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%" className="w-full h-full">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          
          {/* User Icon/Image */}
          <div className="relative z-10 w-24 h-24 bg-gray-600 rounded-full flex items-center justify-center">
            <span className="text-white text-3xl">👤</span>
          </div>
        </div>

        {/* Edit Button */}
        {showEditButton && (
          <button
            onClick={onEdit}
            className="absolute top-0 right-0 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
          >
            <span className="text-gray-600">✏️</span>
          </button>
        )}
      </div>

      {/* User Name and Title */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {/* This would come from user store */}
          Anna Admin
        </h2>
        
        {/* Level Badge and Title */}
        <div className="flex items-center justify-center gap-3 mb-2">
          {userAvatar.title && (
            <span className="text-gray-600 text-lg">
              {userAvatar.title}❤️
            </span>
          )}
          <div className="bg-gradient-to-r from-cyan-400 to-cyan-600 text-white px-6 py-2 rounded-full font-bold text-lg">
            Level {userAvatar.level}
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="w-full mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Skills</h3>
        
        <div className="space-y-4">
          {userAvatar.skills.map((skill) => {
            const skillProgress = skill.currentXP > 0 && skill.level > 1
              ? ((skill.currentXP / (skill.totalXP / skill.level)) * 100)
              : (skill.totalXP > 0 ? 25 : 0); // Default progress for visualization

            return (
              <div key={skill.id} className="flex items-center gap-4">
                {/* Skill Icon and Name */}
                <div className="flex items-center gap-3 min-w-[140px]">
                  <span className="text-2xl">{skill.icon}</span>
                  <span className="font-medium text-gray-900">{skill.name}</span>
                </div>
                
                {/* Progress Bar */}
                <div className="flex-1 bg-gray-200 rounded-full h-3 relative overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.min(100, skillProgress)}%`,
                      backgroundColor: skill.color 
                    }}
                  />
                </div>
                
                {/* Level */}
                <div className="min-w-[60px] text-right">
                  <span className="text-sm font-medium text-gray-600">
                    Level {skill.level}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Coins Section */}
      <div className="w-full mb-6">
        <div className="flex items-center justify-between bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💰</span>
            <span className="font-semibold text-gray-900">Engagement</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900">1600</span>
            <span className="text-lg">🪙</span>
            <span className="text-sm text-gray-600">Browo Coins</span>
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="w-full">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Achievements</h3>
        
        {unlockedAchievements.length > 0 ? (
          <div className="flex justify-center gap-4 flex-wrap">
            {unlockedAchievements.slice(0, 6).map((achievement) => (
              <div
                key={achievement.id}
                className="relative group cursor-pointer transform hover:scale-110 transition-transform"
              >
                {/* Achievement Icon */}
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-lg",
                  achievement.rarity === 'legendary' ? 'bg-gradient-to-r from-purple-400 to-pink-400' :
                  achievement.rarity === 'epic' ? 'bg-gradient-to-r from-purple-300 to-blue-400' :
                  achievement.rarity === 'rare' ? 'bg-gradient-to-r from-blue-300 to-green-400' :
                  'bg-gradient-to-r from-yellow-300 to-orange-400'
                )}>
                  <span>{achievement.icon}</span>
                </div>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  {achievement.name}
                </div>
              </div>
            ))}
            
            {/* Show more indicator */}
            {unlockedAchievements.length > 6 && (
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-300">
                <span className="text-xs">+{unlockedAchievements.length - 6}</span>
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
    </div>
  );
};