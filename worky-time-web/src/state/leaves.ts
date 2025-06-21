import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { LeaveRequest, VacationBalance } from '../types';

interface LeavesState {
  leaveRequests: LeaveRequest[];
  vacationBalance: VacationBalance | null;
  isLoading: boolean;
  submitLeaveRequest: (request: Omit<LeaveRequest, 'id' | 'createdAt'>) => Promise<void>;
  getLeaveRequests: (userId: string) => LeaveRequest[];
  getVacationBalance: (userId: string) => VacationBalance | null;
  setVacationBalance: (balance: VacationBalance) => void;
  approveLeaveRequest: (requestId: string) => void;
  rejectLeaveRequest: (requestId: string) => void;
}

// Mock data
const mockLeaveRequests: LeaveRequest[] = [
  {
    id: '1',
    userId: '1',
    startDate: '2024-12-23',
    endDate: '2024-12-30',
    comment: 'Weihnachtsurlaub',
    status: 'APPROVED',
    type: 'VACATION',
    createdAt: '2024-12-01T10:00:00Z'
  },
  {
    id: '2',
    userId: '1',
    startDate: '2024-11-15',
    endDate: '2024-11-15',
    comment: 'Arzttermin',
    status: 'PENDING',
    type: 'SICK',
    createdAt: '2024-11-15T08:00:00Z'
  }
];

const mockVacationBalance: VacationBalance = {
  userId: '1',
  totalDays: 30,
  usedDays: 8,
  remainingDays: 22,
  year: 2024
};

export const useLeavesStore = create<LeavesState>()(
  persist(
    (set, get) => ({
      leaveRequests: mockLeaveRequests,
      vacationBalance: mockVacationBalance,
      isLoading: false,

      submitLeaveRequest: async (request) => {
        set({ isLoading: true });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const newRequest: LeaveRequest = {
            ...request,
            id: Date.now().toString(),
            createdAt: new Date().toISOString()
          };
          
          set(state => ({
            leaveRequests: [...state.leaveRequests, newRequest],
            isLoading: false
          }));
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      getLeaveRequests: (userId: string) => {
        return get().leaveRequests.filter(request => request.userId === userId);
      },

      getVacationBalance: (userId: string) => {
        const balance = get().vacationBalance;
        return balance?.userId === userId ? balance : null;
      },

      setVacationBalance: (balance: VacationBalance) => {
        set({ vacationBalance: balance });
      },

      approveLeaveRequest: (requestId: string) => {
        set(state => ({
          leaveRequests: state.leaveRequests.map(request =>
            request.id === requestId
              ? { ...request, status: 'APPROVED' as const }
              : request
          )
        }));
        
        // Trigger automatic reminder creation for vacation requests
        const approvedRequest = get().leaveRequests.find(r => r.id === requestId);
        if (approvedRequest && approvedRequest.type === 'VACATION') {
          // This would integrate with the reminders store
          // For now, this is handled in the UI layer
        }
      },

      rejectLeaveRequest: (requestId: string) => {
        set(state => ({
          leaveRequests: state.leaveRequests.map(request =>
            request.id === requestId
              ? { ...request, status: 'REJECTED' as const }
              : request
          )
        }));
      }
    }),
    {
      name: 'leaves-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        leaveRequests: state.leaveRequests,
        vacationBalance: state.vacationBalance 
      }),
    }
  )
);