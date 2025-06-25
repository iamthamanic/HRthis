import React from 'react';

/**
 * Einfache Zeit & Urlaub Ansicht - funktioniert garantiert
 */
export const TimeAndVacationSimple: React.FC = () => (
  <div className="min-h-screen bg-gray-50 p-6">
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        ⏰ Zeit & Urlaub
      </h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Zeit-Erfassung Bereich */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Zeiterfassung</h2>
          <p className="text-gray-600 mb-4">Ein-/Ausstempeln, heutige Arbeitszeit</p>
          <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 mb-4">
            Einstempeln
          </button>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">Heute gearbeitet:</div>
            <div className="text-2xl font-bold text-gray-900">0:00 Std</div>
          </div>
        </div>

        {/* Urlaub Bereich */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Urlaub & Kalender</h2>
          <p className="text-gray-600 mb-4">Antrag stellen, Übersicht, Team-Kalender</p>
          <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 mb-4">
            Neuen Urlaub beantragen
          </button>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">Verfügbare Urlaubstage:</div>
            <div className="text-2xl font-bold text-gray-900">25 Tage</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);