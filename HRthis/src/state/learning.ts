import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  VideoContent, 
  LearningProgress, 
  TestResult, 
  UserLevel, 
  Avatar, 
  Badge, 
  TrainingStatistics,
  LevelConfig,
  TrainingCategory,
  TestQuestion,
  AvatarAccessory,
  ShopItem,
  LearningEvent
} from '../types/learning';

// Level configuration
const LEVEL_CONFIGS: LevelConfig[] = [
  { level: 1, title: "Newcomer", xp: 0 },
  { level: 2, title: "Beginner", xp: 50 },
  { level: 3, title: "Schulungs-Kid", xp: 150 },
  { level: 4, title: "Knowledge Seeker", xp: 300 },
  { level: 5, title: "Certified Champ", xp: 500 },
  { level: 6, title: "Expert Learner", xp: 750 },
  { level: 7, title: "Master Student", xp: 1000 },
  { level: 8, title: "Team Brain", xp: 1500 },
  { level: 9, title: "Wisdom Keeper", xp: 2000 },
  { level: 10, title: "Legend", xp: 3000 }
];

// Mock video content
const mockVideos: VideoContent[] = [
  {
    id: 'video1',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'Datenschutz Grundlagen',
    description: 'Lernen Sie die wichtigsten DSGVO-Richtlinien kennen',
    duration: 600,
    category: TrainingCategory.COMPLIANCE,
    transcription: {
      id: 'trans1',
      videoId: 'video1',
      text: 'Willkommen zur Datenschutz-Schulung...',
      segments: [
        { start: 0, end: 5, text: 'Willkommen zur Datenschutz-Schulung.' },
        { start: 5, end: 10, text: 'Heute lernen wir die Grundlagen der DSGVO.' }
      ],
      language: 'de',
      generatedAt: new Date()
    }
  },
  {
    id: 'video2',
    url: 'https://www.youtube.com/watch?v=abc123',
    title: 'Arbeitssicherheit im Büro',
    description: 'Ergonomie und Sicherheit am Arbeitsplatz',
    duration: 480,
    category: TrainingCategory.MANDATORY
  }
];

// Mock test questions
const mockQuestions: Record<string, TestQuestion[]> = {
  'video1': [
    {
      id: 'q1',
      type: 'multiple-choice',
      question: 'Was ist der Hauptzweck der DSGVO?',
      options: [
        'Datenschutz für Unternehmen',
        'Schutz personenbezogener Daten',
        'Verkauf von Daten',
        'Datenspeicherung'
      ],
      correctAnswer: 'Schutz personenbezogener Daten',
      points: 10,
      explanation: 'Die DSGVO schützt die personenbezogenen Daten von EU-Bürgern.'
    },
    {
      id: 'q2',
      type: 'multiple-choice',
      question: 'Wie lange dürfen personenbezogene Daten maximal gespeichert werden?',
      options: [
        'Unbegrenzt',
        'Nur solange notwendig',
        '10 Jahre',
        '1 Jahr'
      ],
      correctAnswer: 'Nur solange notwendig',
      points: 10
    }
  ]
};

// Mock badges
const availableBadges: Badge[] = [
  {
    id: 'perfect-score',
    name: 'Perfektionist',
    description: '100% in einem Test erreicht',
    icon: '🎯',
    earnedAt: new Date(),
    category: 'achievement',
    rarity: 'rare'
  },
  {
    id: 'early-bird',
    name: 'Frühaufsteher',
    description: 'Erste Schulung vor 8 Uhr',
    icon: '🌅',
    earnedAt: new Date(),
    category: 'special',
    rarity: 'common'
  },
  {
    id: 'week-warrior',
    name: 'Wochenheld',
    description: '5 Schulungen in einer Woche',
    icon: '💪',
    earnedAt: new Date(),
    category: 'milestone',
    rarity: 'epic'
  }
];

// Mock avatar accessories
const mockAccessories: AvatarAccessory[] = [
  {
    id: 'glasses1',
    type: 'glasses',
    name: 'Nerd-Brille',
    imageUrl: '/avatars/glasses/nerd.png',
    price: 100
  },
  {
    id: 'hat1',
    type: 'hat',
    name: 'Absolventenhut',
    imageUrl: '/avatars/hats/graduation.png',
    requiredLevel: 5
  },
  {
    id: 'effect1',
    type: 'effect',
    name: 'Goldener Schein',
    imageUrl: '/avatars/effects/golden-glow.png',
    price: 500
  }
];

// Mock shop items
const mockShopItems: ShopItem[] = [
  {
    id: 'shop1',
    name: 'XP Boost (1 Tag)',
    description: 'Verdoppelt deine XP für 24 Stunden',
    type: 'boost',
    price: 200,
    imageUrl: '/shop/xp-boost.png',
    available: true
  },
  {
    id: 'shop2',
    name: 'Legendäre Lootbox',
    description: 'Enthält garantiert ein episches oder legendäres Item',
    type: 'special',
    price: 1000,
    imageUrl: '/shop/legendary-box.png',
    available: true,
    limitedTime: true,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  }
];

interface LearningState {
  // Video content
  videos: VideoContent[];
  currentVideo: VideoContent | null;
  
  // User progress
  userProgress: Record<string, LearningProgress>;
  testResults: TestResult[];
  
  // Gamification
  userStats: TrainingStatistics | null;
  userLevel: UserLevel | null;
  userAvatar: Avatar | null;
  userBadges: Badge[];
  userCoins: number;
  
  // Shop & Items
  shopItems: ShopItem[];
  ownedItems: string[];
  
  // Events
  activeEvents: LearningEvent[];
  
  // Questions
  testQuestions: Record<string, TestQuestion[]>;
  
  // Actions
  loadVideos: () => void;
  selectVideo: (videoId: string) => void;
  updateProgress: (videoId: string, watchedSeconds: number) => void;
  completeVideo: (videoId: string) => void;
  submitTestResult: (result: TestResult) => void;
  calculateLevel: (xp: number) => UserLevel;
  addXP: (amount: number) => void;
  addCoins: (amount: number) => void;
  awardBadge: (badgeId: string) => void;
  purchaseItem: (itemId: string) => boolean;
  equipAccessory: (accessoryId: string) => void;
  getVideoQuestions: (videoId: string) => TestQuestion[];
  getUserStatistics: (userId: string) => TrainingStatistics;
}

export const useLearningStore = create<LearningState>()(
  persist(
    (set, get) => ({
      videos: mockVideos,
      currentVideo: null,
      userProgress: {},
      testResults: [],
      userStats: null,
      userLevel: { level: 1, title: 'Newcomer', xp: 0, nextLevelXp: 50 },
      userAvatar: {
        id: 'avatar1',
        userId: 'user1',
        baseModel: 'default',
        accessories: [],
        badges: [],
        level: 1,
        title: 'Newcomer'
      },
      userBadges: [],
      userCoins: 0,
      shopItems: mockShopItems,
      ownedItems: [],
      activeEvents: [],
      testQuestions: mockQuestions,

      loadVideos: () => {
        // In production, this would fetch from API
        set({ videos: mockVideos });
      },

      selectVideo: (videoId: string) => {
        const video = get().videos.find(v => v.id === videoId);
        set({ currentVideo: video || null });
      },

      updateProgress: (videoId: string, watchedSeconds: number) => {
        const progress = get().userProgress;
        const video = get().videos.find(v => v.id === videoId);
        
        if (!video) return;

        const currentProgress = progress[videoId] || {
          userId: 'user1',
          videoId,
          watchedSeconds: 0,
          completed: false,
          lastWatchedAt: new Date()
        };

        const newProgress = {
          ...currentProgress,
          watchedSeconds,
          lastWatchedAt: new Date(),
          completed: watchedSeconds >= video.duration * 0.9 // 90% watched = completed
        };

        set({
          userProgress: {
            ...progress,
            [videoId]: newProgress
          }
        });

        // Award XP for completion
        if (newProgress.completed && !currentProgress.completed) {
          get().addXP(50);
          get().addCoins(10);
        }
      },

      completeVideo: (videoId: string) => {
        get().updateProgress(videoId, get().videos.find(v => v.id === videoId)?.duration || 0);
      },

      submitTestResult: (result: TestResult) => {
        set(state => ({
          testResults: [...state.testResults, result]
        }));

        // Award XP and coins based on score
        const baseXP = 100;
        const xpMultiplier = result.score / 100;
        const earnedXP = Math.floor(baseXP * xpMultiplier);
        
        get().addXP(earnedXP);
        get().addCoins(Math.floor(earnedXP / 5));

        // Check for perfect score badge
        if (result.score === 100) {
          get().awardBadge('perfect-score');
        }
      },

      calculateLevel: (xp: number) => {
        let currentLevel = LEVEL_CONFIGS[0];
        let nextLevel = LEVEL_CONFIGS[1];

        for (let i = 0; i < LEVEL_CONFIGS.length; i++) {
          if (xp >= LEVEL_CONFIGS[i].xp) {
            currentLevel = LEVEL_CONFIGS[i];
            nextLevel = LEVEL_CONFIGS[i + 1] || currentLevel;
          }
        }

        return {
          level: currentLevel.level,
          title: currentLevel.title,
          xp: xp,
          nextLevelXp: nextLevel.xp
        };
      },

      addXP: (amount: number) => {
        const currentLevel = get().userLevel;
        const newXP = (currentLevel?.xp || 0) + amount;
        const newLevel = get().calculateLevel(newXP);

        set({
          userLevel: newLevel
        });

        // Update avatar level
        set(state => ({
          userAvatar: state.userAvatar ? {
            ...state.userAvatar,
            level: newLevel.level,
            title: newLevel.title
          } : null
        }));
      },

      addCoins: (amount: number) => {
        set(state => ({
          userCoins: state.userCoins + amount
        }));
      },

      awardBadge: (badgeId: string) => {
        const badge = availableBadges.find(b => b.id === badgeId);
        if (!badge) return;

        const hasBadge = get().userBadges.some(b => b.id === badgeId);
        if (!hasBadge) {
          set(state => ({
            userBadges: [...state.userBadges, badge]
          }));
        }
      },

      purchaseItem: (itemId: string) => {
        const item = get().shopItems.find(i => i.id === itemId);
        if (!item) return false;

        if (get().userCoins < item.price) return false;

        set(state => ({
          userCoins: state.userCoins - item.price,
          ownedItems: [...state.ownedItems, itemId]
        }));

        return true;
      },

      equipAccessory: (accessoryId: string) => {
        const accessory = mockAccessories.find(a => a.id === accessoryId);
        if (!accessory) return;

        set(state => ({
          userAvatar: state.userAvatar ? {
            ...state.userAvatar,
            accessories: [...state.userAvatar.accessories, accessory]
          } : null
        }));
      },

      getVideoQuestions: (videoId: string) => {
        return get().testQuestions[videoId] || [];
      },

      getUserStatistics: (userId: string) => {
        const progress = Object.values(get().userProgress);
        const results = get().testResults;
        const level = get().userLevel;

        const completedTrainings = progress.filter(p => p.completed).length;
        const perfectScores = results.filter(r => r.score === 100).length;
        const totalWatchTime = progress.reduce((acc, p) => acc + p.watchedSeconds, 0);
        const averageScore = results.length > 0 
          ? results.reduce((acc, r) => acc + r.score, 0) / results.length 
          : 0;

        return {
          userId,
          totalXP: level?.xp || 0,
          totalCoins: get().userCoins,
          completedTrainings,
          perfectScores,
          currentStreak: 0, // TODO: Implement streak logic
          badges: get().userBadges,
          averageScore,
          totalWatchTime
        };
      }
    }),
    {
      name: 'learning-storage'
    }
  )
);