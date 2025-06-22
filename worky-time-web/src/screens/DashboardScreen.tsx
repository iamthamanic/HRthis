import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../state/auth';
import { useLeavesStore } from '../state/leaves';
import { useTimeRecordsStore } from '../state/timeRecords';
import { useCoinsStore } from '../state/coins';
import { useCoinEventsStore } from '../state/coinEvents';
import { cn } from '../utils/cn';

/**
 * Main dashboard screen showing personalized information
 * Different views for employees and admins
 */
export const DashboardScreen = () => {
  const navigate = useNavigate();
  const { user, organization, logout, updateUser, getAllUsers } = useAuthStore();
  const { getAllLeaveRequests } = useLeavesStore();
  const { getTimeRecords, getMonthlyStats, getWeeklyStats } = useTimeRecordsStore();
  const { getUserBalance } = useCoinsStore();
  const { getNextEvent, getUnlockedEvents } = useCoinEventsStore();

  const [selectedUserId, setSelectedUserId] = useState(user?.id || '');
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [editForm, setEditForm] = useState({
    position: '',
    weeklyHours: '',
    vacationDays: ''
  });

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPERADMIN';
  const allUsers = isAdmin ? getAllUsers() : [];
  const displayUser = isAdmin && selectedUserId !== user.id 
    ? allUsers.find(u => u.id === selectedUserId) || user 
    : user;

  useEffect(() => {
    if (displayUser) {
      setEditForm({
        position: displayUser.position || '',
        weeklyHours: displayUser.weeklyHours?.toString() || '',
        vacationDays: displayUser.vacationDays?.toString() || ''
      });
    }
  }, [displayUser]);

  if (!user || !displayUser) return null;

  // Get user's data
  const userBalance = getUserBalance(displayUser.id);
  const todayDate = new Date().toISOString().split('T')[0];
  const todayRecords = getTimeRecords(displayUser.id).filter(record => record.date === todayDate);
  const todayRecord = todayRecords[0];
  
  // Calculate monthly and weekly stats
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyStats = getMonthlyStats(displayUser.id, currentMonth, currentYear);
  const weeklyStats = getWeeklyStats(displayUser.id);

  // Calculate vacation usage
  const approvedVacations = getAllLeaveRequests()
    .filter(req => 
      req.userId === displayUser.id && 
      req.type === 'VACATION' && 
      req.status === 'APPROVED' &&
      new Date(req.startDate).getFullYear() === currentYear
    );
  
  const usedVacationDays = approvedVacations.reduce((total, req) => {
    const start = new Date(req.startDate);
    const end = new Date(req.endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return total + days;
  }, 0);

  // Calculate working hours based on employment type
  const expectedMonthlyHours = displayUser.weeklyHours ? (displayUser.weeklyHours * 4.33) : 0; // Average weeks per month
  const expectedWeeklyHours = displayUser.weeklyHours || 0;

  // Get coin level info
  const coinBalance = userBalance?.currentBalance || 0;
  const nextEvent = getNextEvent(coinBalance);
  const unlockedEvents = getUnlockedEvents(coinBalance);
  const currentLevel = unlockedEvents.length > 0 ? unlockedEvents[unlockedEvents.length - 1] : null;

  /**
   * Handles saving user edits (admin only)
   */
  const handleSaveUserEdit = async () => {
    if (!isAdmin || !displayUser) return;

    try {
      await updateUser(displayUser.id, {
        position: editForm.position,
        weeklyHours: parseInt(editForm.weeklyHours) || undefined,
        vacationDays: parseInt(editForm.vacationDays) || undefined
      });
      setIsEditingUser(false);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  /**
   * Formats time to German format
   */
  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {displayUser.id === user.id 
                  ? `Hallo, ${displayUser.firstName || displayUser.name.split(' ')[0]}!`
                  : `Mitarbeiter: ${displayUser.name}`
                }
              </h1>
              {isAdmin && displayUser.id !== user.id && (
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="mt-2 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={user.id}>Meine Ansicht</option>
                  {allUsers.filter(u => u.id !== user.id).map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate('/settings')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Einstellungen"
              >
                ⚙️
              </button>
              <button 
                onClick={logout}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <span className="text-gray-700">Abmelden</span>
              </button>
            </div>
          </div>

          {/* Position and Organization */}
          <div className="mt-4 grid md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Position</p>
              {isEditingUser ? (
                <input
                  type="text"
                  value={editForm.position}
                  onChange={(e) => setEditForm({...editForm, position: e.target.value})}
                  className="mt-1 w-full border border-gray-300 rounded px-2 py-1 text-sm"
                />
              ) : (
                <p className="font-medium">{displayUser.position || '-'}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500">Abteilung</p>
              <p className="font-medium">{displayUser.department || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Organisation</p>
              <p className="font-medium">{organization?.name}</p>
            </div>
          </div>

          {/* Admin Edit Controls */}
          {isAdmin && displayUser.id !== user.id && (
            <div className="mt-4 flex justify-end">
              {isEditingUser ? (
                <>
                  <button
                    onClick={() => setIsEditingUser(false)}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Abbrechen
                  </button>
                  <button
                    onClick={handleSaveUserEdit}
                    className="ml-2 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Speichern
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditingUser(true)}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Bearbeiten
                </button>
              )}
            </div>
          )}
        </div>

        {/* Main Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Working Time Today */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-500">Heute</h3>
              <span className="text-2xl">⏰</span>
            </div>
            {todayRecord ? (
              <>
                <p className="text-2xl font-bold text-gray-900">{todayRecord.totalHours}h</p>
                <p className="text-sm text-gray-500 mt-1">
                  {formatTime(todayRecord.timeIn)} - {todayRecord.timeOut ? formatTime(todayRecord.timeOut) : 'läuft'}
                </p>
                {!todayRecord.timeOut && (
                  <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Gestempelt
                  </span>
                )}
              </>
            ) : (
              <>
                <p className="text-2xl font-bold text-gray-400">-</p>
                <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  Nicht gestempelt
                </span>
              </>
            )}
          </div>

          {/* Monthly Hours */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-500">Monat</h3>
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{monthlyStats.totalHours.toFixed(1)}h</p>
            <div className="mt-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Soll: {expectedMonthlyHours.toFixed(0)}h</span>
                <span className={cn(
                  "font-medium",
                  monthlyStats.totalHours >= expectedMonthlyHours ? "text-green-600" : "text-orange-600"
                )}>
                  {monthlyStats.totalHours >= expectedMonthlyHours ? '+' : ''}{(monthlyStats.totalHours - expectedMonthlyHours).toFixed(1)}h
                </span>
              </div>
              <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={cn(
                    "h-2 rounded-full transition-all",
                    monthlyStats.totalHours >= expectedMonthlyHours ? "bg-green-500" : "bg-blue-500"
                  )}
                  style={{ width: `${Math.min((monthlyStats.totalHours / expectedMonthlyHours) * 100, 100)}%` }}
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Woche: {weeklyStats.totalHours.toFixed(1)}h / {expectedWeeklyHours}h
            </p>
          </div>

          {/* Vacation */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-500">Urlaub</h3>
              <span className="text-2xl">🏖️</span>
            </div>
            <div>
              {isEditingUser ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={editForm.vacationDays}
                    onChange={(e) => setEditForm({...editForm, vacationDays: e.target.value})}
                    className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
                  />
                  <span className="text-sm text-gray-500">Tage/Jahr</span>
                </div>
              ) : (
                <>
                  <p className="text-2xl font-bold text-gray-900">
                    {(displayUser.vacationDays || 0) - usedVacationDays}
                  </p>
                  <p className="text-sm text-gray-500">von {displayUser.vacationDays || 0} Tagen</p>
                </>
              )}
            </div>
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Genommen:</span>
                <span className="font-medium">{usedVacationDays} Tage</span>
              </div>
              {displayUser.employmentType === 'PART_TIME' && (
                <p className="text-xs text-blue-600">Teilzeit-angepasst</p>
              )}
            </div>
          </div>

          {/* Browo Coins & Level */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-500">Browo Coins</h3>
              <span className="text-2xl">🪙</span>
            </div>
            <p className="text-2xl font-bold text-yellow-600">{coinBalance}</p>
            {currentLevel && (
              <p className="text-sm text-purple-600 font-medium mt-1">
                {currentLevel.title}
              </p>
            )}
            {nextEvent && (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Nächstes Level</span>
                  <span>{coinBalance}/{nextEvent.requiredCoins}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min((coinBalance / nextEvent.requiredCoins) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Employment Details (Admin editable) */}
        {isAdmin && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Beschäftigungsdetails</h2>
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Wochenarbeitszeit</p>
                {isEditingUser ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={editForm.weeklyHours}
                      onChange={(e) => setEditForm({...editForm, weeklyHours: e.target.value})}
                      className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
                    />
                    <span className="text-sm">Stunden</span>
                  </div>
                ) : (
                  <p className="font-medium">{displayUser.weeklyHours || '-'}h / Woche</p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500">Beschäftigungsart</p>
                <p className="font-medium">
                  {displayUser.employmentType === 'FULL_TIME' && 'Vollzeit'}
                  {displayUser.employmentType === 'PART_TIME' && 'Teilzeit'}
                  {displayUser.employmentType === 'MINI_JOB' && 'Minijob'}
                  {!displayUser.employmentType && '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Eintrittsdatum</p>
                <p className="font-medium">
                  {displayUser.joinDate ? new Date(displayUser.joinDate).toLocaleDateString('de-DE') : '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium">
                  {displayUser.employmentStatus === 'ACTIVE' && '✅ Aktiv'}
                  {displayUser.employmentStatus === 'PARENTAL_LEAVE' && '👶 Elternzeit'}
                  {displayUser.employmentStatus === 'TERMINATED' && '❌ Ausgeschieden'}
                  {!displayUser.employmentStatus && '-'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/time')}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">⏰</span>
              <span className="text-gray-400">→</span>
            </div>
            <h3 className="font-semibold text-gray-900">Arbeitszeit</h3>
            <p className="text-sm text-gray-500 mt-1">Stempeln & Übersicht</p>
          </button>

          <button
            onClick={() => navigate('/calendar')}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">📅</span>
              <span className="text-gray-400">→</span>
            </div>
            <h3 className="font-semibold text-gray-900">Kalender</h3>
            <p className="text-sm text-gray-500 mt-1">Urlaub & Termine</p>
          </button>

          <button
            onClick={() => navigate('/benefits')}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">🎁</span>
              <span className="text-gray-400">→</span>
            </div>
            <h3 className="font-semibold text-gray-900">Benefits</h3>
            <p className="text-sm text-gray-500 mt-1">Shop & Coins</p>
          </button>

          <button
            onClick={() => navigate('/requests')}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">📝</span>
              <span className="text-gray-400">→</span>
            </div>
            <h3 className="font-semibold text-gray-900">Anträge</h3>
            <p className="text-sm text-gray-500 mt-1">Urlaub & Krankmeldung</p>
          </button>

          <button
            onClick={() => navigate('/documents')}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">📄</span>
              <span className="text-gray-400">→</span>
            </div>
            <h3 className="font-semibold text-gray-900">Dokumente</h3>
            <p className="text-sm text-gray-500 mt-1">Lohn & Verträge</p>
          </button>

          <button
            onClick={() => navigate('/settings')}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">⚙️</span>
              <span className="text-gray-400">→</span>
            </div>
            <h3 className="font-semibold text-gray-900">Einstellungen</h3>
            <p className="text-sm text-gray-500 mt-1">Profil & Daten</p>
          </button>
        </div>
      </div>
    </div>
  );
};