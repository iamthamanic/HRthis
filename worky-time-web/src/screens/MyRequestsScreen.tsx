import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../state/auth';
import { useLeavesStore } from '../state/leaves';
import { LeaveRequest } from '../types';
import { cn } from '../utils/cn';

export const MyRequestsScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { getLeaveRequests } = useLeavesStore();
  
  const [requests, setRequests] = useState<LeaveRequest[]>([]);

  useEffect(() => {
    if (user) {
      const userRequests = getLeaveRequests(user.id);
      setRequests(userRequests.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    }
  }, [user, getLeaveRequests]);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'APPROVED':
        return 'Genehmigt';
      case 'REJECTED':
        return 'Abgelehnt';
      default:
        return 'Ausstehend';
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'VACATION' ? '🏖️' : '🏥';
  };

  const getTypeText = (type: string) => {
    return type === 'VACATION' ? 'Urlaub' : 'Krankheit';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE');
  };

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">
              Meine Anträge
            </h1>
          </div>
          <button 
            onClick={() => navigate('/request-leave')}
            className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span className="text-white font-medium">+ Neu</span>
          </button>
        </div>

        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{getTypeIcon(request.type)}</span>
                  <div>
                    <p className="text-base font-semibold text-gray-900">
                      {getTypeText(request.type)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(request.startDate)} - {formatDate(request.endDate)}
                    </p>
                  </div>
                </div>
                <div className={cn(
                  "px-3 py-1 rounded-full",
                  getStatusColor(request.status)
                )}>
                  <span className="text-xs font-medium">
                    {getStatusText(request.status)}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-3">
                <p className="text-sm text-gray-600">
                  Dauer: {calculateDays(request.startDate, request.endDate)} Tag
                  {calculateDays(request.startDate, request.endDate) !== 1 ? 'e' : ''}
                </p>
                <p className="text-xs text-gray-500">
                  Eingereicht am {formatDate(request.createdAt.split('T')[0])}
                </p>
              </div>

              {request.comment && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    "{request.comment}"
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {requests.length === 0 && (
          <div className="bg-white rounded-xl p-8 flex flex-col items-center shadow-sm">
            <span className="text-4xl mb-4">📝</span>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Keine Anträge
            </h2>
            <p className="text-gray-600 text-center mb-4">
              Sie haben noch keine Urlaubs- oder Krankmeldungen eingereicht.
            </p>
            <button 
              onClick={() => navigate('/request-leave')}
              className="bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span className="text-white font-medium">Ersten Antrag stellen</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};