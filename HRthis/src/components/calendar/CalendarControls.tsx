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

const ToggleButton: React.FC<{
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
  colorScheme?: 'blue' | 'green';
}> = ({ isActive, onClick, children, colorScheme = 'blue' }) => {
  const activeColor = colorScheme === 'green' ? 'bg-green-500' : 'bg-blue-500';
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 py-2 px-3 rounded-md transition-colors text-sm",
        isActive ? `${activeColor} text-white` : "bg-transparent text-gray-700 hover:bg-gray-100"
      )}
    >
      {children}
    </button>
  );
};

const ViewModeToggle: React.FC<{
  viewMode: CalendarViewMode;
  onViewModeChange: (mode: CalendarViewMode) => void;
}> = ({ viewMode, onViewModeChange }) => (
  <div className="flex bg-white rounded-lg p-1 shadow-sm">
    <ToggleButton
      isActive={viewMode === 'personal'}
      onClick={() => onViewModeChange('personal')}
    >
      👤 Persönlich
    </ToggleButton>
    <ToggleButton
      isActive={viewMode === 'team'}
      onClick={() => onViewModeChange('team')}
    >
      👥 Team
    </ToggleButton>
  </div>
);

const CalendarViewToggle: React.FC<{
  calendarView: CalendarView;
  onCalendarViewChange: (view: CalendarView) => void;
}> = ({ calendarView, onCalendarViewChange }) => (
  <div className="flex bg-white rounded-lg p-1 shadow-sm">
    <ToggleButton
      isActive={calendarView === 'month'}
      onClick={() => onCalendarViewChange('month')}
      colorScheme="green"
    >
      📅 Monat
    </ToggleButton>
    <ToggleButton
      isActive={calendarView === 'year'}
      onClick={() => onCalendarViewChange('year')}
      colorScheme="green"
    >
      📆 Jahr
    </ToggleButton>
  </div>
);

const FilterToggle: React.FC<{
  filterMode: CalendarFilterMode;
  viewMode: CalendarViewMode;
  onFilterModeChange: (filter: CalendarFilterMode) => void;
}> = ({ filterMode, viewMode, onFilterModeChange }) => (
  <div className="flex bg-white rounded-lg p-1 shadow-sm">
    <ToggleButton
      isActive={filterMode === 'all'}
      onClick={() => onFilterModeChange('all')}
    >
      Alle
    </ToggleButton>
    <ToggleButton
      isActive={filterMode === 'leaves'}
      onClick={() => onFilterModeChange('leaves')}
    >
      Abwesenheit
    </ToggleButton>
    {viewMode === 'personal' && (
      <ToggleButton
        isActive={filterMode === 'work'}
        onClick={() => onFilterModeChange('work')}
      >
        Arbeitszeit
      </ToggleButton>
    )}
  </div>
);

export const CalendarControls: React.FC<CalendarControlsProps> = ({
  viewMode,
  calendarView,
  filterMode,
  onViewModeChange,
  onCalendarViewChange,
  onFilterModeChange
}) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <ViewModeToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />
      <CalendarViewToggle calendarView={calendarView} onCalendarViewChange={onCalendarViewChange} />
    </div>
    
    <FilterToggle 
      filterMode={filterMode} 
      viewMode={viewMode} 
      onFilterModeChange={onFilterModeChange} 
    />
  </div>
);