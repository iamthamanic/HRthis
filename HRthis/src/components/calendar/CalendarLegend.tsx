import React from 'react';
import { CalendarViewMode } from '../../types/calendar';

interface CalendarLegendProps {
  viewMode: CalendarViewMode;
}

export const CalendarLegend: React.FC<CalendarLegendProps> = ({ viewMode }) => {
  return (
    <div className="bg-white rounded-xl p-4 mt-4 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Legende</h3>
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2" />
          <span className="text-sm text-gray-600">Urlaub</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-2" />
          <span className="text-sm text-gray-600">Krankheit</span>
        </div>
        {viewMode === 'personal' && (
          <>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
              <span className="text-sm text-gray-600">Vollzeit (≥8h)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2" />
              <span className="text-sm text-gray-600">Teilzeit (6-8h)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2" />
              <span className="text-sm text-gray-600">Unterzeit (&lt;6h)</span>
            </div>
          </>
        )}
        <div className="flex items-center">
          <div className="w-3 h-3 bg-orange-500 rounded-full mr-2" />
          <span className="text-sm text-gray-600">Erinnerung</span>
        </div>
      </div>
    </div>
  );
};