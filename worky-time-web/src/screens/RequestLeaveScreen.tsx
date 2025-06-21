import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../state/auth';
import { useLeavesStore } from '../state/leaves';
import { cn } from '../utils/cn';

export const RequestLeaveScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { submitLeaveRequest, isLoading } = useLeavesStore();
  
  const [leaveType, setLeaveType] = useState<'VACATION' | 'SICK'>('VACATION');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!user) {
      setError('Benutzer nicht authentifiziert');
      return;
    }

    // Validation
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      setError('Ungültiges Datum ausgewählt');
      return;
    }

    if (start > end) {
      setError('Das Enddatum muss nach dem Startdatum liegen');
      return;
    }

    try {
      await submitLeaveRequest({
        userId: user.id,
        startDate,
        endDate,
        comment,
        status: 'PENDING',
        type: leaveType
      });

      navigate('/requests');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Der Antrag konnte nicht eingereicht werden');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE');
  };

  const calculateDays = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button onClick={() => navigate(-1)} className="mr-4">
            <span className="text-blue-600 text-lg">‹ Zurück</span>
          </button>
          <h1 className="text-xl font-bold text-gray-900">
            Antrag stellen
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm space-y-6">
          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Leave Type Selection */}
          <div>
            <label className="text-base font-semibold text-gray-900 mb-3 block">
              Art des Antrags
            </label>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setLeaveType('VACATION')}
                className={cn(
                  "flex-1 p-4 rounded-lg border-2 transition-colors",
                  leaveType === 'VACATION' 
                    ? "border-blue-500 bg-blue-50" 
                    : "border-gray-200 bg-white hover:border-gray-300"
                )}
              >
                <span className="font-medium">🏖️ Urlaub</span>
              </button>
              <button
                type="button"
                onClick={() => setLeaveType('SICK')}
                className={cn(
                  "flex-1 p-4 rounded-lg border-2 transition-colors",
                  leaveType === 'SICK' 
                    ? "border-blue-500 bg-blue-50" 
                    : "border-gray-200 bg-white hover:border-gray-300"
                )}
              >
                <span className="font-medium">🏥 Krankheit</span>
              </button>
            </div>
          </div>

          {/* Date Selection */}
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Startdatum
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Enddatum
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Duration Display */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Zeitraum</p>
                <p className="font-semibold text-gray-900">
                  {formatDate(startDate)} - {formatDate(endDate)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Dauer</p>
                <p className="text-xl font-bold text-blue-600">
                  {calculateDays()} Tag{calculateDays() !== 1 ? 'e' : ''}
                </p>
              </div>
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Kommentar (optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Zusätzliche Informationen..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium transition-colors",
                isLoading 
                  ? "opacity-50 cursor-not-allowed" 
                  : "hover:bg-blue-700"
              )}
            >
              {isLoading ? 'Wird eingereicht...' : 'Antrag einreichen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};