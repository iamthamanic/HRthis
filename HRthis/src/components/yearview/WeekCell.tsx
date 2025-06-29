import React, { useState } from 'react';
import { LeaveRequest } from '../../types';
import { cn } from '../../utils/cn';
import { getWeekLeaveType, getCellColor, formatWeekRange } from './yearViewHelpers';

interface WeekCellProps {
  week: number;
  year: number;
  leaves: LeaveRequest[];
  currentWeek: number;
}

export const WeekCell: React.FC<WeekCellProps> = ({
  week,
  year,
  leaves,
  currentWeek
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const leaveType = getWeekLeaveType(leaves);
  const isCurrentWeek = week === currentWeek;
  const cellColor = getCellColor(leaveType, isCurrentWeek);

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div
        className={cn(
          "w-8 h-8 border rounded cursor-pointer transition-colors",
          cellColor
        )}
      />
      
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap z-10">
          <div className="font-medium">KW {week}</div>
          <div>{formatWeekRange(week, year)}</div>
          {leaves.length > 0 && (
            <div className="mt-1">
              {leaves.map((leave, index) => (
                <div key={index}>
                  {leave.type === 'VACATION' ? '🏖️ Urlaub' : '🤒 Krank'}: {leave.startDate} - {leave.endDate}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};