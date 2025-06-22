// Types for the enhanced learning module

export interface VideoContent {
  id: string;
  url: string;
  title: string;
  description: string;
  duration: number; // in seconds
  thumbnail?: string;
  transcription?: Transcription;
  category: TrainingCategory;
}

export interface Transcription {
  id: string;
  videoId: string;
  text: string;
  segments: TranscriptionSegment[];
  language: string;
  generatedAt: Date;
}

export interface TranscriptionSegment {
  start: number; // timestamp in seconds
  end: number;
  text: string;
  confidence?: number;
}

export interface LearningProgress {
  userId: string;
  videoId: string;
  watchedSeconds: number;
  completed: boolean;
  lastWatchedAt: Date;
  testResults?: TestResult[];
}

export interface TestQuestion {
  id: string;
  type: 'multiple-choice' | 'drag-drop' | 'image-selection' | 'sorting';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  points: number;
  explanation?: string;
  mediaUrl?: string;
}

export interface TestResult {
  id: string;
  userId: string;
  trainingId: string;
  score: number; // percentage
  passed: boolean;
  completedAt: Date;
  answers: TestAnswer[];
  earnedXP: number;
  earnedCoins: number;
}

export interface TestAnswer {
  questionId: string;
  userAnswer: string | string[];
  correct: boolean;
  timeSpent: number; // seconds
}

export interface UserLevel {
  level: number;
  title: string;
  xp: number;
  nextLevelXp: number;
  icon?: string;
}

export interface LevelConfig {
  level: number;
  title: string;
  xp: number;
  rewards?: Reward[];
}

export interface Reward {
  type: 'coins' | 'badge' | 'avatar-item' | 'title';
  value: string | number;
  description: string;
  icon?: string;
}

export interface Avatar {
  id: string;
  userId: string;
  baseModel: string;
  accessories: AvatarAccessory[];
  badges: Badge[];
  level: number;
  title: string;
}

export interface AvatarAccessory {
  id: string;
  type: 'hat' | 'glasses' | 'clothing' | 'background' | 'effect';
  name: string;
  imageUrl: string;
  requiredLevel?: number;
  price?: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
  category: 'achievement' | 'special' | 'milestone';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface LearningEvent {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  targetCoins: number;
  rewards: Reward[];
  participants: EventParticipant[];
}

export interface EventParticipant {
  userId: string;
  progress: number; // coins earned for this event
  claimed: boolean;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  type: 'avatar-item' | 'boost' | 'special';
  price: number;
  imageUrl: string;
  available: boolean;
  limitedTime?: boolean;
  expiresAt?: Date;
}

export interface LootboxAnimation {
  id: string;
  type: 'coins' | 'xp' | 'badge' | 'item';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  reward: Reward;
  animation: 'spin' | 'burst' | 'reveal';
}

export interface TrainingStatistics {
  userId: string;
  totalXP: number;
  totalCoins: number;
  completedTrainings: number;
  perfectScores: number;
  currentStreak: number;
  badges: Badge[];
  averageScore: number;
  totalWatchTime: number; // seconds
}

export interface TeamRanking {
  teamId: string;
  teamName: string;
  totalXP: number;
  averageLevel: number;
  completedTrainings: number;
  members: TeamMember[];
}

export interface TeamMember {
  userId: string;
  name: string;
  avatar: Avatar;
  level: number;
  xp: number;
  contributionPercentage: number;
}

export enum TrainingCategory {
  MANDATORY = 'mandatory',
  DEPARTMENT = 'department',
  BONUS = 'bonus',
  COMPLIANCE = 'compliance',
  SKILLS = 'skills',
  ONBOARDING = 'onboarding'
}

export interface Certificate {
  id: string;
  userId: string;
  trainingId: string;
  issuedAt: Date;
  score: number;
  certificateUrl?: string;
  validUntil?: Date;
}