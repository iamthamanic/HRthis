import React from 'react';
import { useAvatarStore } from '../state/avatar';
import { Skill } from '../types/avatar';
import { cn } from '../utils/cn';

interface SkillsDisplayProps {
  userId: string;
  layout?: 'horizontal' | 'vertical' | 'grid';
  showXP?: boolean;
  showProgress?: boolean;
  className?: string;
}

interface SkillCardProps {
  skill: Skill;
  showXP: boolean;
  showProgress: boolean;
  layout: 'horizontal' | 'vertical' | 'grid';
}

const SkillCard: React.FC<SkillCardProps> = ({ skill, showXP, showProgress, layout }) => {
  // Calculate progress within current level
  const progressInLevel = skill.level > 1 
    ? ((skill.currentXP || 0) / Math.max(1, skill.totalXP / skill.level)) * 100
    : skill.totalXP > 0 ? 50 : 0; // Default progress visualization

  if (layout === 'horizontal') {
    return (
      <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
        {/* Icon */}
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center text-2xl text-white shadow-md"
          style={{ backgroundColor: skill.color }}
        >
          {skill.icon}
        </div>
        
        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">{skill.name}</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Level {skill.level}</span>
              {showXP && (
                <span className="text-xs text-gray-500">
                  {skill.totalXP.toLocaleString()} XP
                </span>
              )}
            </div>
          </div>
          
          {showProgress && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-500"
                style={{ 
                  width: `${Math.min(100, Math.max(5, progressInLevel))}%`,
                  backgroundColor: skill.color 
                }}
              />
            </div>
          )}
          
          <p className="text-sm text-gray-600 mt-1">{skill.description}</p>
        </div>
      </div>
    );
  }

  if (layout === 'grid') {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-200 hover:border-gray-300">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center text-2xl text-white shadow-md"
            style={{ backgroundColor: skill.color }}
          >
            {skill.icon}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{skill.name}</h3>
            <p className="text-sm text-gray-600">Level {skill.level}</p>
          </div>
        </div>
        
        {/* Progress */}
        {showProgress && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Fortschritt</span>
              <span>{Math.round(progressInLevel)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="h-3 rounded-full transition-all duration-500 relative overflow-hidden"
                style={{ 
                  width: `${Math.min(100, Math.max(5, progressInLevel))}%`,
                  backgroundColor: skill.color 
                }}
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse" />
              </div>
            </div>
          </div>
        )}
        
        {/* XP Info */}
        {showXP && (
          <div className="flex justify-between items-center text-sm mb-3">
            <span className="text-gray-600">Gesamt XP:</span>
            <span className="font-semibold text-gray-900">
              {skill.totalXP.toLocaleString()}
            </span>
          </div>
        )}
        
        {/* Description */}
        <p className="text-sm text-gray-600">{skill.description}</p>
        
        {/* Level Badge */}
        <div className="mt-4 flex justify-center">
          <div 
            className="px-4 py-2 rounded-full text-white text-sm font-medium"
            style={{ backgroundColor: skill.color }}
          >
            Level {skill.level}
          </div>
        </div>
      </div>
    );
  }

  // Vertical layout (default)
  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <div className="text-center mb-3">
        <div 
          className="w-16 h-16 rounded-full flex items-center justify-center text-3xl text-white shadow-lg mx-auto mb-2"
          style={{ backgroundColor: skill.color }}
        >
          {skill.icon}
        </div>
        <h3 className="font-semibold text-gray-900">{skill.name}</h3>
        <p className="text-sm text-gray-600">Level {skill.level}</p>
      </div>
      
      {showProgress && (
        <div className="mb-3">
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className="h-2 rounded-full transition-all duration-500"
              style={{ 
                width: `${Math.min(100, Math.max(5, progressInLevel))}%`,
                backgroundColor: skill.color 
              }}
            />
          </div>
          <p className="text-xs text-center text-gray-500">
            {Math.round(progressInLevel)}% bis Level {skill.level + 1}
          </p>
        </div>
      )}
      
      {showXP && (
        <p className="text-center text-sm text-gray-600 mb-2">
          {skill.totalXP.toLocaleString()} XP
        </p>
      )}
      
      <p className="text-xs text-gray-600 text-center">{skill.description}</p>
    </div>
  );
};

/**
 * Skills Display Component
 * Shows user skills with different layout options
 */
export const SkillsDisplay: React.FC<SkillsDisplayProps> = ({
  userId,
  layout = 'horizontal',
  showXP = true,
  showProgress = true,
  className
}) => {
  const { _getUserAvatar } = useAvatarStore();
  const userAvatar = getUserAvatar(userId);

  if (!userAvatar) {
    return (
      <div className={cn("p-6", className)}>
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">Skills werden geladen...</p>
        </div>
      </div>
    );
  }

  const containerClasses = {
    horizontal: "space-y-3",
    vertical: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
    grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Skills</h2>
        <div className="text-sm text-gray-600">
          Gesamt: {userAvatar.totalXP.toLocaleString()} XP
        </div>
      </div>
      
      {/* Skills Grid/List */}
      <div className={containerClasses[layout]}>
        {userAvatar.skills.map((skill) => (
          <SkillCard
            key={skill.id}
            skill={skill}
            showXP={showXP}
            showProgress={showProgress}
            layout={layout}
          />
        ))}
      </div>
      
      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {userAvatar.skills.reduce((sum, skill) => sum + skill.level, 0)}
          </div>
          <div className="text-sm text-blue-700">Gesamt Level</div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {userAvatar.level}
          </div>
          <div className="text-sm text-green-700">Avatar Level</div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {Math.round(userAvatar.skills.reduce((sum, skill) => sum + skill.level, 0) / userAvatar.skills.length)}
          </div>
          <div className="text-sm text-purple-700">Ø Skill Level</div>
        </div>
      </div>
    </div>
  );
};