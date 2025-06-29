import React from 'react';
import { colorMap } from '../../types/calendar';

interface TeamCalendarLegendProps {
  showLegend?: boolean;
}

export const TeamCalendarLegend: React.FC<TeamCalendarLegendProps> = ({ showLegend = true }) => {
  if (!showLegend) return null;

  return (
    <div className="mt-4 flex flex-wrap gap-4 text-sm">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded" style={{ backgroundColor: colorMap.urlaub }}></div>
        <span>Urlaub</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded" style={{ backgroundColor: colorMap.krank }}></div>
        <span>Krankheit</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded" style={{ backgroundColor: colorMap.meeting }}></div>
        <span>Meeting</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded" style={{ backgroundColor: colorMap.fortbildung }}></div>
        <span>Fortbildung</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded" style={{ backgroundColor: colorMap.ux }}></div>
        <span>Sonderurlaub</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded" style={{ backgroundColor: colorMap.zeit.vollzeit }}></div>
        <span>Vollzeit (8h+)</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded" style={{ backgroundColor: colorMap.zeit.teilzeit }}></div>
        <span>Teilzeit (6-8h)</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded" style={{ backgroundColor: colorMap.zeit.unter6h }}></div>
        <span>Unter 6h</span>
      </div>
    </div>
  );
};