import React from 'react';
import { CalendarEntry, colorMap, abbreviationMap, getWorkTimeColor } from '../../types/calendar';
import { cn } from '../../utils/cn';
import { format, isToday, startOfMonth, endOfMonth, eachDayOfInterval, startOfYear, endOfYear } from 'date-fns';
import { de } from 'date-fns/locale';

// Helper function to generate date range
export const generateDateRange = (view: 'monat' | 'jahr', selectedMonth: Date): Date[] => {
  if (view === 'monat') {
    const start = startOfMonth(selectedMonth);
    const end = endOfMonth(selectedMonth);
    return eachDayOfInterval({ start, end });
  } else {
    const start = startOfYear(selectedMonth);
    const end = endOfYear(selectedMonth);
    return eachDayOfInterval({ start, end });
  }
};

// Helper function to get entry for specific user and date
export const getEntryForUserAndDate = (
  entries: CalendarEntry[],
  userId: string,
  date: Date
): CalendarEntry | undefined => {
  const dateString = format(date, 'yyyy-MM-dd');
  return entries.find(entry => 
    entry.userId === userId && entry.date === dateString
  );
};

// Helper function to get background color for cell
export const getCellBackgroundColor = (entry: CalendarEntry | undefined): string => {
  if (!entry) return 'bg-gray-50';
  
  if (entry.type === 'zeit') {
    return getWorkTimeColor(entry.stunden);
  }
  
  return colorMap[entry.type] || '#f0f0f0';
};

// Helper function to get cell content
export const getCellContent = (entry: CalendarEntry | undefined): string => {
  if (!entry) return '';
  
  if (entry.type === 'zeit') {
    return typeof abbreviationMap.zeit === 'function' 
      ? abbreviationMap.zeit(entry.stunden) 
      : 'A';
  }
  
  return abbreviationMap[entry.type] || '';
};

// Helper function to render month header
export const renderMonthHeader = (
  selectedMonth: Date,
  setSelectedMonth: (date: Date) => void,
  view: 'monat' | 'jahr'
) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <button
        onClick={() => {
          const newDate = new Date(selectedMonth);
          if (view === 'monat') {
            newDate.setMonth(newDate.getMonth() - 1);
          } else {
            newDate.setFullYear(newDate.getFullYear() - 1);
          }
          setSelectedMonth(newDate);
        }}
        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        ‹
      </button>
      
      <h3 className="text-lg font-semibold">
        {view === 'monat' 
          ? format(selectedMonth, 'MMMM yyyy', { locale: de })
          : format(selectedMonth, 'yyyy', { locale: de })
        }
      </h3>
      
      <button
        onClick={() => {
          const newDate = new Date(selectedMonth);
          if (view === 'monat') {
            newDate.setMonth(newDate.getMonth() + 1);
          } else {
            newDate.setFullYear(newDate.getFullYear() + 1);
          }
          setSelectedMonth(newDate);
        }}
        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        ›
      </button>
    </div>
  );
};

// Helper function to render calendar cell
export const renderCalendarCell = (params: {
  entry: CalendarEntry | undefined;
  date: Date;
  userId: string;
  hoveredCell: { userId: string; date: string } | null;
  onCellClick?: (userId: string, date: string) => void;
  setHoveredCell?: (cell: { userId: string; date: string } | null) => void;
}) => {
  const { entry, date, userId, hoveredCell, onCellClick, setHoveredCell } = params;
  const dateString = format(date, 'yyyy-MM-dd');
  const isHovered = hoveredCell?.userId === userId && hoveredCell?.date === dateString;
  const cellBgColor = getCellBackgroundColor(entry);
  const cellContent = getCellContent(entry);
  
  return (
    <div
      key={dateString}
      className={cn(
        "w-8 h-8 border text-xs flex items-center justify-center cursor-pointer transition-all",
        isToday(date) && "ring-2 ring-blue-500",
        isHovered && "scale-110 z-10 shadow-lg",
        "hover:scale-105"
      )}
      style={{ backgroundColor: cellBgColor }}
      onClick={() => onCellClick?.(userId, dateString)}
      onMouseEnter={() => setHoveredCell?.({ userId, date: dateString })}
      onMouseLeave={() => setHoveredCell?.(null)}
      title={entry ? `${entry.type}${entry.stunden ? ` (${entry.stunden}h)` : ''}` : 'Keine Einträge'}
    >
      {cellContent}
    </div>
  );
};