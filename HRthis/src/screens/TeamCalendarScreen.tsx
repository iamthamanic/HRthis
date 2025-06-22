import React, { useState, useMemo } from 'react';
import { useAuthStore } from '../state/auth';
import { useTeamsStore } from '../state/teams';
import { useLeavesStore } from '../state/leaves';
import { useTimeRecordsStore } from '../state/timeRecords';
import { TeamCalendarView } from '../components/TeamCalendarView';
import { CalendarEntry } from '../types/calendar';
import { TimeRecord } from '../types';
import { format } from 'date-fns';

/**
 * Team Calendar Screen
 * Shows a comprehensive calendar view of all team members' absences and work times
 * Available in month and year view with filtering capabilities
 */
export const TeamCalendarScreen: React.FC = () => {
  const { user, getAllUsers } = useAuthStore();
  const { getTeamsByUserId } = useTeamsStore();
  const { getAllLeaveRequests } = useLeavesStore();
  const { getAllTimeRecords } = useTimeRecordsStore();
  
  const [view, setView] = useState<'monat' | 'jahr'>('monat');
  const [selectedTeamId, setSelectedTeamId] = useState<string>('all');

  // Check if current user is admin or manager
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPERADMIN';
  const userTeams = user ? getTeamsByUserId(user.id) : [];

  // Get users to display based on selected team
  const displayUsers = useMemo(() => {
    const allUsers = getAllUsers();
    
    if (!isAdmin && selectedTeamId === 'all') {
      // Non-admins only see their team members
      const teamMemberIds = new Set<string>();
      userTeams.forEach(team => {
        const teamFromStore = useTeamsStore.getState().getTeamById(team.id);
        teamFromStore?.memberIds.forEach(id => teamMemberIds.add(id));
      });
      return allUsers.filter(u => teamMemberIds.has(u.id));
    }
    
    if (selectedTeamId === 'all') {
      return allUsers;
    }
    
    const team = useTeamsStore.getState().getTeamById(selectedTeamId);
    return allUsers.filter(u => team?.memberIds.includes(u.id));
  }, [selectedTeamId, userTeams, isAdmin]);

  // Convert leave requests and time records to calendar entries
  const calendarEntries = useMemo(() => {
    const entries: CalendarEntry[] = [];
    const allUsers = getAllUsers();
    
    // Add leave requests
    const leaveRequests = getAllLeaveRequests();
    leaveRequests.forEach(request => {
      const user = allUsers.find(u => u.id === request.userId);
      if (!user) return;
      
      // Create entries for each day in the leave period
      const start = new Date(request.startDate);
      const end = new Date(request.endDate);
      
      for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
        entries.push({
          userId: request.userId,
          userName: user.name,
          date: format(date, 'yyyy-MM-dd'),
          type: request.type === 'VACATION' ? 'urlaub' : 'krank',
          status: request.status.toLowerCase() as 'beantragt' | 'genehmigt' | 'abgelehnt'
        });
      }
    });
    
    // Add time records
    const timeRecords = getAllTimeRecords();
    timeRecords.forEach((record: TimeRecord) => {
      const user = allUsers.find(u => u.id === record.userId);
      if (!user || !record.totalHours) return;
      
      entries.push({
        userId: record.userId,
        userName: user.name,
        date: record.date,
        type: 'zeit',
        stunden: record.totalHours
      });
    });

    // Add mock data for demonstration
    const mockEntries: CalendarEntry[] = [
      { userId: '1', userName: 'Max Mustermann', date: '2025-01-06', type: 'meeting' },
      { userId: '2', userName: 'Anna Admin', date: '2025-01-07', type: 'fortbildung' },
      { userId: '3', userName: 'Tom Teilzeit', date: '2025-01-08', type: 'ux' },
      { userId: '1', userName: 'Max Mustermann', date: '2025-01-09', type: 'zeit', stunden: 8.5 },
      { userId: '2', userName: 'Anna Admin', date: '2025-01-09', type: 'zeit', stunden: 6.0 },
      { userId: '3', userName: 'Tom Teilzeit', date: '2025-01-09', type: 'zeit', stunden: 4.0 },
    ];
    
    return [...entries, ...mockEntries];
  }, []);

  // Handle cell click
  const handleCellClick = (userId: string, date: string) => {
    if (!isAdmin) return;
    
    // In a real app, this would open a modal to edit the entry
    console.log('Cell clicked:', userId, date);
  };

  return (
    <div className="p-6 max-w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Team-Kalender</h1>
        <p className="text-gray-600">Übersicht über Abwesenheiten und Arbeitszeiten</p>
      </div>

      {/* Controls */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* View Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setView('monat')}
              className={cn(
                "px-4 py-2 rounded-lg font-medium transition-colors",
                view === 'monat' 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              Monatsansicht
            </button>
            <button
              onClick={() => setView('jahr')}
              className={cn(
                "px-4 py-2 rounded-lg font-medium transition-colors",
                view === 'jahr' 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              Jahresansicht
            </button>
          </div>

          {/* Team Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Team:</label>
            <select
              value={selectedTeamId}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Alle Teams</option>
              {userTeams.map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium">
            📄 PDF Export
          </button>
          <button className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium">
            📊 CSV Export
          </button>
        </div>
      </div>

      {/* Calendar Component */}
      <TeamCalendarView
        view={view}
        entries={calendarEntries}
        users={displayUsers.map(u => ({ userId: u.id, userName: u.name }))}
        onCellClick={handleCellClick}
        isAdmin={isAdmin}
      />
    </div>
  );
};

// Helper function for className
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}