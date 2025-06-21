import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../state/auth';
import { useTimeRecordsStore } from '../state/timeRecords';
import { TimeRecord } from '../types';
import { cn } from '../utils/cn';

// Constants
const WORKING_HOURS_PER_DAY = 8;
const WORKING_DAYS_PER_WEEK = 5;

export const TimeRecordsScreen = () => {
  const { user } = useAuthStore();
  const { getTimeRecords, getTimeRecordsForPeriod } = useTimeRecordsStore();
  
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [selectedPeriod, setSelectedPeriod] = useState(new Date());
  
  const [timeRecords, setTimeRecords] = useState<TimeRecord[]>([]);

  useEffect(() => {
    if (!user) return;

    let records: TimeRecord[] = [];
    const today = new Date();
    
    if (viewMode === 'week') {
      // Get current week
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday
      
      records = getTimeRecordsForPeriod(
        user.id,
        startOfWeek.toISOString().split('T')[0],
        endOfWeek.toISOString().split('T')[0]
      );
    } else {
      // Get current month
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      records = getTimeRecordsForPeriod(
        user.id,
        startOfMonth.toISOString().split('T')[0],
        endOfMonth.toISOString().split('T')[0]
      );
    }
    
    setTimeRecords(records);
  }, [user, viewMode, selectedPeriod, getTimeRecordsForPeriod]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5); // HH:MM
  };

  /**
   * Calculates the total hours worked for all time records
   * @returns Total hours as a formatted string
   */
  const getTotalHours = (): string => {
    if (!timeRecords || timeRecords.length === 0) return '0.0';
    return timeRecords.reduce((sum, record) => sum + (record.totalHours || 0), 0).toFixed(1);
  };

  const getStatusColor = (record: TimeRecord) => {
    if (record.totalHours < 7) return 'text-red-600';
    if (record.totalHours > 9) return 'text-orange-600';
    return 'text-green-600';
  };

  const getWorkDays = (): number => {
    if (viewMode === 'week') return WORKING_DAYS_PER_WEEK;
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const weekdays = Math.floor(daysInMonth / 7) * 5;
    return weekdays;
  };

  const getExpectedHours = (): number => {
    return getWorkDays() * WORKING_HOURS_PER_DAY;
  };

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900">
            Arbeitszeiten
          </h1>
          
          {/* Summary Stats */}
          <div className="flex space-x-4 text-right">
            <div>
              <p className="text-sm text-gray-500">Gearbeitet</p>
              <p className="text-lg font-bold text-blue-600">{getTotalHours()}h</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Erwartet</p>
              <p className="text-lg font-bold text-gray-600">{getExpectedHours()}h</p>
            </div>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex bg-white rounded-lg p-1 mb-6 shadow-sm">
          <button
            onClick={() => setViewMode('week')}
            className={cn(
              "flex-1 py-2 px-4 rounded-md transition-colors",
              viewMode === 'week' ? "bg-blue-500 text-white" : "bg-transparent text-gray-700 hover:bg-gray-100"
            )}
          >
            Woche
          </button>
          <button
            onClick={() => setViewMode('month')}
            className={cn(
              "flex-1 py-2 px-4 rounded-md transition-colors",
              viewMode === 'month' ? "bg-blue-500 text-white" : "bg-transparent text-gray-700 hover:bg-gray-100"
            )}
          >
            Monat
          </button>
        </div>

        {/* Time Records */}
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
                    {record.totalHours.toFixed(1)}h
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
                  style={{ width: `${Math.min(100, (record.totalHours / 8) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>

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

        {/* Summary Card */}
        {timeRecords.length > 0 && (
          <div className="bg-white rounded-xl p-4 shadow-sm mt-6">
            <h3 className="font-semibold text-gray-900 mb-3">
              Zusammenfassung ({viewMode === 'week' ? 'Woche' : 'Monat'})
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Gesamtstunden</p>
                <p className="text-xl font-bold text-blue-600">{getTotalHours()}h</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Arbeitstage</p>
                <p className="text-xl font-bold text-gray-600">{timeRecords.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Durchschnitt/Tag</p>
                <p className="text-xl font-bold text-purple-600">
                  {timeRecords.length > 0 ? (parseFloat(getTotalHours()) / timeRecords.length).toFixed(1) : '0'}h
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className={cn(
                  "text-xl font-bold",
                  parseFloat(getTotalHours()) >= getExpectedHours() ? "text-green-600" : "text-orange-600"
                )}>
                  {parseFloat(getTotalHours()) >= getExpectedHours() ? "Ziel erreicht" : "Unter Ziel"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};