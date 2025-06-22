import React, { useState, useMemo } from 'react';
import { CalendarEntry, colorMap, abbreviationMap, getWorkTimeColor } from '../types/calendar';
import { cn } from '../utils/cn';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, startOfYear, endOfYear } from 'date-fns';
import { de } from 'date-fns/locale';

interface TeamCalendarViewProps {
  view: 'monat' | 'jahr';
  entries: CalendarEntry[];
  users: { userId: string; userName: string }[];
  onCellClick?: (userId: string, date: string) => void;
  isAdmin?: boolean;
}

/**
 * TeamCalendarView Component
 * Displays a scrollable calendar view with absence status for all team members
 * Each user has a horizontal row, each day has a cell with info & color
 */
export const TeamCalendarView: React.FC<TeamCalendarViewProps> = ({
  view,
  entries,
  users,
  onCellClick,
  isAdmin = false
}) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [hoveredCell, setHoveredCell] = useState<{ userId: string; date: string } | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  /**
   * Generate date range based on current view (month or year)
   * For month view: all days in the selected month
   * For year view: all days in the selected year
   */
  const dateRange = useMemo(() => {
    if (view === 'monat') {
      const start = startOfMonth(selectedMonth);
      const end = endOfMonth(selectedMonth);
      return eachDayOfInterval({ start, end });
    } else {
      const start = startOfYear(selectedMonth);
      const end = endOfYear(selectedMonth);
      return eachDayOfInterval({ start, end });
    }
  }, [view, selectedMonth]);

  /**
   * Group entries by userId and date for efficient lookup
   * Key format: "userId-yyyy-MM-dd"
   */
  const entriesByUserAndDate = useMemo(() => {
    const map = new Map<string, CalendarEntry>();
    entries.forEach(entry => {
      const key = `${entry.userId}-${entry.date}`;
      map.set(key, entry);
    });
    return map;
  }, [entries]);

  /**
   * Filter entries based on selected type
   * Returns all entries if filter is 'all', otherwise only matching types
   */
  const filteredEntries = useMemo(() => {
    if (filterType === 'all') return entriesByUserAndDate;
    
    const filtered = new Map<string, CalendarEntry>();
    entriesByUserAndDate.forEach((entry, key) => {
      if (entry.type === filterType) {
        filtered.set(key, entry);
      }
    });
    return filtered;
  }, [entriesByUserAndDate, filterType]);

  /**
   * Get calendar entry for a specific user and date
   * @param userId - The user's ID
   * @param date - The date to check
   * @returns The calendar entry if found, undefined otherwise
   */
  const getEntry = (userId: string, date: Date): CalendarEntry | undefined => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return filteredEntries.get(`${userId}-${dateStr}`);
  };

  /**
   * Generate cell content with appropriate styling based on entry type
   * @param entry - The calendar entry to display
   * @returns JSX element with styled abbreviation or null
   */
  const getCellContent = (entry: CalendarEntry | undefined) => {
    if (!entry) return null;

    const abbreviation = entry.type === 'zeit' 
      ? abbreviationMap.zeit(entry.stunden)
      : abbreviationMap[entry.type];

    const backgroundColor = entry.type === 'zeit'
      ? getWorkTimeColor(entry.stunden)
      : colorMap[entry.type];

    const textColor = entry.type === 'krank' ? 'white' : 'black';

    return (
      <div 
        className={cn(
          "absolute bottom-0 left-0 right-0 text-xs font-medium text-center py-0.5 rounded-sm",
          entry.status === 'beantragt' && "opacity-60 border border-dashed border-gray-400"
        )}
        style={{ backgroundColor, color: textColor }}
      >
        {abbreviation}
      </div>
    );
  };

  /**
   * Generate tooltip content for calendar entries
   * @param entry - The calendar entry
   * @returns Formatted string with entry details
   */
  const getTooltipContent = (entry: CalendarEntry) => {
    let content = `${entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}`;
    if (entry.type === 'zeit' && entry.stunden) {
      content += ` (${entry.stunden}h)`;
    }
    if (entry.status) {
      content += ` - ${entry.status}`;
    }
    return content;
  };

  /**
   * Navigate to previous or next month
   * @param direction - Positive for next month, negative for previous
   */
  const navigateMonth = (direction: number) => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(newDate.getMonth() + direction);
    setSelectedMonth(newDate);
  };

  return (
    <div className="w-full">
      {/* Header Controls */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {view === 'monat' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                ←
              </button>
              <h3 className="text-lg font-semibold">
                {format(selectedMonth, 'MMMM yyyy', { locale: de })}
              </h3>
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                →
              </button>
            </div>
          )}
          {view === 'jahr' && (
            <h3 className="text-lg font-semibold">
              {format(selectedMonth, 'yyyy')}
            </h3>
          )}
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Filter:</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">Alle</option>
            <option value="urlaub">Urlaub</option>
            <option value="krank">Krankheit</option>
            <option value="meeting">Meeting</option>
            <option value="fortbildung">Fortbildung</option>
            <option value="ux">Sonderurlaub</option>
            <option value="zeit">Arbeitszeit</option>
          </select>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className={cn(
        "overflow-x-auto border border-gray-200 rounded-lg",
        view === 'jahr' && "max-w-full"
      )}>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="sticky left-0 bg-white z-10 p-2 border-b border-r border-gray-200 text-left text-sm font-medium text-gray-700 min-w-[150px]">
                Mitarbeiter
              </th>
              {view === 'monat' && dateRange.map((date) => (
                <th
                  key={date.toISOString()}
                  className={cn(
                    "p-1 border-b border-gray-200 text-center text-xs font-medium text-gray-600 min-w-[40px]",
                    isToday(date) && "bg-blue-50"
                  )}
                >
                  <div>{format(date, 'EEE', { locale: de })}</div>
                  <div className="text-sm font-semibold">{format(date, 'd')}</div>
                </th>
              ))}
              {view === 'jahr' && (
                <>
                  {/* Month headers for year view */}
                  {Array.from({ length: 12 }, (_, i) => {
                    const monthDate = new Date(selectedMonth.getFullYear(), i, 1);
                    const daysInMonth = new Date(selectedMonth.getFullYear(), i + 1, 0).getDate();
                    return (
                      <th
                        key={i}
                        colSpan={daysInMonth}
                        className="p-2 border-b border-gray-200 text-center text-sm font-medium text-gray-700"
                      >
                        {format(monthDate, 'MMM', { locale: de })}
                      </th>
                    );
                  })}
                </>
              )}
            </tr>
            {view === 'jahr' && (
              <tr>
                <th className="sticky left-0 bg-white z-10 border-b border-r border-gray-200"></th>
                {dateRange.map((date) => (
                  <th
                    key={date.toISOString()}
                    className={cn(
                      "p-0.5 border-b border-gray-200 text-center text-xs font-normal text-gray-500 min-w-[25px]",
                      isToday(date) && "bg-blue-50"
                    )}
                  >
                    {format(date, 'd')}
                  </th>
                ))}
              </tr>
            )}
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.userId} className="hover:bg-gray-50">
                <td className="sticky left-0 bg-white z-10 p-2 border-r border-gray-200 text-sm font-medium text-gray-900 whitespace-nowrap">
                  {user.userName}
                </td>
                {dateRange.map((date) => {
                  const entry = getEntry(user.userId, date);
                  const cellKey = `${user.userId}-${format(date, 'yyyy-MM-dd')}`;
                  const isHovered = hoveredCell?.userId === user.userId && hoveredCell?.date === format(date, 'yyyy-MM-dd');

                  return (
                    <td
                      key={date.toISOString()}
                      className={cn(
                        "relative p-0 border border-gray-100 cursor-pointer transition-colors",
                        view === 'monat' ? "h-12" : "h-8",
                        isToday(date) && "bg-blue-50",
                        isHovered && "bg-gray-100",
                        date.getDay() === 0 || date.getDay() === 6 ? "bg-gray-50" : ""
                      )}
                      onClick={() => onCellClick?.(user.userId, format(date, 'yyyy-MM-dd'))}
                      onMouseEnter={() => setHoveredCell({ userId: user.userId, date: format(date, 'yyyy-MM-dd') })}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      {view === 'monat' && (
                        <div className="text-xs text-gray-400 text-center mt-0.5">
                          {format(date, 'd')}
                        </div>
                      )}
                      {getCellContent(entry)}
                      {entry && isHovered && (
                        <div className="absolute z-20 bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap">
                          {getTooltipContent(entry)}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: colorMap.urlaub }}></div>
          <span>Urlaub</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: colorMap.krank }}></div>
          <span>Krankheit</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: colorMap.meeting }}></div>
          <span>Meeting</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: colorMap.fortbildung }}></div>
          <span>Fortbildung</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: colorMap.ux }}></div>
          <span>Sonderurlaub</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: colorMap.zeit.vollzeit }}></div>
          <span>Vollzeit (8h+)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: colorMap.zeit.teilzeit }}></div>
          <span>Teilzeit (6-8h)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: colorMap.zeit.unter6h }}></div>
          <span>Unter 6h</span>
        </div>
      </div>
    </div>
  );
};