import React, { useState } from 'react';
import { Reward } from '../../types/learning';
import { LootboxAnimation } from '../LootboxAnimation';

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