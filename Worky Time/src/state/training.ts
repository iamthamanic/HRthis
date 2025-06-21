import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  Training, 
  TrainingLesson, 
  TrainingProgress, 
  TrainingAttempt, 
  TrainingCertificate,
  AIGenerationRequest,
  AIGeneratedContent
} from '../types/training';

interface TrainingState {
  trainings: Training[];
  lessons: TrainingLesson[];
  progress: TrainingProgress[];
  attempts: TrainingAttempt[];
  certificates: TrainingCertificate[];
  isLoading: boolean;
  
  // Training Management
  createTraining: (training: Omit<Training, 'id' | 'createdAt'>) => Promise<void>;
  updateTraining: (id: string, updates: Partial<Training>) => void;
  deleteTraining: (id: string) => void;
  getTrainingById: (id: string) => Training | undefined;
  getTrainingsForUser: (userId: string) => Training[];
  
  // Lesson Management
  addLesson: (lesson: Omit<TrainingLesson, 'id'>) => void;
  updateLesson: (id: string, updates: Partial<TrainingLesson>) => void;
  deleteLesson: (id: string) => void;
  getLessonsForTraining: (trainingId: string) => TrainingLesson[];
  
  // Progress Tracking
  getUserProgress: (userId: string, trainingId: string) => TrainingProgress | undefined;
  updateProgress: (userId: string, trainingId: string, updates: Partial<TrainingProgress>) => void;
  startTraining: (userId: string, trainingId: string) => void;
  completeLesson: (userId: string, trainingId: string, lessonId: string) => void;
  completeTraining: (userId: string, trainingId: string, finalScore: number) => void;
  
  // Quiz Management
  submitQuizAttempt: (attempt: Omit<TrainingAttempt, 'id'>) => void;
  getUserAttempts: (userId: string, quizId: string) => TrainingAttempt[];
  
  // AI Generation
  generateTrainingContent: (request: AIGenerationRequest) => Promise<AIGeneratedContent>;
  
  // Manager Functions
  getTeamProgress: (userIds: string[]) => TrainingProgress[];
  getTrainingStatistics: (trainingId: string) => {
    totalUsers: number;
    completed: number;
    inProgress: number;
    notStarted: number;
    averageScore: number;
  };
}

// Mock data
const mockTrainings: Training[] = [
  {
    id: '1',
    title: 'Datenschutz und DSGVO Grundlagen',
    description: 'Pflichtschulung zu Datenschutz-Grundlagen und DSGVO-Compliance für alle Mitarbeiter',
    targetAudience: 'ALL',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    isActive: true,
    isMandatory: true,
    createdBy: '2',
    createdAt: '2024-01-01T10:00:00Z',
    estimatedDuration: 45,
    category: 'COMPLIANCE'
  },
  {
    id: '2',
    title: 'Onboarding Programm',
    description: 'Umfassendes Einführungsprogramm für neue Mitarbeiter',
    targetAudience: 'SPECIFIC_USERS',
    targetUserIds: ['1'],
    startDate: '2024-12-01',
    isActive: true,
    isMandatory: true,
    createdBy: '2',
    createdAt: '2024-11-15T14:00:00Z',
    estimatedDuration: 120,
    category: 'ONBOARDING'
  },
  {
    id: '3',
    title: 'Microsoft Office 365 Schulung',
    description: 'Erweiterte Funktionen von Office 365 für effizienteres Arbeiten',
    targetAudience: 'DEPARTMENT',
    targetDepartments: ['IT', 'Administration'],
    startDate: '2024-11-01',
    endDate: '2025-01-31',
    isActive: true,
    isMandatory: false,
    createdBy: '2',
    createdAt: '2024-10-15T09:00:00Z',
    estimatedDuration: 90,
    category: 'SKILLS'
  }
];

const mockLessons: TrainingLesson[] = [
  {
    id: '1',
    trainingId: '1',
    title: 'Was ist Datenschutz?',
    description: 'Grundlagen des Datenschutzes und warum er wichtig ist',
    order: 1,
    content: [
      {
        id: '1',
        type: 'TEXT',
        title: 'Einführung',
        content: 'Datenschutz betrifft uns alle und ist ein Grundrecht...',
        order: 1
      }
    ],
    quiz: {
      id: 'quiz1',
      lessonId: '1',
      questions: [
        {
          id: 'q1',
          question: 'Was bedeutet DSGVO?',
          options: [
            'Datenschutz-Grundverordnung',
            'Deutsche Sicherheits-Grundverordnung',
            'Digitale Schutz-Grundverordnung',
            'Daten-Sicherheits-Grundverordnung'
          ],
          correctAnswer: 0,
          explanation: 'DSGVO steht für Datenschutz-Grundverordnung, die europäische Verordnung zum Schutz personenbezogener Daten.'
        }
      ],
      passingScore: 80,
      maxAttempts: 3
    },
    isRequired: true
  },
  {
    id: '2',
    trainingId: '2',
    title: 'Willkommen bei WorkyTime',
    description: 'Erste Schritte und Orientierung im Unternehmen',
    order: 1,
    content: [
      {
        id: '2',
        type: 'TEXT',
        title: 'Unternehmenswerte',
        content: 'Willkommen bei WorkyTime! Unsere Werte sind...',
        order: 1
      }
    ],
    isRequired: true
  }
];

const mockProgress: TrainingProgress[] = [
  {
    id: '1',
    userId: '1',
    trainingId: '1',
    status: 'IN_PROGRESS',
    currentLessonId: '1',
    completedLessons: [],
    startedAt: '2024-12-15T10:00:00Z',
    lastActivityAt: '2024-12-15T10:30:00Z'
  },
  {
    id: '2',
    userId: '1',
    trainingId: '2',
    status: 'NOT_STARTED',
    completedLessons: []
  }
];

export const useTrainingStore = create<TrainingState>()(
  persist(
    (set, get) => ({
      trainings: mockTrainings,
      lessons: mockLessons,
      progress: mockProgress,
      attempts: [],
      certificates: [],
      isLoading: false,

      createTraining: async (trainingData) => {
        set({ isLoading: true });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const newTraining: Training = {
            ...trainingData,
            id: Date.now().toString(),
            createdAt: new Date().toISOString()
          };
          
          set(state => ({
            trainings: [...state.trainings, newTraining],
            isLoading: false
          }));
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      updateTraining: (id: string, updates: Partial<Training>) => {
        set(state => ({
          trainings: state.trainings.map(training =>
            training.id === id ? { ...training, ...updates } : training
          )
        }));
      },

      deleteTraining: (id: string) => {
        set(state => ({
          trainings: state.trainings.filter(training => training.id !== id),
          lessons: state.lessons.filter(lesson => lesson.trainingId !== id),
          progress: state.progress.filter(progress => progress.trainingId !== id)
        }));
      },

      getTrainingById: (id: string) => {
        return get().trainings.find(training => training.id === id);
      },

      getTrainingsForUser: (userId: string) => {
        const { trainings } = get();
        return trainings.filter(training => {
          if (!training.isActive) return false;
          
          switch (training.targetAudience) {
            case 'ALL':
              return true;
            case 'SPECIFIC_USERS':
              return training.targetUserIds?.includes(userId) || false;
            case 'DEPARTMENT':
              // In real app, would check user's department
              return true;
            default:
              return false;
          }
        });
      },

      addLesson: (lessonData) => {
        const newLesson: TrainingLesson = {
          ...lessonData,
          id: Date.now().toString()
        };
        
        set(state => ({
          lessons: [...state.lessons, newLesson]
        }));
      },

      updateLesson: (id: string, updates: Partial<TrainingLesson>) => {
        set(state => ({
          lessons: state.lessons.map(lesson =>
            lesson.id === id ? { ...lesson, ...updates } : lesson
          )
        }));
      },

      deleteLesson: (id: string) => {
        set(state => ({
          lessons: state.lessons.filter(lesson => lesson.id !== id)
        }));
      },

      getLessonsForTraining: (trainingId: string) => {
        return get().lessons
          .filter(lesson => lesson.trainingId === trainingId)
          .sort((a, b) => a.order - b.order);
      },

      getUserProgress: (userId: string, trainingId: string) => {
        return get().progress.find(p => p.userId === userId && p.trainingId === trainingId);
      },

      updateProgress: (userId: string, trainingId: string, updates: Partial<TrainingProgress>) => {
        set(state => ({
          progress: state.progress.map(progress =>
            progress.userId === userId && progress.trainingId === trainingId
              ? { ...progress, ...updates, lastActivityAt: new Date().toISOString() }
              : progress
          )
        }));
      },

      startTraining: (userId: string, trainingId: string) => {
        const existingProgress = get().getUserProgress(userId, trainingId);
        
        if (!existingProgress) {
          const newProgress: TrainingProgress = {
            id: Date.now().toString(),
            userId,
            trainingId,
            status: 'IN_PROGRESS',
            completedLessons: [],
            startedAt: new Date().toISOString(),
            lastActivityAt: new Date().toISOString()
          };
          
          set(state => ({
            progress: [...state.progress, newProgress]
          }));
        } else {
          get().updateProgress(userId, trainingId, { status: 'IN_PROGRESS' });
        }
      },

      completeLesson: (userId: string, trainingId: string, lessonId: string) => {
        const progress = get().getUserProgress(userId, trainingId);
        if (!progress) return;
        
        const completedLessons = [...progress.completedLessons];
        if (!completedLessons.includes(lessonId)) {
          completedLessons.push(lessonId);
        }
        
        get().updateProgress(userId, trainingId, {
          completedLessons,
          currentLessonId: lessonId
        });
      },

      completeTraining: (userId: string, trainingId: string, finalScore: number) => {
        get().updateProgress(userId, trainingId, {
          status: finalScore >= 70 ? 'COMPLETED' : 'FAILED',
          finalScore,
          completedAt: new Date().toISOString()
        });
      },

      submitQuizAttempt: (attemptData) => {
        const newAttempt: TrainingAttempt = {
          ...attemptData,
          id: Date.now().toString()
        };
        
        set(state => ({
          attempts: [...state.attempts, newAttempt]
        }));
      },

      getUserAttempts: (userId: string, quizId: string) => {
        return get().attempts.filter(attempt => 
          attempt.userId === userId && attempt.quizId === quizId
        ).sort((a, b) => b.attemptNumber - a.attemptNumber);
      },

      generateTrainingContent: async (request: AIGenerationRequest) => {
        set({ isLoading: true });
        
        try {
          // Import AI service dynamically to avoid circular dependencies
          const { generateTrainingContent } = await import('../api/training-ai');
          const generatedContent = await generateTrainingContent(request);
          
          set({ isLoading: false });
          return generatedContent;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      getTeamProgress: (userIds: string[]) => {
        return get().progress.filter(progress => userIds.includes(progress.userId));
      },

      getTrainingStatistics: (trainingId: string) => {
        const { progress } = get();
        const trainingProgress = progress.filter(p => p.trainingId === trainingId);
        
        const completed = trainingProgress.filter(p => p.status === 'COMPLETED').length;
        const inProgress = trainingProgress.filter(p => p.status === 'IN_PROGRESS').length;
        const failed = trainingProgress.filter(p => p.status === 'FAILED').length;
        const notStarted = trainingProgress.filter(p => p.status === 'NOT_STARTED').length;
        
        const scoresSum = trainingProgress
          .filter(p => p.finalScore !== undefined)
          .reduce((sum, p) => sum + (p.finalScore || 0), 0);
        const scoresCount = trainingProgress.filter(p => p.finalScore !== undefined).length;
        
        return {
          totalUsers: trainingProgress.length,
          completed,
          inProgress,
          notStarted: notStarted + failed, // Count failed as not started for simplicity
          averageScore: scoresCount > 0 ? scoresSum / scoresCount : 0
        };
      }
    }),
    {
      name: 'training-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        trainings: state.trainings,
        lessons: state.lessons,
        progress: state.progress,
        attempts: state.attempts,
        certificates: state.certificates
      }),
    }
  )
);