import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { TimeRecord } from '../types';

interface TimeRecordsState {
  timeRecords: TimeRecord[];
  isLoading: boolean;
  getTimeRecords: (userId: string) => TimeRecord[];
  getTimeRecordsForPeriod: (userId: string, startDate: string, endDate: string) => TimeRecord[];
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

      getTimeRecordsForPeriod: (userId: string, startDate: string, endDate: string) => {
        const allRecords = get().getTimeRecords(userId);
        return allRecords.filter(record => 
          record.date >= startDate && record.date <= endDate
        );
      },

      setTimeRecords: (records: TimeRecord[]) => {
        set({ timeRecords: records });
      }
    }),
    {
      name: 'time-records-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        timeRecords: state.timeRecords 
      }),
    }
  )
);