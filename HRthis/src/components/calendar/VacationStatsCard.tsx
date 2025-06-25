import React from 'react';
import { VacationStats } from '../../types/calendar';

interface VacationStatsCardProps {
  stats: VacationStats;
}

export const VacationStatsCard: React.FC<VacationStatsCardProps> = ({ stats }) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <h3 className="text-sm font-medium text-gray-700 mb-3">
        Urlaubsübersicht {new Date().getFullYear()}
      </h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
          <p className="text-xs text-gray-500">Gesamt</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-red-600">{stats.used}</p>
          <p className="text-xs text-gray-500">Genommen</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{stats.remaining}</p>
          <p className="text-xs text-gray-500">Verfügbar</p>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mt-3">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all"
            style={{ width: `${Math.min(100, (stats.used / stats.total) * 100)}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1 text-center">
          {((stats.used / stats.total) * 100).toFixed(0)}% verbraucht
        </p>
      </div>
    </div>
  );
};