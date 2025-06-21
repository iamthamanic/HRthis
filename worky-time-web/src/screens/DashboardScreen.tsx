import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../state/auth';
import { useLeavesStore } from '../state/leaves';
import { useTimeRecordsStore } from '../state/timeRecords';
import { useCoinsStore } from '../state/coins';
import { useTrainingStore } from '../state/training';

export const DashboardScreen = () => {
  const navigate = useNavigate();
  const { user, organization, logout } = useAuthStore();
  const { getVacationBalance } = useLeavesStore();
  const { getTimeRecords } = useTimeRecordsStore();
  const { getUserCoins } = useCoinsStore();
  const { getTrainingsForUser, getUserProgress } = useTrainingStore();

  const vacationBalance = user ? getVacationBalance(user.id) : null;
  const userCoins = user ? getUserCoins(user.id) : null;
  const todayRecords = user ? getTimeRecords(user.id).filter(record => 
    record.date === new Date().toISOString().split('T')[0]
  ) : [];
  const userTrainings = user ? getTrainingsForUser(user.id) : [];

  const todayRecord = todayRecords[0];
  
  // Calculate training stats
  const pendingTrainings = user ? userTrainings.filter(training => {
    const progress = getUserProgress(user.id, training.id);
    return !progress || progress.status === 'NOT_STARTED' || progress.status === 'IN_PROGRESS';
  }).length : 0;

  const quickActions = [
    {
      title: 'Urlaub beantragen',
      description: 'Neuen Urlaubsantrag stellen',
      icon: '🏖️',
      onPress: () => navigate('/request-leave')
    },
    {
      title: 'Krankmeldung',
      description: 'Krankheit melden',
      icon: '🏥',
      onPress: () => navigate('/sick-leave')
    },
    {
      title: 'Team Kalender',
      description: 'Urlaubs- & Krankheitszeiten',
      icon: '📅',
      onPress: () => navigate('/calendar')
    },
    {
      title: 'Schulungen',
      description: 'Weiterbildungen & Trainings',
      icon: '📘',
      onPress: () => navigate('/training')
    },
    {
      title: 'Arbeitszeiten',
      description: 'Zeiterfassung einsehen',
      icon: '⏰',
      onPress: () => navigate('/time')
    }
  ];

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Hallo, {user?.name?.split(' ')[0]}!
            </h1>
            <p className="text-gray-600">
              {organization?.name}
            </p>
          </div>
          <button 
            onClick={logout}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <span className="text-gray-700">Abmelden</span>
          </button>
        </div>

        {/* Quick Stats */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex-1 min-w-0 bg-white p-4 rounded-xl shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Urlaubstage</p>
            <p className="text-xl font-bold text-blue-600">
              {vacationBalance?.remainingDays || 0}
            </p>
            <p className="text-xs text-gray-500">
              von {vacationBalance?.totalDays || 0}
            </p>
          </div>
          
          <div className="flex-1 min-w-0 bg-white p-4 rounded-xl shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Coins</p>
            <p className="text-xl font-bold text-yellow-600">
              🪙 {userCoins?.availableCoins || 0}
            </p>
            <p className="text-xs text-gray-500">
              Verfügbar
            </p>
          </div>
          
          <div className="flex-1 min-w-0 bg-white p-4 rounded-xl shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Schulungen</p>
            <p className="text-xl font-bold text-purple-600">
              📘 {pendingTrainings}
            </p>
            <p className="text-xs text-gray-500">
              Offen
            </p>
          </div>
          
          <div className="flex-1 min-w-0 bg-white p-4 rounded-xl shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Heute</p>
            <p className="text-xl font-bold text-green-600">
              {todayRecord ? `${todayRecord.totalHours}h` : '-'}
            </p>
            <p className="text-xs text-gray-500">
              Arbeitszeit
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Schnellzugriff
        </h2>
        
        <div className="space-y-3">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.onPress}
              className="w-full bg-white p-4 rounded-xl shadow-sm flex items-center hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">{action.icon}</span>
              </div>
              <div className="flex-1 text-left">
                <p className="text-base font-semibold text-gray-900">
                  {action.title}
                </p>
                <p className="text-sm text-gray-500">
                  {action.description}
                </p>
              </div>
              <span className="text-gray-400 text-lg">›</span>
            </button>
          ))}
        </div>

        {/* Admin Panel */}
        {(user?.role === 'ADMIN' || user?.role === 'SUPERADMIN') && (
          <div className="mt-6 space-y-3">
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-orange-800 font-medium text-center">
                👑 HR-Administrator
              </p>
            </div>
            
            <button
              onClick={() => navigate('/admin-coins')}
              className="w-full bg-white p-4 rounded-xl shadow-sm flex items-center hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">🏆</span>
              </div>
              <div className="flex-1 text-left">
                <p className="text-base font-semibold text-gray-900">
                  Coin Verwaltung
                </p>
                <p className="text-sm text-gray-500">
                  Coins verteilen & Anträge bearbeiten
                </p>
              </div>
              <span className="text-gray-400 text-lg">›</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};