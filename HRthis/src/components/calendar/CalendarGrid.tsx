import React from 'react';
import { CalendarDay, CalendarEvent, CalendarFilterMode } from '../../types/calendar';
import { cn } from '../../utils/cn';

interface CalendarGridProps {
  calendarDays: CalendarDay[];
  events: CalendarEvent[];
  filterMode: CalendarFilterMode;
  onDayClick: (day: CalendarDay) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  calendarDays,
  events,
  filterMode,
  onDayClick
}) => {
  const weekdays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

  const renderDayContent = (day: CalendarDay) => {
    const dayDateString = day.date instanceof Date ? day.date.toISOString().split('T')[0] : day.date;
    const dayEvents = events.filter(event => event.date === dayDateString);
    
    const filteredEvents = dayEvents.filter(event => {
      if (filterMode === 'all') return true;
      if (filterMode === 'leaves') return event.type === 'urlaub' || event.type === 'krank';
      if (filterMode === 'work') return event.type === 'zeit';
      return true;
    });

    return (
      <div className="h-full flex flex-col p-1">
        <span className={cn(
          "text-sm font-medium mb-1",
          !day.isCurrentMonth && "text-gray-400",
          day.isToday && "text-blue-600 font-bold",
          day.isWeekend && day.isCurrentMonth && "text-gray-600"
        )}>
          {day.date instanceof Date ? day.date.getDate() : new Date(day.date).getDate()}
        </span>
        
        <div className="flex-1 space-y-0.5">
          {filteredEvents.slice(0, 3).map((event, index) => (
            <div key={index} className={cn(
              "text-xs px-1 py-0.5 rounded text-white truncate",
              event.color
            )}>
              {event.title}
            </div>
          ))}
          
          {filteredEvents.length > 3 && (
            <div className="text-xs text-gray-500">
              +{filteredEvents.length - 3} mehr
            </div>
          )}
        </div>
        
        {day.isWeekend && day.isCurrentMonth && (
          <div className="text-xs text-gray-400 mt-auto">
            {(day.date instanceof Date ? day.date.getDay() : new Date(day.date).getDay()) === 6 ? 'SA' : 'SO'}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-2">
        {weekdays.map((day) => (
          <div key={day} className="flex items-center justify-center py-3">
            <span className="text-sm font-semibold text-gray-500">{day}</span>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0 border border-gray-200 rounded-lg overflow-hidden">
        {calendarDays.map((day, index) => (
          <button
            key={index}
            className={cn(
              "aspect-square border-b border-r border-gray-100 text-left hover:bg-gray-50 transition-colors relative",
              !day.isCurrentMonth && "bg-gray-50",
              day.isToday && "bg-blue-50 border-blue-200",
              day.isWeekend && "bg-gray-25"
            )}
            onClick={() => onDayClick(day)}
          >
            {renderDayContent(day)}
          </button>
        ))}
      </div>
    </div>
  );
};