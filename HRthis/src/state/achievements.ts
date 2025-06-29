import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  Achievement, 
  UserAchievement, 
  AchievementCondition,
  ProgressTracker,
  PREDEFINED_ACHIEVEMENTS
} from '../types/gamification';
import { useAvatarStore } from './avatar';
import { useNotificationsStore } from './notifications';
import { 
  checkAchievementCondition, 
  createAchievementFromPredefined, 
  mapUserAchievement,
  getUnlockedAchievementIds
} from './achievements-helpers';
import {
  createDefaultUserProgress,
  getCurrentQuarter,
  updateQuarterlyStats,
  updateDailyStreak
} from './achievement-store-helpers';

interface AchievementsState {
  // Achievement system data
  achievements: Achievement[];
  userProgress: Record<string, ProgressTracker>;
  
  // Actions
  getAchievements: () => Achievement[];
  getUserAchievements: (_userId: string) => UserAchievement[];
  getUnlockedAchievements: (_userId: string) => Achievement[];
  getLockedAchievements: (_userId: string) => Achievement[];
  
  // Progress tracking
  updateProgress: (_userId: string, _eventType: string, _value: number, _metadata?: Record<string, any>) => void;
  checkAchievements: (_userId: string) => UserAchievement[];
  unlockAchievement: (_userId: string, _achievementId: string) => void;
  
  // Admin functions
  addAchievement: (achievement: Omit<Achievement, 'id'>) => void;
  updateAchievement: (_achievementId: string, _updates: Partial<Achievement>) => void;
  deleteAchievement: (_achievementId: string) => void;
  
  // Statistics
  getProgressStats: (_userId: string) => {
    totalAchievements: number;
    unlockedAchievements: number;
    completionRate: number;
    recentUnlocks: UserAchievement[];
  };
  
  // Additional methods
  createAchievement: (achievement: Achievement) => void;
  toggleAchievementActive: (_achievementId: string) => void;
  getAchievementStats: (_achievementId: string) => { unlockedCount: number; totalUsers: number };
  checkCondition: (_userId: string, condition: AchievementCondition, userProgress: ProgressTracker) => boolean;
  getTotalTrainingsCompleted: (_userId: string) => number;
  getTotalPunctualDays: (_userId: string) => number;
  getTotalCoinsEarned: (_userId: string) => number;
  getTotalFeedbackGiven: (_userId: string) => number;
}


export const useAchievementsStore = create<AchievementsState>()(
  persist(
    (set, get) => ({
      achievements: PREDEFINED_ACHIEVEMENTS.map(createAchievementFromPredefined),
      userProgress: {},

      getAchievements: () => get().achievements,

      getUserAchievements: (userId: string) => {
        const avatarStore = useAvatarStore.getState();
        const userAvatar = avatarStore.getUserAvatar(userId);
        const achievements = get().achievements;
        
        if (!userAvatar?.achievements) return [];
        
        return userAvatar.achievements.map(ua => {
          const achievement = achievements.find(a => a.id === ua.achievementId);
          if (!achievement) return null;
          return mapUserAchievement(ua, achievement, userId);
        }).filter(Boolean) as UserAchievement[];
      },

      getUnlockedAchievements: (userId: string) => {
        const userAchievements = get().getUserAchievements(userId);
        const allAchievements = get().achievements;
        const unlockedIds = getUnlockedAchievementIds(userAchievements);
        return allAchievements.filter(achievement => unlockedIds.includes(achievement.id));
      },

      getLockedAchievements: (userId: string) => {
        const userAchievements = get().getUserAchievements(userId);
        const allAchievements = get().achievements;
        const unlockedIds = getUnlockedAchievementIds(userAchievements);
        return allAchievements.filter(achievement => 
          !unlockedIds.includes(achievement.id) && achievement.isActive && !achievement.isHidden
        );
      },

      updateProgress: (userId: string, eventType: string, value: number, metadata = {}) => {
        const now = new Date().toISOString();
        const currentQuarter = getCurrentQuarter();
        
        set(state => {
          const userProgress = state.userProgress[userId] || 
            createDefaultUserProgress(userId, currentQuarter);

          // Update quarterly stats and daily streak using helpers
          const quarterlyStats = updateQuarterlyStats(userProgress.quarterlyStats, eventType, value, currentQuarter);
          const dailyStreak = updateDailyStreak(userProgress.dailyStreak, eventType, now);

          const updatedProgress = {
            ...userProgress,
            quarterlyStats,
            dailyStreak
          };

          return {
            userProgress: {
              ...state.userProgress,
              [userId]: updatedProgress
            }
          };
        });

        // Check for new achievements
        get().checkAchievements(userId);
      },

      checkAchievements: (userId: string) => {
        const userAchievements = get().getUserAchievements(userId);
        const unlockedIds = userAchievements.map(ua => ua.achievementId);
        const lockedAchievements = get().achievements.filter(a => !unlockedIds.includes(a.id));
        const userProgress = get().userProgress[userId];
        const newUnlocks: UserAchievement[] = [];

        if (!userProgress) return newUnlocks;

        lockedAchievements.forEach(achievement => {
          const isUnlocked = achievement.conditions.every(condition => {
            return get().checkCondition(userId, condition, userProgress);
          });

          if (isUnlocked) {
            const userAchievement = {
              id: `${userId}-${achievement.id}`,
              userId,
              achievementId: achievement.id,
              progress: 100,
              unlockedAt: new Date().toISOString(),
              notified: false,
              name: achievement.name,
              description: achievement.description,
              icon: achievement.icon,
              rarity: achievement.rarity
            };
            
            newUnlocks.push(userAchievement);
            get().unlockAchievement(userId, achievement.id);

            // Add notification
            const notificationsStore = useNotificationsStore.getState();
            notificationsStore.addNotification({
              userId,
              type: 'general',
              title: 'Achievement freigeschaltet!',
              message: `Du hast "${achievement.name}" erreicht!`,
              isRead: false,
              relatedId: achievement.id
            });

            // Process rewards
            if (achievement.rewards) {
              const avatarStore = useAvatarStore.getState();
              achievement.rewards.forEach(reward => {
                switch (reward.type) {
                  case 'xp':
                    avatarStore.addXP({
                      userId, 
                      skillId: null, 
                      xpAmount: Number(reward.value), 
                      description: `Achievement: ${achievement.name}`
                    });
                    break;
                  case 'skill_xp':
                    if (reward.skillId) {
                      avatarStore.addXP({
                        userId,
                        skillId: reward.skillId,
                        xpAmount: Number(reward.value),
                        description: `Achievement: ${achievement.name}`
                      });
                    }
                    break;
                  case 'coins':
                    // Add coins logic here when coins store is available
                    break;
                }
              });
            }
          }
        });

        return newUnlocks;
      },


      // Helper functions for getting total values (these would integrate with other stores)
      getTotalTrainingsCompleted: (userId: string) => {
        // This would integrate with training store
        return 0;
      },

      getTotalPunctualDays: (userId: string) => {
        // This would integrate with time records store  
        return 0;
      },

      getTotalCoinsEarned: (userId: string) => {
        // This would integrate with coins store
        return 0;
      },

      getTotalFeedbackGiven: (userId: string) => {
        // This would integrate with feedback/training store
        return 0;
      },

      unlockAchievement: (userId: string, achievementId: string) => {
        const avatarStore = useAvatarStore.getState();
        let userAvatar = avatarStore.getUserAvatar(userId);
        
        if (!userAvatar) {
          userAvatar = avatarStore.createUserAvatar(userId);
        }

        const newAchievement = {
          achievementId,
          unlockedAt: new Date().toISOString(),
          isNew: true
        };

        const updatedAchievements = [...userAvatar.achievements, newAchievement];
        
        // Update avatar store
        avatarStore.updateSkill(userId, 'achievements', updatedAchievements as any);
      },

      addAchievement: (achievementData: Omit<Achievement, 'id'>) => {
        const newAchievement: Achievement = {
          ...achievementData,
          id: `custom-${Date.now()}`
        };

        set(state => ({
          achievements: [...state.achievements, newAchievement]
        }));
      },

      updateAchievement: (achievementId: string, updates: Partial<Achievement>) => {
        set(state => ({
          achievements: state.achievements.map(achievement =>
            achievement.id === achievementId ? { ...achievement, ...updates } : achievement
          )
        }));
      },

      deleteAchievement: (achievementId: string) => {
        set(state => ({
          achievements: state.achievements.filter(achievement => achievement.id !== achievementId)
        }));
      },

      getProgressStats: (userId: string) => {
        const allAchievements = get().achievements;
        const userAchievements = get().getUserAchievements(userId);
        
        const totalAchievements = allAchievements.filter(a => a.isActive && !a.isHidden).length;
        const unlockedAchievements = userAchievements.length;
        const completionRate = totalAchievements > 0 ? (unlockedAchievements / totalAchievements) * 100 : 0;
        
        const recentUnlocks = userAchievements
          .sort((a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime())
          .slice(0, 3);

        return {
          totalAchievements,
          unlockedAchievements,
          completionRate,
          recentUnlocks
        };
      },
      
      createAchievement: (achievement: Achievement) => {
        set(state => ({
          achievements: [...state.achievements, achievement]
        }));
      },
      
      toggleAchievementActive: (achievementId: string) => {
        set(state => ({
          achievements: state.achievements.map(achievement =>
            achievement.id === achievementId 
              ? { ...achievement, isActive: !achievement.isActive }
              : achievement
          )
        }));
      },
      
      getAchievementStats: (achievementId: string) => {
        const avatarStore = useAvatarStore.getState();
        const allUserAvatars = avatarStore.getAllUserAvatars();
        
        let unlockedCount = 0;
        allUserAvatars.forEach(avatar => {
          if (avatar.achievements.some(a => a.achievementId === achievementId)) {
            unlockedCount++;
          }
        });
        
        return { 
          unlockedCount, 
          totalUsers: allUserAvatars.length 
        };
      },
      
      checkCondition: (userId: string, condition: AchievementCondition, userProgress: ProgressTracker) => {
        return checkAchievementCondition(userId, condition, userProgress);
      }
    }),
    {
      name: 'achievements-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        achievements: state.achievements,
        userProgress: state.userProgress
      })
    }
  )
);