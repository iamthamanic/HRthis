import React from 'react';
import { getWeekDateRange, MONTH_NAMES } from './yearViewHelpers';

interface WeekHeaderRowProps {
  year: number;
  weeks: number[];
  viewMode: 'personal' | 'team';
}

export const WeekHeaderRow: React.FC<WeekHeaderRowProps> = ({
  year,
  weeks,
  viewMode
}) => (
  <>
    <div className="flex gap-1 mb-2">
      <div className="w-32 text-sm font-medium text-gray-500 text-center flex-shrink-0">
        {viewMode === 'team' ? 'Mitarbeiter' : 'Benutzer'}
      </div>
      {weeks.map(week => {
        const { start } = getWeekDateRange(week, year);
        const monthIndex = start.getMonth();
        const isFirstWeekOfMonth = week === 1 || 
          (week > 1 && getWeekDateRange(week - 1, year).start.getMonth() !== monthIndex);
        
        return (
          <div key={week} className="w-8 text-xs text-center flex-shrink-0">
            {isFirstWeekOfMonth && (
              <div className="text-gray-600 font-medium mb-1">
                {MONTH_NAMES[monthIndex]}
              </div>
            )}
            <div className="text-gray-400">{week}</div>
          </div>
        );
      })}
    </div>
  </>
);