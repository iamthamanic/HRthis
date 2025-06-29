import { Achievement } from '../../types/gamification';

export const CATEGORIES = [
  { id: 'all', name: 'Alle', icon: '🏆' },
  { id: 'learning', name: 'Lernen', icon: '🎓' },
  { id: 'attendance', name: 'Anwesenheit', icon: '⏰' },
  { id: 'engagement', name: 'Engagement', icon: '💪' },
  { id: 'milestone', name: 'Meilensteine', icon: '🎯' },
  { id: 'special', name: 'Spezial', icon: '⭐' }
];

export const filterAchievements = (
  achievements: Achievement[],
  selectedCategory: string,
  showLocked: boolean,
  unlockedAchievementIds: string[]
): Achievement[] => {
  return achievements.filter(achievement => {
    // Category filter
    if (selectedCategory !== 'all' && achievement.category !== selectedCategory) {
      return false;
    }
    
    // Lock filter
    if (!showLocked && !unlockedAchievementIds.includes(achievement.id)) {
      return false;
    }
    
    return true;
  });
};

export const getCategoryCount = (
  achievements: Achievement[],
  categoryId: string
): number => {
  if (categoryId === 'all') {
    return achievements.length;
  }
  return achievements.filter(a => a.category === categoryId).length;
};