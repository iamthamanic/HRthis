import React from 'react';

interface Skill {
  id: string;
  name: string;
  icon: string;
  level: number;
  currentXP: number;
  totalXP: number;
  color: string;
}

interface SkillsListProps {
  skills: Skill[];
}

export const SkillsList: React.FC<SkillsListProps> = ({ skills }) => (
  <div className="w-full mb-6">
    <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Skills</h3>
    
    <div className="space-y-4">
      {skills.map((skill) => {
        const skillProgress = skill.currentXP > 0 && skill.level > 1
          ? ((skill.currentXP / (skill.totalXP / skill.level)) * 100)
          : (skill.totalXP > 0 ? 25 : 0);

        return (
          <div key={skill.id} className="flex items-center gap-4">
            <div className="flex items-center gap-3 min-w-[140px]">
              <span className="text-2xl">{skill.icon}</span>
              <span className="font-medium text-gray-900">{skill.name}</span>
            </div>
            
            <div className="flex-1 bg-gray-200 rounded-full h-3 relative overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-300"
                style={{ 
                  width: `${Math.min(100, skillProgress)}%`,
                  backgroundColor: skill.color 
                }}
              />
            </div>
            
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
);