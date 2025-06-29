import React from 'react';
import { Avatar } from '../../types/learning';
import { AvatarPreview } from './AvatarPreview';

interface PreviewPanelProps {
  avatar: Avatar;
  userCoins: number;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  avatar,
  userCoins
}) => (
  <div className="w-1/3 bg-gray-50 p-6 flex flex-col">
    <h3 className="text-lg font-semibold mb-4">Vorschau</h3>
    <AvatarPreview avatar={avatar} className="flex-1" />
    
    <div className="mt-4 text-center">
      <p className="text-sm text-gray-600">Coins: {userCoins} 🪙</p>
    </div>
  </div>
);