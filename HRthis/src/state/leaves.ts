import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { LeaveRequest, VacationBalance } from '../types';
import { useNotificationsStore } from './notifications';
import { useTeamsStore } from './teams';
import { useAuthStore } from './auth';

interface LeavesState {
  leaveRequests: LeaveRequest[];
  vacationBalance: VacationBalance | null;
  isLoading: boolean;
  submitLeaveRequest: (request: Omit<LeaveRequest, 'id' | 'createdAt'>) => Promise<void>;
  getLeaveRequests: (userId: string) => LeaveRequest[];
  getAllLeaveRequests: () => LeaveRequest[];
  getPendingRequestsForTeamLead: (leadUserId: string) => LeaveRequest[];
  getUserLeaveRequests: (userId: string) => LeaveRequest[];
  getVacationBalance: (userId: string) => VacationBalance | null;
  setVacationBalance: (balance: VacationBalance) => void;
  approveLeaveRequest: (requestId: string, approverId: string) => Promise<void>;
  rejectLeaveRequest: (requestId: string, approverId: string) => Promise<void>;
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
    createdAt: '2024-12-01T10:00:00Z',
    teamId: 'team1'
  },
  {
    id: '2',
    userId: '1',
    startDate: '2024-11-15',
    endDate: '2024-11-15',
    comment: 'Arzttermin',
    status: 'PENDING',
    type: 'SICK',
    createdAt: '2024-11-15T08:00:00Z',
    teamId: 'team1'
  },
  {
    id: '3',
    userId: '3',
    startDate: '2025-01-15',
    endDate: '2025-01-17',
    comment: 'Verlängertes Wochenende',
    status: 'PENDING',
    type: 'VACATION',
    createdAt: '2024-12-20T14:30:00Z',
    teamId: 'team2'
  },
  {
    id: '4',
    userId: '4',
    startDate: '2024-12-28',
    endDate: '2024-12-28',
    comment: 'Erkältung',
    status: 'PENDING',
    type: 'SICK',
    createdAt: '2024-12-27T07:45:00Z',
    teamId: 'team3'
  },
  {
    id: '5',
    userId: '5',
    startDate: '2025-02-10',
    endDate: '2025-02-14',
    comment: 'Skiurlaub',
    status: 'PENDING',
    type: 'VACATION',
    createdAt: '2024-12-15T16:20:00Z'
  },
  {
    id: '6',
    userId: '2',
    startDate: '2024-11-20',
    endDate: '2024-11-22',
    comment: 'Familienbesuch',
    status: 'APPROVED',
    type: 'VACATION',
    createdAt: '2024-11-10T11:15:00Z'
  },
  {
    id: '7',
    userId: '6',
    startDate: '2024-12-19',
    endDate: '2024-12-19',
    comment: '',
    status: 'REJECTED',
    type: 'SICK',
    createdAt: '2024-12-18T09:30:00Z'
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
          
          // Determine primary team for the user
          const authStore = useAuthStore.getState();
          const teamsStore = useTeamsStore.getState();
          const allUsers = authStore.getAllUsers();
          const requestingUser = allUsers.find(u => u.id === request.userId);
          const userTeams = teamsStore.getTeamsByUserId(request.userId);
          const primaryTeamId = requestingUser?.primaryTeamId || userTeams[0]?.id;
          
          const newRequest: LeaveRequest = {
            ...request,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            teamId: primaryTeamId
          };
          
          set(state => ({
            leaveRequests: [...state.leaveRequests, newRequest],
            isLoading: false
          }));

          // Notify team leads about new leave request
          const notificationsStore = useNotificationsStore.getState();
          const getUserName = (userId: string): string => {
            const user = allUsers.find(u => u.id === userId);
            return user?.name || 'Unbekannt';
          };

          // Get team leads for the primary team
          let teamLeadIds: string[] = [];
          if (primaryTeamId) {
            const team = teamsStore.getTeamById(primaryTeamId);
            teamLeadIds = team?.leadIds || [];
          }
          
          // If no team leads found, fallback to all admins
          if (teamLeadIds.length === 0) {
            teamLeadIds = allUsers.filter(u => u.role === 'ADMIN' || u.role === 'SUPERADMIN').map(u => u.id);
          }

          teamLeadIds.forEach(leadId => {
            notificationsStore.addNotification({
              userId: leadId,
              type: 'leave_request',
              title: 'Neuer Antrag eingereicht',
              message: `${getUserName(request.userId)} hat einen ${request.type === 'VACATION' ? 'Urlaubs' : 'Krankheits'}antrag eingereicht`,
              isRead: false,
              relatedId: newRequest.id
            });
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      getLeaveRequests: (userId: string) => {
        return get().leaveRequests.filter(request => request.userId === userId);
      },

      getAllLeaveRequests: () => {
        return get().leaveRequests;
      },

      getPendingRequestsForTeamLead: (leadUserId: string) => {
        const teamsStore = useTeamsStore.getState();
        const ledTeams = teamsStore.getTeamsLedByUser(leadUserId);
        const ledTeamIds = ledTeams.map(team => team.id);
        
        return get().leaveRequests.filter(request => 
          request.status === 'PENDING' && 
          (ledTeamIds.includes(request.teamId || '') || !request.teamId)
        );
      },

      getUserLeaveRequests: (userId: string) => {
        return get().leaveRequests.filter(request => request.userId === userId);
      },

      getVacationBalance: (userId: string) => {
        const balance = get().vacationBalance;
        return balance?.userId === userId ? balance : null;
      },

      setVacationBalance: (balance: VacationBalance) => {
        set({ vacationBalance: balance });
      },

      approveLeaveRequest: async (requestId: string, approverId: string) => {
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 300));
          
          const requestToApprove = get().leaveRequests.find(r => r.id === requestId);
          
          set(state => ({
            leaveRequests: state.leaveRequests.map(request =>
              request.id === requestId
                ? { 
                    ...request, 
                    status: 'APPROVED' as const,
                    approvedBy: approverId,
                    approvedAt: new Date().toISOString()
                  }
                : request
            )
          }));
          
          // Notify user about approval
          if (requestToApprove) {
            const getUserName = (userId: string): string => {
              const names: { [key: string]: string } = {
                '1': 'Max M.',
                '2': 'Anna A.',
                '3': 'Tom K.',
                '4': 'Lisa S.',
                '5': 'Julia B.',
                '6': 'Marco L.'
              };
              return names[userId] || 'Unbekannt';
            };

            const notificationsStore = useNotificationsStore.getState();
            notificationsStore.addNotification({
              userId: requestToApprove.userId,
              type: 'leave_approved',
              title: 'Antrag genehmigt',
              message: `Ihr ${requestToApprove.type === 'VACATION' ? 'Urlaubs' : 'Krankheits'}antrag wurde von ${getUserName(approverId)} genehmigt`,
              isRead: false,
              relatedId: requestId
            });
          }
          
          // Trigger automatic reminder creation for vacation requests
          const approvedRequest = get().leaveRequests.find(r => r.id === requestId);
          if (approvedRequest && approvedRequest.type === 'VACATION') {
            // This would integrate with the reminders store
            // For now, this is handled in the UI layer
          }
        } catch (error) {
          throw error;
        }
      },

      rejectLeaveRequest: async (requestId: string, approverId: string) => {
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 300));
          
          const requestToReject = get().leaveRequests.find(r => r.id === requestId);
          
          set(state => ({
            leaveRequests: state.leaveRequests.map(request =>
              request.id === requestId
                ? { 
                    ...request, 
                    status: 'REJECTED' as const,
                    approvedBy: approverId,
                    approvedAt: new Date().toISOString()
                  }
                : request
            )
          }));

          // Notify user about rejection
          if (requestToReject) {
            const getUserName = (userId: string): string => {
              const names: { [key: string]: string } = {
                '1': 'Max M.',
                '2': 'Anna A.',
                '3': 'Tom K.',
                '4': 'Lisa S.',
                '5': 'Julia B.',
                '6': 'Marco L.'
              };
              return names[userId] || 'Unbekannt';
            };

            const notificationsStore = useNotificationsStore.getState();
            notificationsStore.addNotification({
              userId: requestToReject.userId,
              type: 'leave_rejected',
              title: 'Antrag abgelehnt',
              message: `Ihr ${requestToReject.type === 'VACATION' ? 'Urlaubs' : 'Krankheits'}antrag wurde von ${getUserName(approverId)} abgelehnt`,
              isRead: false,
              relatedId: requestId
            });
          }
        } catch (error) {
          throw error;
        }
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