export interface VacationReminder {
  id: string;
  leaveRequestId: string;
  userId: string;
  reminderType: 'AUTOMATIC' | 'MANUAL';
  reminderDate: string;
  daysBeforeVacation: number;
  isActive: boolean;
  isSent: boolean;
  message: string;
  createdAt: string;
  createdBy: string; // Manager who set the reminder
}

export interface ReminderSettings {
  id: string;
  managerId: string;
  isEnabled: boolean;
  defaultReminders: number[]; // Days before vacation [14, 7, 2]
  customMessage?: string;
  notificationMethod: 'APP' | 'EMAIL' | 'BOTH';
  autoCreateForNewVacations: boolean;
  createdAt: string;
}

export interface ReminderNotification {
  id: string;
  reminderId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  scheduledFor: string;
  leaveRequestId: string;
  employeeName: string;
  vacationDates: {
    startDate: string;
    endDate: string;
  };
}