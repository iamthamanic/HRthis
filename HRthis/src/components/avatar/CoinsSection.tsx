import React from 'react';

interface CoinsSectionProps {
  coins?: number;
}

export const CoinsSection: React.FC<CoinsSectionProps> = ({ 
  coins = 1600 
}) => (
  <div className="w-full mb-6">
    <div className="flex items-center justify-between bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-4">
      <div className="flex items-center gap-3">
        <span className="text-2xl">💰</span>
        <span className="font-semibold text-gray-900">Engagement</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-gray-900">{coins}</span>
        <span className="text-lg">🪙</span>
        <span className="text-sm text-gray-600">Browo Coins</span>
      </div>
    </div>
  </div>
);