import { Achievement, AchievementCondition, ProgressTracker } from '../types/gamification';
import { useAvatarStore } from './avatar';

// Helper to get current value for condition type
const getCurrentValue = (
  userId: string,
  condition: AchievementCondition,
  userProgress: ProgressTracker
): number => {
  switch (condition.type) {
    case 'xp_earned':
      const avatarStore = useAvatarStore.getState();
      const userAvatar = avatarStore.getUserAvatar(userId);
      return userAvatar?.totalXP || 0;
    
    case 'training_completed':
    case 'trainings_completed':
      return condition.timeframe === 'quarterly' 
        ? userProgress.quarterlyStats.trainingsCompleted
        : getTotalTrainingsCompleted(userId);
    
    case 'days_punctual':
    case 'punctual_checkins':
      return condition.timeframe === 'quarterly'
        ? userProgress.quarterlyStats.punctualDays
        : getTotalPunctualDays(userId);
    
    case 'coins_earned':
      return condition.timeframe === 'quarterly'
        ? userProgress.quarterlyStats.coinsEarned
        : getTotalCoinsEarned(userId);
    
    case 'feedback_given':
      return condition.timeframe === 'quarterly'
        ? userProgress.quarterlyStats.feedbackGiven
        : getTotalFeedbackGiven(userId);
    
    case 'level_reached':
      const avatar = useAvatarStore.getState().getUserAvatar(userId);
      return avatar?.level || 1;
    
    case 'consecutive_days':
      return userProgress.dailyStreak.current;
    
    default:
      return 0;
  }
};

// Helper to check condition operator
const checkConditionOperator = (currentValue: number, condition: AchievementCondition): boolean => {
  switch (condition.operator) {
    case 'equals':
    case 'eq':
      return currentValue === condition.target;
    case 'gte':
      return currentValue >= condition.target;
    case 'gt':
      return currentValue > condition.target;
    case 'lte':
      return currentValue <= condition.target;
    case 'lt':
      return currentValue < condition.target;
    default:
      return false;
  }
};

// Helper function to check individual achievement conditions
export const checkAchievementCondition = (
  userId: string,
  condition: AchievementCondition,
  userProgress: ProgressTracker
): boolean => {
  const currentValue = getCurrentValue(userId, condition, userProgress);
  return checkConditionOperator(currentValue, condition);
};

// Mock functions that would normally be in the store
const getTotalTrainingsCompleted = (userId: string): number => {
  // This would fetch from training store
  return 0;
};

const getTotalPunctualDays = (userId: string): number => {
  // This would fetch from time tracking store
  return 0;
};

const getTotalCoinsEarned = (userId: string): number => {
  // This would fetch from coins store
  return 0;
};

const getTotalFeedbackGiven = (userId: string): number => {
  // This would fetch from feedback/teams store
  return 0;
};

// Helper to get user progress stats
export const getUserProgressStats = (userId: string): ProgressTracker => {
  // This would normally fetch from various stores/APIs
  // For now, returning mock data structure
  return {
    userId,
    achievements: {},
    dailyStreak: {
      current: 0,
      longest: 0,
      lastCheckin: new Date().toISOString()
    },
    quarterlyStats: {
      quarter: `${new Date().getFullYear()}-Q${Math.floor(new Date().getMonth() / 3) + 1}`,
      coinsEarned: 0,
      trainingsCompleted: 0,
      punctualDays: 0,
      feedbackGiven: 0
    }
  };
};

// Create initial achievement from predefined data
export const createAchievementFromPredefined = (achievement: any, index: number): Achievement => ({
  id: `predefined-${index}`,
  name: achievement.name,
  description: achievement.description,
  icon: achievement.icon,
  category: achievement.category,
  rarity: achievement.rarity,
  conditions: achievement.conditions.map((c: any) => ({
    type: c.type,
    target: c.target,
    operator: c.operator,
    timeframe: c.timeframe
  })),
  xpReward: achievement.rewards ? 
    (achievement.rewards as unknown as any[]).find((r: any) => r.type === 'xp')?.value as number || 50 
    : 50,
  rewards: achievement.rewards ? [...achievement.rewards] : undefined,
  isActive: true,
  isHidden: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

// Helper to map user achievement to UserAchievement object
export const mapUserAchievement = (
  ua: any,
  achievement: Achievement,
  userId: string
): any => ({
  id: `${userId}-${ua.achievementId}`,
  userId,
  achievementId: ua.achievementId,
  progress: 100,
  unlockedAt: ua.unlockedAt,
  notified: ua.isNew !== true,
  name: achievement.name,
  description: achievement.description,
  icon: achievement.icon,
  rarity: achievement.rarity
});

// Helper to get unlocked achievement IDs
export const getUnlockedAchievementIds = (userAchievements: any[]): string[] => {
  return userAchievements.map(ua => ua.achievementId);
};