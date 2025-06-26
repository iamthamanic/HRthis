import { z } from 'zod';

/**
 * Zod Schemas für Runtime-Validierung
 * Verwende diese um API-Daten und User-Input zu validieren
 */

// User Schema
export const UserSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name ist erforderlich'),
  email: z.string().email('Ungültige E-Mail-Adresse'),
  role: z.enum(['EMPLOYEE', 'ADMIN', 'SUPERADMIN']),
  employmentStatus: z.enum(['ACTIVE', 'PARENTAL_LEAVE', 'TERMINATED']).optional(),
  position: z.string().optional(),
  weeklyHours: z.number().min(0).max(60).optional(),
  vacationDays: z.number().min(0).optional(),
  coinWallet: z.number().min(0).optional(),
  level: z.number().min(1).optional(),
});

// Leave Request Schema
export const LeaveRequestSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.enum(['VACATION', 'SICK', 'PERSONAL', 'PARENTAL']),
  startDate: z.string(),
  endDate: z.string(),
  reason: z.string().optional(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
  createdAt: z.string(),
});

// Team Schema
export const TeamSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Team-Name ist erforderlich'),
  description: z.string().optional(),
  leaderId: z.string().optional(),
  memberIds: z.array(z.string()),
  createdAt: z.string(),
});

// API Response Schema für Listen
export const UsersResponseSchema = z.array(UserSchema);
export const TeamsResponseSchema = z.array(TeamSchema);

// Type Exports für TypeScript
export type ValidatedUser = z.infer<typeof UserSchema>;
export type ValidatedLeaveRequest = z.infer<typeof LeaveRequestSchema>;
export type ValidatedTeam = z.infer<typeof TeamSchema>;

/**
 * Helper-Funktionen für sichere Validierung
 */

export const validateUser = (data: unknown): ValidatedUser => {
  return UserSchema.parse(data);
};

export const validateUserSafe = (data: unknown): { success: true; data: ValidatedUser } | { success: false; error: string } => {
  const result = UserSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error.message };
};

export const validateTeam = (data: unknown): ValidatedTeam => {
  return TeamSchema.parse(data);
};

export const validateLeaveRequest = (data: unknown): ValidatedLeaveRequest => {
  return LeaveRequestSchema.parse(data);
};

/**
 * Verwendungsbeispiele:
 * 
 * // Beim Laden von API-Daten:
 * const response = await fetch('/api/users');
 * const rawData = await response.json();
 * const users = UsersResponseSchema.parse(rawData); // Throws bei Invalid
 * 
 * // Sicher validieren:
 * const result = validateUserSafe(someUserData);
 * if (result.success) {
 *   console.log('Valid user:', result.data);
 * } else {
 *   console.error('Validation error:', result.error);
 * }
 */