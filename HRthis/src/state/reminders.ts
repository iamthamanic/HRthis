import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { VacationReminder, ReminderSettings, ReminderNotification } from '../types/reminders';
import { LeaveRequest } from '../types';

interface RemindersState {
  reminders: VacationReminder[];
  reminderSettings: ReminderSettings[];
  notifications: ReminderNotification[];
  isLoading: boolean;
  
  // Reminder management
  createReminderForVacation: (leaveRequest: LeaveRequest, managerId: string, customDays?: number[]) => Promise<void>;
  createManualReminder: (leaveRequestId: string, reminderDate: string, message: string, managerId: string) => Promise<void>;
  deleteReminder: (reminderId: string) => void;
  updateReminder: (reminderId: string, updates: Partial<VacationReminder>) => void;
  
  // Settings management
  getReminderSettings: (managerId: string) => ReminderSettings | null;
  updateReminderSettings: (managerId: string, settings: Partial<ReminderSettings>) => Promise<void>;
  
  // Notifications
  getUpcomingNotifications: (managerId: string) => ReminderNotification[];
  markNotificationAsRead: (notificationId: string) => void;
  generateNotificationsForToday: () => ReminderNotification[];
  
  // Calendar integration
  getRemindersForLeave: (leaveRequestId: string) => VacationReminder[];
  getUpcomingVacationAlerts: (managerId: string, days?: number) => ReminderNotification[];
}

// Constants
const DEFAULT_VACATION_MESSAGE = 'Max Mustermann ist vom 23.12.2024 bis 30.12.2024 im Weihnachtsurlaub.';
const CREATED_DATE = '2024-12-01T10:00:00Z';

// Mock data
const mockReminderSettings: ReminderSettings[] = [
  {
    id: '1',
    managerId: '2', // Anna Admin
    isEnabled: true,
    defaultReminders: [14, 7, 2], // 2 weeks, 1 week, 2 days before
    customMessage: 'Erinnerung: {employeeName} ist vom {startDate} bis {endDate} im Urlaub.',
    notificationMethod: 'BOTH',
    autoCreateForNewVacations: true,
    createdAt: '2024-01-01T00:00:00Z'
  }
];

const mockReminders: VacationReminder[] = [
  {
    id: '1',
    leaveRequestId: '1', // Max's Christmas vacation
    userId: '1',
    reminderType: 'AUTOMATIC',
    reminderDate: '2024-12-09', // 2 weeks before
    daysBeforeVacation: 14,
    isActive: true,
    isSent: false,
    message: DEFAULT_VACATION_MESSAGE,
    createdAt: CREATED_DATE,
    createdBy: '2'
  },
  {
    id: '2',
    leaveRequestId: '1',
    userId: '1',
    reminderType: 'AUTOMATIC',
    reminderDate: '2024-12-16', // 1 week before
    daysBeforeVacation: 7,
    isActive: true,
    isSent: false,
    message: DEFAULT_VACATION_MESSAGE,
    createdAt: CREATED_DATE,
    createdBy: '2'
  },
  {
    id: '3',
    leaveRequestId: '1',
    userId: '1',
    reminderType: 'AUTOMATIC',
    reminderDate: '2024-12-21', // 2 days before
    daysBeforeVacation: 2,
    isActive: true,
    isSent: false,
    message: DEFAULT_VACATION_MESSAGE,
    createdAt: CREATED_DATE,
    createdBy: '2'
  }
];

export const useRemindersStore = create<RemindersState>()(
  persist(
    (set, get) => ({
      reminders: mockReminders,
      reminderSettings: mockReminderSettings,
      notifications: [],
      isLoading: false,

      createReminderForVacation: async (leaveRequest: LeaveRequest, managerId: string, customDays?: number[]) => {
        set({ isLoading: true });
        
        try {
          const settings = get().getReminderSettings(managerId);
          const reminderDays = customDays || settings?.defaultReminders || [7, 2]; // Default fallback
          
          const vacationStart = new Date(leaveRequest.startDate);
          const newReminders: VacationReminder[] = [];
          
          reminderDays.forEach(days => {
            const reminderDate = new Date(vacationStart);
            reminderDate.setDate(vacationStart.getDate() - days);
            
            // Don't create reminders for past dates
            if (reminderDate >= new Date()) {
              const reminder: VacationReminder = {
                id: `${Date.now()}-${days}`,
                leaveRequestId: leaveRequest.id,
                userId: leaveRequest.userId,
                reminderType: 'AUTOMATIC',
                reminderDate: reminderDate.toISOString().split('T')[0],
                daysBeforeVacation: days,
                isActive: true,
                isSent: false,
                message: settings?.customMessage
                  ?.replace('{employeeName}', 'Mitarbeiter')
                  ?.replace('{startDate}', new Date(leaveRequest.startDate).toLocaleDateString('de-DE'))
                  ?.replace('{endDate}', new Date(leaveRequest.endDate).toLocaleDateString('de-DE'))
                  || `Urlaub vom ${new Date(leaveRequest.startDate).toLocaleDateString('de-DE')} bis ${new Date(leaveRequest.endDate).toLocaleDateString('de-DE')}`,
                createdAt: new Date().toISOString(),
                createdBy: managerId
              };
              
              newReminders.push(reminder);
            }
          });
          
          set(state => ({
            reminders: [...state.reminders, ...newReminders],
            isLoading: false
          }));
          
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      createManualReminder: async (leaveRequestId: string, reminderDate: string, message: string, managerId: string) => {
        set({ isLoading: true });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          
          const reminder: VacationReminder = {
            id: Date.now().toString(),
            leaveRequestId,
            userId: '', // Will be filled from leave request
            reminderType: 'MANUAL',
            reminderDate,
            daysBeforeVacation: 0, // Calculated later
            isActive: true,
            isSent: false,
            message,
            createdAt: new Date().toISOString(),
            createdBy: managerId
          };
          
          set(state => ({
            reminders: [...state.reminders, reminder],
            isLoading: false
          }));
          
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      deleteReminder: (reminderId: string) => {
        set(state => ({
          reminders: state.reminders.filter(r => r.id !== reminderId)
        }));
      },

      updateReminder: (reminderId: string, updates: Partial<VacationReminder>) => {
        set(state => ({
          reminders: state.reminders.map(r => 
            r.id === reminderId ? { ...r, ...updates } : r
          )
        }));
      },

      getReminderSettings: (managerId: string) => {
        return get().reminderSettings.find(s => s.managerId === managerId) || null;
      },

      updateReminderSettings: async (managerId: string, settingsUpdate: Partial<ReminderSettings>) => {
        set({ isLoading: true });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          
          set(state => {
            const existingIndex = state.reminderSettings.findIndex(s => s.managerId === managerId);
            
            if (existingIndex >= 0) {
              // Update existing settings
              const updatedSettings = [...state.reminderSettings];
              updatedSettings[existingIndex] = { ...updatedSettings[existingIndex], ...settingsUpdate };
              return { reminderSettings: updatedSettings, isLoading: false };
            } else {
              // Create new settings
              const newSettings: ReminderSettings = {
                id: Date.now().toString(),
                managerId,
                isEnabled: true,
                defaultReminders: [14, 7, 2],
                notificationMethod: 'BOTH',
                autoCreateForNewVacations: true,
                createdAt: new Date().toISOString(),
                ...settingsUpdate
              };
              return { 
                reminderSettings: [...state.reminderSettings, newSettings], 
                isLoading: false 
              };
            }
          });
          
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      getUpcomingNotifications: (managerId: string) => {
        const today = new Date().toISOString().split('T')[0];
        const upcomingDays = new Date();
        upcomingDays.setDate(upcomingDays.getDate() + 7); // Next 7 days
        
        return get().notifications.filter(n => 
          n.scheduledFor >= today && 
          n.scheduledFor <= upcomingDays.toISOString().split('T')[0] &&
          !n.isRead
        );
      },

      markNotificationAsRead: (notificationId: string) => {
        set(state => ({
          notifications: state.notifications.map(n => 
            n.id === notificationId ? { ...n, isRead: true } : n
          )
        }));
      },

      generateNotificationsForToday: () => {
        const today = new Date().toISOString().split('T')[0];
        const todayReminders = get().reminders.filter(r => 
          r.reminderDate === today && r.isActive && !r.isSent
        );
        
        const newNotifications: ReminderNotification[] = todayReminders.map(reminder => ({
          id: Date.now().toString() + Math.random(),
          reminderId: reminder.id,
          title: `Urlaubserinnerung - ${reminder.daysBeforeVacation} Tag${reminder.daysBeforeVacation !== 1 ? 'e' : ''} vorher`,
          message: reminder.message,
          isRead: false,
          createdAt: new Date().toISOString(),
          scheduledFor: today,
          leaveRequestId: reminder.leaveRequestId,
          employeeName: 'Mitarbeiter', // Would be filled from user data
          vacationDates: {
            startDate: '', // Would be filled from leave request
            endDate: ''
          }
        }));
        
        // Mark reminders as sent
        set(state => ({
          notifications: [...state.notifications, ...newNotifications],
          reminders: state.reminders.map(r => 
            todayReminders.some(tr => tr.id === r.id) 
              ? { ...r, isSent: true } 
              : r
          )
        }));
        
        return newNotifications;
      },

      getRemindersForLeave: (leaveRequestId: string) => {
        return get().reminders.filter(r => r.leaveRequestId === leaveRequestId);
      },

      getUpcomingVacationAlerts: (managerId: string, days = 14) => {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + days);
        const endDateString = endDate.toISOString().split('T')[0];
        const today = new Date().toISOString().split('T')[0];
        
        return get().notifications.filter(n => 
          n.scheduledFor >= today && 
          n.scheduledFor <= endDateString
        ).sort((a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime());
      }
    }),
    {
      name: 'reminders-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        reminders: state.reminders,
        reminderSettings: state.reminderSettings,
        notifications: state.notifications
      }),
    }
  )
);