import { LeaveRequest } from '../../types';

export type WeekLeaveType = 'vacation' | 'sick' | 'mixed' | null;

export const getWeekDateRange = (week: number, year: number): { start: Date; end: Date } => {
  const jan1 = new Date(year, 0, 1);
  const days = (week - 1) * 7;
  const weekStart = new Date(jan1.getTime() + days * 24 * 60 * 60 * 1000);
  
  const dayOfWeek = weekStart.getDay();
  const diff = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
  weekStart.setDate(weekStart.getDate() + diff);
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  
  return { start: weekStart, end: weekEnd };
};

export const formatWeekRange = (week: number, year: number): string => {
  const { start, end } = getWeekDateRange(week, year);
  const startStr = start.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
  const endStr = end.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
  return `${startStr} - ${endStr}`;
};

export const getWeekLeaveType = (leaves: LeaveRequest[]): WeekLeaveType => {
  if (leaves.length === 0) return null;
  
  const hasVacation = leaves.some(leave => leave.type === 'VACATION');
  const hasSick = leaves.some(leave => leave.type === 'SICK');
  
  if (hasVacation && hasSick) return 'mixed';
  if (hasVacation) return 'vacation';
  if (hasSick) return 'sick';
  return null;
};

export const getCellColor = (leaveType: WeekLeaveType, isCurrentWeek: boolean): string => {
  if (isCurrentWeek) {
    return 'bg-blue-100 border-blue-300';
  }
  
  switch (leaveType) {
    case 'vacation':
      return 'bg-blue-200';
    case 'sick':
      return 'bg-red-200';
    case 'mixed':
      return 'bg-gradient-to-r from-blue-200 to-red-200';
    default:
      return 'bg-white hover:bg-gray-50';
  }
};

export const getCurrentWeekNumber = (): number => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor((now.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + start.getDay() + 1) / 7);
};

export const MONTH_NAMES = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'] as const;