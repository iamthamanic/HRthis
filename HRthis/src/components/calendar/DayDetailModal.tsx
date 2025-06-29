import React from 'react';
import { CalendarDay, CalendarViewMode } from '../../types/calendar';

interface DayDetailModalProps {
  selectedDay: CalendarDay | null;
  viewMode: CalendarViewMode;
  getUserName: (userId: string) => string;
  onClose: () => void;
}

export const DayDetailModal: React.FC<DayDetailModalProps> = ({
  selectedDay,
  viewMode,
  getUserName,
  onClose
}) => {
  if (!selectedDay) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {(selectedDay.date instanceof Date ? selectedDay.date : new Date(selectedDay.date)).toLocaleDateString('de-DE', { 
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-3">
          {/* User's events */}
          {selectedDay.userLeaves?.map(leave => (
            <div key={leave.id} className="p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <span className="text-2xl mr-3">
                  {leave.type === 'VACATION' ? '🏖️' : '🏥'}
                </span>
                <div>
                  <p className="font-medium">
                    {leave.type === 'VACATION' ? 'Urlaub' : 'Krankheit'}
                  </p>
                  {leave.comment && (
                    <p className="text-sm text-gray-600">{leave.comment}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {/* User's time record */}
          {selectedDay.userTimeRecord && (
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <span className="text-2xl mr-3">⏰</span>
                <div>
                  <p className="font-medium">
                    {selectedDay.userTimeRecord.totalHours.toFixed(1)}h gearbeitet
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedDay.userTimeRecord.timeIn} - {selectedDay.userTimeRecord.timeOut || 'läuft'}
                    {selectedDay.userTimeRecord.breakMinutes > 0 && (
                      <span> (Pause: {selectedDay.userTimeRecord.breakMinutes}min)</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Team events (if team view) */}
          {viewMode === 'team' && selectedDay.leaves?.map(leave => (
            <div key={leave.id} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <span className="text-2xl mr-3">
                  {leave.type === 'VACATION' ? '🏖️' : '🏥'}
                </span>
                <div>
                  <p className="font-medium">
                    {getUserName(leave.userId)} - {leave.type === 'VACATION' ? 'Urlaub' : 'Krankheit'}
                  </p>
                  {leave.comment && (
                    <p className="text-sm text-gray-600">{leave.comment}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {/* Reminders */}
          {selectedDay.reminders?.map(reminder => (
            <div key={reminder.id} className="p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center">
                <span className="text-2xl mr-3">🔔</span>
                <div>
                  <p className="font-medium">Erinnerung</p>
                  <p className="text-sm text-gray-600">{reminder.message}</p>
                </div>
              </div>
            </div>
          ))}
          
          {/* Empty state */}
          {(selectedDay.userLeaves?.length || 0) === 0 && 
           !selectedDay.userTimeRecord && 
           (selectedDay.leaves?.length || 0) === 0 && 
           (selectedDay.reminders?.length || 0) === 0 && (
            <div className="text-center py-4">
              <p className="text-gray-500">Keine Ereignisse für diesen Tag</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};