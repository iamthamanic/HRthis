export const generateCelebrationParticles = () => {
  return Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 0.5
  }));
};

export const createAutoCompleteTimer = (
  onComplete: () => void, 
  setStage: React.Dispatch<React.SetStateAction<'waiting' | 'opening' | 'revealing' | 'complete'>>
) => {
  return setTimeout(() => {
    setStage('complete');
    setTimeout(onComplete, 1000);
  }, 3000);
};

export const getRarityColor = (rewardType: string) => {
  switch (rewardType) {
    case 'coins':
      return 'from-yellow-400 to-yellow-600';
    case 'badge':
      return 'from-purple-400 to-purple-600';
    default:
      return 'from-blue-400 to-blue-600';
  }
};

export const getRewardIcon = (rewardType: string) => {
  switch (rewardType) {
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

export const getRewardSound = (rewardType: string) => {
  switch (rewardType) {
    case 'coins':
      return '💰';
    case 'badge':
      return '🎉';
    default:
      return '✨';
  }
};

export const startLootboxAnimation = (
  setStage: React.Dispatch<React.SetStateAction<'waiting' | 'opening' | 'revealing' | 'complete'>>
) => {
  setStage('opening');
  setTimeout(() => {
    setStage('revealing');
  }, 1500);
};