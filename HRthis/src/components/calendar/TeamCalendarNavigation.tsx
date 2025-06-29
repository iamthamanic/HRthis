import React from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface TeamCalendarNavigationProps {
  view: 'monat' | 'jahr';
  selectedMonth: Date;
  onNavigateMonth: (direction: number) => void;
  filterType: string;
  onFilterChange: (filterType: string) => void;
}

export const TeamCalendarNavigation: React.FC<TeamCalendarNavigationProps> = ({
  view,
  selectedMonth,
  onNavigateMonth,
  filterType,
  onFilterChange
}) => (
  <div className="mb-4 flex items-center justify-between">
    <div className="flex items-center gap-4">
      {view === 'monat' && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateMonth(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Vorheriger Monat"
          >
            ←
          </button>
          <h3 className="text-lg font-semibold min-w-48 text-center">
            {format(selectedMonth, 'MMMM yyyy', { locale: de })}
          </h3>
          <button
            onClick={() => onNavigateMonth(1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Nächster Monat"
          >
            →
          </button>
        </div>
      )}
      
      {view === 'jahr' && (
        <h3 className="text-lg font-semibold">
          Jahresübersicht {selectedMonth.getFullYear()}
        </h3>
      )}
    </div>

    <div className="flex items-center gap-2">
      <label htmlFor="filter-type" className="text-sm font-medium text-gray-700">
        Filter:
      </label>
      <select
        id="filter-type"
        value={filterType}
        onChange={(e) => onFilterChange(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="all">Alle anzeigen</option>
        <option value="urlaub">Urlaub</option>
        <option value="krank">Krank</option>
        <option value="zeit">Arbeitszeit</option>
        <option value="homeoffice">Homeoffice</option>
      </select>
    </div>
  </div>
);