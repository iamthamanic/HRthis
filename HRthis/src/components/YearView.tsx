import React from 'react';
import { LeaveRequest, User } from '../types';
import { WeekHeaderRow } from './yearview/WeekHeaderRow';
import { UserVacationRow } from './yearview/UserVacationRow';
import { getCurrentWeekNumber } from './yearview/yearViewHelpers';

interface YearViewProps {
  year: number;
  yearData: { [userId: string]: { [week: string]: LeaveRequest[] } };
  allUsers: User[];
  viewMode: 'personal' | 'team';
  getUserName: (userId: string) => string;
}

const YearViewLegend: React.FC = () => (
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
);

const UserRowsContainer: React.FC<{
  allUsers: User[];
  getUserName: (userId: string) => string;
  weeks: number[];
  year: number;
  currentWeek: number;
  yearData: { [userId: string]: { [week: string]: LeaveRequest[] } };
}> = ({ allUsers, getUserName, weeks, year, currentWeek, yearData }) => (
  <div className="space-y-1">
    {allUsers.map(user => (
      <UserVacationRow
        key={user.id}
        userId={user.id}
        userName={getUserName(user.id)}
        weeks={weeks}
        year={year}
        currentWeek={currentWeek}
        yearData={yearData}
      />
    ))}
  </div>
);

export const YearView: React.FC<YearViewProps> = ({
  year,
  yearData,
  allUsers,
  viewMode,
  getUserName
}) => {
  const weeks = Array.from({ length: 53 }, (_, i) => i + 1);
  const currentWeek = getCurrentWeekNumber();

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <div className="min-w-max">
          <WeekHeaderRow 
            year={year}
            weeks={weeks}
            viewMode={viewMode}
          />
          
          <UserRowsContainer
            allUsers={allUsers}
            getUserName={getUserName}
            weeks={weeks}
            year={year}
            currentWeek={currentWeek}
            yearData={yearData}
          />
        </div>
      </div>

      <YearViewLegend />
    </div>
  );
};