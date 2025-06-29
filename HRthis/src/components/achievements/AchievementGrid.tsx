import React from 'react';
import { Achievement, UserAchievement } from '../../types/gamification';
import { AchievementCard } from './AchievementCard';

interface AchievementGridProps {
  achievements: Achievement[];
  userAchievements: UserAchievement[];
  layout: 'grid' | 'list';
  onAchievementClick: (achievement: Achievement) => void;
}

const CONTAINER_CLASSES = {
  grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
  list: "space-y-4"
};

export const AchievementGrid: React.FC<AchievementGridProps> = ({
  achievements,
  userAchievements,
  layout,
  onAchievementClick
}) => (
  <div className={CONTAINER_CLASSES[layout]}>
    {achievements.map(achievement => {
      const userAchievement = userAchievements.find(ua => ua.achievementId === achievement.id);
      const isUnlocked = !!userAchievement;
      
      return (
        <AchievementCard
          key={achievement.id}
          achievement={achievement}
          isUnlocked={isUnlocked}
          unlockedAt={userAchievement?.unlockedAt}
          progress={userAchievement?.progress || 0}
          layout={layout}
          onClick={() => onAchievementClick(achievement)}
        />
      );
    })}
  </div>
);