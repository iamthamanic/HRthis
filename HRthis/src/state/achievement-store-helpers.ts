import { ProgressTracker } from '../types/gamification';

// Helper to create default user progress
export const createDefaultUserProgress = (userId: string, currentQuarter: string): ProgressTracker => ({
  userId,
  achievements: {},
  dailyStreak: { current: 0, longest: 0, lastCheckin: '' },
  quarterlyStats: {
    quarter: currentQuarter,
    coinsEarned: 0,
    trainingsCompleted: 0,
    punctualDays: 0,
    feedbackGiven: 0
  }
});

// Helper to get current quarter string
export const getCurrentQuarter = (): string => {
  return `${new Date().getFullYear()}-Q${Math.ceil((new Date().getMonth() + 1) / 3)}`;
};

// Helper to update quarterly stats
export const updateQuarterlyStats = (
  currentStats: any,
  eventType: string,
  value: number,
  currentQuarter: string
): any => {
  // Reset stats if quarter changed
  if (currentStats.quarter !== currentQuarter) {
    return {
      quarter: currentQuarter,
      coinsEarned: eventType === 'coins_earned' ? value : 0,
      trainingsCompleted: eventType === 'training_completed' ? value : 0,
      punctualDays: eventType === 'punctual_checkin' ? value : 0,
      feedbackGiven: eventType === 'feedback_given' ? value : 0
    };
  }

  // Update existing stats
  const updates: any = { ...currentStats };
  switch (eventType) {
    case 'coins_earned':
      updates.coinsEarned += value;
      break;
    case 'training_completed':
      updates.trainingsCompleted += value;
      break;
    case 'punctual_checkin':
      updates.punctualDays += value;
      break;
    case 'feedback_given':
      updates.feedbackGiven += value;
      break;
  }
  return updates;
};

// Helper to update daily streak
export const updateDailyStreak = (
  currentStreak: any,
  eventType: string,
  now: string
): any => {
  if (eventType !== 'daily_checkin') return currentStreak;

  const today = now.split('T')[0];
  const lastCheckin = currentStreak.lastCheckin?.split('T')[0];
  
  if (lastCheckin === today) return currentStreak; // Already checked in today

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const newCurrent = lastCheckin === yesterdayStr ? currentStreak.current + 1 : 1;
  
  return {
    current: newCurrent,
    longest: Math.max(currentStreak.longest, newCurrent),
    lastCheckin: now
  };
};