import React from 'react';
import { Avatar, AvatarAccessory } from '../../types/learning';
import { AccessoryTab } from './AccessoryTab';
import { ColorTab } from './ColorTab';
import { CustomizationTabs } from './CustomizationTabs';

type TabType = 'accessories' | 'colors';

interface CustomizationPanelProps {
  activeTab: TabType;
  previewAvatar: Avatar;
  availableAccessories: AvatarAccessory[];
  ownedItems: string[];
  userCoins: number;
  onTabChange: (tab: TabType) => void;
  onAccessoryPreview: (accessory: AvatarAccessory) => void;
  onAccessoryPurchase: (accessory: AvatarAccessory) => void;
  onAccessoryRemove: (type: string) => void;
  onColorChange: (type: 'skin' | 'hair' | 'background', color: string) => void;
}

export const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  activeTab,
  previewAvatar,
  availableAccessories,
  ownedItems,
  userCoins,
  onTabChange,
  onAccessoryPreview,
  onAccessoryPurchase,
  onAccessoryRemove,
  onColorChange
}) => (
  <div className="w-2/3 p-6 overflow-y-auto">
    <CustomizationTabs 
      activeTab={activeTab} 
      onTabChange={onTabChange} 
    />

    {activeTab === 'accessories' && (
      <AccessoryTab
        accessories={availableAccessories}
        previewAvatar={previewAvatar}
        ownedItems={ownedItems}
        userCoins={userCoins}
        onPreview={onAccessoryPreview}
        onPurchase={onAccessoryPurchase}
        onRemove={onAccessoryRemove}
      />
    )}

    {activeTab === 'colors' && (
      <ColorTab
        previewAvatar={previewAvatar}
        onColorChange={onColorChange}
      />
    )}
  </div>
);