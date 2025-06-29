export interface User {
  id: string;
  email: string; // Work email (system login)
  name: string;
  role: UserRole;
  organizationId: string;
  // Personal info
  firstName?: string;
  lastName?: string;
  privateEmail?: string; // Private email address
  address?: {
    street?: string;
    postalCode?: string;
    city?: string;
  };
  phone?: string;
  bankDetails?: {
    iban?: string;
    bic?: string;
  };
  // Work info
  position?: string;
  department?: string;
  weeklyHours?: number;
  employmentType?: EmploymentType;
  joinDate?: string;
  employmentStatus?: EmploymentStatus;
  vacationDays?: number; // Total vacation days per year
  // Team management
  teamIds?: string[]; // Teams the user belongs to
  leadTeamIds?: string[]; // Teams where user is a lead
  primaryTeamId?: string; // Primary team for leave requests
  // Coins & Gamification
  coinWallet?: number;
  coinProgress?: number;
  badges?: string[];
  level?: number;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
}

/**
 * Team entity for organizational structure
 * Teams can have multiple members and multiple leads
 */
export interface Team {
  /** Unique identifier for the team */
  id: string;
  /** Team name */
  name: string;
  /** Optional description of team purpose/function */
  description?: string;
  /** Organization this team belongs to */
  organizationId: string;
  /** Array of user IDs who are team leads */
  leadIds: string[];
  /** Array of all team member IDs (including leads) */
  memberIds: string[];
  /** ISO timestamp of team creation */
  createdAt: string;
  /** ISO timestamp of last update */
  updatedAt: string;
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
  approvedBy?: string; // User ID who approved/rejected
  approvedAt?: string; // Timestamp when approved/rejected
  teamId?: string; // Team context for approval routing
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

// Type definitions
export type UserRole = 'EMPLOYEE' | 'ADMIN' | 'SUPERADMIN';
export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'MINI_JOB';
export type EmploymentStatus = 'ACTIVE' | 'PARENTAL_LEAVE' | 'TERMINATED';

// Re-export benefit and training types
export * from './benefits';
export * from './training';

// Re-export reminder types
export * from './reminders';