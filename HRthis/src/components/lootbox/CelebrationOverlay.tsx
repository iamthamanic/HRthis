import React, { useEffect } from 'react';
import { cn } from '../../utils/cn';

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