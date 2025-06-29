import React from 'react';
import { useAvatarStore } from '../state/avatar';
import { cn } from '../utils/cn';
import { SkillCard } from './skills/SkillCard';
import { SkillsHeader } from './skills/SkillsHeader';
import { SkillsSummaryStats } from './skills/SkillsSummaryStats';

interface SkillsDisplayProps {
  userId: string;
  layout?: 'horizontal' | 'vertical' | 'grid';
  showXP?: boolean;
  showProgress?: boolean;
  className?: string;
}


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
  const { getUserAvatar } = useAvatarStore();
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
      <SkillsHeader totalXP={userAvatar.totalXP} />
      
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
      
      <SkillsSummaryStats 
        skills={userAvatar.skills}
        avatarLevel={userAvatar.level}
      />
    </div>
  );
};