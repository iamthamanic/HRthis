/**
 * Gamification Events and Tracking Types
 */

export interface GamificationConfig {
  xpRates: {
    trainingCompleted: number;
    punctualCheckin: number;
    coinsEarned: number; // XP per coin earned
    feedbackGiven: number;
    dailyLogin: number;
  };
  coinMilestones: {
    quarterly: number[];
    yearly: number[];
  };
  achievementCategories: AchievementCategory[];
  levelSystem: {
    baseXP: number;
    multiplier: number;
  };
}

export interface AchievementCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface NotificationEvent {
  id: string;
  userId: string;
  type: 'level_up' | 'achievement_unlocked' | 'skill_level_up' | 'milestone_reached';
  title: string;
  message: string;
  data: {
    level?: number;
    skillId?: string;
    achievementId?: string;
    xpGained?: number;
    coinsGained?: number;
  };
  isRead: boolean;
  createdAt: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  conditions: AchievementCondition[];
  xpReward: number;
  rewards?: AchievementReward[];
  isActive: boolean;
  isHidden?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  progress?: number;
  unlockedAt: string;
  notified: boolean;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface AchievementCondition {
  type: 'xp_earned' | 'training_completed' | 'punctual_checkins' | 'coins_earned' | 
        'level_reached' | 'feedback_given' | 'consecutive_days' | 'trainings_completed' |
        'days_punctual';
  target: number;
  operator: 'gte' | 'gt' | 'eq' | 'lt' | 'lte' | 'equals';
  skillId?: string;
  timeframe?: 'all_time' | 'quarterly' | 'monthly' | 'weekly';
}

export interface AchievementReward {
  type: 'xp' | 'skill_xp' | 'coins' | 'title' | 'avatar_item';
  value: number | string;
  skillId?: string;
}

export interface ProgressTracker {
  userId: string;
  achievements: {
    [achievementId: string]: {
      progress: number;
      maxProgress: number;
      isCompleted: boolean;
      lastUpdated: string;
    };
  };
  dailyStreak: {
    current: number;
    longest: number;
    lastCheckin: string;
  };
  quarterlyStats: {
    quarter: string; // "2024-Q1"
    coinsEarned: number;
    trainingsCompleted: number;
    punctualDays: number;
    feedbackGiven: number;
  };
}

// Event types for XP tracking
export type XPEventType = 
  | 'training_completed'
  | 'training_passed'
  | 'punctual_checkin'
  | 'coins_earned'
  | 'feedback_given'
  | 'daily_login'
  | 'manual';

export interface XPEventData {
  type: XPEventType;
  userId: string;
  skillIds?: string[]; // Which skills to award XP to
  xpAmount?: number; // Override default XP amount
  metadata?: {
    trainingId?: string;
    coinAmount?: number;
    streakDay?: number;
    reason?: string;
    passed?: boolean;
    feedbackId?: string;
    date?: string;
    [key: string]: any;
  };
}

// Predefined achievements
export const PREDEFINED_ACHIEVEMENTS = [
  // Learning Achievements
  {
    id: 'first_training',
    name: 'Erste Schritte',
    description: 'Erste Schulung erfolgreich abgeschlossen',
    icon: '🎯',
    category: 'learning' as const,
    rarity: 'common' as const,
    conditions: [{
      type: 'trainings_completed' as const,
      operator: 'equals' as const,
      target: 1,
      timeframe: 'all_time' as const
    }],
    rewards: [{ type: 'xp' as const, value: 50 }]
  },
  {
    id: 'knowledge_seeker',
    name: 'Wissenssucher',
    description: '5 Schulungen erfolgreich abgeschlossen',
    icon: '📚',
    category: 'learning' as const,
    rarity: 'common' as const,
    conditions: [{
      type: 'trainings_completed' as const,
      operator: 'equals' as const,
      target: 5,
      timeframe: 'all_time' as const
    }],
    rewards: [
      { type: 'skill_xp' as const, value: 100, skillId: 'knowledge' },
      { type: 'coins' as const, value: 50 }
    ]
  },
  {
    id: 'training_master',
    name: 'Schulmeister',
    description: '10 Schulungen erfolgreich abgeschlossen',
    icon: '🎓',
    category: 'learning' as const,
    rarity: 'rare' as const,
    conditions: [{
      type: 'trainings_completed' as const,
      operator: 'equals' as const,
      target: 10,
      timeframe: 'all_time' as const
    }],
    rewards: [
      { type: 'skill_xp' as const, value: 200, skillId: 'knowledge' },
      { type: 'coins' as const, value: 100 },
      { type: 'title' as const, value: 'Schulmeister' }
    ]
  },
  
  // Attendance Achievements  
  {
    id: 'punctual_week',
    name: 'Pünktlichkeits-Profi',
    description: '7 Tage hintereinander pünktlich',
    icon: '⏰',
    category: 'attendance' as const,
    rarity: 'common' as const,
    conditions: [{
      type: 'days_punctual' as const,
      operator: 'equals' as const,
      target: 7,
      timeframe: 'all_time' as const
    }],
    rewards: [
      { type: 'skill_xp' as const, value: 75, skillId: 'loyalty' },
      { type: 'coins' as const, value: 25 }
    ]
  },
  {
    id: 'punctual_month',
    name: 'Zeitmanagement-Experte', 
    description: '30 Tage pünktlich gestempelt',
    icon: '🕐',
    category: 'attendance' as const,
    rarity: 'rare' as const,
    conditions: [{
      type: 'days_punctual' as const,
      operator: 'equals' as const,
      target: 30,
      timeframe: 'all_time' as const
    }],
    rewards: [
      { type: 'skill_xp' as const, value: 150, skillId: 'loyalty' },
      { type: 'coins' as const, value: 75 },
      { type: 'title' as const, value: 'Zeitmanagement-Experte' }
    ]
  },

  // Engagement Achievements
  {
    id: 'coin_collector',
    name: 'Münzsammler',
    description: '100 BrowoCoins gesammelt',
    icon: '🪙',
    category: 'engagement' as const,
    rarity: 'common' as const,
    conditions: [{
      type: 'coins_earned' as const,
      operator: 'equals' as const,
      target: 100,
      timeframe: 'all_time' as const
    }],
    rewards: [
      { type: 'skill_xp' as const, value: 50, skillId: 'hustle' },
      { type: 'xp' as const, value: 25 }
    ]
  },
  {
    id: 'browo_legend',
    name: 'Browo Legend',
    description: '2500 Coins in einem Quartal',
    icon: '👑',
    category: 'milestone' as const,
    rarity: 'legendary' as const,
    conditions: [{
      type: 'coins_earned' as const,
      operator: 'equals' as const,
      target: 2500,
      timeframe: 'quarterly' as const
    }],
    rewards: [
      { type: 'skill_xp' as const, value: 500, skillId: 'hustle' },
      { type: 'xp' as const, value: 250 },
      { type: 'title' as const, value: 'Browo Legend' },
      { type: 'coins' as const, value: 250 }
    ]
  },

  // Feedback Achievements
  {
    id: 'feedback_giver',
    name: 'Feedback-Geber',
    description: '5 Bewertungen abgegeben',
    icon: '💬',
    category: 'engagement' as const,
    rarity: 'common' as const,
    conditions: [{
      type: 'feedback_given' as const,
      operator: 'equals' as const,
      target: 5,
      timeframe: 'all_time' as const
    }],
    rewards: [
      { type: 'skill_xp' as const, value: 75, skillId: 'loyalty' },
      { type: 'coins' as const, value: 30 }
    ]
  },
  {
    id: 'feedback_veteran',
    name: 'Feedback-Veteran',
    description: '25 Bewertungen abgegeben',
    icon: '🗣️',
    category: 'engagement' as const,
    rarity: 'rare' as const,
    conditions: [{
      type: 'feedback_given' as const,
      operator: 'equals' as const,
      target: 25,
      timeframe: 'all_time' as const
    }],
    rewards: [
      { type: 'skill_xp' as const, value: 150, skillId: 'loyalty' },
      { type: 'coins' as const, value: 75 },
      { type: 'title' as const, value: 'Feedback-Veteran' }
    ]
  }
] as const;

// Default gamification configuration
export const DEFAULT_GAMIFICATION_CONFIG: GamificationConfig = {
  xpRates: {
    trainingCompleted: 50,
    punctualCheckin: 5,
    coinsEarned: 0.1, // 1 XP per 10 coins
    feedbackGiven: 15,
    dailyLogin: 2
  },
  coinMilestones: {
    quarterly: [500, 1000, 1500, 2000, 2500],
    yearly: [2000, 5000, 8000, 12000, 15000]
  },
  levelSystem: {
    baseXP: 100,
    multiplier: 1.15
  },
  achievementCategories: [
    {
      id: 'learning',
      name: 'Lernen',
      description: 'Schulungen und Wissensaufbau',
      icon: '🎓',
      color: '#3B82F6'
    },
    {
      id: 'attendance', 
      name: 'Anwesenheit',
      description: 'Pünktlichkeit und Zuverlässigkeit',
      icon: '⏰',
      color: '#10B981'
    },
    {
      id: 'engagement',
      name: 'Engagement',
      description: 'Aktive Teilnahme und Feedback',
      icon: '💪',
      color: '#F59E0B'
    },
    {
      id: 'milestone',
      name: 'Meilensteine',
      description: 'Besondere Leistungen und Erfolge',
      icon: '🏆',
      color: '#8B5CF6'
    },
    {
      id: 'special',
      name: 'Spezial',
      description: 'Einmalige und seltene Achievements',
      icon: '⭐',
      color: '#EF4444'
    }
  ]
};