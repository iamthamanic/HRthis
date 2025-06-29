import React from 'react';
import { useCoinEventsStore } from '../../state/coinEvents';

interface CoinEventProgressProps {
  userBalance: number;
}

const CoinEventHeader: React.FC = () => (
  <div className="mb-3">
    <h3 className="font-semibold text-lg">🎯 Coin Events</h3>
    <p className="text-sm opacity-90">Erreiche Meilensteine und erhalte Belohnungen!</p>
  </div>
);

const NextEventProgress: React.FC<{ event: any; userBalance: number }> = ({ event, userBalance }) => {
  const progress = (userBalance / event.requiredCoins) * 100;
  
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">{event.title}</span>
        <span className="text-sm">{userBalance} / {event.requiredCoins} Coins</span>
      </div>
      <div className="w-full bg-white/20 rounded-full h-3">
        <div 
          className="bg-white rounded-full h-3 transition-all duration-500 ease-out"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <p className="text-xs mt-2 opacity-90">Belohnung: {event.reward}</p>
    </div>
  );
};

const AllEventsComplete: React.FC = () => (
  <div className="text-center py-2">
    <p className="text-lg font-bold">🏆 Alle Events freigeschaltet!</p>
    <p className="text-sm opacity-90">Glückwunsch, du hast alle Meilensteine erreicht!</p>
  </div>
);

const NoActiveEvents: React.FC = () => (
  <div className="text-center py-2">
    <p className="text-sm opacity-90">Keine aktiven Events verfügbar</p>
  </div>
);

const UnlockedEventsList: React.FC<{ events: any[] }> = ({ events }) => (
  <div className="mt-4 pt-4 border-t border-white/20">
    <p className="text-xs font-semibold mb-2">✅ Freigeschaltet:</p>
    <div className="flex flex-wrap gap-2">
      {events.map((event) => (
        <span key={event.id} className="text-xs bg-white/20 px-2 py-1 rounded-full">
          {event.title}
        </span>
      ))}
    </div>
  </div>
);

const getEventContent = (nextEvent: any, unlockedEvents: any[], allEvents: any[], userBalance: number) => {
  if (nextEvent) {
    return <NextEventProgress event={nextEvent} userBalance={userBalance} />;
  } else if (unlockedEvents.length === allEvents.length && allEvents.length > 0) {
    return <AllEventsComplete />;
  } else {
    return <NoActiveEvents />;
  }
};

export const CoinEventProgress: React.FC<CoinEventProgressProps> = ({ userBalance }) => {
  const { getActiveEvents, getUnlockedEvents, getNextEvent } = useCoinEventsStore();
  
  const unlockedEvents = getUnlockedEvents(userBalance);
  const nextEvent = getNextEvent(userBalance);
  const allEvents = getActiveEvents();
  
  return (
    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-4 text-white shadow-lg">
      <CoinEventHeader />
      {getEventContent(nextEvent, unlockedEvents, allEvents, userBalance)}
      {unlockedEvents.length > 0 && <UnlockedEventsList events={unlockedEvents} />}
    </div>
  );
};