import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { TimeRecord } from '../types';

interface TimeRecordsState {
  timeRecords: TimeRecord[];
  isLoading: boolean;
  currentlyTracking: { [userId: string]: { timeIn: string; startTime: number } | null };
  getTimeRecords: (userId: string) => TimeRecord[];
  getAllTimeRecords: () => TimeRecord[];
  getTimeRecordsForPeriod: (userId: string, startDate: string, endDate: string) => TimeRecord[];
  getMonthlyStats: (userId: string, month: number, year: number) => { totalHours: number; totalDays: number };
  getWeeklyStats: (userId: string) => { totalHours: number; totalDays: number };
  getTodayRecord: (userId: string) => TimeRecord | null;
  isCurrentlyTracking: (userId: string) => boolean;
  clockIn: (userId: string) => Promise<void>;
  clockOut: (userId: string, breakMinutes?: number) => Promise<void>;
  addTimeRecord: (record: Omit<TimeRecord, 'id'>) => Promise<void>;
  updateTimeRecord: (recordId: string, updates: Partial<TimeRecord>) => Promise<void>;
  deleteTimeRecord: (recordId: string) => Promise<void>;
  setTimeRecords: (records: TimeRecord[]) => void;
}

// Mock data - simulating data from Timerecording.de API
const generateMockTimeRecords = (userId: string): TimeRecord[] => {
  const records: TimeRecord[] = [];
  const today = new Date();
  
  // Generate records for the last 30 days
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    
    const timeIn = new Date(date);
    timeIn.setHours(8 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60));
    
    const timeOut = new Date(timeIn);
    timeOut.setHours(timeIn.getHours() + 8 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60));
    
    const breakMinutes = 30 + Math.floor(Math.random() * 30);
    const totalHours = (timeOut.getTime() - timeIn.getTime()) / (1000 * 60 * 60) - (breakMinutes / 60);
    
    records.push({
      id: `${userId}-${date.toISOString().split('T')[0]}`,
      userId,
      date: date.toISOString().split('T')[0],
      timeIn: timeIn.toTimeString().split(' ')[0].substring(0, 5),
      timeOut: timeOut.toTimeString().split(' ')[0].substring(0, 5),
      breakMinutes,
      totalHours: Math.round(totalHours * 100) / 100
    });
  }
  
  return records;
};

export const useTimeRecordsStore = create<TimeRecordsState>()(
  persist(
    (set, get) => ({
      timeRecords: [],
      isLoading: false,
      currentlyTracking: {},

      getTimeRecords: (userId: string) => {
        let records = get().timeRecords.filter(record => record.userId === userId);
        
        // If no records exist for this user, generate mock data
        if (records.length === 0) {
          const mockRecords = generateMockTimeRecords(userId);
          set(state => ({
            timeRecords: [...state.timeRecords, ...mockRecords]
          }));
          records = mockRecords;
        }
        
        return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      },

      getAllTimeRecords: () => {
        return get().timeRecords;
      },

      getTimeRecordsForPeriod: (userId: string, startDate: string, endDate: string) => {
        const allRecords = get().getTimeRecords(userId);
        return allRecords.filter(record => 
          record.date >= startDate && record.date <= endDate
        );
      },

      getMonthlyStats: (userId: string, month: number, year: number) => {
        const allRecords = get().getTimeRecords(userId);
        const monthRecords = allRecords.filter(record => {
          const recordDate = new Date(record.date);
          return recordDate.getMonth() === month && recordDate.getFullYear() === year;
        });
        
        const totalHours = monthRecords.reduce((sum, record) => sum + record.totalHours, 0);
        return {
          totalHours,
          totalDays: monthRecords.length
        };
      },

      getWeeklyStats: (userId: string) => {
        const today = new Date();
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay() + 1); // Monday
        weekStart.setHours(0, 0, 0, 0);
        
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6); // Sunday
        weekEnd.setHours(23, 59, 59, 999);
        
        const allRecords = get().getTimeRecords(userId);
        const weekRecords = allRecords.filter(record => {
          const recordDate = new Date(record.date);
          return recordDate >= weekStart && recordDate <= weekEnd;
        });
        
        const totalHours = weekRecords.reduce((sum, record) => sum + record.totalHours, 0);
        return {
          totalHours,
          totalDays: weekRecords.length
        };
      },

      getTodayRecord: (userId: string) => {
        const today = new Date().toISOString().split('T')[0];
        const records = get().getTimeRecords(userId);
        return records.find(record => record.date === today) || null;
      },

      isCurrentlyTracking: (userId: string) => {
        return !!get().currentlyTracking[userId];
      },

      clockIn: async (userId: string) => {
        set({ isLoading: true });
        
        try {
          const now = new Date();
          const timeIn = now.toTimeString().split(' ')[0].substring(0, 5); // HH:MM
          const today = now.toISOString().split('T')[0];
          
          // Check if already clocked in today
          const existingRecord = get().getTodayRecord(userId);
          if (existingRecord && !existingRecord.timeOut) {
            throw new Error('Bereits eingestempelt heute');
          }
          
          // If there's already a completed record today, create a new one
          if (existingRecord && existingRecord.timeOut) {
            throw new Error('Heute bereits vollständig erfasst. Bitte HR kontaktieren für Änderungen.');
          }
          
          // Create new time record
          const newRecord: TimeRecord = {
            id: `${userId}-${today}-${Date.now()}`,
            userId,
            date: today,
            timeIn,
            breakMinutes: 0,
            totalHours: 0
          };
          
          // Add to records and set tracking
          set(state => ({
            timeRecords: [...state.timeRecords, newRecord],
            currentlyTracking: {
              ...state.currentlyTracking,
              [userId]: { timeIn, startTime: now.getTime() }
            },
            isLoading: false
          }));
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      clockOut: async (userId: string, breakMinutes = 30) => {
        set({ isLoading: true });
        
        try {
          const now = new Date();
          const timeOut = now.toTimeString().split(' ')[0].substring(0, 5); // HH:MM
          
          // Find today's record
          const todayRecord = get().getTodayRecord(userId);
          if (!todayRecord || todayRecord.timeOut) {
            throw new Error('Nicht eingestempelt oder bereits ausgestempelt');
          }
          
          // Calculate total hours
          const timeInParts = todayRecord.timeIn.split(':');
          const timeOutParts = timeOut.split(':');
          const timeInMinutes = parseInt(timeInParts[0]) * 60 + parseInt(timeInParts[1]);
          const timeOutMinutes = parseInt(timeOutParts[0]) * 60 + parseInt(timeOutParts[1]);
          const totalMinutes = timeOutMinutes - timeInMinutes - breakMinutes;
          const totalHours = Math.round((totalMinutes / 60) * 100) / 100;
          
          // Update record
          const updatedRecords = get().timeRecords.map(record =>
            record.id === todayRecord.id
              ? { ...record, timeOut, breakMinutes, totalHours }
              : record
          );
          
          set(state => ({
            timeRecords: updatedRecords,
            currentlyTracking: {
              ...state.currentlyTracking,
              [userId]: null
            },
            isLoading: false
          }));
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      addTimeRecord: async (record: Omit<TimeRecord, 'id'>) => {
        set({ isLoading: true });
        
        try {
          const newRecord: TimeRecord = {
            ...record,
            id: `${record.userId}-${record.date}-${Date.now()}`
          };
          
          set(state => ({
            timeRecords: [...state.timeRecords, newRecord],
            isLoading: false
          }));
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      updateTimeRecord: async (recordId: string, updates: Partial<TimeRecord>) => {
        set({ isLoading: true });
        
        try {
          const updatedRecords = get().timeRecords.map(record =>
            record.id === recordId ? { ...record, ...updates } : record
          );
          
          set({ timeRecords: updatedRecords, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      deleteTimeRecord: async (recordId: string) => {
        set({ isLoading: true });
        
        try {
          const filteredRecords = get().timeRecords.filter(record => record.id !== recordId);
          
          set({ timeRecords: filteredRecords, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      setTimeRecords: (records: TimeRecord[]) => {
        set({ timeRecords: records });
      }
    }),
    {
      name: 'time-records-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        timeRecords: state.timeRecords,
        currentlyTracking: state.currentlyTracking
      }),
    }
  )
);