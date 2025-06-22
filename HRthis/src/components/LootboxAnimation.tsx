import React, { useState, useEffect } from 'react';
import { LootboxAnimation as LootboxData, Reward } from '../types/learning';
import { cn } from '../utils/cn';

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
  const [stage, setStage] = useState<'waiting' | 'opening' | 'revealing' | 'complete'>('waiting');
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    if (autoStart) {
      handleStartAnimation();
    }
  }, [autoStart]);

  useEffect(() => {
    if (stage === 'revealing') {
      // Generate particles for celebration
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 0.5
      }));
      setParticles(newParticles);

      // Auto-complete after showing reward
      const timer = setTimeout(() => {
        setStage('complete');
        setTimeout(onComplete, 1000);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [stage, onComplete]);

  const handleStartAnimation = () => {
    setStage('opening');
    
    setTimeout(() => {
      setStage('revealing');
    }, 1500);
  };

  const getRarityColor = () => {
    switch (reward.type) {
      case 'coins':
        return 'from-yellow-400 to-yellow-600';
      case 'badge':
        return 'from-purple-400 to-purple-600';
      default:
        return 'from-blue-400 to-blue-600';
    }
  };

  const getRewardIcon = () => {
    switch (reward.type) {
      case 'coins':
        return '🪙';
      case 'badge':
        return '🏅';
      case 'avatar-item':
        return '👕';
      default:
        return '🎁';
    }
  };

  const getRewardSound = () => {
    switch (reward.type) {
      case 'coins':
        return '💰';
      case 'badge':
        return '🎉';
      default:
        return '✨';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="relative">
        {/* Particles */}
        {stage === 'revealing' && particles.map(particle => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`
            }}
          />
        ))}

        {/* Lootbox Container */}
        <div className="relative w-80 h-80 flex items-center justify-center">
          {stage === 'waiting' && (
            <div className="text-center">
              <div className="w-48 h-48 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl mx-auto mb-6 flex items-center justify-center text-6xl shadow-2xl transform hover:scale-105 transition-transform cursor-pointer"
                onClick={handleStartAnimation}
              >
                🎁
              </div>
              <p className="text-white text-xl font-bold mb-2">Belohnung erhalten!</p>
              <p className="text-gray-300">Klicke um zu öffnen</p>
            </div>
          )}

          {stage === 'opening' && (
            <div className="text-center">
              <div className="w-48 h-48 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl mx-auto mb-6 flex items-center justify-center text-6xl shadow-2xl animate-bounce">
                📦
              </div>
              <p className="text-white text-xl font-bold animate-pulse">Öffnet sich...</p>
            </div>
          )}

          {stage === 'revealing' && (
            <div className="text-center animate-pulse">
              <div className={cn(
                "w-48 h-48 bg-gradient-to-br rounded-2xl mx-auto mb-6 flex items-center justify-center text-8xl shadow-2xl",
                getRarityColor()
              )}>
                {getRewardIcon()}
              </div>
              <div className="bg-white rounded-xl p-6 shadow-2xl max-w-sm">
                <div className="text-center">
                  <div className="text-4xl mb-3">{getRewardSound()}</div>
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
          )}

          {stage === 'complete' && (
            <div className="text-center opacity-0 animate-fade-out">
              <div className="text-white text-2xl font-bold">Belohnung erhalten!</div>
            </div>
          )}
        </div>

        {/* Close button */}
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

// Utility component for showing multiple rewards
interface MultiRewardAnimationProps {
  rewards: Reward[];
  onComplete: () => void;
}

export const MultiRewardAnimation: React.FC<MultiRewardAnimationProps> = ({ 
  rewards, 
  onComplete 
}) => {
  const [currentRewardIndex, setCurrentRewardIndex] = useState(0);

  const handleRewardComplete = () => {
    if (currentRewardIndex < rewards.length - 1) {
      setCurrentRewardIndex(currentRewardIndex + 1);
    } else {
      onComplete();
    }
  };

  if (currentRewardIndex >= rewards.length) {
    return null;
  }

  return (
    <LootboxAnimation
      reward={rewards[currentRewardIndex]}
      onComplete={handleRewardComplete}
      autoStart={currentRewardIndex > 0}
    />
  );
};

// Simple celebration overlay for quick rewards
interface CelebrationOverlayProps {
  message: string;
  icon: string;
  color?: string;
  onComplete: () => void;
}

export const CelebrationOverlay: React.FC<CelebrationOverlayProps> = ({
  message,
  icon,
  color = 'from-blue-400 to-purple-600',
  onComplete
}) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-pulse">
      <div className={cn(
        "bg-gradient-to-br text-white rounded-2xl p-8 text-center shadow-2xl transform scale-110",
        color
      )}>
        <div className="text-6xl mb-4 animate-bounce">{icon}</div>
        <p className="text-2xl font-bold">{message}</p>
      </div>
    </div>
  );
};