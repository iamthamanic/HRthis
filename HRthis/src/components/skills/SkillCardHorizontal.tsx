import React from 'react';
import { Skill } from '../../types/avatar';

interface SkillCardHorizontalProps {
  skill: Skill;
  showXP: boolean;
  showProgress: boolean;
}

export const SkillCardHorizontal: React.FC<SkillCardHorizontalProps> = ({ 
  skill, 
  showXP, 
  showProgress 
}) => {
  const progressInLevel = skill.level > 1 
    ? ((skill.currentXP || 0) / Math.max(1, skill.totalXP / skill.level)) * 100
    : skill.totalXP > 0 ? 50 : 0;

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div 
        className="w-12 h-12 rounded-full flex items-center justify-center text-2xl text-white shadow-md"
        style={{ backgroundColor: skill.color }}
      >
        {skill.icon}
      </div>
      
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
};