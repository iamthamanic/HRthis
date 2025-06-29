import React from 'react';
import { Skill } from '../../types/avatar';

interface SkillCardVerticalProps {
  skill: Skill;
  showXP: boolean;
  showProgress: boolean;
}

export const SkillCardVertical: React.FC<SkillCardVerticalProps> = ({ 
  skill, 
  showXP, 
  showProgress 
}) => {
  const progressInLevel = skill.level > 1 
    ? ((skill.currentXP || 0) / Math.max(1, skill.totalXP / skill.level)) * 100
    : skill.totalXP > 0 ? 50 : 0;

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