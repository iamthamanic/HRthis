import React from 'react';

export const EmptyState: React.FC = () => (
  <div className="text-center py-12">
    <span className="text-6xl mb-4 block">🏆</span>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">
      Keine Achievements gefunden
    </h3>
    <p className="text-gray-600">
      Probiere einen anderen Filter oder starte mit deinen ersten Aktivitäten!
    </p>
  </div>
);