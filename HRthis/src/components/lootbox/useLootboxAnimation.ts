import { useState, useEffect } from 'react';
import { generateCelebrationParticles, createAutoCompleteTimer, startLootboxAnimation } from './LootboxHelpers';

interface UseLootboxAnimationProps {
  autoStart: boolean;
  onComplete: () => void;
}

export const useLootboxAnimation = ({ autoStart, onComplete }: UseLootboxAnimationProps) => {
  const [stage, setStage] = useState<'waiting' | 'opening' | 'revealing' | 'complete'>('waiting');
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    if (autoStart) {
      handleStartAnimation();
    }
  }, [autoStart]);

  useEffect(() => {
    if (stage === 'revealing') {
      setParticles(generateCelebrationParticles());
      const timer = createAutoCompleteTimer(onComplete, setStage);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [stage, onComplete]);

  const handleStartAnimation = () => {
    startLootboxAnimation(setStage);
  };

  return {
    stage,
    particles,
    handleStartAnimation
  };
};