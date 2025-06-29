import { UserAvatar, Skill, Level, XPEvent, LevelUpEvent, calculateXPProgress, calculateLevelFromXP } from '../types/avatar';

// Helper function to calculate new level based on XP
export const calculateLevel = (totalXP: number, levels: Level[]): number => {
  for (let i = levels.length - 1; i >= 0; i--) {
    if (totalXP >= levels[i].requiredXP) {
      return levels[i].levelNumber;
    }
  }
  return 1;
};

// Helper function to create XP event
export const createXPEvent = (params: {
  userId: string;
  skillId: string | null | undefined;
  xpAmount: number;
  description: string;
  metadata: any;
  now: string;
}): XPEvent => ({
  id: `${params.userId}-${Date.now()}`,
  userId: params.userId,
  type: params.metadata.type || 'manual',
  skillId: params.skillId || undefined,
  xpAmount: params.xpAmount,
  description: params.description,
  metadata: params.metadata,
  createdAt: params.now
});

// Helper function to update skill XP and level
export const updateSkillXP = (skill: Skill, xpAmount: number, levels: Level[]): Skill => {
  const newTotalXP = skill.totalXP + xpAmount;
  const newLevel = calculateLevel(newTotalXP, levels);
  const newCurrentXP = newTotalXP - (levels.find(l => l.levelNumber === newLevel)?.requiredXP || 0);
  
  return {
    ...skill,
    currentXP: newCurrentXP,
    totalXP: newTotalXP,
    level: newLevel
  };
};

// Helper function to update user avatar with XP
export const updateAvatarWithXP = (params: {
  avatar: UserAvatar;
  skillId: string | null | undefined;
  xpAmount: number;
  levels: Level[];
  now: string;
}): UserAvatar => {
  const { avatar, skillId, xpAmount, levels, now } = params;
  const updatedAvatar = { ...avatar };
  
  // Add to total XP
  updatedAvatar.totalXP += xpAmount;
  
  // Update specific skill if provided
  if (skillId) {
    updatedAvatar.skills = updatedAvatar.skills.map(skill => {
      if (skill.id === skillId) {
        return updateSkillXP(skill, xpAmount, levels);
      }
      return skill;
    });
  }
  
  // Update overall level progress  
  updatedAvatar.level = calculateLevel(updatedAvatar.totalXP, levels);
  const overallProgress = calculateXPProgress(updatedAvatar.totalXP);
  updatedAvatar.currentLevelXP = overallProgress.currentLevelXP;
  updatedAvatar.nextLevelXP = overallProgress.nextLevelXP;
  updatedAvatar.lastActiveAt = now;
  updatedAvatar.updatedAt = now;
  
  return updatedAvatar;
};

// Helper function to check level ups
export const checkLevelUps = (params: {
  userAvatar: UserAvatar;
  userId: string;
  now: string;
}): LevelUpEvent[] => {
  const { userAvatar, userId, now } = params;
  const levelUpEvents: LevelUpEvent[] = [];

  // Check overall level up
  const newOverallLevel = calculateLevelFromXP(userAvatar.totalXP);
  if (newOverallLevel > userAvatar.level) {
    const levelUpEvent: LevelUpEvent = {
      userId,
      oldLevel: userAvatar.level,
      newLevel: newOverallLevel,
      rewards: [], // Add level rewards logic here
      timestamp: now
    };
    levelUpEvents.push(levelUpEvent);
  }

  // Check skill level ups
  userAvatar.skills.forEach(skill => {
    const newSkillLevel = calculateLevelFromXP(skill.totalXP);
    if (newSkillLevel > skill.level) {
      const skillLevelUpEvent: LevelUpEvent = {
        userId,
        oldLevel: skill.level,
        newLevel: newSkillLevel,
        skillId: skill.id,
        rewards: [], // Add skill level rewards logic here
        timestamp: now
      };
      levelUpEvents.push(skillLevelUpEvent);
    }
  });

  return levelUpEvents;
};