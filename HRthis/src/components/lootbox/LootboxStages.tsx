import React from 'react';
import { Reward } from '../../types/learning';
import { cn } from '../../utils/cn';
import { getRarityColor, getRewardIcon, getRewardSound } from './LootboxHelpers';

interface LootboxStageProps {
  stage: 'waiting' | 'opening' | 'revealing' | 'complete';
  reward: Reward;
  onStartAnimation: () => void;
}

export const LootboxStages: React.FC<LootboxStageProps> = ({ stage, reward, onStartAnimation }) => {
  if (stage === 'waiting') {
    return (
      <div className="text-center">
        <div 
          className="w-48 h-48 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl mx-auto mb-6 flex items-center justify-center text-6xl shadow-2xl transform hover:scale-105 transition-transform cursor-pointer"
          onClick={onStartAnimation}
        >
          🎁
        </div>
        <p className="text-white text-xl font-bold mb-2">Belohnung erhalten!</p>
        <p className="text-gray-300">Klicke um zu öffnen</p>
      </div>
    );
  }

  if (stage === 'opening') {
    return (
      <div className="text-center">
        <div className="w-48 h-48 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl mx-auto mb-6 flex items-center justify-center text-6xl shadow-2xl animate-bounce">
          📦
        </div>
        <p className="text-white text-xl font-bold animate-pulse">Öffnet sich...</p>
      </div>
    );
  }

  if (stage === 'revealing') {
    return (
      <div className="text-center animate-pulse">
        <div className={cn(
          "w-48 h-48 bg-gradient-to-br rounded-2xl mx-auto mb-6 flex items-center justify-center text-8xl shadow-2xl",
          getRarityColor(reward.type)
        )}>
          {getRewardIcon(reward.type)}
        </div>
        <div className="bg-white rounded-xl p-6 shadow-2xl max-w-sm">
          <div className="text-center">
            <div className="text-4xl mb-3">{getRewardSound(reward.type)}</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {reward.type === 'coins' ? `${reward.value} BrowoCoins` : reward.description}
            </h3>
            <p className="text-gray-600">{reward.description}</p>
            
            {reward.type === 'coins' && (
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                <p className="text-yellow-800 font-medium">
                  + {reward.value} 🪙
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'complete') {
    return (
      <div className="text-center opacity-0 animate-fade-out">
        <div className="text-white text-2xl font-bold">Belohnung erhalten!</div>
      </div>
    );
  }

  return null;
};