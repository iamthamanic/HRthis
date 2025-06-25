import React from 'react';
import { useCoinEventsStore } from '../../state/coinEvents';

interface CoinEventsProgressProps {
  userBalance: number;
}

export const CoinEventsProgress: React.FC<CoinEventsProgressProps> = ({ userBalance }) => {
  const { getActiveEvents, getUnlockedEvents, getNextEvent } = useCoinEventsStore();

  const unlockedEvents = getUnlockedEvents(userBalance);
  const nextEvent = getNextEvent(userBalance);
  const allEvents = getActiveEvents();

  const renderProgressContent = () => {
    if (nextEvent) {
      const progress = (userBalance / nextEvent.requiredCoins) * 100;
      
      return (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">{nextEvent.title}</span>
            <span className="text-sm">{userBalance} / {nextEvent.requiredCoins} Coins</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div 
              className="bg-white rounded-full h-3 transition-all duration-500 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <p className="text-xs mt-2 opacity-90">Belohnung: {nextEvent.reward}</p>
        </div>
      );
    }
    
    if (unlockedEvents.length === allEvents.length && allEvents.length > 0) {
      return (
        <div className="text-center py-2">
          <p className="text-lg font-bold">🏆 Alle Events freigeschaltet!</p>
          <p className="text-sm opacity-90">Glückwunsch, du hast alle Meilensteine erreicht!</p>
        </div>
      );
    }
    
    return (
      <div className="text-center py-2">
        <p className="text-sm opacity-90">Keine aktiven Events verfügbar</p>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-4 text-white shadow-lg">
      <div className="mb-3">
        <h3 className="font-semibold text-lg">🎯 Coin Events</h3>
        <p className="text-sm opacity-90">Erreiche Meilensteine und erhalte Belohnungen!</p>
      </div>
      
      {renderProgressContent()}
      
      {unlockedEvents.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-xs font-semibold mb-2">✅ Freigeschaltet:</p>
          <div className="flex flex-wrap gap-2">
            {unlockedEvents.map((event) => (
              <span key={event.id} className="text-xs bg-white/20 px-2 py-1 rounded-full">
                {event.title}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};