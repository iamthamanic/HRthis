import React from 'react';
import { CalendarView, CalendarViewMode, CalendarFilterMode } from '../../types/calendar';
import { cn } from '../../utils/cn';

interface CalendarControlsProps {
  viewMode: CalendarViewMode;
  calendarView: CalendarView;
  filterMode: CalendarFilterMode;
  onViewModeChange: (mode: CalendarViewMode) => void;
  onCalendarViewChange: (view: CalendarView) => void;
  onFilterModeChange: (filter: CalendarFilterMode) => void;
}

export const CalendarControls: React.FC<CalendarControlsProps> = ({
  viewMode,
  calendarView,
  filterMode,
  onViewModeChange,
  onCalendarViewChange,
  onFilterModeChange
}) => {
  return (
    <div className="space-y-4">
      {/* View Mode and Calendar View Toggle */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* View Mode Toggle */}
        <div className="flex bg-white rounded-lg p-1 shadow-sm">
          <button
            onClick={() => onViewModeChange('personal')}
            className={cn(
              "flex-1 py-2 px-3 rounded-md transition-colors text-sm",
              viewMode === 'personal' ? "bg-blue-500 text-white" : "bg-transparent text-gray-700 hover:bg-gray-100"
            )}
          >
            👤 Persönlich
          </button>
          <button
            onClick={() => onViewModeChange('team')}
            className={cn(
              "flex-1 py-2 px-3 rounded-md transition-colors text-sm",
              viewMode === 'team' ? "bg-blue-500 text-white" : "bg-transparent text-gray-700 hover:bg-gray-100"
            )}
          >
            👥 Team
          </button>
        </div>

        {/* Calendar View Toggle */}
        <div className="flex bg-white rounded-lg p-1 shadow-sm">
          <button
            onClick={() => onCalendarViewChange('month')}
            className={cn(
              "flex-1 py-2 px-3 rounded-md transition-colors text-sm",
              calendarView === 'month' ? "bg-green-500 text-white" : "bg-transparent text-gray-700 hover:bg-gray-100"
            )}
          >
            📅 Monat
          </button>
          <button
            onClick={() => onCalendarViewChange('year')}
            className={cn(
              "flex-1 py-2 px-3 rounded-md transition-colors text-sm",
              calendarView === 'year' ? "bg-green-500 text-white" : "bg-transparent text-gray-700 hover:bg-gray-100"
            )}
          >
            📆 Jahr
          </button>
        </div>
      </div>

      {/* Filter Toggle */}
      <div className="flex bg-white rounded-lg p-1 shadow-sm">
        <button
          onClick={() => onFilterModeChange('all')}
          className={cn(
            "flex-1 py-2 px-3 rounded-md transition-colors text-sm",
            filterMode === 'all' ? "bg-blue-500 text-white" : "bg-transparent text-gray-700 hover:bg-gray-100"
          )}
        >
          Alle
        </button>
        <button
          onClick={() => onFilterModeChange('leaves')}
          className={cn(
            "flex-1 py-2 px-3 rounded-md transition-colors text-sm",
            filterMode === 'leaves' ? "bg-blue-500 text-white" : "bg-transparent text-gray-700 hover:bg-gray-100"
          )}
        >
          Abwesenheit
        </button>
        {viewMode === 'personal' && (
          <button
            onClick={() => onFilterModeChange('work')}
            className={cn(
              "flex-1 py-2 px-3 rounded-md transition-colors text-sm",
              filterMode === 'work' ? "bg-blue-500 text-white" : "bg-transparent text-gray-700 hover:bg-gray-100"
            )}
          >
            Arbeitszeit
          </button>
        )}
      </div>
    </div>
  );
};