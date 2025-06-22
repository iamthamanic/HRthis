import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../state/auth';
import { useLeavesStore } from '../state/leaves';
import { LeaveRequest } from '../types';
import { cn } from '../utils/cn';

export const MyRequestsScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { getLeaveRequests, getAllLeaveRequests, approveLeaveRequest, rejectLeaveRequest } = useLeavesStore();
  
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'my' | 'all'>('my');
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const isAdmin = user && (user.role === 'ADMIN' || user.role === 'SUPERADMIN');

  useEffect(() => {
    if (!user) return;

    let allRequests: LeaveRequest[] = [];
    
    if (activeTab === 'my') {
      // Show user's own requests
      allRequests = getLeaveRequests(user.id);
    } else if (activeTab === 'all' && isAdmin) {
      // Show all requests for admin
      allRequests = getAllLeaveRequests();
      if (filter !== 'ALL') {
        allRequests = allRequests.filter(req => req.status === filter);
      }
    }

    setRequests(allRequests.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
  }, [user, getLeaveRequests, getAllLeaveRequests, activeTab, filter, isAdmin]);

  const handleApprove = async (requestId: string) => {
    if (!user) return;
    setProcessingId(requestId);
    try {
      await approveLeaveRequest(requestId, user.id);
      // Refresh the list
      const allRequests = getAllLeaveRequests();
      const filteredRequests = filter === 'ALL' 
        ? allRequests 
        : allRequests.filter(req => req.status === filter);
      setRequests(filteredRequests.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId: string) => {
    if (!user) return;
    setProcessingId(requestId);
    try {
      await rejectLeaveRequest(requestId, user.id);
      // Refresh the list
      const allRequests = getAllLeaveRequests();
      const filteredRequests = filter === 'ALL' 
        ? allRequests 
        : allRequests.filter(req => req.status === filter);
      setRequests(filteredRequests.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    } finally {
      setProcessingId(null);
    }
  };

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

  /**
   * Gets the display name for a user ID
   * @param userId - The user ID to get the name for
   * @returns The display name or 'Unbekannt' if not found
   */
  const getUserName = (userId: string): string => {
    const names: { [key: string]: string } = {
      '1': 'Max M.',
      '2': 'Anna A.',
      '3': 'Tom K.',
      '4': 'Lisa S.',
      '5': 'Julia B.',
      '6': 'Marco L.'
    };
    return names[userId] || 'Unbekannt';
  };

  const getPendingCount = () => {
    if (!isAdmin) return 0;
    return getAllLeaveRequests().filter(req => req.status === 'PENDING').length;
  };

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900">
            Anträge
          </h1>
          <button 
            onClick={() => navigate('/request-leave')}
            className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span className="text-white font-medium">+ Neu</span>
          </button>
        </div>

        {/* Tab Navigation for Admin */}
        {isAdmin && (
          <div className="flex bg-white rounded-lg p-1 mb-4 shadow-sm">
            <button
              onClick={() => setActiveTab('my')}
              className={cn(
                "flex-1 py-2 px-3 rounded-md transition-colors",
                activeTab === 'my' ? "bg-blue-500 text-white" : "bg-transparent text-gray-700 hover:bg-gray-100"
              )}
            >
              <span className="text-center font-medium text-sm">
                Meine Anträge
              </span>
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={cn(
                "flex-1 py-2 px-3 rounded-md transition-colors relative",
                activeTab === 'all' ? "bg-blue-500 text-white" : "bg-transparent text-gray-700 hover:bg-gray-100"
              )}
            >
              <span className="text-center font-medium text-sm">
                Alle verwalten
              </span>
              {getPendingCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getPendingCount()}
                </span>
              )}
            </button>
          </div>
        )}

        {/* Filter for Admin View */}
        {isAdmin && activeTab === 'all' && (
          <div className="flex items-center justify-end mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Filter:</span>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">Alle</option>
                <option value="PENDING">Ausstehend</option>
                <option value="APPROVED">Genehmigt</option>
                <option value="REJECTED">Abgelehnt</option>
              </select>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{getTypeIcon(request.type)}</span>
                  <div>
                    <p className="text-base font-semibold text-gray-900">
                      {activeTab === 'all' && isAdmin 
                        ? `${getUserName(request.userId)} - ${getTypeText(request.type)}`
                        : getTypeText(request.type)
                      }
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
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    Eingereicht am {formatDate(request.createdAt.split('T')[0])}
                  </p>
                  {request.approvedBy && request.approvedAt && (
                    <p className="text-xs text-gray-500">
                      {getStatusText(request.status)} von {getUserName(request.approvedBy)} am {formatDate(request.approvedAt.split('T')[0])}
                    </p>
                  )}
                </div>
              </div>

              {request.comment && (
                <div className="p-3 bg-gray-50 rounded-lg mb-3">
                  <p className="text-sm text-gray-700">
                    "{request.comment}"
                  </p>
                </div>
              )}

              {/* Admin Actions */}
              {isAdmin && activeTab === 'all' && request.status === 'PENDING' && (
                <div className="flex space-x-3 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleReject(request.id)}
                    disabled={processingId === request.id}
                    className={cn(
                      "flex-1 py-2 px-4 rounded-lg border border-red-300 text-red-700 font-medium transition-colors",
                      processingId === request.id 
                        ? "opacity-50 cursor-not-allowed" 
                        : "hover:bg-red-50"
                    )}
                  >
                    {processingId === request.id ? '...' : 'Ablehnen'}
                  </button>
                  <button
                    onClick={() => handleApprove(request.id)}
                    disabled={processingId === request.id}
                    className={cn(
                      "flex-1 py-2 px-4 rounded-lg bg-green-600 text-white font-medium transition-colors",
                      processingId === request.id 
                        ? "opacity-50 cursor-not-allowed" 
                        : "hover:bg-green-700"
                    )}
                  >
                    {processingId === request.id ? '...' : 'Genehmigen'}
                  </button>
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
              {activeTab === 'my' 
                ? 'Sie haben noch keine Urlaubs- oder Krankmeldungen eingereicht.'
                : filter === 'PENDING' 
                  ? 'Es gibt derzeit keine ausstehenden Anträge.' 
                  : `Es gibt keine Anträge mit dem Status "${getStatusText(filter)}".`
              }
            </p>
            {activeTab === 'my' && (
              <button 
                onClick={() => navigate('/request-leave')}
                className="bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span className="text-white font-medium">Ersten Antrag stellen</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};