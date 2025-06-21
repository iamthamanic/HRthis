export interface User {
  id: string;
  email: string;
  name: string;
  role: 'EMPLOYEE' | 'ADMIN' | 'SUPERADMIN';
  organizationId: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
}

export interface LeaveRequest {
  id: string;
  userId: string;
  startDate: string;
  endDate: string;
  comment?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  type: 'VACATION' | 'SICK';
  createdAt: string;
}

export interface SickNote {
  id: string;
  userId: string;
  dateFrom: string;
  dateTo: string;
  fileUrl?: string;
  status: 'UPLOADED' | 'REVIEWED';
  createdAt: string;
}

export interface TimeRecord {
  id: string;
  userId: string;
  date: string;
  timeIn: string;
  timeOut?: string;
  breakMinutes: number;
  totalHours: number;
}

export interface Document {
  id: string;
  userId: string;
  title: string;
  category: 'LOHN' | 'VERTRAG' | 'SONSTIGES';
  fileUrl: string;
  createdAt: string;
}

export interface VacationBalance {
  userId: string;
  totalDays: number;
  usedDays: number;
  remainingDays: number;
  year: number;
}

// Re-export benefit and training types
export * from './benefits';
export * from './training';

// Re-export reminder types
export * from './reminders';