import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  UserAvatar, 
  Skill, 
  Level, 
  XPEvent, 
  LevelUpEvent,
  calculateLevelFromXP
} from '../types/avatar';
import { checkLevelUps } from './avatar-helpers';
import { createNewUserAvatar, calculateUserStats } from './avatar-actions';
import { processAddXP } from './avatar-xp';

// Helper functions for avatar store actions
const createAvatarActions = (get: any, set: any) => ({
  updateSkill: (userId: string, skillId: string, updates: Partial<Skill>) => {
    set((state: any) => {
      const userAvatar = state.userAvatars[userId];
      if (!userAvatar) return state;

      const updatedSkills = userAvatar.skills.map((skill: Skill) =>
        skill.id === skillId ? { ...skill, ...updates } : skill
      );

      return {
        userAvatars: {
          ...state.userAvatars,
          [userId]: {
            ...userAvatar,
            skills: updatedSkills,
            updatedAt: new Date().toISOString()
          }
        }
      };
    });
  },

  updateTitle: (userId: string, title: string) => {
    set((state: any) => {
      const userAvatar = state.userAvatars[userId];
      if (!userAvatar) return state;
      
      return {
        userAvatars: {
          ...state.userAvatars,
          [userId]: {
            ...userAvatar,
            title,
            updatedAt: new Date().toISOString()
          }
        }
      };
    });
  },

  updateAvatar: (userId: string, avatarConfig: Partial<UserAvatar>) => {
    set((state: any) => {
      const userAvatar = state.userAvatars[userId];
      if (!userAvatar) return state;
      
      return {
        userAvatars: {
          ...state.userAvatars,
          [userId]: {
            ...userAvatar,
            ...avatarConfig,
            updatedAt: new Date().toISOString()
          }
        }
      };
    });
  }
});

const createLevelActions = (get: any, set: any) => ({
  addLevel: (levelData: Omit<Level, 'id'>) => {
    const newLevel: Level = {
      ...levelData,
      id: `level-${Date.now()}`
    };

    set((state: any) => ({
      levels: [...state.levels, newLevel].sort((a, b) => a.levelNumber - b.levelNumber)
    }));
  },

  updateLevel: (levelId: string, updates: Partial<Level>) => {
    set((state: any) => ({
      levels: state.levels.map((level: Level) =>
        level.id === levelId ? { ...level, ...updates } : level
      )
    }));
  },

  deleteLevel: (levelId: string) => {
    set((state: any) => ({
      levels: state.levels.filter((level: Level) => level.id !== levelId)
    }));
  }
});

interface AvatarState {
  // User avatar data
  userAvatars: Record<string, UserAvatar>;
  
  // System configuration
  levels: Level[];
  xpEvents: XPEvent[];
  levelUpEvents: LevelUpEvent[];
  
  // Actions
  getUserAvatar: (userId: string) => UserAvatar | null;
  createUserAvatar: (userId: string) => UserAvatar;
  addXP: (params: { userId: string; skillId: string | null; xpAmount: number; description: string; metadata?: Record<string, any> }) => void;
  updateSkill: (userId: string, skillId: string, updates: Partial<Skill>) => void;
  
  // Level management
  getLevels: () => Level[];
  getLevel: (levelNumber: number) => Level | null;
  addLevel: (level: Omit<Level, 'id'>) => void;
  updateLevel: (levelId: string, updates: Partial<Level>) => void;
  deleteLevel: (levelId: string) => void;
  
  // XP and level calculations
  calculateUserLevel: (userId: string) => number;
  checkLevelUp: (userId: string) => LevelUpEvent[];
  
  // Statistics
  getXPEvents: (userId: string, limit?: number) => XPEvent[];
  getLevelUpEvents: (userId: string, limit?: number) => LevelUpEvent[];
  getUserStats: (userId: string) => {
    totalXP: number;
    level: number;
    skillLevels: Record<string, number>;
    recentEvents: XPEvent[];
  };
  
  // Additional methods
  getAllUserAvatars: () => UserAvatar[];
  getUserSkill: (userId: string, skillId: string) => Skill | undefined;
  updateTitle: (userId: string, title: string) => void;
  updateAvatar: (userId: string, avatarConfig: Partial<UserAvatar>) => void;
}

// Mock default levels
const mockLevels: Level[] = [
  { id: '1', levelNumber: 1, title: 'Neuling', requiredXP: 0, icon: '🌱', color: '#10B981' },
  { id: '2', levelNumber: 2, title: 'Anfänger', requiredXP: 100, icon: '🔰', color: '#3B82F6' },
  { id: '3', levelNumber: 3, title: 'Lernender', requiredXP: 250, icon: '📚', color: '#6366F1' },
  { id: '4', levelNumber: 4, title: 'Fortgeschrittener', requiredXP: 450, icon: '⭐', color: '#8B5CF6' },
  { id: '5', levelNumber: 5, title: 'Explorer', requiredXP: 700, icon: '🧭', color: '#F59E0B' },
  { id: '6', levelNumber: 6, title: 'Spezialist', requiredXP: 1000, icon: '🎯', color: '#EF4444' },
  { id: '7', levelNumber: 7, title: 'Experte', requiredXP: 1350, icon: '💎', color: '#06B6D4' },
  { id: '8', levelNumber: 8, title: 'Meister', requiredXP: 1750, icon: '👑', color: '#8B5CF6' },
  { id: '9', levelNumber: 9, title: 'Profi', requiredXP: 2200, icon: '🏆', color: '#F59E0B' },
  { id: '10', levelNumber: 10, title: 'Sensei', requiredXP: 2700, icon: '🥇', color: '#EF4444' }
];


export const useAvatarStore = create<AvatarState>()(
  persist(
    (set, get) => {
      const avatarActions = createAvatarActions(get, set);
      const levelActions = createLevelActions(get, set);
      
      return {
        userAvatars: {},
        levels: mockLevels,
        xpEvents: [],
        levelUpEvents: [],
        
        getUserAvatar: (userId) => {
          const avatars = get().userAvatars;
          return avatars[userId] || null;
        },

        createUserAvatar: (userId: string) => {
          const newAvatar = createNewUserAvatar(userId);

          set(state => ({
            userAvatars: {
              ...state.userAvatars,
              [userId]: newAvatar
            }
          }));

          return newAvatar;
        },

        addXP: (params: {
          userId: string;
          skillId: string | null | undefined;
          xpAmount: number;
          description: string;
          metadata?: Record<string, any>;
        }) => {
          processAddXP(get, set, params);
        },

        updateSkill: avatarActions.updateSkill,
        updateTitle: avatarActions.updateTitle,
        updateAvatar: avatarActions.updateAvatar,

        getLevels: () => get().levels,

        getLevel: (levelNumber: number) => {
          return get().levels.find(level => level.levelNumber === levelNumber) || null;
        },

        addLevel: levelActions.addLevel,
        updateLevel: levelActions.updateLevel,
        deleteLevel: levelActions.deleteLevel,

        calculateUserLevel: (userId: string) => {
          const userAvatar = get().getUserAvatar(userId);
          if (!userAvatar) return 1;
          
          return calculateLevelFromXP(userAvatar.totalXP);
        },

        checkLevelUp: (userId: string) => {
          const userAvatar = get().getUserAvatar(userId);
          if (!userAvatar) return [];

          return checkLevelUps({
            userAvatar,
            userId,
            now: new Date().toISOString()
          });
        },

        getXPEvents: (userId: string, limit = 10) => {
          return get().xpEvents
            .filter(event => event.userId === userId)
            .slice(0, limit);
        },

        getLevelUpEvents: (userId: string, limit = 5) => {
          return get().levelUpEvents
            .filter(event => event.userId === userId)
            .slice(0, limit);
        },

        getUserStats: (userId: string) => {
          const userAvatar = get().getUserAvatar(userId);
          const xpEvents = get().getXPEvents(userId, 5);
          
          return calculateUserStats(userAvatar, xpEvents);
        },
        
        getAllUserAvatars: () => {
          return Object.values(get().userAvatars);
        },
        
        getUserSkill: (userId: string, skillId: string) => {
          const userAvatar = get().getUserAvatar(userId);
          if (!userAvatar) return undefined;
          return userAvatar.skills.find(skill => skill.id === skillId);
        }
      };
    },
    {
      name: 'avatar-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        userAvatars: state.userAvatars,
        levels: state.levels,
        xpEvents: state.xpEvents.slice(0, 100), // Keep only recent events
        levelUpEvents: state.levelUpEvents.slice(0, 50)
      })
    }
  )
);