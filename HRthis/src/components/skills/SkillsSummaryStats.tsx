import React from 'react';
import { Skill } from '../../types/avatar';

interface SkillsSummaryStatsProps {
  skills: Skill[];
  avatarLevel: number;
}

export const SkillsSummaryStats: React.FC<SkillsSummaryStatsProps> = ({ 
  skills, 
  avatarLevel 
}) => {
  const totalLevels = skills.reduce((sum, skill) => sum + skill.level, 0);
  const averageLevel = Math.round(totalLevels / skills.length);

  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-blue-50 rounded-lg p-4 text-center">
        <div className="text-2xl font-bold text-blue-600">
          {totalLevels}
        </div>
        <div className="text-sm text-blue-700">Gesamt Level</div>
      </div>
      
      <div className="bg-green-50 rounded-lg p-4 text-center">
        <div className="text-2xl font-bold text-green-600">
          {avatarLevel}
        </div>
        <div className="text-sm text-green-700">Avatar Level</div>
      </div>
      
      <div className="bg-purple-50 rounded-lg p-4 text-center">
        <div className="text-2xl font-bold text-purple-600">
          {averageLevel}
        </div>
        <div className="text-sm text-purple-700">Ø Skill Level</div>
      </div>
    </div>
  );
};