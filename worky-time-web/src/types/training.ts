export interface Training {
  id: string;
  title: string;
  description: string;
  targetAudience: 'ALL' | 'DEPARTMENT' | 'SPECIFIC_USERS';
  targetDepartments?: string[];
  targetUserIds?: string[];
  startDate: string;
  endDate?: string;
  isActive: boolean;
  isMandatory: boolean;
  createdBy: string;
  createdAt: string;
  estimatedDuration: number; // in minutes
  category: 'ONBOARDING' | 'COMPLIANCE' | 'SKILLS' | 'SAFETY' | 'OTHER';
}

export interface TrainingLesson {
  id: string;
  trainingId: string;
  title: string;
  description: string;
  order: number;
  content: TrainingContent[];
  quiz?: TrainingQuiz;
  isRequired: boolean;
}

export interface TrainingContent {
  id: string;
  type: 'TEXT' | 'PDF' | 'VIDEO' | 'LINK';
  title: string;
  content: string; // text content or file URL or link URL
  order: number;
}

export interface TrainingQuiz {
  id: string;
  lessonId: string;
  questions: TrainingQuestion[];
  passingScore: number; // percentage (0-100)
  maxAttempts: number;
}

export interface TrainingQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index of correct option
  explanation?: string;
}

export interface TrainingProgress {
  id: string;
  userId: string;
  trainingId: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  currentLessonId?: string;
  completedLessons: string[];
  startedAt?: string;
  completedAt?: string;
  lastActivityAt?: string;
  finalScore?: number;
}

export interface TrainingAttempt {
  id: string;
  userId: string;
  quizId: string;
  answers: number[]; // array of selected answer indices
  score: number;
  passed: boolean;
  attemptNumber: number;
  completedAt: string;
}

export interface TrainingCertificate {
  id: string;
  userId: string;
  trainingId: string;
  issuedAt: string;
  certificateUrl: string;
  expiresAt?: string;
}

export interface TrainingNotification {
  id: string;
  userId: string;
  trainingId: string;
  type: 'NEW_TRAINING' | 'REMINDER' | 'DEADLINE_APPROACHING' | 'COMPLETED' | 'FAILED';
  sentAt: string;
  isRead: boolean;
}

export interface TrainingTemplate {
  id: string;
  title: string;
  description: string;
  category: Training['category'];
  estimatedDuration: number;
  lessons: Omit<TrainingLesson, 'id' | 'trainingId'>[];
}

export interface AIGenerationRequest {
  topic: string;
  description: string;
  targetAudience: string;
  duration: number; // in minutes
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  includeQuiz: boolean;
  lessonCount: number;
}

export interface AIGeneratedContent {
  title: string;
  description: string;
  lessons: {
    title: string;
    description: string;
    content: string;
    quiz?: {
      questions: {
        question: string;
        options: string[];
        correctAnswer: number;
        explanation: string;
      }[];
      passingScore: number;
    };
  }[];
  finalQuiz?: {
    questions: {
      question: string;
      options: string[];
      correctAnswer: number;
      explanation: string;
    }[];
    passingScore: number;
  };
}