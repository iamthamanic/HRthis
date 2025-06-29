import React from 'react';

interface SkillsHeaderProps {
  totalXP: number;
}

export const SkillsHeader: React.FC<SkillsHeaderProps> = ({ totalXP }) => (
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-xl font-bold text-gray-900">Skills</h2>
    <div className="text-sm text-gray-600">
      Gesamt: {totalXP.toLocaleString()} XP
    </div>
  </div>
);