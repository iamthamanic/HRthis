import React from 'react';
import { useAvatarStore } from '../../state/avatar';
import { cn } from '../../utils/cn';

interface AvatarMiniProps {
  userId: string;
  onClick?: () => void;
  className?: string;
  showProgress?: boolean;
}

/**
 * Mini Avatar Component (for Dashboard)
 * Compact display like Screenshot 1 with skills preview and achievements
 */
const AvatarMiniSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("bg-white rounded-xl p-4 shadow-sm", className)}>
    <div className="animate-pulse">
      <div className="w-16 h-16 bg-gray-200 rounded-full mb-3"></div>
      <div className="h-4 bg-gray-200 rounded mb-2"></div>
      <div className="h-3 bg-gray-200 rounded"></div>
    </div>
  </div>
);

const AvatarMiniHeader: React.FC<{ onClick?: () => void }> = ({ onClick }) => (
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-sm font-semibold text-gray-700">Avatar</h3>
    {onClick && (
      <span className="text-xs text-gray-400 hover:text-gray-600">
        Einstellungen →
      </span>
    )}
  </div>
);

const SkillsSection: React.FC<{ primarySkill: any }> = ({ primarySkill }) => (
  <div className="mb-6">
    <h4 className="text-lg font-semibold text-gray-900 mb-3 text-center">Skills</h4>
    <div className="bg-gradient-to-r from-cyan-400 to-cyan-600 text-white px-4 py-2 rounded-full text-center font-medium">
      Level {primarySkill.level}
    </div>
  </div>
);

const EngagementSection: React.FC = () => (
  <div className="mb-6">
    <div className="flex items-center justify-between bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-4">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-gray-900">Engagement</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-lg font-bold text-gray-900">1600</span>
        <span className="text-lg">🪙</span>
      </div>
    </div>
    <p className="text-center text-xs text-gray-600 mt-2">Browo Coins</p>
  </div>
);

const AchievementSection: React.FC = () => (
  <div className="text-center">
    <span className="text-3xl mb-2 block">🏆</span>
    <p className="text-xs text-gray-500">Verdiene dein erstes Achievement!</p>
  </div>
);

export const AvatarMini: React.FC<AvatarMiniProps> = ({
  userId,
  onClick,
  className,
  showProgress = true
}) => {
  const { getUserAvatar } = useAvatarStore();
  const userAvatar = getUserAvatar(userId);

  if (!userAvatar) {
    return <AvatarMiniSkeleton className={className} />;
  }

  const primarySkill = userAvatar.skills.reduce((prev, current) => 
    current.level > prev.level ? current : prev
  );

  return (
    <div 
      className={cn(
        "bg-white rounded-xl p-6 shadow-sm transition-all duration-200 flex flex-col h-full",
        onClick && "cursor-pointer hover:shadow-md hover:scale-105",
        className
      )}
      onClick={onClick}
    >
      <AvatarMiniHeader onClick={onClick} />
      
      <div className="flex-grow flex flex-col justify-center">
        <div className="text-center mb-6">
          <h4 className="text-sm font-medium text-gray-900">Level 01: Rookie</h4>
        </div>

        <SkillsSection primarySkill={primarySkill} />
        <EngagementSection />
        <AchievementSection />
      </div>
    </div>
  );
};