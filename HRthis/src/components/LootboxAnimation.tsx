import React from 'react';
import { Reward } from '../types/learning';
import { useLootboxAnimation } from './lootbox/useLootboxAnimation';
import { ParticleEffect } from './lootbox/ParticleEffect';
import { LootboxStages } from './lootbox/LootboxStages';

interface LootboxAnimationProps {
  reward: Reward;
  onComplete: () => void;
  autoStart?: boolean;
}

export const LootboxAnimation: React.FC<LootboxAnimationProps> = ({ 
  reward, 
  onComplete, 
  autoStart = false 
}) => {
  const { stage, particles, handleStartAnimation } = useLootboxAnimation({ autoStart, onComplete });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="relative">
        <ParticleEffect particles={particles} show={stage === 'revealing'} />

        <div className="relative w-80 h-80 flex items-center justify-center">
          <LootboxStages 
            stage={stage} 
            reward={reward} 
            onStartAnimation={handleStartAnimation} 
          />
        </div>

        {stage !== 'waiting' && stage !== 'complete' && (
          <button
            onClick={onComplete}
            className="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl"
          >
            ×
          </button>
        )}
      </div>

      <style>{`
        @keyframes fade-out {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        .animate-fade-out {
          animation: fade-out 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

// Re-export utility components
export { MultiRewardAnimation } from './lootbox/MultiRewardAnimation';
export { CelebrationOverlay } from './lootbox/CelebrationOverlay';