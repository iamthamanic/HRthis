import React from 'react';
import { LeaveRequest } from '../types';
import { User } from '../types';
import { cn } from '../utils/cn';

/**
 * Props for the YearView component
 */
interface YearViewProps {
  /** The year to display (e.g., 2024) */
  year: number;
  /** Vacation data organized by user ID and week number */
  yearData: { [userId: string]: { [week: string]: LeaveRequest[] } };
  /** List of users to display in the view */
  allUsers: User[];
  /** Current view mode - personal shows only current user, team shows all users */
  viewMode: 'personal' | 'team';
  /** Function to get formatted user name by user ID */
  getUserName: (userId: string) => string;
}

/**
 * Type representing the result of leave type analysis for a week
 */
type WeekLeaveType = 'vacation' | 'sick' | 'mixed' | null;

/**
 * YearView component displays a calendar overview showing vacation/sick leave 
 * for all users across all weeks of a year in a horizontal scrollable format.
 * 
 * Features:
 * - Horizontal scrolling grid with 53 weeks
 * - Color-coded leave types (blue for vacation, red for sick)
 * - Current week highlighting
 * - Tooltips with detailed leave information
 * - Month headers for easy orientation
 */
export const YearView: React.FC<YearViewProps> = ({
  year,
  yearData,
  allUsers,
  viewMode,
  getUserName
}) => {
  // Generate week numbers array (1-53 weeks per year)
  const weeks = Array.from({ length: 53 }, (_, i) => i + 1);
  
  /**
   * Calculates the start and end dates for a given week number in a year.
   * Uses ISO 8601 week calculation where week starts on Monday.
   * 
   * @param week - Week number (1-53)
   * @param year - Year to calculate for
   * @returns Object with start and end dates of the week
   */
  const getWeekDateRange = (week: number, year: number): { start: Date; end: Date } => {
    const jan1 = new Date(year, 0, 1);
    const days = (week - 1) * 7;
    const weekStart = new Date(jan1.getTime() + days * 24 * 60 * 60 * 1000);
    
    // Adjust to Monday (ISO 8601 week starts on Monday)
    // Sunday = 0, Monday = 1, so we need to adjust accordingly
    const dayOfWeek = weekStart.getDay();
    const diff = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
    weekStart.setDate(weekStart.getDate() + diff);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    return {
      start: weekStart,
      end: weekEnd
    };
  };

  /**
   * Formats a week's date range as a readable string for German locale.
   * 
   * @param week - Week number to format
   * @returns Formatted string like "01.01 - 07.01"
   */
  const formatWeekRange = (week: number): string => {
    const { start, end } = getWeekDateRange(week, year);
    const startStr = start.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
    const endStr = end.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
    return `${startStr} - ${endStr}`;
  };

  /**
   * Analyzes leave requests for a week and determines the predominant leave type.
   * Handles cases where multiple leave types exist in the same week.
   * 
   * @param leaves - Array of leave requests for the week
   * @returns The leave type or null if no leaves
   */
  const getWeekLeaveType = (leaves: LeaveRequest[]): WeekLeaveType => {
    if (leaves.length === 0) return null;
    
    // Check for different leave types in the week
    const hasVacation = leaves.some(leave => leave.type === 'VACATION');
    const hasSick = leaves.some(leave => leave.type === 'SICK');
    
    // Priority: mixed > vacation > sick
    if (hasVacation && hasSick) return 'mixed';
    if (hasVacation) return 'vacation';
    if (hasSick) return 'sick';
    return null;
  };

  /**
   * Returns appropriate CSS classes for week cell styling based on leave type and current week status.
   * 
   * @param leaveType - Type of leave for the week
   * @param isCurrentWeek - Whether this is the current week
   * @returns CSS class string for styling
   */
  const getCellColor = (leaveType: WeekLeaveType, isCurrentWeek: boolean): string => {
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

  /**
   * Calculates the current week number using ISO 8601 standard.
   * 
   * @returns Current week number (1-53)
   */
  const getCurrentWeekNumber = (): number => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const days = Math.floor((now.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + start.getDay() + 1) / 7);
  };

  const currentWeek = getCurrentWeekNumber();
  
  // Month names in German for display
  const monthNames = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'] as const;

  return (
    <div className="space-y-4">
      {/* Year View with horizontal scrolling for 53 weeks */}
      <div className="overflow-x-auto">
        <div className="min-w-max">
          {/* Week headers with month indicators */}
          <div className="flex gap-1 mb-2">
            <div className="w-32 text-sm font-medium text-gray-500 text-center flex-shrink-0">
              {viewMode === 'team' ? 'Mitarbeiter' : 'Benutzer'}
            </div>
            {weeks.map((week) => {
              const { start } = getWeekDateRange(week, year);
              const month = start.getMonth();
              
              // Show month name only for first week of each month to avoid clutter
              const isFirstWeekOfMonth = week === 1 || 
                (week > 1 && getWeekDateRange(week - 1, year).start.getMonth() !== month);
              
              const isCurrentYear = year === new Date().getFullYear();
              const isCurrentWeekHighlighted = isCurrentYear && week === currentWeek;
              
              return (
                <div key={week} className="w-8 text-xs font-medium text-gray-500 text-center flex-shrink-0">
                  {isFirstWeekOfMonth && (
                    <div className="mb-1">
                      {monthNames[month]}
                    </div>
                  )}
                  <div className={cn(
                    "text-xs p-1 rounded",
                    isCurrentWeekHighlighted 
                      ? "bg-blue-500 text-white font-bold" 
                      : "text-gray-400"
                  )}>
                    {week}
                  </div>
                </div>
              );
            })}
          </div>

          {/* User vacation overview rows */}
          <div className="space-y-1">
            {allUsers.map((user) => {
              // Safely get user name with fallback
              const userName = getUserName(user.id);
              
              return (
                <div key={user.id} className="flex gap-1 items-center">
                  {/* User name column - fixed width for alignment */}
                  <div className="w-32 text-sm font-medium text-gray-700 p-2 bg-gray-50 rounded text-center truncate flex-shrink-0">
                    {userName}
                  </div>
                  
                  {/* Week cells for vacation visualization */}
                  {weeks.map((week) => {
                    // Safely access user's vacation data for this week
                    const userWeekData = yearData[user.id]?.[week] ?? [];
                    const leaveType = getWeekLeaveType(userWeekData);
                    
                    const isCurrentYear = year === new Date().getFullYear();
                    const isCurrentWeekCell = isCurrentYear && week === currentWeek;
                    
                    // Create tooltip content based on leave data
                    const tooltipContent = userWeekData.length > 0
                      ? userWeekData.map(leave => {
                          const leaveTypeText = leave.type === 'VACATION' ? 'Urlaub' : 
                                               leave.type === 'SICK' ? 'Krank' : 'Abwesenheit';
                          return `${leaveTypeText}: ${leave.startDate} - ${leave.endDate}`;
                        }).join('\n')
                      : `KW ${week}: ${formatWeekRange(week)}`;
                    
                    // Select appropriate emoji based on leave type
                    const getLeaveEmoji = (type: WeekLeaveType): string => {
                      switch (type) {
                        case 'vacation': return '🏖️';
                        case 'sick': return '🏥';
                        case 'mixed': return '📅';
                        default: return '';
                      }
                    };
                    
                    return (
                      <div
                        key={`${user.id}-${week}`}
                        className={cn(
                          "w-8 h-8 border border-gray-200 rounded text-xs flex items-center justify-center cursor-pointer transition-colors flex-shrink-0",
                          getCellColor(leaveType, isCurrentWeekCell)
                        )}
                        title={tooltipContent}
                        role="gridcell"
                        aria-label={`${userName}, Woche ${week}: ${userWeekData.length > 0 ? `${userWeekData.length} Abwesenheit(en)` : 'Keine Abwesenheit'}`}
                      >
                        {userWeekData.length > 0 && (
                          <span className="text-xs" aria-hidden="true">
                            {getLeaveEmoji(leaveType)}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-xl p-4 mt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Legende</h4>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-200 border border-gray-300 rounded" />
            <span>Urlaub</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-200 border border-gray-300 rounded" />
            <span>Krankheit</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-r from-blue-200 to-red-200 border border-gray-300 rounded" />
            <span>Gemischt</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded" />
            <span>Aktuelle Woche</span>
          </div>
        </div>
      </div>
    </div>
  );
};