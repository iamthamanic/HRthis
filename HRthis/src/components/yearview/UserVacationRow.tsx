import React from 'react';
import { LeaveRequest } from '../../types';
import { WeekCell } from './WeekCell';

interface UserVacationRowProps {
  userId: string;
  userName: string;
  weeks: number[];
  year: number;
  currentWeek: number;
  yearData: { [userId: string]: { [week: string]: LeaveRequest[] } };
}

export const UserVacationRow: React.FC<UserVacationRowProps> = ({
  userId,
  userName,
  weeks,
  year,
  currentWeek,
  yearData
}) => (
  <div className="flex gap-1 items-center">
    <div className="w-32 text-sm font-medium text-gray-700 truncate flex-shrink-0">
      {userName}
    </div>
    {weeks.map(week => {
      const leaves = yearData[userId]?.[week.toString()] || [];
      return (
        <WeekCell
          key={week}
          week={week}
          year={year}
          leaves={leaves}
          currentWeek={currentWeek}
        />
      );
    })}
  </div>
);