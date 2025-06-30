/**
 * Employee Types
 * TypeScript definitions for HR employee data
 */

// Enums
export enum EmploymentType {
  FULLTIME = 'fulltime',
  PARTTIME = 'parttime',
  MINIJOB = 'minijob',
  INTERN = 'intern',
  OTHER = 'other'
}

export enum EmployeeStatus {
  ACTIVE = 'active',
  PROBATION = 'probation',
  INACTIVE = 'inactive',
  TERMINATED = 'terminated'
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  SUPERADMIN = 'superadmin'
}

// Interfaces
export interface ClothingSizes {
  top?: string;
  pants?: string;
  shoes?: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relation: string;
}

export interface Employee {
  id: string;
  employeeNumber: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  birthDate?: string;
  phone?: string;
  address?: string;
  emergencyContact?: EmergencyContact;
  
  // Employment
  employmentType: EmploymentType;
  employmentTypeCustom?: string;
  employmentTypeDisplay: string;
  position: string;
  department?: string;
  startDate: string;
  endDate?: string;
  probationEnd?: string;
  
  // NEW: Clothing Sizes
  clothingSizes?: ClothingSizes;
  
  // Status
  status: EmployeeStatus;
  role: UserRole;
  isActive: boolean;
  isAdmin: boolean;
  
  // Onboarding
  onboardingCompleted: boolean;
  onboardingEmailSent?: string;
  onboardingPreset?: string;
  
  // HR Data
  salary?: number;
  vacationDays: number;
  
  // Documents
  documents: string[];
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface CreateEmployeeRequest {
  email: string;
  password: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  birthDate?: string;
  phone?: string;
  address?: string;
  emergencyContact?: EmergencyContact;
  
  employmentType: EmploymentType;
  employmentTypeCustom?: string;
  position: string;
  department?: string;
  startDate: string;
  endDate?: string;
  probationEnd?: string;
  
  clothingSizes?: ClothingSizes;
  
  status?: EmployeeStatus;
  role?: UserRole;
  salary?: number;
  vacationDays?: number;
  
  // Onboarding
  sendOnboardingEmail?: boolean;
  onboardingPreset?: string;
}

export interface UpdateEmployeeRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  phone?: string;
  address?: string;
  emergencyContact?: EmergencyContact;
  
  employmentType?: EmploymentType;
  employmentTypeCustom?: string;
  position?: string;
  department?: string;
  endDate?: string;
  probationEnd?: string;
  
  clothingSizes?: ClothingSizes;
  
  status?: EmployeeStatus;
  role?: UserRole;
  salary?: number;
  vacationDays?: number;
}

export interface EmployeeFilters {
  search?: string;
  department?: string;
  status?: EmployeeStatus;
  employmentType?: EmploymentType;
  role?: UserRole;
  page?: number;
  size?: number;
}

export interface EmployeeListResponse {
  employees: Employee[];
  total: number;
  page: number;
  size: number;
}

export interface OnboardingEmailPreset {
  id: string;
  name: string;
  displayName: string;
  subject: string;
  template: string;
  variables: string[];
}

// Form Types
export interface EmployeeFormData {
  // Basic Info
  email: string;
  firstName: string;
  lastName: string;
  employeeNumber: string;
  password?: string;
  
  // Personal
  birthDate?: string;
  phone?: string;
  address?: string;
  emergencyContact?: EmergencyContact;
  
  // Employment
  employmentType: EmploymentType;
  employmentTypeCustom?: string;
  position: string;
  department?: string;
  startDate: string;
  endDate?: string;
  probationEnd?: string;
  
  // NEW: Clothing Sizes
  clothingSizes?: ClothingSizes;
  
  // Status
  status: EmployeeStatus;
  role: UserRole;
  salary?: number;
  vacationDays: number;
  
  // Onboarding
  sendOnboardingEmail?: boolean;
  onboardingPreset?: string;
}

export interface EmployeeFormErrors {
  [key: string]: string;
}