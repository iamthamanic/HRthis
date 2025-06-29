import React from 'react';
import { Skill } from '../../types/avatar';

interface SkillCardGridProps {
  skill: Skill;
  showXP: boolean;
  showProgress: boolean;
}

export const SkillCardGrid: React.FC<SkillCardGridProps> = ({ 
  skill, 
  showXP, 
  showProgress 
}) => {
  const progressInLevel = skill.level > 1 
    ? ((skill.currentXP || 0) / Math.max(1, skill.totalXP / skill.level)) * 100
    : skill.totalXP > 0 ? 50 : 0;

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-200 hover:border-gray-300">
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
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse" />
            </div>
          </div>
        </div>
      )}
      
      {showXP && (
        <div className="flex justify-between items-center text-sm mb-3">
          <span className="text-gray-600">Gesamt XP:</span>
          <span className="font-semibold text-gray-900">
            {skill.totalXP.toLocaleString()}
          </span>
        </div>
      )}
      
      <p className="text-sm text-gray-600">{skill.description}</p>
      
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
};