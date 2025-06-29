import React, { useState, useMemo } from 'react';
import { CalendarEntry } from '../types/calendar';
import {
  generateDateRange
} from './calendar/TeamCalendarHelpers';
import { TeamCalendarGrid } from './calendar/TeamCalendarGrid';
import { TeamCalendarLegend } from './calendar/TeamCalendarLegend';
import { TeamCalendarNavigation } from './calendar/TeamCalendarNavigation';

interface TeamCalendarViewProps {
  view: 'monat' | 'jahr';
  entries: CalendarEntry[];
  users: { userId: string; userName: string }[];
  onCellClick?: (userId: string, date: string) => void;
  isAdmin?: boolean;
  showLegend?: boolean;
}

const useTeamCalendarLogic = (view: 'monat' | 'jahr', entries: CalendarEntry[]) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [hoveredCell, setHoveredCell] = useState<{ userId: string; date: string } | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  const dateRange = useMemo(() => {
    return generateDateRange(view, selectedMonth);
  }, [view, selectedMonth]);

  const entriesByUserAndDate = useMemo(() => {
    const map = new Map<string, CalendarEntry>();
    entries.forEach(entry => {
      const key = `${entry.userId}-${entry.date}`;
      map.set(key, entry);
    });
    return map;
  }, [entries]);

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

  const navigateMonth = (direction: number) => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(newDate.getMonth() + direction);
    setSelectedMonth(newDate);
  };

  const handleCellHover = (userId: string, date: string) => {
    setHoveredCell({ userId, date });
  };

  const handleCellLeave = () => {
    setHoveredCell(null);
  };

  return {
    selectedMonth,
    hoveredCell,
    filterType,
    dateRange,
    filteredEntries,
    navigateMonth,
    handleCellHover,
    handleCellLeave,
    setFilterType
  };
};

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
  isAdmin = false,
  showLegend = true
}) => {
  const calendarLogic = useTeamCalendarLogic(view, entries);

  return (
    <div className="w-full">
      <TeamCalendarNavigation
        view={view}
        selectedMonth={calendarLogic.selectedMonth}
        filterType={calendarLogic.filterType}
        onNavigateMonth={calendarLogic.navigateMonth}
        onFilterChange={calendarLogic.setFilterType}
      />
      
      <TeamCalendarGrid
        view={view}
        dateRange={calendarLogic.dateRange}
        users={users}
        filteredEntries={calendarLogic.filteredEntries}
        selectedMonth={calendarLogic.selectedMonth}
        hoveredCell={calendarLogic.hoveredCell}
        onCellClick={onCellClick}
        onCellHover={calendarLogic.handleCellHover}
        onCellLeave={calendarLogic.handleCellLeave}
      />
      
      <TeamCalendarLegend showLegend={showLegend} />
    </div>
  );
};