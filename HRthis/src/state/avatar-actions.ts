import { UserAvatar, Skill, DEFAULT_SKILLS } from '../types/avatar';

// Helper to create new user avatar
export const createNewUserAvatar = (userId: string): UserAvatar => {
  const now = new Date().toISOString();
  
  // Create default skills with 0 XP
  const skills: Skill[] = DEFAULT_SKILLS.map(skillTemplate => ({
    ...skillTemplate,
    currentXP: 0,
    level: 1,
    totalXP: 0
  }));

  return {
    userId,
    level: 1,
    totalXP: 0,
    currentLevelXP: 0,
    nextLevelXP: 100,
    skills,
    achievements: [],
    lastActiveAt: now,
    createdAt: now,
    updatedAt: now
  };
};

// Helper to get user stats
export const calculateUserStats = (
  userAvatar: UserAvatar | null,
  xpEvents: any[]
) => {
  if (!userAvatar) {
    return {
      totalXP: 0,
      level: 1,
      skillLevels: {},
      recentEvents: []
    };
  }

  const skillLevels = userAvatar.skills.reduce((acc, skill) => {
    acc[skill.id] = skill.level;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalXP: userAvatar.totalXP,
    level: userAvatar.level,
    skillLevels,
    recentEvents: xpEvents
  };
};