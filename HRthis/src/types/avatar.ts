/**
 * Avatar and Gamification System Types
 */

export interface Skill {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  currentXP: number;
  level: number;
  totalXP: number; // Total XP ever earned for this skill
}

export interface Level {
  id: string;
  levelNumber: number;
  title: string;
  description?: string;
  requiredXP: number;
  icon?: string;
  color?: string;
  badge?: string;
  rewards?: LevelReward[];
}

export interface LevelReward {
  type: 'coins' | 'achievement' | 'benefit' | 'title';
  value: string | number;
  description: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'learning' | 'attendance' | 'engagement' | 'special' | 'milestone';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  conditions: AchievementCondition[];
  rewards?: AchievementReward[];
  isVisible: boolean; // Hidden until unlocked
  unlockedAt?: string; // ISO timestamp
}

export interface AchievementCondition {
  type: 'trainings_completed' | 'days_punctual' | 'coins_earned' | 'feedback_given' | 'custom';
  operator: 'equals' | 'greater_than' | 'less_than' | 'between';
  value: number | [number, number];
  timeframe?: 'all_time' | 'monthly' | 'quarterly' | 'yearly';
}

export interface AchievementReward {
  type: 'xp' | 'coins' | 'skill_xp' | 'title' | 'benefit_unlock';
  value: number | string;
  skillId?: string; // For skill_xp rewards
}

export interface UserAvatar {
  userId: string;
  level: number;
  totalXP: number;
  currentLevelXP: number;
  nextLevelXP: number;
  title?: string;
  avatarUrl?: string;
  skills: Skill[];
  achievements: UserAchievement[];
  lastActiveAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserAchievement {
  achievementId: string;
  unlockedAt: string;
  isNew?: boolean; // For highlighting new achievements
}

export interface XPEvent {
  id: string;
  userId: string;
  type: 'training_completed' | 'punctual_checkin' | 'coins_earned' | 'feedback_given' | 'manual';
  skillId?: string; // Which skill gets the XP
  xpAmount: number;
  description: string;
  metadata?: Record<string, any>; // Additional data (training ID, etc.)
  createdAt: string;
}

export interface LevelUpEvent {
  userId: string;
  oldLevel: number;
  newLevel: number;
  skillId?: string; // null for overall level
  rewards: LevelReward[];
  timestamp: string;
}

// Default skill IDs
export const SKILL_IDS = {
  KNOWLEDGE: 'knowledge',
  LOYALTY: 'loyalty', 
  HUSTLE: 'hustle'
} as const;

// Default skills configuration
export const DEFAULT_SKILLS: Omit<Skill, 'currentXP' | 'level' | 'totalXP'>[] = [
  {
    id: SKILL_IDS.KNOWLEDGE,
    name: '🎓 Wissen',
    description: 'Durch Schulungen und Lernen erworbenes Wissen',
    icon: '🎓',
    color: '#3B82F6'
  },
  {
    id: SKILL_IDS.LOYALTY,
    name: '🔁 Loyalität', 
    description: 'Treue und regelmäßige Aktivität im Unternehmen',
    icon: '🔁',
    color: '#10B981'
  },
  {
    id: SKILL_IDS.HUSTLE,
    name: '💪 Hustle',
    description: 'Engagement und Initiative durch BrowoCoins',
    icon: '💪',
    color: '#F59E0B'
  }
];

// XP calculation helpers
export const calculateLevelFromXP = (xp: number): number => {
  // Progressive XP requirement: Level 1 = 100 XP, Level 2 = 250 XP, etc.
  let level = 1;
  let requiredXP = 100;
  let totalRequired = 0;
  
  while (totalRequired + requiredXP <= xp) {
    totalRequired += requiredXP;
    level++;
    requiredXP = Math.floor(requiredXP * 1.15); // 15% increase per level
  }
  
  return level;
};

export const calculateXPForLevel = (level: number): number => {
  let totalXP = 0;
  let requiredXP = 100;
  
  for (let i = 1; i < level; i++) {
    totalXP += requiredXP;
    requiredXP = Math.floor(requiredXP * 1.15);
  }
  
  return totalXP;
};

export const calculateXPProgress = (currentXP: number): {
  level: number;
  currentLevelXP: number;
  nextLevelXP: number;
  progress: number;
} => {
  const level = calculateLevelFromXP(currentXP);
  const currentLevelStartXP = calculateXPForLevel(level);
  const nextLevelStartXP = calculateXPForLevel(level + 1);
  
  const currentLevelXP = currentXP - currentLevelStartXP;
  const nextLevelXP = nextLevelStartXP - currentLevelStartXP;
  const progress = nextLevelXP > 0 ? (currentLevelXP / nextLevelXP) * 100 : 0;
  
  return {
    level,
    currentLevelXP,
    nextLevelXP,
    progress: Math.min(100, Math.max(0, progress))
  };
};