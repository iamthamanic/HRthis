import _React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../state/auth';
import { useLeavesStore } from '../state/leaves';
import { useTimeRecordsStore } from '../state/timeRecords';
import { useTeamsStore } from '../state/teams';
import { useNotificationsStore } from '../state/notifications';
import { TeamCalendarView } from '../components/TeamCalendarView';
import { CalendarEntry } from '../types/calendar';
import { TimeRecord } from '../types';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { cn } from '../utils/cn';

/**
 * Combined Time & Vacation Module
 * Unified calendar view showing work times, vacation days, and sick days
 * Includes status overview and application management
 */
export const TimeAndVacationScreen = () => {
  const navigate = useNavigate();
  const { user, getAllUsers } = useAuthStore();
  const { _getAllLeaveRequests } = useLeavesStore();
  const { _getUnreadNotificationsForUser, _markAsRead, _removeAllUserNotifications } = useNotificationsStore();
  const { getTimeRecordsForPeriod, _getTodayRecord, _isCurrentlyTracking, _clockIn, _clockOut } = useTimeRecordsStore();
  const { _getTeamsByUserId } = useTeamsStore();
  
  const [view, setView] = useState<'monat' | 'jahr'>('monat');
  const [calendarType, setCalendarType] = useState<'mein' | 'team'>('mein');
  const [requestsTab, setRequestsTab] = useState<'my' | 'manage'>('my');
  const [selectedTeamId, setSelectedTeamId] = useState<string>('user');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const allLeaves = getAllLeaveRequests();
  const isTracking = user ? isCurrentlyTracking(user.id) : false;
  const todayRecord = user ? getTodayRecord(user.id) : null;
  const unreadNotifications = user ? getUnreadNotificationsForUser(user.id) : [];
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPERADMIN';

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Get users to display based on calendar type
  const displayUsers = useMemo(() => {
    if (!user) return [];
    
    if (calendarType === 'mein') {
      // Show only current user
      return [{
        userId: user.id,
        userName: user.name
      }];
    } else {
      // Show all users in the organization
      const allUsers = getAllUsers();
      return allUsers
        .filter(u => u.organizationId === user.organizationId)
        .map(u => ({
          userId: u.id,
          userName: u.name
        }));
    }
  }, [user, getAllUsers, calendarType]);

  /**
   * Get vacation statistics for current user
   */
  const getVacationStats = () => {
    if (!user) return { total: 0, used: 0, remaining: 0 };
    
    const currentYear = new Date().getFullYear();
    const approvedVacations = allLeaves.filter(leave =>
      leave.userId === user.id &&
      leave.type === 'VACATION' &&
      leave.status === 'APPROVED' &&
      new Date(leave.startDate).getFullYear() === currentYear
    );
    
    const usedDays = approvedVacations.reduce((total, leave) => {
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return total + days;
    }, 0);
    
    const totalDays = user.vacationDays || 30;
    
    return {
      total: totalDays,
      used: usedDays,
      remaining: Math.max(0, totalDays - usedDays)
    };
  };

  // Convert leave requests and time records to calendar entries
  const calendarEntries = useMemo(() => {
    if (!user || displayUsers.length === 0) return [];
    
    const entries: CalendarEntry[] = [];
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const startDateStr = new Date(currentYear, currentMonth - 1, 1).toISOString().split('T')[0];
    const endDateStr = new Date(currentYear, currentMonth + 2, 0).toISOString().split('T')[0];
    
    const isAdmin = user.role === 'ADMIN' || user.role === 'SUPERADMIN';
    
    // Process each user
    displayUsers.forEach(displayUser => {
      // Add leave requests for this user
      allLeaves
        .filter(leave => leave.userId === displayUser.userId)
        .forEach(request => {
          // Only show vacation (green) and sick leave (blue)
          if (request.type === 'VACATION' || request.type === 'SICK') {
            const start = new Date(request.startDate);
            const end = new Date(request.endDate);
            
            for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
              entries.push({
                userId: request.userId,
                userName: displayUser.userName,
                date: format(date, 'yyyy-MM-dd'),
                type: request.type === 'VACATION' ? 'urlaub' : 'krank',
                status: request.status.toLowerCase() as 'beantragt' | 'genehmigt' | 'abgelehnt'
              });
            }
          }
        });
      
      // Add time records - only for "Mein Kalender" or if user is admin in "Teamkalender"
      const shouldShowWorkTime = calendarType === 'mein' || (calendarType === 'team' && isAdmin);
      
      if (shouldShowWorkTime) {
        const timeRecords = getTimeRecordsForPeriod(displayUser.userId, startDateStr, endDateStr);
        timeRecords.forEach((record: TimeRecord) => {
          if (record.totalHours) {
            entries.push({
              userId: record.userId,
              userName: displayUser.userName,
              date: record.date,
              type: 'zeit',
              stunden: record.totalHours
            });
          }
        });
      }
    });

    return entries;
  }, [user, displayUsers, allLeaves, getTimeRecordsForPeriod, calendarType]);

  // Handle cell click for calendar
  const handleCellClick = (_userId: string, date: string) => {
    // Open detail modal for work time entries
    const clickedDate = new Date(date);
    const dateStr = date;
    const timeRecord = getTimeRecordsForPeriod(userId, dateStr, dateStr)[0];
    
    if (timeRecord && timeRecord.totalHours > 0) {
      setSelectedDay(clickedDate);
      setShowDetailModal(true);
    }
  };

  /**
   * Clock in/out handlers
   */
  const handleClockIn = async () => {
    if (!user) return;
    
    try {
      setError('');
      await clockIn(user.id);
      setSuccess('Erfolgreich eingestempelt!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Einstempeln');
    }
  };

  const handleClockOut = async () => {
    if (!user) return;
    
    try {
      setError('');
      await clockOut(user.id, 30);
      setSuccess('Erfolgreich ausgestempelt!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Ausstempeln');
    }
  };

  const vacationStats = getVacationStats();

  /**
   * Check if a leave request has unread notifications
   */
  const hasUnreadNotification = (leaveRequestId: string): boolean => {
    return unreadNotifications.some(notification => 
      notification.relatedId === leaveRequestId && 
      (notification.type === 'leave_approved' || notification.type === 'leave_rejected')
    );
  };

  /**
   * Get user name by ID
   */
  const getUserName = (userId: string): string => {
    const allUsers = getAllUsers();
    const foundUser = allUsers.find(u => u.id === userId);
    return foundUser?.name || 'Unbekannt';
  };

  /**
   * Handle click on leave request - mark related notifications as read
   */
  const handleLeaveRequestClick = (_leaveRequestId: string) => {
    // Mark all related notifications as read
    unreadNotifications.forEach(notification => {
      if (notification.relatedId === leaveRequestId && 
          (notification.type === 'leave_approved' || notification.type === 'leave_rejected')) {
        markAsRead(notification.id);
      }
    });
  };

  if (!user) return null;

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Zeit & Urlaub</h1>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/request-leave')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              + Neue Abwesenheit
            </button>
          </div>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* User Info */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Meine Daten</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Beschäftigungsart:</span>
                <span className="font-medium">Vollzeit</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Wochenstunden:</span>
                <span className="font-medium">40h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Urlaubstage/Jahr:</span>
                <span className="font-medium">{vacationStats.total}</span>
              </div>
            </div>
          </div>

          {/* Vacation Stats */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Urlaubsübersicht {new Date().getFullYear()}
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{vacationStats.remaining}</p>
                <p className="text-xs text-gray-500">Verfügbar</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{vacationStats.used}</p>
                <p className="text-xs text-gray-500">Genommen</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{vacationStats.total}</p>
                <p className="text-xs text-gray-500">Gesamt</p>
              </div>
            </div>
          </div>

          {/* Today's Time Tracking */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Heute</h3>
            <div className="space-y-3">
              <div className="text-center">
                <p className="text-lg font-mono font-bold text-gray-900">
                  {format(currentTime, 'HH:mm:ss')}
                </p>
                <p className="text-sm text-gray-500">Aktuelle Zeit</p>
              </div>
              
              {todayRecord && (
                <div className="text-sm">
                  <p className="text-gray-600">Heute gestempelt:</p>
                  <p className="font-mono">
                    {todayRecord.timeIn} {todayRecord.timeOut ? `– ${todayRecord.timeOut}` : '– läuft'}
                  </p>
                  {todayRecord.totalHours > 0 && (
                    <p className="text-gray-600">Arbeitszeit: {todayRecord.totalHours.toFixed(1)}h</p>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={handleClockIn}
                  disabled={isTracking}
                  className={cn(
                    "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors",
                    isTracking 
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                  )}
                >
                  Einstempeln
                </button>
                <button
                  onClick={handleClockOut}
                  disabled={!isTracking}
                  className={cn(
                    "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors",
                    !isTracking 
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-red-600 text-white hover:bg-red-700"
                  )}
                >
                  Ausstempeln
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        {/* Team Calendar - Timebutler Style */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {calendarType === 'mein' ? 'Mein Kalender' : 'Team Kalender'}
            </h3>
            
            <div className="flex items-center gap-4">
              {/* Calendar Type Toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCalendarType('mein')}
                  className={cn(
                    "px-3 py-1.5 rounded-lg font-medium transition-colors text-sm",
                    calendarType === 'mein' 
                      ? "bg-green-600 text-white" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  Mein Kalender
                </button>
                <button
                  onClick={() => setCalendarType('team')}
                  className={cn(
                    "px-3 py-1.5 rounded-lg font-medium transition-colors text-sm",
                    calendarType === 'team' 
                      ? "bg-green-600 text-white" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  Team Kalender
                </button>
              </div>
              
              {/* View Toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setView('monat')}
                  className={cn(
                    "px-3 py-1.5 rounded-lg font-medium transition-colors text-sm",
                    view === 'monat' 
                      ? "bg-blue-600 text-white" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  Monat
                </button>
                <button
                  onClick={() => setView('jahr')}
                  className={cn(
                    "px-3 py-1.5 rounded-lg font-medium transition-colors text-sm",
                    view === 'jahr' 
                      ? "bg-blue-600 text-white" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  Jahr
                </button>
              </div>
            </div>
          </div>

          {/* Team Calendar Component */}
          <TeamCalendarView
            view={view}
            entries={calendarEntries}
            users={displayUsers}
            onCellClick={handleCellClick}
            isAdmin={false}
            showLegend={false}
          />
          
          {/* Custom Legend - Only 3 Categories */}
          <div className="mt-4 flex justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: "#22c55e" }}></div>
              <span>Urlaub</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: "#3b82f6" }}></div>
              <span>Krankheit</span>
            </div>
            {((calendarType === 'mein') || (calendarType === 'team' && (user.role === 'ADMIN' || user.role === 'SUPERADMIN'))) && (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: "#9ca3af" }}></div>
                <span>Arbeitszeit</span>
              </div>
            )}
          </div>
        </div>

        {/* Applications Management */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Abwesenheiten</h3>
            <div className="flex items-center gap-3">
              {/* Debug Button - temporär zum Testen */}
              <button
                onClick={() => {
                  console.log('Lösche Notifications für User:', user.id);
                  removeAllUserNotifications(user.id);
                }}
                className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                🗑️ Debug: Notifications löschen
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
            <button
              onClick={() => setRequestsTab('my')}
              className={cn(
                "flex-1 py-2 px-3 rounded-md transition-colors text-sm font-medium",
                requestsTab === 'my' 
                  ? "bg-white text-gray-900 shadow-sm" 
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              Meine Abwesenheiten
            </button>
            {isAdmin && (
              <button
                onClick={() => setRequestsTab('manage')}
                className={cn(
                  "flex-1 py-2 px-3 rounded-md transition-colors text-sm font-medium",
                  requestsTab === 'manage' 
                    ? "bg-white text-gray-900 shadow-sm" 
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                Abwesenheiten verwalten
              </button>
            )}
          </div>
          
          <div className="space-y-4">
            {(requestsTab === 'my' ? 
              allLeaves.filter(leave => leave.userId === user.id) :
              allLeaves
            )
              .sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime())
              .slice(0, 8)
              .map(leave => {
                const start = new Date(leave.startDate);
                const end = new Date(leave.endDate);
                const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                const hasNotification = hasUnreadNotification(leave.id);

                return (
                  <div 
                    key={leave.id} 
                    className={cn(
                      "p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors relative",
                      hasNotification && "bg-blue-50 border-blue-200"
                    )}
                    onClick={() => handleLeaveRequestClick(leave.id)}
                  >
                    {/* Notification Indicator */}
                    {hasNotification && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                    )}
                    
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">
                          {leave.type === 'VACATION' ? '🏖️' : '🏥'}
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-gray-900">
                              {requestsTab === 'manage' ? `${getUserName(leave.userId)} - ` : ''}
                              {leave.type === 'VACATION' ? 'Urlaub' : 'Krankheit'}
                            </p>
                            {hasNotification && (
                              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                                🔔 Neu
                              </span>
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">
                            {format(start, 'dd.MM.yyyy')} - {format(end, 'dd.MM.yyyy')} ({days} Tag{days !== 1 ? 'e' : ''})
                          </p>
                          
                          {leave.comment && (
                            <p className="text-sm text-gray-600 italic mb-2">"{leave.comment}"</p>
                          )}
                          
                          <div className="text-xs text-gray-500 space-y-1">
                            <p>Erstellt: {format(new Date(leave.createdAt), 'dd.MM.yyyy HH:mm')} von {getUserName(leave.userId)}</p>
                            {leave.approvedAt && leave.approvedBy && (
                              <p>
                                {leave.status === 'APPROVED' ? 'Genehmigt' : 'Abgelehnt'}: {format(new Date(leave.approvedAt), 'dd.MM.yyyy HH:mm')} von {getUserName(leave.approvedBy)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium",
                        leave.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                        leave.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      )}>
                        {leave.status === 'APPROVED' ? 'Genehmigt' :
                         leave.status === 'PENDING' ? 'Ausstehend' : 'Abgelehnt'}
                      </span>
                    </div>
                  </div>
                );
              })}
          
            {(requestsTab === 'my' ? 
              allLeaves.filter(leave => leave.userId === user.id) :
              allLeaves
            ).length === 0 && (
              <p className="text-gray-500 text-center py-4">
                Noch keine Abwesenheiten vorhanden
              </p>
            )}
          </div>
        </div>

        {/* Detail Modal for Work Time */}
        {showDetailModal && selectedDay && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  Arbeitszeit - {format(selectedDay, 'dd.MM.yyyy', { locale: de })}
                </h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              {(() => {
                const dateStr = format(selectedDay, 'yyyy-MM-dd');
                const timeRecord = getTimeRecordsForPeriod(user!.id, dateStr, dateStr)[0];
                
                if (!timeRecord) {
                  return (
                    <p className="text-gray-500 text-center py-4">
                      Keine Arbeitszeit für diesen Tag gefunden
                    </p>
                  );
                }

                return (
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Arbeitsbeginn:</span>
                          <p className="font-mono font-medium">{timeRecord.timeIn}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Arbeitsende:</span>
                          <p className="font-mono font-medium">{timeRecord.timeOut || 'läuft'}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Pause:</span>
                          <p className="font-mono font-medium">{timeRecord.breakMinutes}min</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Gesamtzeit:</span>
                          <p className="font-mono font-medium">{timeRecord.totalHours.toFixed(1)}h</p>
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <span className={cn(
                        "inline-block px-3 py-1 rounded-full text-sm font-medium",
                        timeRecord.totalHours >= 8 ? "bg-green-100 text-green-800" :
                        timeRecord.totalHours >= 6 ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      )}>
                        {timeRecord.totalHours >= 8 ? "Vollzeit erreicht" :
                         timeRecord.totalHours >= 6 ? "Teilzeit" : "Unterzeit"}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};