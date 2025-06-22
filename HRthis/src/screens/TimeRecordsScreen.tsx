import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../state/auth';
import { useTimeRecordsStore } from '../state/timeRecords';
import { TimeRecord } from '../types';
import { cn } from '../utils/cn';

/**
 * Time tracking screen with clock in/out, overview, and calendar view
 * Features live timer, statistics, and admin management capabilities
 */
export const TimeRecordsScreen = () => {
  const { user } = useAuthStore();
  const { 
    getTimeRecordsForPeriod, 
    getTodayRecord, 
    isCurrentlyTracking, 
    clockIn, 
    clockOut,
    isLoading
  } = useTimeRecordsStore();
  
  const [viewMode, setViewMode] = useState<'clock' | 'overview' | 'calendar'>('clock');
  const [periodMode, setPeriodMode] = useState<'week' | 'month'>('week');
  const [timeRecords, setTimeRecords] = useState<TimeRecord[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [breakMinutes, setBreakMinutes] = useState(30);

  const isTracking = user ? isCurrentlyTracking(user.id) : false;
  const todayRecord = user ? getTodayRecord(user.id) : null;

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Load time records based on period
  useEffect(() => {
    if (!user) return;

    const today = new Date();
    let records: TimeRecord[] = [];
    
    if (periodMode === 'week') {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay() + 1);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      records = getTimeRecordsForPeriod(
        user.id,
        startOfWeek.toISOString().split('T')[0],
        endOfWeek.toISOString().split('T')[0]
      );
    } else {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      records = getTimeRecordsForPeriod(
        user.id,
        startOfMonth.toISOString().split('T')[0],
        endOfMonth.toISOString().split('T')[0]
      );
    }
    
    setTimeRecords(records);
  }, [user, periodMode, getTimeRecordsForPeriod]);

  /**
   * Handles clock in action
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

  /**
   * Handles clock out action
   */
  const handleClockOut = async () => {
    if (!user) return;
    
    try {
      setError('');
      await clockOut(user.id, breakMinutes);
      setSuccess('Erfolgreich ausgestempelt!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Ausstempeln');
    }
  };

  /**
   * Calculates current working time
   */
  const getCurrentWorkingTime = (): string => {
    if (!isTracking || !todayRecord) return '0:00';
    
    const timeInParts = todayRecord.timeIn.split(':');
    const timeInMinutes = parseInt(timeInParts[0]) * 60 + parseInt(timeInParts[1]);
    const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    const workedMinutes = Math.max(0, currentMinutes - timeInMinutes);
    
    const hours = Math.floor(workedMinutes / 60);
    const minutes = workedMinutes % 60;
    
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  };

  /**
   * Formats time to German format
   */
  const formatTime = (time: string) => {
    return time.substring(0, 5);
  };

  /**
   * Formats date to German format
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit'
    });
  };

  /**
   * Gets status color for time record
   */
  const getStatusColor = (record: TimeRecord) => {
    if (!record.timeOut) return 'text-blue-600'; // Currently running
    if (record.totalHours < 7) return 'text-red-600';
    if (record.totalHours > 9) return 'text-orange-600';
    return 'text-green-600';
  };

  /**
   * Calculates total hours for current period
   */
  const getTotalHours = (): string => {
    return timeRecords.reduce((sum, record) => sum + (record.totalHours || 0), 0).toFixed(1);
  };

  /**
   * Gets expected hours for current period
   */
  const getExpectedHours = (): number => {
    const workingHours = user?.weeklyHours || 40;
    if (periodMode === 'week') {
      return workingHours;
    }
    // Rough calculation for month (4.33 weeks average)
    return workingHours * 4.33;
  };

  /**
   * Renders clock in/out interface
   */
  const renderClockInterface = () => (
    <div className="space-y-6">
      {/* Current Time Display */}
      <div className="bg-white rounded-xl p-8 text-center shadow-sm">
        <div className="text-6xl font-mono font-bold text-gray-900 mb-2">
          {currentTime.toLocaleTimeString('de-DE', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
          })}
        </div>
        <div className="text-lg text-gray-600">
          {currentTime.toLocaleDateString('de-DE', { 
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </div>

      {/* Status Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Arbeitsstatus</h2>
          <span className={cn(
            "px-3 py-1 rounded-full text-sm font-medium",
            isTracking ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
          )}>
            {isTracking ? "Eingestempelt" : "Nicht eingestempelt"}
          </span>
        </div>

        {todayRecord && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">Start</p>
              <p className="text-lg font-semibold">{formatTime(todayRecord.timeIn)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Ende</p>
              <p className="text-lg font-semibold">
                {todayRecord.timeOut ? formatTime(todayRecord.timeOut) : 'Läuft...'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Arbeitszeit</p>
              <p className="text-lg font-semibold text-blue-600">
                {isTracking ? getCurrentWorkingTime() : `${todayRecord.totalHours.toFixed(1)}h`}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Pause</p>
              <p className="text-lg font-semibold">{todayRecord.breakMinutes || 0} min</p>
            </div>
          </div>
        )}

        {/* Clock In/Out Buttons */}
        <div className="space-y-4">
          {!isTracking ? (
            <button
              onClick={handleClockIn}
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Lädt...' : '🕐 Einstempeln'}
            </button>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pausenzeit (Minuten)
                </label>
                <input
                  type="number"
                  value={breakMinutes}
                  onChange={(e) => setBreakMinutes(parseInt(e.target.value) || 0)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  min="0"
                  max="120"
                />
              </div>
              <button
                onClick={handleClockOut}
                disabled={isLoading}
                className="w-full bg-red-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Lädt...' : '🕐 Ausstempeln'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800">{success}</p>
        </div>
      )}
    </div>
  );

  /**
   * Renders overview with statistics
   */
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Period Toggle */}
      <div className="flex bg-white rounded-lg p-1 shadow-sm">
        <button
          onClick={() => setPeriodMode('week')}
          className={cn(
            "flex-1 py-2 px-4 rounded-md transition-colors",
            periodMode === 'week' ? "bg-blue-500 text-white" : "bg-transparent text-gray-700 hover:bg-gray-100"
          )}
        >
          Woche
        </button>
        <button
          onClick={() => setPeriodMode('month')}
          className={cn(
            "flex-1 py-2 px-4 rounded-md transition-colors",
            periodMode === 'month' ? "bg-blue-500 text-white" : "bg-transparent text-gray-700 hover:bg-gray-100"
          )}
        >
          Monat
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Gearbeitet</p>
          <p className="text-2xl font-bold text-blue-600">{getTotalHours()}h</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Erwartet</p>
          <p className="text-2xl font-bold text-gray-600">{getExpectedHours().toFixed(0)}h</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Arbeitstage</p>
          <p className="text-2xl font-bold text-purple-600">{timeRecords.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Durchschnitt</p>
          <p className="text-2xl font-bold text-green-600">
            {timeRecords.length > 0 ? (parseFloat(getTotalHours()) / timeRecords.length).toFixed(1) : '0'}h
          </p>
        </div>
      </div>

      {/* Time Records List */}
      <div className="space-y-3">
        {timeRecords.map((record) => (
          <div key={record.id} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-semibold text-gray-900">
                  {formatDate(record.date)}
                </p>
                <p className="text-sm text-gray-500">
                  {formatTime(record.timeIn)} - {record.timeOut ? formatTime(record.timeOut) : 'Läuft...'}
                </p>
              </div>
              <div className="text-right">
                <p className={cn("text-lg font-bold", getStatusColor(record))}>
                  {record.timeOut ? `${record.totalHours.toFixed(1)}h` : getCurrentWorkingTime()}
                </p>
                {record.breakMinutes > 0 && (
                  <p className="text-xs text-gray-500">
                    {record.breakMinutes}min Pause
                  </p>
                )}
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={cn(
                  "h-2 rounded-full transition-all",
                  record.totalHours >= 8 ? "bg-green-500" : 
                  record.totalHours >= 6 ? "bg-yellow-500" : "bg-red-500"
                )}
                style={{ 
                  width: `${Math.min(100, ((record.timeOut ? record.totalHours : parseFloat(getCurrentWorkingTime().split(':')[0])) / 8) * 100)}%` 
                }}
              />
            </div>
          </div>
        ))}

        {timeRecords.length === 0 && (
          <div className="bg-white rounded-xl p-8 flex flex-col items-center shadow-sm">
            <span className="text-4xl mb-4">⏰</span>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Keine Zeiterfassung
            </h2>
            <p className="text-gray-600 text-center">
              Für den ausgewählten Zeitraum wurden keine Arbeitszeiten erfasst.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  /**
   * Renders calendar view
   */
  const renderCalendar = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay() || 7; // Monday = 1, Sunday = 7
    
    // Create calendar grid
    const calendarDays = [];
    
    // Empty cells for days before month starts
    for (let i = 1; i < startDay; i++) {
      calendarDays.push(null);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const dayRecord = timeRecords.find(record => record.date === dateStr);
      calendarDays.push({ day, dateStr, record: dayRecord });
    }

    return (
      <div className="space-y-6">
        {/* Calendar Header */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 text-center">
            {today.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}
          </h2>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((dayData, index) => (
              <div key={index} className="aspect-square">
                {dayData ? (
                  <div className={cn(
                    "w-full h-full p-2 rounded-lg border transition-colors",
                    dayData.record 
                      ? dayData.record.totalHours >= 8 
                        ? "bg-green-50 border-green-200" 
                        : dayData.record.totalHours >= 6
                        ? "bg-yellow-50 border-yellow-200"
                        : "bg-red-50 border-red-200"
                      : "bg-gray-50 border-gray-200",
                    dayData.dateStr === today.toISOString().split('T')[0] && "ring-2 ring-blue-500"
                  )}>
                    <div className="text-sm font-medium text-gray-900">
                      {dayData.day}
                    </div>
                    {dayData.record && (
                      <div className="text-xs text-gray-600 mt-1">
                        <div>{formatTime(dayData.record.timeIn)}</div>
                        {dayData.record.timeOut && (
                          <div className="font-medium">
                            {dayData.record.totalHours.toFixed(1)}h
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex justify-center space-x-4 mt-6 text-sm">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-100 border border-green-200 rounded mr-2"></div>
              <span>≥8h</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-100 border border-yellow-200 rounded mr-2"></div>
              <span>6-8h</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-100 border border-red-200 rounded mr-2"></div>
              <span>&lt;6h</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded mr-2"></div>
              <span>Kein Eintrag</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!user) return null;

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900">
            Arbeitszeit
          </h1>
        </div>

        {/* View Mode Toggle */}
        <div className="flex bg-white rounded-lg p-1 mb-6 shadow-sm">
          <button
            onClick={() => setViewMode('clock')}
            className={cn(
              "flex-1 py-2 px-4 rounded-md transition-colors text-sm",
              viewMode === 'clock' ? "bg-blue-500 text-white" : "bg-transparent text-gray-700 hover:bg-gray-100"
            )}
          >
            ⏰ Stempeluhr
          </button>
          <button
            onClick={() => setViewMode('overview')}
            className={cn(
              "flex-1 py-2 px-4 rounded-md transition-colors text-sm",
              viewMode === 'overview' ? "bg-blue-500 text-white" : "bg-transparent text-gray-700 hover:bg-gray-100"
            )}
          >
            📊 Übersicht
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={cn(
              "flex-1 py-2 px-4 rounded-md transition-colors text-sm",
              viewMode === 'calendar' ? "bg-blue-500 text-white" : "bg-transparent text-gray-700 hover:bg-gray-100"
            )}
          >
            📅 Kalender
          </button>
        </div>

        {/* Content */}
        {viewMode === 'clock' && renderClockInterface()}
        {viewMode === 'overview' && renderOverview()}
        {viewMode === 'calendar' && renderCalendar()}
      </div>
    </div>
  );
};