import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  UserAvatar, 
  Skill, 
  Level, 
  XPEvent, 
  LevelUpEvent,
  DEFAULT_SKILLS,
  calculateXPProgress,
  calculateLevelFromXP
} from '../types/avatar';

interface AvatarState {
  // User avatar data
  userAvatars: Record<string, UserAvatar>;
  
  // System configuration
  levels: Level[];
  xpEvents: XPEvent[];
  levelUpEvents: LevelUpEvent[];
  
  // Actions
  getUserAvatar: (_userId: string) => UserAvatar | null;
  createUserAvatar: (_userId: string) => UserAvatar;
  addXP: (_userId: string, _skillId: string | null, _xpAmount: number, _description: string, _metadata?: Record<string, any>) => void;
  updateSkill: (_userId: string, _skillId: string, _updates: Partial<Skill>) => void;
  
  // Level management
  getLevels: () => Level[];
  getLevel: (_levelNumber: number) => Level | null;
  addLevel: (level: Omit<Level, 'id'>) => void;
  updateLevel: (_levelId: string, _updates: Partial<Level>) => void;
  deleteLevel: (_levelId: string) => void;
  
  // XP and level calculations
  calculateUserLevel: (_userId: string) => number;
  checkLevelUp: (_userId: string) => LevelUpEvent[];
  
  // Statistics
  getXPEvents: (_userId: string, _limit?: number) => XPEvent[];
  getLevelUpEvents: (_userId: string, _limit?: number) => LevelUpEvent[];
  getUserStats: (_userId: string) => {
    totalXP: number;
    level: number;
    skillLevels: Record<string, number>;
    recentEvents: XPEvent[];
  };
  
  // Additional methods
  getAllUserAvatars: () => UserAvatar[];
  getUserSkill: (_userId: string, _skillId: string) => Skill | undefined;
  updateTitle: (_userId: string, _title: string) => void;
  updateAvatar: (_userId: string, _avatarConfig: Partial<UserAvatar>) => void;
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

// Helper function to calculate new level based on XP
const calculateLevel = (totalXP: number, levels: Level[]): number => {
  for (let i = levels.length - 1; i >= 0; i--) {
    if (totalXP >= levels[i].requiredXP) {
      return levels[i].level;
    }
  }
  return 1;
};


// Helper function to update skill XP and level
const updateSkillXP = (skill: Skill, xpAmount: number, levels: Level[]): Skill => {
  const newTotalXP = skill.totalXP + xpAmount;
  const newLevel = calculateLevel(newTotalXP, levels);
  const newCurrentXP = newTotalXP - (levels.find(l => l.level === newLevel)?.requiredXP || 0);
  
  return {
    ...skill,
    currentXP: newCurrentXP,
    totalXP: newTotalXP,
    level: newLevel
  };
};

export const useAvatarStore = create<AvatarState>()(
  persist(
    (set, get) => ({
      userAvatars: {},
      levels: mockLevels,
      xpEvents: [],
      levelUpEvents: [],
      
      getUserAvatar: (userId) => {
        const avatars = get().userAvatars;
        return avatars[userId] || null;
      },

      createUserAvatar: (_userId: string) => {
        const now = new Date().toISOString();
        
        // Create default skills with 0 XP
        const skills: Skill[] = DEFAULT_SKILLS.map(skillTemplate => ({
          ...skillTemplate,
          currentXP: 0,
          level: 1,
          totalXP: 0
        }));

        const newAvatar: UserAvatar = {
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

        set(state => ({
          userAvatars: {
            ...state.userAvatars,
            [userId]: newAvatar
          }
        }));

        return newAvatar;
      },

      addXP: (_userId: string, _skillId: string | null | undefined, _xpAmount: number, _description: string, metadata = {}) => {
        const now = new Date().toISOString();
        let userAvatar = get().getUserAvatar(userId);
        
        // Create avatar if it doesn't exist
        if (!userAvatar) {
          userAvatar = get().createUserAvatar(userId);
        }

        // Create XP event
        const xpEvent: XPEvent = {
          id: `${userId}-${Date.now()}`,
          userId,
          type: metadata.type || 'manual',
          skillId: skillId || undefined,
          xpAmount,
          description,
          metadata,
          createdAt: now
        };

        set(state => {
          const updatedAvatar = { ...state.userAvatars[userId] };
          
          // Add to total XP
          updatedAvatar.totalXP += xpAmount;
          
          // Update specific skill if provided
          if (skillId) {
            updatedAvatar.skills = updatedAvatar.skills.map(skill => {
              if (skill.id === skillId) {
                return updateSkillXP(skill, xpAmount, state.levels);
              }
              return skill;
            });
          }
          
          // Update overall level progress  
          updatedAvatar.level = calculateLevel(updatedAvatar.totalXP, state.levels);
          const overallProgress = calculateXPProgress(updatedAvatar.totalXP);
          updatedAvatar.currentLevelXP = overallProgress.currentLevelXP;
          updatedAvatar.nextLevelXP = overallProgress.nextLevelXP;
          updatedAvatar.lastActiveAt = now;
          updatedAvatar.updatedAt = now;

          return {
            userAvatars: {
              ...state.userAvatars,
              [userId]: updatedAvatar
            },
            xpEvents: [xpEvent, ...state.xpEvents]
          };
        });

        // Check for level ups
        get().checkLevelUp(userId);
      },

      updateSkill: (_userId: string, _skillId: string, _updates: Partial<Skill>) => {
        set(state => {
          const userAvatar = state.userAvatars[userId];
          if (!userAvatar) return state;

          const updatedSkills = userAvatar.skills.map(skill =>
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

      getLevels: () => get().levels,

      getLevel: (_levelNumber: number) => {
        return get().levels.find(level => level.levelNumber === levelNumber) || null;
      },

      addLevel: (_levelData: Omit<Level, 'id'>) => {
        const newLevel: Level = {
          ...levelData,
          id: `level-${Date.now()}`
        };

        set(_state => ({
          levels: [...state.levels, newLevel].sort((a, b) => a.levelNumber - b.levelNumber)
        }));
      },

      updateLevel: (_levelId: string, _updates: Partial<Level>) => {
        set(state => ({
          levels: state.levels.map(level =>
            level.id === levelId ? { ...level, ...updates } : level
          )
        }));
      },

      deleteLevel: (_levelId: string) => {
        set(state => ({
          levels: state.levels.filter(level => level.id !== levelId)
        }));
      },

      calculateUserLevel: (_userId: string) => {
        const userAvatar = get().getUserAvatar(userId);
        if (!userAvatar) return 1;
        
        return calculateLevelFromXP(userAvatar.totalXP);
      },

      checkLevelUp: (_userId: string) => {
        const userAvatar = get().getUserAvatar(userId);
        if (!userAvatar) return [];

        const levelUpEvents: LevelUpEvent[] = [];
        const now = new Date().toISOString();

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

        if (levelUpEvents.length > 0) {
          set(state => ({
            levelUpEvents: [...levelUpEvents, ...state.levelUpEvents]
          }));
        }

        return levelUpEvents;
      },

      getXPEvents: (_userId: string, limit = 10) => {
        return get().xpEvents
          .filter(event => event.userId === userId)
          .slice(0, limit);
      },

      getLevelUpEvents: (_userId: string, limit = 5) => {
        return get().levelUpEvents
          .filter(event => event.userId === userId)
          .slice(0, limit);
      },

      getUserStats: (_userId: string) => {
        const userAvatar = get().getUserAvatar(userId);
        const xpEvents = get().getXPEvents(userId, 5);
        
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
      },
      
      getAllUserAvatars: () => {
        return Object.values(get().userAvatars);
      },
      
      getUserSkill: (_userId: string, _skillId: string) => {
        const userAvatar = get().getUserAvatar(userId);
        if (!userAvatar) return undefined;
        return userAvatar.skills.find(skill => skill.id === skillId);
      },
      
      updateTitle: (userId: string, title: string) => {
        set(state => {
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
        set(state => {
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
    }),
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